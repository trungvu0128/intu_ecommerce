using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Interfaces;
using LotusEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LotusEcommerce.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.ProductCategories)
                .ThenInclude(pc => pc.Category)
            .Include(p => p.Variants)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Product?> GetBySlugAsync(string slug)
    {
        return await _context.Products
            .Include(p => p.Category)
            .Include(p => p.ProductCategories)
                .ThenInclude(pc => pc.Category)
            .Include(p => p.Variants)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Slug == slug);
    }

    public async Task<IEnumerable<Product>> GetAllAsync(string? search = null, Guid? categoryId = null, bool? isFeatured = null, bool isAdmin = false)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .Include(p => p.ProductCategories)
                .ThenInclude(pc => pc.Category)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .AsQueryable();

        if (!isAdmin)
        {
            query = query.Where(p => p.IsActive);
            // Ignore deprecated Category property, use ProductCategories for active check
            query = query.Where(p => !p.ProductCategories.Any() || p.ProductCategories.Any(pc => pc.Category.IsActive));
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()) 
                || p.Description.ToLower().Contains(search.ToLower()));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value
                || p.ProductCategories.Any(pc => pc.CategoryId == categoryId.Value));
        }

        if (isFeatured.HasValue)
        {
            query = query.Where(p => p.IsFeatured == isFeatured.Value);
        }

        return await query.ToListAsync();
    }

    public async Task AddAsync(Product product)
    {
        await _context.Products.AddAsync(product);
    }

    public void Update(Product product)
    {
        _context.Products.Update(product);
    }

    public void Delete(Product product)
    {
        _context.Products.Remove(product);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<IEnumerable<Product>> GetAllWithVariantsAsync()
    {
        return await _context.Products
            .Include(p => p.Variants)
            .Include(p => p.Images)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<ProductVariant?> GetVariantBySKUAsync(string sku)
    {
        return await _context.ProductVariants.FirstOrDefaultAsync(v => v.Sku == sku);
    }

    public async Task<ProductVariant?> GetVariantByIdAsync(Guid id)
    {
        return await _context.ProductVariants
            .Include(v => v.Product)
                .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(v => v.Id == id);
    }

    /// <summary>
    /// No-tracking variant used by CartService to avoid duplicate entity tracking conflicts.
    /// The cart query already tracks ProductVariant/Product/Images; a second tracked query
    /// on the same entities causes DbUpdateConcurrencyException.
    /// </summary>
    public async Task<ProductVariant?> GetVariantByIdNoTrackingAsync(Guid id)
    {
        return await _context.ProductVariants
            .AsNoTracking()
            .Include(v => v.Product)
                .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(v => v.Id == id);
    }

    /// <summary>
    /// No-tracking variant used by CartService to avoid duplicate entity tracking conflicts.
    /// </summary>
    public async Task<Product?> GetProductByIdNoTrackingAsync(Guid id)
    {
        return await _context.Products
            .AsNoTracking()
            .Include(p => p.Variants)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task UpdateStockAsync(Guid variantId, int quantity)
    {
        var variant = await _context.ProductVariants.FindAsync(variantId);
        if (variant != null)
        {
            variant.StockQuantity = quantity;
        }
    }
}
