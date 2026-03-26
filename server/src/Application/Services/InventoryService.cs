using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Enums;
using LotusEcommerce.Domain.Interfaces;

namespace LotusEcommerce.Application.Services;

public class InventoryService : IInventoryService
{
    private readonly IProductRepository _productRepository;
    private readonly IInventoryTransactionRepository _transactionRepository;
    private readonly IInventoryReasonRepository _reasonRepository;

    public InventoryService(
        IProductRepository productRepository,
        IInventoryTransactionRepository transactionRepository,
        IInventoryReasonRepository reasonRepository)
    {
        _productRepository = productRepository;
        _transactionRepository = transactionRepository;
        _reasonRepository = reasonRepository;
    }

    // ─── Existing ────────────────────────────────────────────────────────────────

    public async Task<IEnumerable<InventoryItemDto>> GetInventoryAsync(string? search = null, int? lowStockThreshold = null)
    {
        var products = await _productRepository.GetAllWithVariantsAsync();

        var items = products
            .SelectMany(p => p.Variants.Select(v =>
            {
                var mainImage = p.Images.FirstOrDefault(i => i.IsMain) ?? p.Images.FirstOrDefault();
                return new InventoryItemDto
                {
                    VariantId = v.Id,
                    ProductId = p.Id,
                    ProductName = p.Name,
                    ProductSlug = p.Slug,
                    ProductImage = mainImage?.Url,
                    Sku = v.Sku,
                    Color = v.Color,
                    Size = v.Size,
                    Price = p.BasePrice + v.PriceAdjustment,
                    StockQuantity = v.StockQuantity,
                    IsActive = p.IsActive
                };
            }));

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            items = items.Where(i =>
                i.ProductName.ToLower().Contains(s)
                || i.Sku.ToLower().Contains(s)
                || i.Color.ToLower().Contains(s)
                || i.Size.ToLower().Contains(s));
        }

        if (lowStockThreshold.HasValue)
        {
            items = items.Where(i => i.StockQuantity <= lowStockThreshold.Value);
        }

        return items.OrderBy(i => i.StockQuantity).ToList();
    }

    public async Task<bool> BulkUpdateStockAsync(BulkUpdateStockDto dto)
    {
        foreach (var item in dto.Items)
        {
            await _productRepository.UpdateStockAsync(item.VariantId, item.Quantity);
        }

        return await _productRepository.SaveChangesAsync();
    }

    // ─── Good Receipt ────────────────────────────────────────────────────────────

    public async Task<bool> CreateGoodReceiptAsync(CreateGoodReceiptDto dto, Guid? userId = null)
    {
        if (dto.Items.Count == 0) return false;

        var transactions = new List<InventoryTransaction>();

        foreach (var item in dto.Items)
        {
            if (item.Quantity <= 0) continue;

            var variant = await _productRepository.GetVariantByIdAsync(item.VariantId);
            if (variant == null) return false;

            // Increase stock
            variant.StockQuantity += item.Quantity;

            transactions.Add(new InventoryTransaction
            {
                ProductVariantId = item.VariantId,
                QuantityChanged = item.Quantity,
                TransactionType = TransactionType.GoodReceipt,
                ReasonId = dto.ReasonId,
                Note = dto.Note,
                CreatedByUserId = userId
            });
        }

        if (transactions.Count == 0) return false;

        await _transactionRepository.AddRangeAsync(transactions);
        await _productRepository.SaveChangesAsync();
        return await _transactionRepository.SaveChangesAsync();
    }

    // ─── Good Issue ──────────────────────────────────────────────────────────────

    public async Task<bool> CreateGoodIssueAsync(CreateGoodIssueDto dto, Guid? userId = null)
    {
        if (dto.Items.Count == 0) return false;

        var transactions = new List<InventoryTransaction>();

        foreach (var item in dto.Items)
        {
            if (item.Quantity <= 0) continue;

            var variant = await _productRepository.GetVariantByIdAsync(item.VariantId);
            if (variant == null) return false;

            // Validate sufficient stock
            if (variant.StockQuantity < item.Quantity)
                throw new InvalidOperationException(
                    $"Insufficient stock for variant {variant.Sku}. Available: {variant.StockQuantity}, Requested: {item.Quantity}");

            // Decrease stock
            variant.StockQuantity -= item.Quantity;

            transactions.Add(new InventoryTransaction
            {
                ProductVariantId = item.VariantId,
                QuantityChanged = -item.Quantity, // Negative for issue
                TransactionType = TransactionType.GoodIssue,
                ReasonId = dto.ReasonId,
                Note = dto.Note,
                CreatedByUserId = userId
            });
        }

        if (transactions.Count == 0) return false;

        await _transactionRepository.AddRangeAsync(transactions);
        await _productRepository.SaveChangesAsync();
        return await _transactionRepository.SaveChangesAsync();
    }

    // ─── Transaction History ─────────────────────────────────────────────────────

    public async Task<PaginatedTransactionResult> GetTransactionsAsync(TransactionHistoryQueryDto query)
    {
        TransactionType? type = null;
        if (!string.IsNullOrEmpty(query.Type) && Enum.TryParse<TransactionType>(query.Type, true, out var parsed))
            type = parsed;

        var total = await _transactionRepository.GetTotalCountAsync(query.VariantId, type, query.From, query.To);
        var items = await _transactionRepository.GetAllAsync(query.VariantId, type, query.From, query.To, query.Page, query.PageSize);

        return new PaginatedTransactionResult
        {
            Total = total,
            Page = query.Page,
            PageSize = query.PageSize,
            Data = items.Select(t => new InventoryTransactionDto
            {
                Id = t.Id,
                ProductVariantId = t.ProductVariantId,
                ProductName = t.ProductVariant?.Product?.Name ?? "",
                Sku = t.ProductVariant?.Sku ?? "",
                Color = t.ProductVariant?.Color ?? "",
                Size = t.ProductVariant?.Size ?? "",
                QuantityChanged = t.QuantityChanged,
                TransactionType = t.TransactionType.ToString(),
                ReasonName = t.Reason?.Name,
                Note = t.Note,
                CreatedByUserId = t.CreatedByUserId,
                CreatedAt = t.CreatedAt
            }).ToList()
        };
    }

    // ─── Inventory Reasons ───────────────────────────────────────────────────────

    public async Task<IEnumerable<InventoryReasonDto>> GetReasonsAsync(bool? activeOnly = null)
    {
        var reasons = await _reasonRepository.GetAllAsync(activeOnly);
        return reasons.Select(r => new InventoryReasonDto
        {
            Id = r.Id,
            Name = r.Name,
            Description = r.Description,
            Type = r.Type,
            IsActive = r.IsActive,
            CreatedAt = r.CreatedAt
        });
    }

    public async Task<InventoryReasonDto?> GetReasonByIdAsync(Guid id)
    {
        var r = await _reasonRepository.GetByIdAsync(id);
        if (r == null) return null;

        return new InventoryReasonDto
        {
            Id = r.Id,
            Name = r.Name,
            Description = r.Description,
            Type = r.Type,
            IsActive = r.IsActive,
            CreatedAt = r.CreatedAt
        };
    }

    public async Task<InventoryReasonDto> CreateReasonAsync(CreateInventoryReasonDto dto)
    {
        var reason = new InventoryReason
        {
            Name = dto.Name,
            Description = dto.Description,
            Type = dto.Type,
            IsActive = dto.IsActive
        };

        await _reasonRepository.AddAsync(reason);
        await _reasonRepository.SaveChangesAsync();

        return new InventoryReasonDto
        {
            Id = reason.Id,
            Name = reason.Name,
            Description = reason.Description,
            Type = reason.Type,
            IsActive = reason.IsActive,
            CreatedAt = reason.CreatedAt
        };
    }

    public async Task<bool> UpdateReasonAsync(Guid id, CreateInventoryReasonDto dto)
    {
        var reason = await _reasonRepository.GetByIdAsync(id);
        if (reason == null) return false;

        reason.Name = dto.Name;
        reason.Description = dto.Description;
        reason.Type = dto.Type;
        reason.IsActive = dto.IsActive;

        _reasonRepository.Update(reason);
        return await _reasonRepository.SaveChangesAsync();
    }

    public async Task<bool> DeleteReasonAsync(Guid id)
    {
        var reason = await _reasonRepository.GetByIdAsync(id);
        if (reason == null) return false;

        _reasonRepository.Delete(reason);
        return await _reasonRepository.SaveChangesAsync();
    }
}
