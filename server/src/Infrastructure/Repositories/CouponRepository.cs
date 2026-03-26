using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Interfaces;
using LotusEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LotusEcommerce.Infrastructure.Repositories;

public class CouponRepository : ICouponRepository
{
    private readonly AppDbContext _context;

    public CouponRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Coupon?> GetByCodeAsync(string code)
    {
        return await _context.Coupons.FirstOrDefaultAsync(c => c.Code == code);
    }

    public async Task<Coupon?> GetByIdAsync(Guid id)
    {
        return await _context.Coupons.FindAsync(id);
    }

    public async Task<IEnumerable<Coupon>> GetAllAsync(bool? isActive = null)
    {
        var query = _context.Coupons.AsQueryable();
        if (isActive.HasValue)
        {
            query = query.Where(c => c.IsActive == isActive.Value);
        }
        return await query.ToListAsync();
    }

    public async Task AddAsync(Coupon coupon)
    {
        await _context.Coupons.AddAsync(coupon);
    }

    public void Update(Coupon coupon)
    {
        coupon.UpdatedAt = DateTime.UtcNow;
        _context.Coupons.Update(coupon);
    }

    public void Delete(Coupon coupon)
    {
        coupon.UpdatedAt = DateTime.UtcNow;
        _context.Coupons.Remove(coupon);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
