using FirebaseAdmin.Auth;
using LotusEcommerce.Application.DTOs.Auth;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using LotusEcommerce.Infrastructure.Configuration;
using FirebaseAdmin;

namespace LotusEcommerce.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;
    private readonly AppDbContext _context;
    private readonly FirebaseOptions _firebaseOptions;
    private readonly GoogleAuthOptions _googleOptions;

    public AuthService(
        UserManager<User> userManager,
        RoleManager<IdentityRole<Guid>> roleManager,
        ITokenService tokenService,
        IEmailService emailService,
        AppDbContext context,
        IOptions<FirebaseOptions> firebaseOptions,
        IOptions<GoogleAuthOptions> googleOptions)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _tokenService = tokenService;
        _emailService = emailService;
        _context = context;
        _firebaseOptions = firebaseOptions.Value;
        _googleOptions = googleOptions.Value;
    }

    public async Task<TokenResponse?> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null) return null;

        var user = new User
        {
            Email = request.Email,
            UserName = request.Email,
            FullName = request.FullName,
            PhoneNumber = request.PhoneNumber
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded) return null;

        // Default role: Customer
        if (!await _roleManager.RoleExistsAsync("Customer"))
        {
            await _roleManager.CreateAsync(new IdentityRole<Guid>("Customer"));
        }
        await _userManager.AddToRoleAsync(user, "Customer");

        // Send Email Verification
        var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        // In a real app, this URL would point to your frontend
        var callbackUrl = $"https://localhost:5001/api/auth/confirm-email?userId={user.Id}&token={Uri.EscapeDataString(emailToken)}";
        await _emailService.SendEmailAsync(user.Email!, "Confirm your email", $"Please confirm your account by <a href='{callbackUrl}'>clicking here</a>.");

        return await GenerateTokenResponseAsync(user, "127.0.0.1");
    }

    public async Task<bool> ConfirmEmailAsync(string userId, string token)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        var result = await _userManager.ConfirmEmailAsync(user, token);
        return result.Succeeded;
    }

    public async Task<TokenResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            return null;
        }

        return await GenerateTokenResponseAsync(user, "127.0.0.1");
    }

    public async Task<TokenResponse?> RefreshTokenAsync(string refreshToken, string ipAddress)
    {
        var user = await _context.Users
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == refreshToken));

        if (user == null) return null;

        var token = user.RefreshTokens.Single(t => t.Token == refreshToken);
        if (!token.IsActive) return null;

        // Revoke old token
        token.Revoked = DateTime.UtcNow;
        token.RevokedByIp = ipAddress;

        // Generate new token
        var newRefreshToken = _tokenService.GenerateRefreshToken(user.Id, ipAddress);
        user.RefreshTokens.Add(newRefreshToken);

        await _context.SaveChangesAsync();

        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _tokenService.GenerateAccessToken(user, roles);

        return new TokenResponse
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshToken.Token,
            Expiration = DateTime.UtcNow.AddMinutes(60), // Should match JwtSettings
            UserEmail = user.Email!,
            FullName = user.FullName ?? string.Empty,
            Roles = roles.ToList()
        };
    }

    public async Task<bool> RevokeTokenAsync(string refreshToken, string ipAddress)
    {
        var user = await _context.Users
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == refreshToken));

        if (user == null) return false;

        var token = user.RefreshTokens.Single(t => t.Token == refreshToken);
        if (!token.IsActive) return false;

        token.Revoked = DateTime.UtcNow;
        token.RevokedByIp = ipAddress;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<TokenResponse?> ExternalLoginAsync(string provider, string idToken)
    {
        // TODO: Verify external token (Google/Facebook)
        // For brevity, we'll implement this as a skeleton.
        // In a real app, use GoogleJsonWebSignature.ValidateAsync or similar.
        return null;
    }

    public async Task<TokenResponse?> FirebaseLoginAsync(string idToken, string ipAddress)
    {
        try
        {
            if (FirebaseApp.DefaultInstance == null)
            {
                throw new InvalidOperationException("Firebase Admin SDK is not initialized. Check server credentials.");
            }

            var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
            var uid = decodedToken.Uid;
            var email = decodedToken.Claims["email"].ToString();
            var name = decodedToken.Claims.ContainsKey("name") ? decodedToken.Claims["name"].ToString() : email;

            if (string.IsNullOrEmpty(email)) return null;

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                user = new User
                {
                    Email = email,
                    UserName = email,
                    FullName = name,
                    EmailConfirmed = true // Verified by Firebase
                };

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded) return null;

                if (!await _roleManager.RoleExistsAsync("Customer"))
                {
                    await _roleManager.CreateAsync(new IdentityRole<Guid>("Customer"));
                }
                await _userManager.AddToRoleAsync(user, "Customer");
            }

            return await GenerateTokenResponseAsync(user, ipAddress);
        }
        catch (Exception)
        {
            return null;
        }
    }

    private async Task<TokenResponse> GenerateTokenResponseAsync(User user, string ipAddress = "127.0.0.1")
    {
        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _tokenService.GenerateAccessToken(user, roles);
        var refreshToken = _tokenService.GenerateRefreshToken(user.Id, ipAddress);

        user.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return new TokenResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token,
            Expiration = DateTime.UtcNow.AddMinutes(60),
            UserEmail = user.Email!,
            FullName = user.FullName ?? string.Empty,
            Roles = roles.ToList()
        };
    }
}
