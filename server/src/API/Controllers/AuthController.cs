using LotusEcommerce.Application.DTOs.Auth;
using LotusEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers;

[Route("api/[controller]")]
public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var response = await _authService.RegisterAsync(request);
        if (response == null)
        {
            return BadRequestResponse("User already exists or registration failed");
        }

        return OkResponse(response);
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(string userId, string token)
    {
        var result = await _authService.ConfirmEmailAsync(userId, token);
        if (!result)
        {
            return BadRequestResponse("Email confirmation failed");
        }

        return OkResponse(new { message = "Email confirmed successfully" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);
        if (response == null)
        {
            return UnauthorizedResponse("Invalid email or password");
        }

        return OkResponse(response);
    }

    [HttpPost("firebase-login")]
    public async Task<IActionResult> FirebaseLogin([FromBody] ExternalAuthRequest request)
    {
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        var response = await _authService.FirebaseLoginAsync(request.IdToken, ipAddress);
        if (response == null)
        {
            return UnauthorizedResponse("Invalid Firebase token or login failed");
        }

        return OkResponse(response);
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        var response = await _authService.RefreshTokenAsync(request.RefreshToken, ipAddress);
        if (response == null)
        {
            return UnauthorizedResponse("Invalid or expired refresh token");
        }

        return OkResponse(response);
    }

    [HttpPost("revoke-token")]
    [Authorize]
    public async Task<IActionResult> RevokeToken([FromBody] RefreshTokenRequest request)
    {
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        var result = await _authService.RevokeTokenAsync(request.RefreshToken, ipAddress);
        if (!result)
        {
            return BadRequestResponse("Token revocation failed");
        }

        return OkResponse(new { message = "Token revoked successfully" });
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult GetMe()
    {
        return OkResponse(new
        {
            Email = User.Identity?.Name,
            Roles = User.Claims
                .Where(c => c.Type == System.Security.Claims.ClaimTypes.Role)
                .Select(c => c.Value)
                .ToList()
        });
    }
}
