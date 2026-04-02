namespace LotusEcommerce.Application.DTOs;

public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
    public string SizeChartImage { get; set; } = string.Empty;
    public CategoryDto Category { get; set; } = null!;
    public List<CategoryDto> Categories { get; set; } = new();
    public List<ProductVariantDto> Variants { get; set; } = new();
    public List<ProductImageDto> Images { get; set; } = new();
}

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public bool IsFeatured { get; set; }
    public string SizeChartImage { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public List<Guid> CategoryIds { get; set; } = new();
    public Guid BrandId = new Guid("db6fc557-aea3-4df2-b3f9-dbc63f8e986f");
    public List<CreateProductVariantDto> Variants { get; set; } = new();
    public List<CreateProductImageDto> Images { get; set; } = new();
}

public class UpdateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public bool IsFeatured { get; set; }
    public string SizeChartImage { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public List<Guid> CategoryIds { get; set; } = new();
    public Guid BrandId = new Guid("db6fc557-aea3-4df2-b3f9-dbc63f8e986f");
    public List<CreateProductVariantDto>? Variants { get; set; }
    public List<CreateProductImageDto>? Images { get; set; }
}

public class UpdateStockDto
{
    public Guid VariantId { get; set; }
    public int Quantity { get; set; }
}

