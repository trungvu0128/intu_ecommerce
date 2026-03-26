using LotusEcommerce.Domain.Entities;

namespace LotusEcommerce.Domain.Interfaces;

public interface ICouponRepository
{
    Task<Coupon?> GetByCodeAsync(string code);
    Task<Coupon?> GetByIdAsync(Guid id);
    Task<IEnumerable<Coupon>> GetAllAsync(bool? isActive = null);
    Task AddAsync(Coupon coupon);
    void Update(Coupon coupon);
    void Delete(Coupon coupon);
    Task<bool> SaveChangesAsync();
}
