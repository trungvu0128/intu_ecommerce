using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LotusEcommerce.API.Controllers.Admin;

[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class AdminUsersController : BaseApiController
{
    private readonly UserManager<User> _userManager;

    public AdminUsersController(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? role,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _userManager.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.ToLower();
            query = query.Where(u =>
                (u.Email != null && u.Email.ToLower().Contains(search)) ||
                (u.FullName != null && u.FullName.ToLower().Contains(search)));
        }

        if (!string.IsNullOrWhiteSpace(role))
        {
            var usersInRole = await _userManager.GetUsersInRoleAsync(role);
            var userIds = usersInRole.Select(u => u.Id).ToList();
            query = query.Where(u => userIds.Contains(u.Id));
        }

        var total = await query.CountAsync();
        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = new List<AdminUserDto>();
        foreach (var u in users)
        {
            var roles = await _userManager.GetRolesAsync(u);
            dtos.Add(new AdminUserDto
            {
                Id = u.Id.ToString(),
                Email = u.Email ?? "",
                FullName = u.FullName,
                PhoneNumber = u.PhoneNumber,
                AvatarUrl = u.AvatarUrl,
                IsActive = u.IsActive,
                EmailConfirmed = u.EmailConfirmed,
                Roles = roles.ToList(),
                CreatedAt = u.CreatedAt,
            });
        }

        return OkResponse(new { total, page, pageSize, data = dtos });
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        // Check if user already exists
        var existing = await _userManager.FindByEmailAsync(dto.Email);
        if (existing != null)
            return BadRequestResponse("A user with this email already exists.");

        // Validate role
        var validRoles = new[] { "Admin", "Customer" };
        if (!validRoles.Contains(dto.Role))
            return BadRequestResponse($"Invalid role. Allowed: {string.Join(", ", validRoles)}");

        var user = new User
        {
            Email = dto.Email,
            UserName = dto.Email,
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            EmailConfirmed = true, // Admin-created accounts are auto-confirmed
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            return BadRequestResponse(errors);
        }

        await _userManager.AddToRoleAsync(user, dto.Role);

        return OkResponse(new AdminUserDto
        {
            Id = user.Id.ToString(),
            Email = user.Email!,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber,
            AvatarUrl = user.AvatarUrl,
            IsActive = user.IsActive,
            EmailConfirmed = user.EmailConfirmed,
            Roles = new List<string> { dto.Role },
            CreatedAt = user.CreatedAt,
        });
    }

    [HttpPatch("{id}/role")]
    public async Task<IActionResult> UpdateRole(string id, [FromBody] UpdateUserRoleDto dto)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFoundResponse("User not found");

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        await _userManager.AddToRoleAsync(user, dto.Role);

        return NoContentResponse();
    }

    [HttpPatch("{id}/toggle-active")]
    public async Task<IActionResult> ToggleActive(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFoundResponse("User not found");

        user.IsActive = !user.IsActive;
        await _userManager.UpdateAsync(user);

        return OkResponse(new { user.IsActive });
    }
}
