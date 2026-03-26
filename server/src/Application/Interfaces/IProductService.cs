using LotusEcommerce.Application.DTOs;

namespace LotusEcommerce.Application.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllAsync(string? search = null, Guid? categoryId = null, bool? isFeatured = null, bool isAdmin = false);
    Task<ProductDto?> GetByIdAsync(Guid id);
    Task<ProductDto?> GetBySlugAsync(string slug);
    Task<ProductDto> CreateAsync(CreateProductDto dto);
    Task<bool> UpdateAsync(Guid id, UpdateProductDto dto);
    Task<bool> DeleteAsync(Guid id);

    // Stock/Variant features
    Task<bool> UpdateStockAsync(Guid variantId, int quantity);
    Task<ProductVariantDto?> GetVariantBySKUAsync(string sku);
    Task<bool> AddVariantAsync(Guid productId, CreateProductVariantDto variantDto);
    Task<bool> AddImageAsync(Guid productId, CreateProductImageDto imageDto);
}
