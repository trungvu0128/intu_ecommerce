using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers.Admin;

[Route("api/admin/products")]
[Authorize(Roles = "Admin")]
public class AdminProductsController : BaseApiController
{
    private readonly IProductService _productService;

    public AdminProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] Guid? categoryId,
        [FromQuery] bool? isFeatured,
        [FromQuery] bool isAdmin = true)
    {
        var products = await _productService.GetAllAsync(search, categoryId, isFeatured, isAdmin);
        return OkResponse(products);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductDto createProductDto)
    {
        var product = await _productService.CreateAsync(createProductDto);
        return CreatedResponse(product, nameof(GetById), new { id = product.Id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, UpdateProductDto updateProductDto)
    {
        var result = await _productService.UpdateAsync(id, updateProductDto);
        if (!result) return NotFoundResponse("Product not found");
        return NoContentResponse();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _productService.DeleteAsync(id);
        if (!result) return NotFoundResponse("Product not found");
        return NoContentResponse();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product == null) return NotFoundResponse("Product not found");
        return OkResponse(product);
    }

    [HttpPatch("stock")]
    public async Task<IActionResult> UpdateStock(UpdateStockDto updateStockDto)
    {
        var result = await _productService.UpdateStockAsync(updateStockDto.VariantId, updateStockDto.Quantity);
        if (!result) return NotFoundResponse("Product variant not found");
        return NoContentResponse();
    }
}
