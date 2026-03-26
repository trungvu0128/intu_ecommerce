using LotusEcommerce.Application.DTOs;

namespace LotusEcommerce.Application.Interfaces;

public interface ICmsService
{
    // ─── Banners ──────────────────────────────────────────────────────────────
    Task<IEnumerable<BannerDto>> GetBannersAsync();
    Task<BannerDto?> GetBannerByIdAsync(Guid id);
    Task<BannerDto> CreateBannerAsync(CreateBannerDto dto);
    Task<bool> UpdateBannerAsync(Guid id, UpdateBannerDto dto);
    Task<bool> DeleteBannerAsync(Guid id);

    // ─── Blog Categories ──────────────────────────────────────────────────────
    Task<IEnumerable<BlogCategoryDto>> GetBlogCategoriesAsync();
    Task<BlogCategoryDto> CreateBlogCategoryAsync(CreateBlogCategoryDto dto);
    Task<bool> UpdateBlogCategoryAsync(Guid id, UpdateBlogCategoryDto dto);
    Task<bool> DeleteBlogCategoryAsync(Guid id);

    // ─── Blog Posts ───────────────────────────────────────────────────────────
    Task<IEnumerable<BlogPostDto>> GetBlogPostsAsync(bool? isPublished = null);
    Task<BlogPostDto?> GetBlogPostByIdAsync(Guid id);
    Task<BlogPostDto> CreateBlogPostAsync(Guid authorId, CreateBlogPostDto dto);
    Task<bool> UpdateBlogPostAsync(Guid id, UpdateBlogPostDto dto);
    Task<bool> DeleteBlogPostAsync(Guid id);

    // ─── Featured Sections ───────────────────────────────────────────────────
    Task<IEnumerable<FeaturedSectionDto>> GetFeaturedSectionsAsync(bool? isActive = null);
    Task<FeaturedSectionDto?> GetFeaturedSectionByIdAsync(Guid id);
    Task<FeaturedSectionDto> CreateFeaturedSectionAsync(CreateFeaturedSectionDto dto);
    Task<bool> UpdateFeaturedSectionAsync(Guid id, UpdateFeaturedSectionDto dto);
    Task<bool> DeleteFeaturedSectionAsync(Guid id);
}
