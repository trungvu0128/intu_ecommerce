namespace LotusEcommerce.Domain.Entities;

public class InventoryReason : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    /// <summary>
    /// "Receipt", "Issue", or "Both" — controls which transaction type this reason can be used with.
    /// </summary>
    public string Type { get; set; } = "Both";
    public bool IsActive { get; set; } = true;
}
