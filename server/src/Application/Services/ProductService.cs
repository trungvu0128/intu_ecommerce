using System.Text.Json;
using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Application.Models;
using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Interfaces;
using Microsoft.Extensions.Caching.Distributed;

namespace LotusEcommerce.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _repository;
    private readonly IDistributedCache _cache;
    private readonly ISearchService _searchService;
    private const string FeaturedProductsKey = "featured_products";
    private readonly IProductImageRepository _productImageRepository;
    private readonly IProductVariantRepository _productVariantRepository;
    public ProductService(IProductRepository repository, IDistributedCache cache, ISearchService searchService, IProductImageRepository productImageRepository, IProductVariantRepository productVariantRepository)
    {
        _repository = repository;
        _cache = cache;
        _searchService = searchService;
        _productImageRepository = productImageRepository;
        _productVariantRepository = productVariantRepository;
    }


    public async Task<IEnumerable<ProductDto>> GetAllAsync(string? search = null, Guid? categoryId = null, bool? isFeatured = null, bool isAdmin = false)
    {
        // Cache featured products (only for non-admin public requests)
        if (!isAdmin && isFeatured == true && string.IsNullOrEmpty(search) && !categoryId.HasValue)
        {
            var cachedData = await _cache.GetStringAsync(FeaturedProductsKey);
            if (!string.IsNullOrEmpty(cachedData))
            {
                return JsonSerializer.Deserialize<IEnumerable<ProductDto>>(cachedData)!;
            }

            var featuredProducts = await _repository.GetAllAsync(null, null, true, false);
            var dtos = featuredProducts.Select(MapToDto).ToList();

            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
            };

            await _cache.SetStringAsync(FeaturedProductsKey, JsonSerializer.Serialize(dtos), cacheOptions);
            return dtos;
        }

        var products = await _repository.GetAllAsync(search, categoryId, isFeatured, isAdmin);
        return products.Select(MapToDto);
    }

    public async Task<ProductDto?> GetByIdAsync(Guid id)
    {
        var product = await _repository.GetByIdAsync(id);
        if (product == null) return null;

        return MapToDto(product);
    }

    public async Task<ProductDto?> GetBySlugAsync(string slug)
    {
        var product = await _repository.GetBySlugAsync(slug);
        if (product == null) return null;

        return MapToDto(product);
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Slug = dto.Slug,
            Description = dto.Description,
            BasePrice = dto.BasePrice,
            IsFeatured = dto.IsFeatured,
            CategoryId = dto.CategoryId,
            BrandId = dto.BrandId,
            Variants = dto.Variants.Select(v => new ProductVariant
            {
                Sku = v.Sku,
                Color = v.Color,
                Size = v.Size,
                PriceAdjustment = v.PriceAdjustment,
                StockQuantity = v.StockQuantity
            }).ToList(),
            Images = dto.Images.Select(i => new ProductImage
            {
                Url = i.Url?.OriginalUrl ?? string.Empty,
                ThumbnailUrl = i.Url?.ThumbnailUrl ?? string.Empty,
                IsMain = i.IsMain
            }).ToList()
        };

        await _repository.AddAsync(product);
        await _repository.SaveChangesAsync();

        //if (product.IsFeatured) await _cache.RemoveAsync(FeaturedProductsKey);

        // Sync to search index
        //await _searchService.IndexProductAsync(MapToSearchModel(product));

        return MapToDto(product);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateProductDto dto)
    {
        var product = await _repository.GetByIdAsync(id);
        if (product == null) return false;

        product.Name = dto.Name;
        product.Slug = dto.Slug;
        product.Description = dto.Description;
        product.BasePrice = dto.BasePrice;
        product.IsFeatured = dto.IsFeatured;
        product.CategoryId = dto.CategoryId;
        product.BrandId = dto.BrandId;
        product.UpdatedAt = DateTime.UtcNow;

        if (dto.Variants != null && dto.Variants.Any())
        {
            var existingVariantIds = dto.Variants.Where(v => v.Id != Guid.Empty).Select(v => v.Id).ToList();
            var variantsToRemove = product.Variants.Where(v => !existingVariantIds.Contains(v.Id)).ToList();

            foreach (var variant in variantsToRemove)
            {
                product.Variants.Remove(variant);
            }

            foreach (var variantDto in dto.Variants)
            {
                if (variantDto.Id != Guid.Empty)
                {
                    var existingVariant = product.Variants.FirstOrDefault(v => v.Id == variantDto.Id);
                    if (existingVariant != null)
                    {
                        existingVariant.Sku = variantDto.Sku;
                        existingVariant.Color = variantDto.Color;
                        existingVariant.Size = variantDto.Size;
                        existingVariant.PriceAdjustment = variantDto.PriceAdjustment;
                        existingVariant.StockQuantity = variantDto.StockQuantity;
                    }
                }
                else
                {
                    product.Variants.Add(new ProductVariant
                    {
                        Sku = variantDto.Sku,
                        Color = variantDto.Color,
                        Size = variantDto.Size,
                        PriceAdjustment = variantDto.PriceAdjustment,
                        StockQuantity = variantDto.StockQuantity
                    });
                }
            }
        }

        if (dto.Images != null && dto.Images.Any())
        {
            foreach (var item in product.Images)
            {
                _productImageRepository.Delete(item);
            }
            foreach(var item in dto.Images)
            {
                await _productImageRepository.AddAsync(new ProductImage
                {
                    Url = item.Url?.OriginalUrl ?? string.Empty,
                    ThumbnailUrl = item.Url?.ThumbnailUrl ?? string.Empty,
                    IsMain = item.IsMain,
                    ProductId = product.Id
                });
            }
        }

        _repository.Update(product);
        var success = await _repository.SaveChangesAsync();

        //if (success)
        //{
        //    await _cache.RemoveAsync(FeaturedProductsKey);
        //    await _searchService.IndexProductAsync(MapToSearchModel(product));
        //}

        return success;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var product = await _repository.GetByIdAsync(id);
        if (product == null) return false;

        _repository.Delete(product);
        var success = await _repository.SaveChangesAsync();

        if (success)
        {
            if (product.IsFeatured) await _cache.RemoveAsync(FeaturedProductsKey);
            // Sync to search index
            await _searchService.DeleteProductAsync(id);
        }

        return success;
    }

    public async Task<bool> UpdateStockAsync(Guid variantId, int quantity)
    {
        await _repository.UpdateStockAsync(variantId, quantity);
        return await _repository.SaveChangesAsync();
    }

    public async Task<ProductVariantDto?> GetVariantBySKUAsync(string sku)
    {
        var variant = await _repository.GetVariantBySKUAsync(sku);
        if (variant == null) return null;

        return new ProductVariantDto
        {
            Id = variant.Id,
            Sku = variant.Sku,
            Color = variant.Color,
            Size = variant.Size,
            PriceAdjustment = variant.PriceAdjustment,
            StockQuantity = variant.StockQuantity
        };
    }

    public async Task<bool> AddVariantAsync(Guid productId, CreateProductVariantDto variantDto)
    {
        var product = await _repository.GetByIdAsync(productId);
        if (product == null) return false;

        product.Variants.Add(new ProductVariant
        {
            Sku = variantDto.Sku,
            Color = variantDto.Color,
            Size = variantDto.Size,
            PriceAdjustment = variantDto.PriceAdjustment,
            StockQuantity = variantDto.StockQuantity
        });

        _repository.Update(product);
        return await _repository.SaveChangesAsync();
    }

    public async Task<bool> AddImageAsync(Guid productId, CreateProductImageDto imageDto)
    {
        var product = await _repository.GetByIdAsync(productId);
        if (product == null) return false;

        product.Images.Add(new ProductImage
        {
            Url = imageDto.Url?.OriginalUrl ?? string.Empty,
            ThumbnailUrl = imageDto.Url?.ThumbnailUrl ?? string.Empty,
            IsMain = imageDto.IsMain
        });

        _repository.Update(product);
        return await _repository.SaveChangesAsync();
    }

    private ProductSearchModel MapToSearchModel(Product p)
    {
        return new ProductSearchModel
        {
            Id = p.Id.ToString(),
            Name = p.Name,
            Description = p.Description,
            CategoryName = p.Category?.Name ?? string.Empty,
            CategorySlug = p.Category?.Slug ?? string.Empty,
            Sizes = p.Variants.Select(v => v.Size).Where(s => !string.IsNullOrEmpty(s)).Distinct().ToList()!,
            MinPrice = p.BasePrice + (p.Variants.Any() ? p.Variants.Min(v => v.PriceAdjustment) : 0),
            MaxPrice = p.BasePrice + (p.Variants.Any() ? p.Variants.Max(v => v.PriceAdjustment) : 0),
            IsActive = p.IsActive,
            IsFeatured = p.IsFeatured
        };
    }

    private ProductDto MapToDto(Product p)
    {
        return new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Slug = p.Slug,
            Description = p.Description,
            BasePrice = p.BasePrice,
            IsFeatured = p.IsFeatured,
            IsActive = p.IsActive,
            Category = p.Category != null ? new CategoryDto
            {
                Id = p.Category.Id,
                Name = p.Category.Name,
                Slug = p.Category.Slug,
                Description = p.Category.Description,
                ImageUrl = p.Category.ImageUrl
            } : null!,
            Variants = p.Variants.Select(v => new ProductVariantDto
            {
                Id = v.Id,
                Sku = v.Sku,
                Color = v.Color,
                Size = v.Size,
                PriceAdjustment = v.PriceAdjustment,
                StockQuantity = v.StockQuantity
            }).ToList(),
            Images = p.Images.Select(i => new ProductImageDto
            {
                Id = i.Id,
                Url = i.Url,
                ThumbnailUrl = i.ThumbnailUrl,
                IsMain = i.IsMain
            }).ToList()
        };
    }
}
