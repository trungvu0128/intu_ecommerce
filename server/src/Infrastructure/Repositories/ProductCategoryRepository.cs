using Microsoft.EntityFrameworkCore;
using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Interfaces;
using LotusEcommerce.Infrastructure.Data;

namespace LotusEcommerce.Infrastructure.Repositories;

public class ProductCategoryRepository : IProductCategoryRepository
{
    private readonly AppDbContext _context;

    public ProductCategoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProductCategory>> GetProductCategoriesAsync()
    {
        return await _context.ProductCategories
            .Include(pc => pc.Product)
            .Include(pc => pc.Category)
            .ToListAsync();
    }

    public async Task<IEnumerable<ProductCategory>> GetByProductIdAsync(Guid productId)
    {
        return await _context.ProductCategories
            .Where(pc => pc.ProductId == productId)
            .Include(pc => pc.Category)
            .ToListAsync();
    }

    public async Task<IEnumerable<ProductCategory>> GetByCategoryIdAsync(Guid categoryId)
    {
        return await _context.ProductCategories
            .Where(pc => pc.CategoryId == categoryId)
            .Include(pc => pc.Product)
            .ToListAsync();
    }

    public async Task AddAsync(ProductCategory productCategory)
    {
        await _context.ProductCategories.AddAsync(productCategory);
    }

    public async Task AddRangeAsync(IEnumerable<ProductCategory> productCategories)
    {
        await _context.ProductCategories.AddRangeAsync(productCategories);
    }

    public void Remove(ProductCategory productCategory)
    {
        _context.ProductCategories.Remove(productCategory);
    }

    public void RemoveRange(IEnumerable<ProductCategory> productCategories)
    {
        _context.ProductCategories.RemoveRange(productCategories);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
