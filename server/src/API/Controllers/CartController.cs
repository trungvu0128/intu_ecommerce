using System.Security.Claims;
using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CartController : BaseApiController
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) throw new UnauthorizedAccessException("User ID not found in token");
        return Guid.Parse(userIdClaim.Value);
    }

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var cart = await _cartService.GetCartAsync(GetUserId());
        return OkResponse(cart);
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
    {
        var cart = await _cartService.AddToCartAsync(GetUserId(), request);
        return OkResponse(cart);
    }

    [HttpDelete("item/{variantId}")]
    public async Task<IActionResult> RemoveFromCart(Guid variantId)
    {
        var cart = await _cartService.RemoveFromCartAsync(GetUserId(), variantId);
        return OkResponse(cart);
    }

    [HttpPost("sync")]
    public async Task<IActionResult> SyncCart([FromBody] SyncCartRequest request)
    {
        var cart = await _cartService.SyncCartAsync(GetUserId(), request);
        return OkResponse(cart);
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        await _cartService.ClearCartAsync(GetUserId());
        return NoContentResponse();
    }

}
