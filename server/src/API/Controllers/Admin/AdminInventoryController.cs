using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LotusEcommerce.API.Controllers.Admin;

[Route("api/admin/inventory")]
[Authorize(Roles = "Admin")]
public class AdminInventoryController : BaseApiController
{
    private readonly IInventoryService _inventoryService;

    public AdminInventoryController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] int? lowStockThreshold)
    {
        var items = await _inventoryService.GetInventoryAsync(search, lowStockThreshold);
        return OkResponse(items);
    }

    [HttpPatch("bulk-update")]
    public async Task<IActionResult> BulkUpdate(BulkUpdateStockDto dto)
    {
        if (dto.Items.Count == 0) return BadRequestResponse("No items provided");
        var result = await _inventoryService.BulkUpdateStockAsync(dto);
        if (!result) return NotFoundResponse("One or more variants not found");
        return NoContentResponse();
    }

    // ─── Good Receipt ────────────────────────────────────────────────────────────

    [HttpPost("good-receipt")]
    public async Task<IActionResult> CreateGoodReceipt(CreateGoodReceiptDto dto)
    {
        if (dto.Items.Count == 0) return BadRequestResponse("No items provided");

        var userId = GetUserId();
        var result = await _inventoryService.CreateGoodReceiptAsync(dto, userId);
        if (!result) return BadRequestResponse("Failed to create good receipt. One or more variants not found.");
        return OkResponse("Good receipt created successfully");
    }

    // ─── Good Issue ──────────────────────────────────────────────────────────────

    [HttpPost("good-issue")]
    public async Task<IActionResult> CreateGoodIssue(CreateGoodIssueDto dto)
    {
        if (dto.Items.Count == 0) return BadRequestResponse("No items provided");

        try
        {
            var userId = GetUserId();
            var result = await _inventoryService.CreateGoodIssueAsync(dto, userId);
            if (!result) return BadRequestResponse("Failed to create good issue. One or more variants not found.");
            return OkResponse("Good issue created successfully");
        }
        catch (InvalidOperationException ex)
        {
            return BadRequestResponse(ex.Message);
        }
    }

    // ─── Transaction History ─────────────────────────────────────────────────────

    [HttpGet("transactions")]
    public async Task<IActionResult> GetTransactions([FromQuery] TransactionHistoryQueryDto query)
    {
        var result = await _inventoryService.GetTransactionsAsync(query);
        return OkResponse(result);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────────

    private Guid? GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var id) ? id : null;
    }
}
