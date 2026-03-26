using LotusEcommerce.Domain.Enums;

namespace LotusEcommerce.Domain.Entities;

public class Coupon : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public DiscountType DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal? MinOrderAmount { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? UsageLimit { get; set; }
    public int UsedCount { get; set; }
    public bool IsActive { get; set; } = true;

    public bool IsValid(decimal orderAmount)
    {
        if (!IsActive) return false;
        if (StartDate.HasValue && StartDate.Value > DateTime.UtcNow) return false;
        if (EndDate.HasValue && EndDate.Value < DateTime.UtcNow) return false;
        if (UsageLimit.HasValue && UsedCount >= UsageLimit.Value) return false;
        if (MinOrderAmount.HasValue && orderAmount < MinOrderAmount.Value) return false;
        return true;
    }

    public decimal CalculateDiscount(decimal orderAmount)
    {
        if (!IsValid(orderAmount)) return 0;

        decimal discount = 0;
        if (DiscountType == DiscountType.Percentage)
        {
            discount = orderAmount * (DiscountValue / 100);
            if (MaxDiscountAmount.HasValue && discount > MaxDiscountAmount.Value)
            {
                discount = MaxDiscountAmount.Value;
            }
        }
        else
        {
            discount = DiscountValue;
        }

        return Math.Min(discount, orderAmount);
    }
}
