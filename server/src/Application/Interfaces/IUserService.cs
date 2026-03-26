using LotusEcommerce.Application.DTOs;

namespace LotusEcommerce.Application.Interfaces;

public interface IUserService
{
    /// <summary>Gets the full profile for the requesting user.</summary>
    Task<UserProfileDto?> GetProfileAsync(Guid userId);

    /// <summary>Updates mutable profile fields; returns the updated profile.</summary>
    Task<UserProfileDto?> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);

    /// <summary>Changes the user's password. Returns false if current password is wrong.</summary>
    Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
}
