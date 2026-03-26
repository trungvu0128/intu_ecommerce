namespace LotusEcommerce.Application.DTOs;

// ─── Banner ───────────────────────────────────────────────────────────────────

public class BannerDto
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? LinkUrl { get; set; }
    public string Position { get; set; } = "MainHero";
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateBannerDto
{
    public string? Title { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? LinkUrl { get; set; }
    public string Position { get; set; } = "MainHero";
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateBannerDto
{
    public string? Title { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? LinkUrl { get; set; }
    public string Position { get; set; } = "MainHero";
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

// ─── Blog Category ─────────────────────────────────────────────────────────

public class BlogCategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int PostCount { get; set; }
}

public class CreateBlogCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}

public class UpdateBlogCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}

// ─── Blog Post ─────────────────────────────────────────────────────────────

public class BlogPostDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string? ThumbnailUrl { get; set; }
    public Guid? AuthorId { get; set; }
    public string? AuthorName { get; set; }
    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public bool IsPublished { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateBlogPostDto
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string? ThumbnailUrl { get; set; }
    public Guid? CategoryId { get; set; }
    public bool IsPublished { get; set; }
}

public class UpdateBlogPostDto
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string? ThumbnailUrl { get; set; }
    public Guid? CategoryId { get; set; }
    public bool IsPublished { get; set; }
}

// ─── Featured Section ──────────────────────────────────────────────────────

public class FeaturedSectionDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string Type { get; set; } = "Manual"; // Manual | Category
    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public int GridColumns { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<FeaturedSectionItemDto> Items { get; set; } = new();
}

public class FeaturedSectionItemDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ProductSlug { get; set; }
    public string? ProductImage { get; set; }
    public decimal ProductPrice { get; set; }
    public string? OverlayText { get; set; }
    public string? LinkUrl { get; set; }
    public string? ImageUrl { get; set; }
    public int DisplayOrder { get; set; }
}

public class CreateFeaturedSectionDto
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string Type { get; set; } = "Manual"; // Manual | Category
    public Guid? CategoryId { get; set; }
    public int GridColumns { get; set; } = 2;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public List<CreateFeaturedSectionItemDto> Items { get; set; } = new();
}

public class CreateFeaturedSectionItemDto
{
    public Guid ProductId { get; set; }
    public string? OverlayText { get; set; }
    public string? LinkUrl { get; set; }
    public string? ImageUrl { get; set; }
    public int DisplayOrder { get; set; }
}

public class UpdateFeaturedSectionDto
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string Type { get; set; } = "Manual"; // Manual | Category
    public Guid? CategoryId { get; set; }
    public int GridColumns { get; set; } = 2;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public List<CreateFeaturedSectionItemDto> Items { get; set; } = new();
}

// ─── Admin User ────────────────────────────────────────────────────────────

public class AdminUserDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public bool EmailConfirmed { get; set; }
    public List<string> Roles { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class UpdateUserRoleDto
{
    public string Role { get; set; } = string.Empty;
}

public class CreateUserDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Role { get; set; } = "Customer";
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

public class AdminDashboardDto
{
    public int TotalProducts { get; set; }
    public int TotalOrders { get; set; }
    public int TotalUsers { get; set; }
    public decimal TotalRevenue { get; set; }
    public int OrdersToday { get; set; }
    public decimal RevenueToday { get; set; }
    public int PendingOrders { get; set; }
    public List<RecentOrderDto> RecentOrders { get; set; } = new();
}

public class RecentOrderDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string? CustomerName { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
