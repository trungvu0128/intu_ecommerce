using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Interfaces;
using LotusEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LotusEcommerce.Infrastructure.Repositories;

public class ProductImageRepository : IProductImageRepository
{
    private readonly AppDbContext _context;

    public ProductImageRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ProductImage?> GetByIdAsync(Guid id)
    {
        return await _context.ProductImages.FindAsync(id);
    }

    public async Task<IEnumerable<ProductImage>> GetByProductIdAsync(Guid productId)
    {
        return await _context.ProductImages
            .Where(i => i.ProductId == productId)
            .ToListAsync();
    }

    public async Task AddAsync(ProductImage image)
    {
        await _context.ProductImages.AddAsync(image);
    }

    public void Update(ProductImage image)
    {
        _context.ProductImages.Update(image);
    }

    public void Delete(ProductImage image)
    {
        _context.ProductImages.Remove(image);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
