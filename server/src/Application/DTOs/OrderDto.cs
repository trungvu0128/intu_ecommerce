using System;
using System.Collections.Generic;
using LotusEcommerce.Domain.Enums;

namespace LotusEcommerce.Application.DTOs;

public class OrderDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public decimal SubTotal { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TotalAmount { get; set; }
    
    public OrderStatus Status { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public PaymentMethod? PaymentMethod { get; set; }
    
    public string? CouponCode { get; set; }
    public string? ShippingAddress { get; set; }
    
    public DateTime CreatedAt { get; set; }
    
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public Guid? ProductVariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal Total { get; set; }
}

public class CheckoutDto
{
    public Guid ShippingAddressId { get; set; }
    
    public string? RecipientName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Street { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public string? Country { get; set; }
    
    public string? CouponCode { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    
    /// Guest checkout: client submits items directly.
    public List<CheckoutItemDto>? GuestItems { get; set; }
}

public class CheckoutItemDto
{
    public Guid ProductVariantId { get; set; }
    public int Quantity { get; set; }
}
