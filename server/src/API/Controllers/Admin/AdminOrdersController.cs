using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers.Admin;

[Route("api/admin/orders")]
[Authorize(Roles = "Admin")]
public class AdminOrdersController : BaseApiController
{
    private readonly IOrderService _orderService;

    public AdminOrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] OrderStatus? status)
    {
        var orders = await _orderService.GetAllOrdersAsync(status);
        return OkResponse(orders);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] OrderStatus status)
    {
        var result = await _orderService.UpdateOrderStatusAsync(id, status);
        if (!result) return NotFoundResponse("Order not found");
        return NoContentResponse();
    }

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        var result = await _orderService.CancelOrderAsync(id);
        if (!result) return BadRequestResponse("Could not cancel order");
        return NoContentResponse();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOrder(Guid id, [FromBody] LotusEcommerce.Application.DTOs.UpdateOrderDto dto)
    {
        var result = await _orderService.UpdateOrderInfoAsync(id, dto);
        if (!result) return NotFoundResponse("Order not found or could not be updated");
        return OkResponse(new { message = "Order updated successfully" });
    }
}
