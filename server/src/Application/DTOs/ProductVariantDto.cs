namespace LotusEcommerce.Application.DTOs;

public class ProductVariantDto
{
    public Guid Id { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public decimal PriceAdjustment { get; set; }
    public int StockQuantity { get; set; }
}

public class CreateProductVariantDto
{
    public Guid Id { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public decimal PriceAdjustment { get; set; }
    public int StockQuantity { get; set; }
}
