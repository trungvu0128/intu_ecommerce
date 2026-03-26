namespace LotusEcommerce.Domain.Entities;

public class ProductVariant : BaseEntity
{
    public string Sku { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public decimal PriceAdjustment { get; set; }
    public int StockQuantity { get; set; }
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
}
