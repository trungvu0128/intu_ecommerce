using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace LotusEcommerce.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;

    public UserService(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<UserProfileDto?> GetProfileAsync(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return null;

        var roles = await _userManager.GetRolesAsync(user);
        return MapToDto(user, roles);
    }

    public async Task<UserProfileDto?> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return null;

        // Apply only non-null fields (partial update / PATCH semantics)
        if (request.FullName is not null)
            user.FullName = request.FullName.Trim();

        if (request.PhoneNumber is not null)
            user.PhoneNumber = request.PhoneNumber.Trim();

        if (request.Gender is not null)
            user.Gender = request.Gender.Trim();

        if (request.AvatarUrl is not null)
            user.AvatarUrl = request.AvatarUrl.Trim();

        if (request.DateOfBirth is not null)
        {
            if (DateOnly.TryParse(request.DateOfBirth, out var dob))
                user.DateOfBirth = dob;
        }

        user.UpdatedAt = DateTime.UtcNow;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded) return null;

        var roles = await _userManager.GetRolesAsync(user);
        return MapToDto(user, roles);
    }

    public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null) return false;

        var result = await _userManager.ChangePasswordAsync(
            user, request.CurrentPassword, request.NewPassword);

        return result.Succeeded;
    }

    // ─── Mapper ─────────────────────────────────────────────────────────────────
    private static UserProfileDto MapToDto(User user, IList<string> roles) => new()
    {
        Id           = user.Id,
        Email        = user.Email ?? string.Empty,
        FullName     = user.FullName,
        PhoneNumber  = user.PhoneNumber,
        Gender       = user.Gender,
        DateOfBirth  = user.DateOfBirth?.ToString("yyyy-MM-dd"),
        AvatarUrl    = user.AvatarUrl,
        EmailConfirmed = user.EmailConfirmed,
        Roles        = roles.ToList(),
        CreatedAt    = user.CreatedAt,
    };
}
