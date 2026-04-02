using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Interfaces;
using LotusEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LotusEcommerce.Infrastructure.Repositories;

public class ProductVariantRepository : IProductVariantRepository
{
    private readonly AppDbContext _context;

    public ProductVariantRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ProductVariant?> GetByIdAsync(Guid id)
    {
        return await _context.ProductVariants.FindAsync(id);
    }

    public async Task<ProductVariant?> GetBySkuAsync(string sku)
    {
        return await _context.ProductVariants
            .FirstOrDefaultAsync(v => v.Sku == sku);
    }

    public async Task<IEnumerable<ProductVariant>> GetByProductIdAsync(Guid productId)
    {
        return await _context.ProductVariants
            .Where(v => v.ProductId == productId)
            .ToListAsync();
    }

    public async Task AddAsync(ProductVariant variant)
    {
        await _context.ProductVariants.AddAsync(variant);
    }

    public void Update(ProductVariant variant)
    {
        _context.ProductVariants.Update(variant);
    }

    public void Delete(ProductVariant variant)
    {
        _context.ProductVariants.Remove(variant);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
