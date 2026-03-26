using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers.Admin;

[Route("api/admin/inventory-reasons")]
[Authorize(Roles = "Admin")]
public class AdminInventoryReasonController : BaseApiController
{
    private readonly IInventoryService _inventoryService;

    public AdminInventoryReasonController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool? activeOnly)
    {
        var reasons = await _inventoryService.GetReasonsAsync(activeOnly);
        return OkResponse(reasons);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var reason = await _inventoryService.GetReasonByIdAsync(id);
        if (reason == null) return NotFoundResponse("Reason not found");
        return OkResponse(reason);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateInventoryReasonDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequestResponse("Name is required");

        var result = await _inventoryService.CreateReasonAsync(dto);
        return OkResponse(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, CreateInventoryReasonDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequestResponse("Name is required");

        var result = await _inventoryService.UpdateReasonAsync(id, dto);
        if (!result) return NotFoundResponse("Reason not found");
        return NoContentResponse();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _inventoryService.DeleteReasonAsync(id);
        if (!result) return NotFoundResponse("Reason not found");
        return NoContentResponse();
    }
}
