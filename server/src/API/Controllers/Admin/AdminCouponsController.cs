using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers.Admin;

[Route("api/admin/coupons")]
[Authorize(Roles = "Admin")]
public class AdminCouponsController : BaseApiController
{
    private readonly ICouponService _couponService;

    public AdminCouponsController(ICouponService couponService)
    {
        _couponService = couponService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var coupons = await _couponService.GetAllAsync();
        return OkResponse(coupons);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var coupon = await _couponService.GetByIdAsync(id);
        if (coupon == null) return NotFoundResponse("Coupon not found");
        return OkResponse(coupon);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCouponDto dto)
    {
        var coupon = await _couponService.CreateAsync(dto);
        return OkResponse(coupon);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateCouponDto dto)
    {
        var result = await _couponService.UpdateAsync(id, dto);
        if (!result) return NotFoundResponse("Coupon not found");
        return NoContentResponse();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _couponService.DeleteAsync(id);
        if (!result) return NotFoundResponse("Coupon not found");
        return NoContentResponse();
    }

    [HttpPatch("{id}/toggle")]
    public async Task<IActionResult> Toggle(Guid id)
    {
        var result = await _couponService.ToggleActiveAsync(id);
        if (!result) return NotFoundResponse("Coupon not found");
        return NoContentResponse();
    }
}
