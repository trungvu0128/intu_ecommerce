using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LotusEcommerce.API.Controllers.Admin;

[Route("api/admin/categories")]
[Authorize(Roles = "Admin")]
public class AdminCategoriesController : BaseApiController
{
    private readonly AppDbContext _context;
    private readonly IImageService _imageService;
    public AdminCategoriesController(AppDbContext context, IImageService imageService)
    {
        _context = context;
        _imageService = imageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _context.Categories
            .Include(c => c.Parent)
            .Include(c => c.ProductCategories)
            .OrderBy(c => c.Name)
            .Select(c => new CategoryAdminDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                BannerImages = string.IsNullOrEmpty(c.BannerImages) ? null : System.Text.Json.JsonSerializer.Deserialize<List<string>>(c.BannerImages, new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }),
                IsActive = c.IsActive,
                ParentId = c.ParentId,
                ParentName = c.Parent != null ? c.Parent.Name : null,
                ProductCount = c.ProductCategories.Count,
                CreatedAt = c.CreatedAt,
            })
            .ToListAsync();

        return OkResponse(categories);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var c = await _context.Categories
            .Include(c => c.Parent)
            .Include(c => c.ProductCategories)
                .ThenInclude(pc => pc.Product)
                    .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (c == null) return NotFoundResponse("Category not found");

        return OkResponse(new CategoryAdminDto
        {
            Id = c.Id,
            Name = c.Name,
            Slug = c.Slug,
            Description = c.Description,
            ImageUrl = c.ImageUrl,
            BannerImages = string.IsNullOrEmpty(c.BannerImages) ? null : System.Text.Json.JsonSerializer.Deserialize<List<string>>(c.BannerImages, new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }),
            IsActive = c.IsActive,
            ParentId = c.ParentId,
            ParentName = c.Parent?.Name,
            ProductCount = c.ProductCategories.Count,
            CreatedAt = c.CreatedAt,
            Products = c.ProductCategories.Select(pc => new CategoryProductDto
            {
                Id = pc.Product.Id,
                Name = pc.Product.Name,
                Slug = pc.Product.Slug,
                BasePrice = pc.Product.BasePrice,
                MainImageUrl = _imageService.GetPublicUrlAsync(
                    pc.Product.Images
                        .Where(img => img.IsMain)
                        .Select(img => img.ThumbnailUrl ?? img.Url)
                        .FirstOrDefault()
                        ?? pc.Product.Images.Select(img => img.ThumbnailUrl ?? img.Url).FirstOrDefault() ?? string.Empty
                ).Result,
                IsActive = pc.Product.IsActive,
            }).ToList(),
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCategoryDto dto)
    {
        var cat = new Category
        {
            Name = dto.Name,
            Slug = dto.Slug,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            BannerImages = dto.BannerImages != null ? System.Text.Json.JsonSerializer.Serialize(dto.BannerImages) : null,
            IsActive = dto.IsActive,
            ParentId = dto.ParentId,
        };
        _context.Categories.Add(cat);
        await _context.SaveChangesAsync();
        return OkResponse(new { cat.Id, cat.Name, cat.Slug });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateCategoryDto dto)
    {
        var cat = await _context.Categories.FindAsync(id);
        if (cat == null) return NotFoundResponse("Category not found");

        cat.Name = dto.Name;
        cat.Slug = dto.Slug;
        cat.Description = dto.Description;
        cat.ImageUrl = dto.ImageUrl;
        cat.BannerImages = dto.BannerImages != null ? System.Text.Json.JsonSerializer.Serialize(dto.BannerImages) : null;
        cat.IsActive = dto.IsActive;
        cat.ParentId = dto.ParentId;

        await _context.SaveChangesAsync();
        return NoContentResponse();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var cat = await _context.Categories.FindAsync(id);
        if (cat == null) return NotFoundResponse("Category not found");

        _context.Categories.Remove(cat);
        await _context.SaveChangesAsync();
        return NoContentResponse();
    }

    [HttpPost("{id}/products")]
    public async Task<IActionResult> UpdateProducts(Guid id, [FromBody] List<Guid> productIds)
    {
        var category = await _context.Categories
            .Include(c => c.ProductCategories)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null) return NotFoundResponse("Category not found");

        _context.ProductCategories.RemoveRange(category.ProductCategories);

        foreach (var pId in productIds)
        {
            category.ProductCategories.Add(new ProductCategory
            {
                CategoryId = id,
                ProductId = pId
            });
        }

        await _context.SaveChangesAsync();
        return NoContentResponse();
    }
}
