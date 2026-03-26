using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Interfaces;
using LotusEcommerce.Domain.Exceptions;

namespace LotusEcommerce.Application.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly IProductRepository _productRepository;
    private readonly ICartItemRepository _cartItemRepository;
    public CartService(ICartRepository cartRepository, IProductRepository productRepository, ICartItemRepository cartItemRepository)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
        _cartItemRepository = cartItemRepository;
    }

    public async Task<CartDto> GetCartAsync(Guid userId)
    {
        var cart = await GetOrCreateCartAsync(userId);
        return MapToDto(cart);
    }

    public async Task<CartDto> AddToCartAsync(Guid userId, AddToCartRequest request)
    {
        var cart = await GetOrCreateCartAsync(userId);
        
        // Resolve Variant
        var variant = await ResolveVariantAsync(request.ProductId);
        if (variant == null) throw new BadRequestException("Product or Variant not found");

        var existingItem = cart.Items.FirstOrDefault(i => i.ProductVariantId == variant.Id);
        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
        }
        else
        {
            await _cartItemRepository.AddAsync(new CartItem
            {
                CartId = cart.Id,
                ProductVariantId = variant.Id,
                Quantity = request.Quantity
            });
        }
        await _cartRepository.SaveChangesAsync();
        // Re-fetch so all navigation properties (ProductVariant.Product.Images) are populated
        var updatedCart = await _cartRepository.GetByUserIdAsync(userId);
        return MapToDto(updatedCart!);
    }

    public async Task<CartDto> RemoveFromCartAsync(Guid userId, Guid variantId)
    {
        var cart = await GetOrCreateCartAsync(userId);
        var item = cart.Items.FirstOrDefault(i => i.ProductVariantId == variantId);
        
        if (item != null)
        {
            cart.Items.Remove(item);
            await _cartRepository.SaveChangesAsync();
        }

        return MapToDto(cart);
    }

    public async Task<CartDto> SyncCartAsync(Guid userId, SyncCartRequest request)
    {
        var cart = await GetOrCreateCartAsync(userId);

        foreach (var itemRequest in request.Items)
        {
            var variant = await ResolveVariantAsync(itemRequest.ProductId);
            if (variant == null) continue;

            var existingItem = cart.Items.FirstOrDefault(i => i.ProductVariantId == variant.Id);
            if (existingItem != null)
            {
                // Merge: take the max of remote and local quantity
                existingItem.Quantity = Math.Max(existingItem.Quantity, itemRequest.Quantity); 
            }
            else
            {
                cart.Items.Add(new CartItem
                {
                    ProductVariantId = variant.Id,
                    Quantity = itemRequest.Quantity
                });
            }
        }

        await _cartRepository.SaveChangesAsync();
        // Re-fetch so all navigation properties (ProductVariant.Product.Images) are populated
        var updatedCart = await _cartRepository.GetByUserIdAsync(userId);
        return MapToDto(updatedCart!);
    }

    public async Task ClearCartAsync(Guid userId)
    {
        var cart = await _cartRepository.GetByUserIdAsync(userId);
        if (cart != null)
        {
            await _cartRepository.DeleteAsync(cart);
            await _cartRepository.SaveChangesAsync();
        }
    }

    private async Task<Cart> GetOrCreateCartAsync(Guid userId)
    {
        var cart = await _cartRepository.GetByUserIdAsync(userId);

        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            await _cartRepository.AddAsync(cart);
            await _cartRepository.SaveChangesAsync();
        }

        return cart;
    }

    private async Task<ProductVariant?> ResolveVariantAsync(Guid id)
    {
        // Use AsNoTracking queries to avoid duplicate-tracking conflicts:
        // GetByUserIdAsync already tracks ProductVariant/Product/Images;
        // a second tracked query on the same entities causes DbUpdateConcurrencyException.

        // Try to get variant by ID (no tracking)
        var variant = await _productRepository.GetVariantByIdNoTrackingAsync(id);
        if (variant != null) return variant;

        // Try to get product by ID and use first variant (no tracking)
        var product = await _productRepository.GetProductByIdNoTrackingAsync(id);
        if (product != null && product.Variants != null && product.Variants.Any())
        {
            return product.Variants.First();
        }

        return null;
    }

    private CartDto MapToDto(Cart cart)
    {
        // Keep raw decimals for TotalPrice calculation, then format for display
        var itemsWithPrice = cart.Items.Select(i => {
            var product = i.ProductVariant.Product;
            var rawPrice = product.BasePrice + i.ProductVariant.PriceAdjustment;
            var mainImage = product.Images.FirstOrDefault(img => img.IsMain)?.Url 
                            ?? product.Images.FirstOrDefault()?.Url 
                            ?? "";
            return (item: i, product, rawPrice, mainImage);
        }).ToList();

        var itemsDto = itemsWithPrice.Select(x => new CartItemDto
        {
            Id = x.item.ProductVariant.Id,
            VariantId = x.item.ProductVariant.Id,
            ProductId = x.product.Id,
            Name = x.product.Name,
            Price = $"{x.rawPrice:N0} VND",
            Image = x.mainImage,
            Quantity = x.item.Quantity
        }).ToList();

        var totalPrice = itemsWithPrice.Sum(x => x.rawPrice * x.item.Quantity);

        return new CartDto
        {
            Id = cart.Id,
            Items = itemsDto,
            TotalItems = itemsDto.Sum(i => i.Quantity),
            TotalPrice = totalPrice
        };
    }
}
