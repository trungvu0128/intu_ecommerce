using System.Security.Claims;
using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers;

[Route("api/[controller]")]
public class OrdersController : BaseApiController
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    private Guid? TryGetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }

    [HttpPost("calculate")]
    [AllowAnonymous] // Allow guests to calculate totals
    public async Task<IActionResult> Calculate(Application.Models.OrderCalculationRequest request)
    {
        var result = await _orderService.CalculateOrderAsync(request);
        return OkResponse(result);
    }

    /// <summary>
    /// Unified checkout endpoint.
    /// - Authenticated users: items are loaded from their server-side cart (GuestItems ignored).
    /// - Guest users: items must be provided in GuestItems.
    /// </summary>
    [HttpPost("checkout")]
    [AllowAnonymous]
    public async Task<IActionResult> Checkout([FromBody] CheckoutDto checkoutDto)
    {
        try
        {
            var userId = TryGetUserId();

            OrderDto order;
            if (userId.HasValue)
            {
                // Path 1: Authenticated — pull items from server cart
                order = await _orderService.CheckoutFromCartAsync(userId.Value, checkoutDto);
            }
            else
            {
                // Path 2: Guest — use items submitted in request body
                order = await _orderService.CreateOrderAsync(checkoutDto);
            }

            return CreatedResponse(order, nameof(GetOrder), new { id = order.Id });
        }
        catch (Exception ex)
        {
            return BadRequestResponse(ex.Message);
        }
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);
        if (order == null) return NotFoundResponse("Order not found");
        return OkResponse(order);
    }

    [HttpGet("number/{orderNumber}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetOrderByNumber(string orderNumber)
    {
        var order = await _orderService.GetOrderByNumberAsync(orderNumber);
        if (order == null) return NotFoundResponse("Order not found");
        return OkResponse(order);
    }

    [HttpGet("my-orders")]
    [Authorize]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = TryGetUserId();
        if (!userId.HasValue) return UnauthorizedResponse("User not authenticated");
        var orders = await _orderService.GetUserOrdersAsync(userId.Value);
        return OkResponse(orders);
    }

    [HttpGet("user/{userId}")]
    [Authorize]
    public async Task<IActionResult> GetUserOrders(Guid userId)
    {
        var orders = await _orderService.GetUserOrdersAsync(userId);
        return OkResponse(orders);
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAllOrders([FromQuery] OrderStatus? status)
    {
        var orders = await _orderService.GetAllOrdersAsync(status);
        return OkResponse(orders);
    }

    [HttpPatch("{id}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] OrderStatus status)
    {
        var result = await _orderService.UpdateOrderStatusAsync(id, status);
        if (!result) return NotFoundResponse("Order not found");
        return NoContentResponse();
    }

    [HttpPost("{id}/cancel")]
    [Authorize]
    public async Task<IActionResult> CancelOrder(Guid id)
    {
        var result = await _orderService.CancelOrderAsync(id);
        if (!result) return BadRequestResponse("Could not cancel order");
        return NoContentResponse();
    }
}
