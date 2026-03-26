using LotusEcommerce.Domain.Enums;

namespace LotusEcommerce.Domain.Entities;

public class InventoryTransaction : BaseEntity
{
    public Guid ProductVariantId { get; set; }
    public ProductVariant ProductVariant { get; set; } = null!;
    public int QuantityChanged { get; set; }
    public Enums.TransactionType TransactionType { get; set; }
    public Guid? ReasonId { get; set; }
    public InventoryReason? Reason { get; set; }
    public Guid? ReferenceId { get; set; } // Can link to OrderId or AdjustmentId
    public Guid? CreatedByUserId { get; set; }
    public string? Note { get; set; }
}

public class Payment : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public decimal Amount { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string? TransactionId { get; set; }
    public PaymentStatus Status { get; set; }
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
}

public class Shipment : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public string? TrackingNumber { get; set; }
    public string? Carrier { get; set; }
    public string Status { get; set; } = "Pending"; // 'Pending', 'Shipped', 'Delivered', 'Returned'
    public DateTime? ShippedDate { get; set; }
    public DateTime? EstimatedDeliveryDate { get; set; }

    public List<ShipmentTracking> Tracking { get; set; } = new();
}

public class ShipmentTracking : BaseEntity
{
    public Guid ShipmentId { get; set; }
    public Shipment Shipment { get; set; } = null!;
    public string Status { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Description { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
