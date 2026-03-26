using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Application.Models;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers;

[Route("api/[controller]")]
public class SearchController : BaseApiController
{
    private readonly ISearchService _searchService;

    public SearchController(ISearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpGet]
    public async Task<IActionResult> Search(
        [FromQuery] string q = "",
        [FromQuery] string? category = null,
        [FromQuery] string? size = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null)
    {
        var results = await _searchService.SearchAsync(q, category, size, minPrice, maxPrice);
        return OkResponse(results);
    }

    [HttpPost("reindex")]
    public async Task<IActionResult> Reindex([FromServices] IProductService productService)
    {
        var products = await productService.GetAllAsync();
        var searchModels = products.Select(p => new ProductSearchModel
        {
            Id = p.Id.ToString(),
            Name = p.Name,
            Description = p.Description,
            CategoryName = p.Category?.Name ?? string.Empty,
            CategorySlug = p.Category?.Slug ?? string.Empty,
            Sizes = p.Variants.Select(v => v.Size).Where(s => !string.IsNullOrEmpty(s)).Distinct().ToList()!,
            MinPrice = p.BasePrice + (p.Variants.Any() ? p.Variants.Min(v => v.PriceAdjustment) : 0),
            MaxPrice = p.BasePrice + (p.Variants.Any() ? p.Variants.Max(v => v.PriceAdjustment) : 0),
            IsActive = true,
            IsFeatured = p.IsFeatured
        });

        await _searchService.BulkIndexProductsAsync(searchModels);
        return OkResponse(new { message = "Reindexing started" });
    }
}
