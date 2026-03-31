using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Enums;
using LotusEcommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LotusEcommerce.API.Controllers.Admin;

[Route("api/admin/dashboard")]
[Authorize(Roles = "Admin")]
public class AdminDashboardController : BaseApiController
{
    private readonly AppDbContext _context;
    private readonly UserManager<User> _userManager;

    public AdminDashboardController(AppDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetStats()
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        var totalProducts = await _context.Products.CountAsync();
        var totalOrders = await _context.Orders.CountAsync();
        var totalUsers = await _userManager.Users.CountAsync();

        var totalRevenue = await _context.Orders
            .Where(o => o.Status != OrderStatus.Cancelled)
            .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;

        var ordersToday = await _context.Orders
            .Where(o => o.CreatedAt >= today && o.CreatedAt < tomorrow)
            .CountAsync();

        var revenueToday = await _context.Orders
            .Where(o => o.CreatedAt >= today && o.CreatedAt < tomorrow && o.Status != OrderStatus.Cancelled)
            .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;

        var pendingOrders = await _context.Orders
            .Where(o => o.Status == OrderStatus.Pending)
            .CountAsync();

        var recentOrdersRaw = await _context.Orders
            .OrderByDescending(o => o.CreatedAt)
            .Take(10)
            .ToListAsync();

        var userIds = recentOrdersRaw.Select(o => o.UserId).Distinct().ToList();
        var userNames = await _userManager.Users
            .Where(u => userIds.Contains(u.Id))
            .Select(u => new { u.Id, u.FullName })
            .ToDictionaryAsync(u => u.Id, u => u.FullName);

        var recentOrders = recentOrdersRaw.Select(o => new RecentOrderDto
        {
            Id = o.Id,
            OrderNumber = o.OrderNumber,
            CustomerName = o.UserId.HasValue && userNames.TryGetValue(o.UserId.Value, out var name) ? name : null,
            TotalAmount = o.TotalAmount,
            Status = o.Status.ToString(),
            CreatedAt = o.CreatedAt,
        }).ToList();

        return OkResponse(new AdminDashboardDto
        {
            TotalProducts = totalProducts,
            TotalOrders = totalOrders,
            TotalUsers = totalUsers,
            TotalRevenue = totalRevenue,
            OrdersToday = ordersToday,
            RevenueToday = revenueToday,
            PendingOrders = pendingOrders,
            RecentOrders = recentOrders,
        });
    }
}
