using LotusEcommerce.Application.DTOs.Auth;

namespace LotusEcommerce.Application.Interfaces;

public interface IAuthService
{
    Task<TokenResponse?> RegisterAsync(RegisterRequest request);
    Task<bool> ConfirmEmailAsync(string userId, string token);
    Task<TokenResponse?> LoginAsync(LoginRequest request);
    Task<TokenResponse?> RefreshTokenAsync(string refreshToken, string ipAddress);
    Task<bool> RevokeTokenAsync(string refreshToken, string ipAddress);
    Task<TokenResponse?> ExternalLoginAsync(string provider, string idToken);
    Task<TokenResponse?> FirebaseLoginAsync(string idToken, string ipAddress);
}
