using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers;

[Route("api/[controller]")]
public class ProductsController : BaseApiController
{
    private readonly IProductService _service;

    public ProductsController(IProductService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] Guid? categoryId,
        [FromQuery] bool? isFeatured)
    {
        var products = await _service.GetAllAsync(search, categoryId, isFeatured);
        return OkResponse(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _service.GetByIdAsync(id);
        if (product == null) return NotFoundResponse("Product not found");
        return OkResponse(product);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var product = await _service.GetBySlugAsync(slug);
        if (product == null) return NotFoundResponse("Product not found");
        return OkResponse(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductDto dto)
    {
        var product = await _service.CreateAsync(dto);
        return CreatedResponse(product, nameof(GetById), new { id = product.Id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateProductDto dto)
    {
        var success = await _service.UpdateAsync(id, dto);
        if (!success) return NotFoundResponse("Product not found");
        return NoContentResponse();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success) return NotFoundResponse("Product not found");
        return NoContentResponse();
    }

    // Admin / SKU / Inventory management
    [HttpPatch("inventory/stock")]
    public async Task<IActionResult> UpdateStock(UpdateStockDto dto)
    {
        var success = await _service.UpdateStockAsync(dto.VariantId, dto.Quantity);
        if (!success) return NotFoundResponse("Product variant not found");
        return NoContentResponse();
    }

    [HttpGet("variants/sku/{sku}")]
    public async Task<IActionResult> GetVariantBySKU(string sku)
    {
        var variant = await _service.GetVariantBySKUAsync(sku);
        if (variant == null) return NotFoundResponse("Variant not found");
        return OkResponse(variant);
    }

    [HttpPost("{id}/variants")]
    public async Task<IActionResult> AddVariant(Guid id, CreateProductVariantDto dto)
    {
        var success = await _service.AddVariantAsync(id, dto);
        if (!success) return NotFoundResponse("Product not found");
        return NoContentResponse();
    }

    [HttpPost("{id}/images")]
    public async Task<IActionResult> AddImage(Guid id, CreateProductImageDto dto)
    {
        var success = await _service.AddImageAsync(id, dto);
        if (!success) return NotFoundResponse("Product not found");
        return NoContentResponse();
    }
}
