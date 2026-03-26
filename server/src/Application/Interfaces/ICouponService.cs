using LotusEcommerce.Application.DTOs;

namespace LotusEcommerce.Application.Interfaces;

public interface ICouponService
{
    Task<IEnumerable<CouponDto>> GetAllAsync();
    Task<CouponDto?> GetByIdAsync(Guid id);
    Task<CouponDto> CreateAsync(CreateCouponDto dto);
    Task<bool> UpdateAsync(Guid id, UpdateCouponDto dto);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ToggleActiveAsync(Guid id);
}
