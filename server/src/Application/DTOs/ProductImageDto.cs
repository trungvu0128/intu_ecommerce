namespace LotusEcommerce.Application.DTOs;

public class ProductImageDto
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public bool IsMain { get; set; }
}

public class CreateProductImageDto
{
    public UrlDto? Url { get; set; } = new UrlDto();
    public bool IsMain { get; set; }
}

public class UrlDto
{
    public string OriginalUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
}
