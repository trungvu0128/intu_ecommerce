using System;
using LotusEcommerce.Domain.Enums;

namespace LotusEcommerce.Application.DTOs;

public class UpdateOrderDto
{
    public OrderStatus? Status { get; set; }
    public PaymentStatus? PaymentStatus { get; set; }
    public string? ShippingAddress { get; set; } // JSON string
}
