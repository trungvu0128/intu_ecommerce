using LotusEcommerce.Domain.Entities;

namespace LotusEcommerce.Domain.Interfaces;

public interface IProductCategoryRepository
{
    Task<IEnumerable<ProductCategory>> GetProductCategoriesAsync();
    Task<IEnumerable<ProductCategory>> GetByProductIdAsync(Guid productId);
    Task<IEnumerable<ProductCategory>> GetByCategoryIdAsync(Guid categoryId);
    Task AddAsync(ProductCategory productCategory);
    Task AddRangeAsync(IEnumerable<ProductCategory> productCategories);
    void Remove(ProductCategory productCategory);
    void RemoveRange(IEnumerable<ProductCategory> productCategories);
    Task<bool> SaveChangesAsync();
}
