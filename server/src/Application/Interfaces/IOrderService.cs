using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Domain.Enums;

namespace LotusEcommerce.Application.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CreateOrderAsync(CheckoutDto checkoutDto);
    Task<OrderDto> CheckoutFromCartAsync(Guid userId, CheckoutDto checkoutDto);
    Task<Models.OrderCalculationResponse> CalculateOrderAsync(Models.OrderCalculationRequest request);
    Task<OrderDto?> GetOrderByIdAsync(Guid id);
    Task<OrderDto?> GetOrderByNumberAsync(string orderNumber);
    Task<IEnumerable<OrderDto>> GetUserOrdersAsync(Guid userId);
    Task<IEnumerable<OrderDto>> GetAllOrdersAsync(OrderStatus? status = null);
    Task<bool> UpdateOrderStatusAsync(Guid orderId, OrderStatus status);
    Task<bool> UpdateOrderInfoAsync(Guid orderId, UpdateOrderDto dto);
    Task<bool> MarkOrderAsPaidAsync(string orderNumber);
    Task<bool> CancelOrderAsync(Guid orderId);
}
