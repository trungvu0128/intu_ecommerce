namespace LotusEcommerce.Domain.Entities;

public enum FeaturedSectionType
{
    Manual,
    Category,
    Media
}

public class FeaturedSection : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public FeaturedSectionType Type { get; set; } = FeaturedSectionType.Manual;
    public Guid? CategoryId { get; set; }
    public Category? Category { get; set; }
    public int GridColumns { get; set; } = 2; // 1, 2, or 4
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    // Background media (image or video) for the section
    public string? MediaUrl { get; set; }
    public string? MediaType { get; set; } // "image" | "video" | null
    public string? LinkUrl { get; set; } 

    public List<FeaturedSectionItem> Items { get; set; } = new();
}

public class FeaturedSectionItem : BaseEntity
{
    public Guid FeaturedSectionId { get; set; }
    public FeaturedSection FeaturedSection { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string? OverlayText { get; set; }
    public string? LinkUrl { get; set; }
    public string? ImageUrl { get; set; } // Optional override image
    public int DisplayOrder { get; set; }
}
