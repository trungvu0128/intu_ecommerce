using LotusEcommerce.Domain.Entities;

namespace LotusEcommerce.Domain.Interfaces;

public interface IProductImageRepository
{
    Task<ProductImage?> GetByIdAsync(Guid id);
    Task<IEnumerable<ProductImage>> GetByProductIdAsync(Guid productId);
    Task AddAsync(ProductImage image);
    void Update(ProductImage image);
    void Delete(ProductImage image);
    Task<bool> SaveChangesAsync();
}
