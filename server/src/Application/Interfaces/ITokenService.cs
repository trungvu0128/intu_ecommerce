using LotusEcommerce.Domain.Entities;
using System.Security.Claims;

namespace LotusEcommerce.Application.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user, IEnumerable<string> roles);
    RefreshToken GenerateRefreshToken(Guid userId, string ipAddress);
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
