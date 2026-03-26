using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Enums;
using LotusEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LotusEcommerce.Infrastructure.Services;

public class CouponService : ICouponService
{
    private readonly AppDbContext _context;

    public CouponService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CouponDto>> GetAllAsync()
    {
        return await _context.Coupons
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => MapCoupon(c))
            .ToListAsync();
    }

    public async Task<CouponDto?> GetByIdAsync(Guid id)
    {
        var c = await _context.Coupons.FindAsync(id);
        return c == null ? null : MapCoupon(c);
    }

    public async Task<CouponDto> CreateAsync(CreateCouponDto dto)
    {
        var coupon = new Coupon
        {
            Code = dto.Code.ToUpper(),
            DiscountType = Enum.Parse<DiscountType>(dto.DiscountType, true),
            DiscountValue = dto.DiscountValue,
            MinOrderAmount = dto.MinOrderAmount,
            MaxDiscountAmount = dto.MaxDiscountAmount,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            UsageLimit = dto.UsageLimit,
            IsActive = dto.IsActive,
        };
        _context.Coupons.Add(coupon);
        await _context.SaveChangesAsync();
        return MapCoupon(coupon);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateCouponDto dto)
    {
        var coupon = await _context.Coupons.FindAsync(id);
        if (coupon == null) return false;

        coupon.Code = dto.Code.ToUpper();
        coupon.DiscountType = Enum.Parse<DiscountType>(dto.DiscountType, true);
        coupon.DiscountValue = dto.DiscountValue;
        coupon.MinOrderAmount = dto.MinOrderAmount;
        coupon.MaxDiscountAmount = dto.MaxDiscountAmount;
        coupon.StartDate = dto.StartDate;
        coupon.EndDate = dto.EndDate;
        coupon.UsageLimit = dto.UsageLimit;
        coupon.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var coupon = await _context.Coupons.FindAsync(id);
        if (coupon == null) return false;
        _context.Coupons.Remove(coupon);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ToggleActiveAsync(Guid id)
    {
        var coupon = await _context.Coupons.FindAsync(id);
        if (coupon == null) return false;
        coupon.IsActive = !coupon.IsActive;
        await _context.SaveChangesAsync();
        return true;
    }

    private static CouponDto MapCoupon(Coupon c) => new()
    {
        Id = c.Id,
        Code = c.Code,
        DiscountType = c.DiscountType.ToString(),
        DiscountValue = c.DiscountValue,
        MinOrderAmount = c.MinOrderAmount,
        MaxDiscountAmount = c.MaxDiscountAmount,
        StartDate = c.StartDate,
        EndDate = c.EndDate,
        UsageLimit = c.UsageLimit,
        UsedCount = c.UsedCount,
        IsActive = c.IsActive,
        CreatedAt = c.CreatedAt,
    };
}
