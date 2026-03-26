using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LotusEcommerce.Infrastructure.Services;

public class CmsService : ICmsService
{
    private readonly AppDbContext _context;

    public CmsService(AppDbContext context)
    {
        _context = context;
    }

    // ─── Banners ──────────────────────────────────────────────────────────────

    public async Task<IEnumerable<BannerDto>> GetBannersAsync()
    {
        return await _context.Banners
            .OrderBy(b => b.DisplayOrder)
            .Select(b => MapBanner(b))
            .ToListAsync();
    }

    public async Task<BannerDto?> GetBannerByIdAsync(Guid id)
    {
        var b = await _context.Banners.FindAsync(id);
        return b == null ? null : MapBanner(b);
    }

    public async Task<BannerDto> CreateBannerAsync(CreateBannerDto dto)
    {
        var b = new Banner
        {
            Title = dto.Title,
            ImageUrl = dto.ImageUrl,
            LinkUrl = dto.LinkUrl,
            Position = dto.Position,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive,
        };
        _context.Banners.Add(b);
        await _context.SaveChangesAsync();
        return MapBanner(b);
    }

    public async Task<bool> UpdateBannerAsync(Guid id, UpdateBannerDto dto)
    {
        var b = await _context.Banners.FindAsync(id);
        if (b == null) return false;

        b.Title = dto.Title;
        b.ImageUrl = dto.ImageUrl;
        b.LinkUrl = dto.LinkUrl;
        b.Position = dto.Position;
        b.DisplayOrder = dto.DisplayOrder;
        b.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteBannerAsync(Guid id)
    {
        var b = await _context.Banners.FindAsync(id);
        if (b == null) return false;
        _context.Banners.Remove(b);
        await _context.SaveChangesAsync();
        return true;
    }

    private static BannerDto MapBanner(Banner b) => new()
    {
        Id = b.Id,
        Title = b.Title,
        ImageUrl = b.ImageUrl,
        LinkUrl = b.LinkUrl,
        Position = b.Position,
        DisplayOrder = b.DisplayOrder,
        IsActive = b.IsActive,
        CreatedAt = b.CreatedAt,
    };

    // ─── Blog Categories ──────────────────────────────────────────────────────

    public async Task<IEnumerable<BlogCategoryDto>> GetBlogCategoriesAsync()
    {
        return await _context.BlogCategories
            .Include(c => c.Posts)
            .Select(c => new BlogCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                PostCount = c.Posts.Count,
            })
            .ToListAsync();
    }

    public async Task<BlogCategoryDto> CreateBlogCategoryAsync(CreateBlogCategoryDto dto)
    {
        var cat = new BlogCategory { Name = dto.Name, Slug = dto.Slug };
        _context.BlogCategories.Add(cat);
        await _context.SaveChangesAsync();
        return new BlogCategoryDto { Id = cat.Id, Name = cat.Name, Slug = cat.Slug };
    }

    public async Task<bool> UpdateBlogCategoryAsync(Guid id, UpdateBlogCategoryDto dto)
    {
        var cat = await _context.BlogCategories.FindAsync(id);
        if (cat == null) return false;
        cat.Name = dto.Name;
        cat.Slug = dto.Slug;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteBlogCategoryAsync(Guid id)
    {
        var cat = await _context.BlogCategories.FindAsync(id);
        if (cat == null) return false;
        _context.BlogCategories.Remove(cat);
        await _context.SaveChangesAsync();
        return true;
    }

    // ─── Blog Posts ───────────────────────────────────────────────────────────

    public async Task<IEnumerable<BlogPostDto>> GetBlogPostsAsync(bool? isPublished = null)
    {
        var query = _context.BlogPosts
            .Include(p => p.Author)
            .Include(p => p.Category)
            .AsQueryable();

        if (isPublished.HasValue)
            query = query.Where(p => p.IsPublished == isPublished.Value);

        return await query
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => MapBlogPost(p))
            .ToListAsync();
    }

    public async Task<BlogPostDto?> GetBlogPostByIdAsync(Guid id)
    {
        var post = await _context.BlogPosts
            .Include(p => p.Author)
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);
        return post == null ? null : MapBlogPost(post);
    }

    public async Task<BlogPostDto> CreateBlogPostAsync(Guid authorId, CreateBlogPostDto dto)
    {
        var post = new BlogPost
        {
            Title = dto.Title,
            Slug = dto.Slug,
            Content = dto.Content,
            Excerpt = dto.Excerpt,
            ThumbnailUrl = dto.ThumbnailUrl,
            CategoryId = dto.CategoryId,
            AuthorId = authorId,
            IsPublished = dto.IsPublished,
            PublishedAt = dto.IsPublished ? DateTime.UtcNow : null,
        };
        _context.BlogPosts.Add(post);
        await _context.SaveChangesAsync();

        await _context.Entry(post).Reference(p => p.Author).LoadAsync();
        await _context.Entry(post).Reference(p => p.Category).LoadAsync();
        return MapBlogPost(post);
    }

    public async Task<bool> UpdateBlogPostAsync(Guid id, UpdateBlogPostDto dto)
    {
        var post = await _context.BlogPosts.FindAsync(id);
        if (post == null) return false;

        post.Title = dto.Title;
        post.Slug = dto.Slug;
        post.Content = dto.Content;
        post.Excerpt = dto.Excerpt;
        post.ThumbnailUrl = dto.ThumbnailUrl;
        post.CategoryId = dto.CategoryId;

        if (dto.IsPublished && !post.IsPublished)
            post.PublishedAt = DateTime.UtcNow;
        else if (!dto.IsPublished)
            post.PublishedAt = null;
        post.IsPublished = dto.IsPublished;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteBlogPostAsync(Guid id)
    {
        var post = await _context.BlogPosts.FindAsync(id);
        if (post == null) return false;
        _context.BlogPosts.Remove(post);
        await _context.SaveChangesAsync();
        return true;
    }

    private static BlogPostDto MapBlogPost(BlogPost p) => new()
    {
        Id = p.Id,
        Title = p.Title,
        Slug = p.Slug,
        Content = p.Content,
        Excerpt = p.Excerpt,
        ThumbnailUrl = p.ThumbnailUrl,
        AuthorId = p.AuthorId,
        AuthorName = p.Author?.FullName,
        CategoryId = p.CategoryId,
        CategoryName = p.Category?.Name,
        IsPublished = p.IsPublished,
        PublishedAt = p.PublishedAt,
        CreatedAt = p.CreatedAt,
    };

    // ─── Featured Sections ───────────────────────────────────────────────────

    public async Task<IEnumerable<FeaturedSectionDto>> GetFeaturedSectionsAsync(bool? isActive = null)
    {
        var query = _context.FeaturedSections
            .Include(s => s.Category)
            .Include(s => s.Items)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.Images)
            .AsQueryable();

        if (isActive.HasValue)
            query = query.Where(s => s.IsActive == isActive.Value);

        var sections = await query
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync();

        var result = new List<FeaturedSectionDto>();
        foreach (var s in sections)
        {
            result.Add(await MapFeaturedSectionAsync(s));
        }
        return result;
    }

    public async Task<FeaturedSectionDto?> GetFeaturedSectionByIdAsync(Guid id)
    {
        var section = await _context.FeaturedSections
            .Include(s => s.Category)
            .Include(s => s.Items)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(s => s.Id == id);

        return section == null ? null : await MapFeaturedSectionAsync(section);
    }

    public async Task<FeaturedSectionDto> CreateFeaturedSectionAsync(CreateFeaturedSectionDto dto)
    {
        var sectionType = Enum.TryParse<FeaturedSectionType>(dto.Type, true, out var parsed)
            ? parsed : FeaturedSectionType.Manual;

        var section = new FeaturedSection
        {
            Title = dto.Title,
            Subtitle = dto.Subtitle,
            Type = sectionType,
            CategoryId = sectionType == FeaturedSectionType.Category ? dto.CategoryId : null,
            GridColumns = dto.GridColumns,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive,
            Items = sectionType == FeaturedSectionType.Manual
                ? dto.Items.Select(i => new FeaturedSectionItem
                {
                    ProductId = i.ProductId,
                    OverlayText = i.OverlayText,
                    LinkUrl = i.LinkUrl,
                    ImageUrl = i.ImageUrl,
                    DisplayOrder = i.DisplayOrder,
                }).ToList()
                : new List<FeaturedSectionItem>(),
        };

        _context.FeaturedSections.Add(section);
        await _context.SaveChangesAsync();

        // Reload with includes
        return (await GetFeaturedSectionByIdAsync(section.Id))!;
    }

    public async Task<bool> UpdateFeaturedSectionAsync(Guid id, UpdateFeaturedSectionDto dto)
    {
        var section = await _context.FeaturedSections
            .Include(s => s.Items)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (section == null) return false;

        var sectionType = Enum.TryParse<FeaturedSectionType>(dto.Type, true, out var parsed)
            ? parsed : FeaturedSectionType.Manual;

        section.Title = dto.Title;
        section.Subtitle = dto.Subtitle;
        section.Type = sectionType;
        section.CategoryId = sectionType == FeaturedSectionType.Category ? dto.CategoryId : null;
        section.GridColumns = dto.GridColumns;
        section.DisplayOrder = dto.DisplayOrder;
        section.IsActive = dto.IsActive;

        // Replace all items (only for Manual type)
        _context.FeaturedSectionItems.RemoveRange(section.Items);
        if (sectionType == FeaturedSectionType.Manual)
        {
            section.Items = dto.Items.Select(i => new FeaturedSectionItem
            {
                FeaturedSectionId = id,
                ProductId = i.ProductId,
                OverlayText = i.OverlayText,
                LinkUrl = i.LinkUrl,
                ImageUrl = i.ImageUrl,
                DisplayOrder = i.DisplayOrder,
            }).ToList();
        }
        else
        {
            section.Items = new List<FeaturedSectionItem>();
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteFeaturedSectionAsync(Guid id)
    {
        var section = await _context.FeaturedSections.FindAsync(id);
        if (section == null) return false;
        _context.FeaturedSections.Remove(section);
        await _context.SaveChangesAsync();
        return true;
    }

    private async Task<FeaturedSectionDto> MapFeaturedSectionAsync(FeaturedSection s)
    {
        var dto = new FeaturedSectionDto
        {
            Id = s.Id,
            Title = s.Title,
            Subtitle = s.Subtitle,
            Type = s.Type.ToString(),
            CategoryId = s.CategoryId,
            CategoryName = s.Category?.Name,
            GridColumns = s.GridColumns,
            DisplayOrder = s.DisplayOrder,
            IsActive = s.IsActive,
            CreatedAt = s.CreatedAt,
        };

        if (s.Type == FeaturedSectionType.Category && s.CategoryId.HasValue)
        {
            // Dynamically fetch products from the category
            var products = await _context.Products
                .Include(p => p.Images)
                .Where(p => p.CategoryId == s.CategoryId.Value && p.IsActive)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            dto.Items = products.Select((p, index) => new FeaturedSectionItemDto
            {
                Id = p.Id,
                ProductId = p.Id,
                ProductName = p.Name,
                ProductSlug = p.Slug,
                ProductImage = p.Images.FirstOrDefault(img => img.IsMain)?.Url
                              ?? p.Images.FirstOrDefault()?.Url,
                ProductPrice = p.BasePrice,
                DisplayOrder = index,
            }).ToList();
        }
        else
        {
            dto.Items = s.Items.OrderBy(i => i.DisplayOrder).Select(i => new FeaturedSectionItemDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.Product?.Name ?? string.Empty,
                ProductSlug = i.Product?.Slug,
                ProductImage = i.Product?.Images?.FirstOrDefault(img => img.IsMain)?.Url
                              ?? i.Product?.Images?.FirstOrDefault()?.Url,
                ProductPrice = i.Product?.BasePrice ?? 0,
                OverlayText = i.OverlayText,
                LinkUrl = i.LinkUrl,
                ImageUrl = i.ImageUrl,
                DisplayOrder = i.DisplayOrder,
            }).ToList();
        }

        return dto;
    }
}

