using System.Security.Claims;
using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers;

/// <summary>
/// Manages the authenticated user's own profile data.
/// All endpoints require a valid JWT bearer token.
/// </summary>
[Route("api/users")]
[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    // ─── Helper ──────────────────────────────────────────────────────────────────

    private Guid? GetCurrentUserId()
    {
        var raw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(raw, out var id) ? id : null;
    }

    // ─── GET /api/users/me ────────────────────────────────────────────────────

    /// <summary>
    /// Returns the full profile of the currently authenticated user.
    /// </summary>
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = GetCurrentUserId();
        if (userId is null) return UnauthorizedResponse("Invalid user token");

        var profile = await _userService.GetProfileAsync(userId.Value);
        if (profile is null) return NotFoundResponse("User not found");

        return OkResponse(profile);
    }

    // ─── PATCH /api/users/me ──────────────────────────────────────────────────

    /// <summary>
    /// Partially updates the profile of the currently authenticated user.
    /// Only non-null fields in the body are applied.
    /// </summary>
    [HttpPatch("me")]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return UnauthorizedResponse("Invalid user token");

        var updated = await _userService.UpdateProfileAsync(userId.Value, request);
        if (updated is null) return BadRequestResponse("Profile update failed");

        return OkResponse(updated);
    }

    // ─── POST /api/users/me/change-password ───────────────────────────────────

    /// <summary>
    /// Changes the authenticated user's password.
    /// </summary>
    [HttpPost("me/change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return UnauthorizedResponse("Invalid user token");

        var success = await _userService.ChangePasswordAsync(userId.Value, request);
        if (!success) return BadRequestResponse("Password change failed. Current password may be incorrect.");

        return OkResponse(new { message = "Password changed successfully" });
    }
}
