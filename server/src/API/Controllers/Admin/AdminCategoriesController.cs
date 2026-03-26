using LotusEcommerce.Application.DTOs;
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

    public AdminCategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _context.Categories
            .Include(c => c.Parent)
            .Include(c => c.Products)
            .OrderBy(c => c.Name)
            .Select(c => new CategoryAdminDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                IsActive = c.IsActive,
                ParentId = c.ParentId,
                ParentName = c.Parent != null ? c.Parent.Name : null,
                ProductCount = c.Products.Count,
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
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (c == null) return NotFoundResponse("Category not found");

        return OkResponse(new CategoryAdminDto
        {
            Id = c.Id,
            Name = c.Name,
            Slug = c.Slug,
            Description = c.Description,
            ImageUrl = c.ImageUrl,
            IsActive = c.IsActive,
            ParentId = c.ParentId,
            ParentName = c.Parent?.Name,
            ProductCount = c.Products.Count,
            CreatedAt = c.CreatedAt,
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
}
