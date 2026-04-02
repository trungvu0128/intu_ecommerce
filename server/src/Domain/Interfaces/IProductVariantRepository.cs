using LotusEcommerce.Domain.Entities;

namespace LotusEcommerce.Domain.Interfaces;

public interface IProductVariantRepository
{
    Task<ProductVariant?> GetByIdAsync(Guid id);
    Task<ProductVariant?> GetBySkuAsync(string sku);
    Task<IEnumerable<ProductVariant>> GetByProductIdAsync(Guid productId);
    Task AddAsync(ProductVariant variant);
    void Update(ProductVariant variant);
    void Delete(ProductVariant variant);
    Task<bool> SaveChangesAsync();
}
