namespace LotusEcommerce.Application.DTOs;

public class InventoryItemDto
{
    public Guid VariantId { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductSlug { get; set; } = string.Empty;
    public string? ProductImage { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; }
}

public class UpdateStockItemDto
{
    public Guid VariantId { get; set; }
    public int Quantity { get; set; }
}

public class BulkUpdateStockDto
{
    public List<UpdateStockItemDto> Items { get; set; } = new();
}

// ─── Inventory Reason ──────────────────────────────────────────────────────────

public class InventoryReasonDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = "Both"; // "Receipt", "Issue", "Both"
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateInventoryReasonDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = "Both";
    public bool IsActive { get; set; } = true;
}

// ─── Good Receipt / Good Issue ─────────────────────────────────────────────────

public class GoodReceiptItemDto
{
    public Guid VariantId { get; set; }
    public int Quantity { get; set; }
}

public class CreateGoodReceiptDto
{
    public List<GoodReceiptItemDto> Items { get; set; } = new();
    public Guid? ReasonId { get; set; }
    public string? Note { get; set; }
}

public class GoodIssueItemDto
{
    public Guid VariantId { get; set; }
    public int Quantity { get; set; }
}

public class CreateGoodIssueDto
{
    public List<GoodIssueItemDto> Items { get; set; } = new();
    public Guid? ReasonId { get; set; }
    public string? Note { get; set; }
}

// ─── Transaction History ───────────────────────────────────────────────────────

public class InventoryTransactionDto
{
    public Guid Id { get; set; }
    public Guid ProductVariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public int QuantityChanged { get; set; }
    public string TransactionType { get; set; } = string.Empty;
    public string? ReasonName { get; set; }
    public string? Note { get; set; }
    public Guid? CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class TransactionHistoryQueryDto
{
    public Guid? VariantId { get; set; }
    public string? Type { get; set; } // "GoodReceipt", "GoodIssue", "Adjustment"
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}

public class PaginatedTransactionResult
{
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public List<InventoryTransactionDto> Data { get; set; } = new();
}
