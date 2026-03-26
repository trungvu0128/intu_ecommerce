using LotusEcommerce.Domain.Entities;

namespace LotusEcommerce.Domain.Interfaces;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(Guid id);
    Task<Product?> GetBySlugAsync(string slug);
    Task<IEnumerable<Product>> GetAllAsync(string? search = null, Guid? categoryId = null, bool? isFeatured = null, bool isAdmin = false);
    Task AddAsync(Product product);
    void Update(Product product);
    void Delete(Product product);
    Task<bool> SaveChangesAsync();

    // Inventory
    Task<IEnumerable<Product>> GetAllWithVariantsAsync();

    // Admin/Stock features
    Task<ProductVariant?> GetVariantBySKUAsync(string sku);
    Task<ProductVariant?> GetVariantByIdAsync(Guid id);
    Task UpdateStockAsync(Guid variantId, int quantity);

    // No-tracking reads (for cart resolution — avoids duplicate-tracking conflicts)
    Task<ProductVariant?> GetVariantByIdNoTrackingAsync(Guid id);
    Task<Product?> GetProductByIdNoTrackingAsync(Guid id);
}
