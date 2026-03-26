using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LotusEcommerce.API.Controllers.Admin;

[Route("api/admin/cms")]
[Authorize(Roles = "Admin")]
public class AdminCmsController : BaseApiController
{
    private readonly ICmsService _cmsService;

    public AdminCmsController(ICmsService cmsService)
    {
        _cmsService = cmsService;
    }

    // ─── Banners ──────────────────────────────────────────────────────────────

    [HttpGet("banners")]
    public async Task<IActionResult> GetBanners()
    {
        var banners = await _cmsService.GetBannersAsync();
        return OkResponse(banners);
    }

    [HttpGet("banners/{id}")]
    public async Task<IActionResult> GetBanner(Guid id)
    {
        var banner = await _cmsService.GetBannerByIdAsync(id);
        if (banner == null) return NotFoundResponse("Banner not found");
        return OkResponse(banner);
    }

    [HttpPost("banners")]
    public async Task<IActionResult> CreateBanner(CreateBannerDto dto)
    {
        var banner = await _cmsService.CreateBannerAsync(dto);
        return OkResponse(banner);
    }

    [HttpPut("banners/{id}")]
    public async Task<IActionResult> UpdateBanner(Guid id, UpdateBannerDto dto)
    {
        var result = await _cmsService.UpdateBannerAsync(id, dto);
        if (!result) return NotFoundResponse("Banner not found");
        return NoContentResponse();
    }

    [HttpDelete("banners/{id}")]
    public async Task<IActionResult> DeleteBanner(Guid id)
    {
        var result = await _cmsService.DeleteBannerAsync(id);
        if (!result) return NotFoundResponse("Banner not found");
        return NoContentResponse();
    }

    // ─── Blog Categories ──────────────────────────────────────────────────────

    [HttpGet("blog-categories")]
    public async Task<IActionResult> GetBlogCategories()
    {
        var cats = await _cmsService.GetBlogCategoriesAsync();
        return OkResponse(cats);
    }

    [HttpPost("blog-categories")]
    public async Task<IActionResult> CreateBlogCategory(CreateBlogCategoryDto dto)
    {
        var cat = await _cmsService.CreateBlogCategoryAsync(dto);
        return OkResponse(cat);
    }

    [HttpPut("blog-categories/{id}")]
    public async Task<IActionResult> UpdateBlogCategory(Guid id, UpdateBlogCategoryDto dto)
    {
        var result = await _cmsService.UpdateBlogCategoryAsync(id, dto);
        if (!result) return NotFoundResponse("Blog category not found");
        return NoContentResponse();
    }

    [HttpDelete("blog-categories/{id}")]
    public async Task<IActionResult> DeleteBlogCategory(Guid id)
    {
        var result = await _cmsService.DeleteBlogCategoryAsync(id);
        if (!result) return NotFoundResponse("Blog category not found");
        return NoContentResponse();
    }

    // ─── Blog Posts ───────────────────────────────────────────────────────────

    [HttpGet("blogs")]
    public async Task<IActionResult> GetBlogs([FromQuery] bool? isPublished)
    {
        var posts = await _cmsService.GetBlogPostsAsync(isPublished);
        return OkResponse(posts);
    }

    [HttpGet("blogs/{id}")]
    public async Task<IActionResult> GetBlog(Guid id)
    {
        var post = await _cmsService.GetBlogPostByIdAsync(id);
        if (post == null) return NotFoundResponse("Blog post not found");
        return OkResponse(post);
    }

    [HttpPost("blogs")]
    public async Task<IActionResult> CreateBlog(CreateBlogPostDto dto)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId))
            return UnauthorizedResponse("Invalid user");

        var post = await _cmsService.CreateBlogPostAsync(userId, dto);
        return OkResponse(post);
    }

    [HttpPut("blogs/{id}")]
    public async Task<IActionResult> UpdateBlog(Guid id, UpdateBlogPostDto dto)
    {
        var result = await _cmsService.UpdateBlogPostAsync(id, dto);
        if (!result) return NotFoundResponse("Blog post not found");
        return NoContentResponse();
    }

    [HttpDelete("blogs/{id}")]
    public async Task<IActionResult> DeleteBlog(Guid id)
    {
        var result = await _cmsService.DeleteBlogPostAsync(id);
        if (!result) return NotFoundResponse("Blog post not found");
        return NoContentResponse();
    }

    // ─── Featured Sections ───────────────────────────────────────────────────

    [HttpGet("featured-sections")]
    public async Task<IActionResult> GetFeaturedSections([FromQuery] bool? isActive)
    {
        var sections = await _cmsService.GetFeaturedSectionsAsync(isActive);
        return OkResponse(sections);
    }

    [HttpGet("featured-sections/{id}")]
    public async Task<IActionResult> GetFeaturedSection(Guid id)
    {
        var section = await _cmsService.GetFeaturedSectionByIdAsync(id);
        if (section == null) return NotFoundResponse("Featured section not found");
        return OkResponse(section);
    }

    [HttpPost("featured-sections")]
    public async Task<IActionResult> CreateFeaturedSection(CreateFeaturedSectionDto dto)
    {
        var section = await _cmsService.CreateFeaturedSectionAsync(dto);
        return OkResponse(section);
    }

    [HttpPut("featured-sections/{id}")]
    public async Task<IActionResult> UpdateFeaturedSection(Guid id, UpdateFeaturedSectionDto dto)
    {
        var result = await _cmsService.UpdateFeaturedSectionAsync(id, dto);
        if (!result) return NotFoundResponse("Featured section not found");
        return NoContentResponse();
    }

    [HttpDelete("featured-sections/{id}")]
    public async Task<IActionResult> DeleteFeaturedSection(Guid id)
    {
        var result = await _cmsService.DeleteFeaturedSectionAsync(id);
        if (!result) return NotFoundResponse("Featured section not found");
        return NoContentResponse();
    }
}
