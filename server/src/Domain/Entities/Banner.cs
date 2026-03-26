namespace LotusEcommerce.Domain.Entities;

public class Banner : BaseEntity
{
    public string? Title { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? LinkUrl { get; set; }
    public string Position { get; set; } = "MainHero";
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
