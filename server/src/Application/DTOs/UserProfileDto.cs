namespace LotusEcommerce.Application.DTOs;

/// <summary>
/// Full user profile returned by GET /api/users/me
/// </summary>
public class UserProfileDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Gender { get; set; }
    public string? DateOfBirth { get; set; }   // ISO-8601 date string "yyyy-MM-dd"
    public string? AvatarUrl { get; set; }
    public bool EmailConfirmed { get; set; }
    public List<string> Roles { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Payload for PATCH /api/users/me — all fields are optional so clients
/// can send only what changed.
/// </summary>
public class UpdateProfileRequest
{
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Gender { get; set; }

    /// <summary>e.g. "1995-06-25"</summary>
    public string? DateOfBirth { get; set; }
    public string? AvatarUrl { get; set; }
}

/// <summary>
/// Payload for POST /api/users/me/change-password
/// </summary>
public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
