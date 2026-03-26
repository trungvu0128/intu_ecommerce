namespace LotusEcommerce.Application.DTOs;

public class ProductImageDto
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public bool IsMain { get; set; }
}

public class CreateProductImageDto
{
    public string Url { get; set; } = string.Empty;
    public bool IsMain { get; set; }
}
