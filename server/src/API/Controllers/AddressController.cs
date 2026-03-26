using System.Security.Claims;
using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers;

[Route("api/[controller]")]
public class AddressController : BaseApiController
{
    private readonly IAddressService _addressService;

    public AddressController(IAddressService addressService)
    {
        _addressService = addressService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAddressDto createAddressDto)
    {
        // Get user ID from claims if authenticated
        Guid? userId = null;
        if (User.Identity?.IsAuthenticated == true)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(userIdString, out var parsedId))
            {
                userId = parsedId;
            }
        }

        var address = await _addressService.CreateAsync(createAddressDto, userId);
        return CreatedResponse(address, nameof(GetById), new { id = address.Id });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var address = await _addressService.GetByIdAsync(id);
        if (address == null) return NotFoundResponse("Address not found");
        return OkResponse(address);
    }

    [HttpGet("user")]
    [Authorize]
    public async Task<IActionResult> GetUserAddresses()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId))
        {
            return UnauthorizedResponse("Invalid user ID");
        }

        var addresses = await _addressService.GetUserAddressesAsync(userId);
        return OkResponse(addresses);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _addressService.DeleteAsync(id);
        if (!result) return NotFoundResponse("Address not found");
        return NoContentResponse();
    }
}