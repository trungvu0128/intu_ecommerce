using LotusEcommerce.Application.DTOs;

namespace LotusEcommerce.Application.Models;

public class OrderCalculationRequest
{
    public List<CheckoutItemDto> Items { get; set; } = new();
    public string? CouponCode { get; set; }
}

public class OrderCalculationResponse
{
    public decimal SubTotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal TotalAmount { get; set; }
    public bool IsCouponValid { get; set; }
    public string? CouponError { get; set; }
}