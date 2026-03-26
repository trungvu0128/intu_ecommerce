using LotusEcommerce.Application.DTOs;

namespace LotusEcommerce.Application.Interfaces;

public interface IInventoryService
{
    // Existing
    Task<IEnumerable<InventoryItemDto>> GetInventoryAsync(string? search = null, int? lowStockThreshold = null);
    Task<bool> BulkUpdateStockAsync(BulkUpdateStockDto dto);

    // Good Receipt / Good Issue
    Task<bool> CreateGoodReceiptAsync(CreateGoodReceiptDto dto, Guid? userId = null);
    Task<bool> CreateGoodIssueAsync(CreateGoodIssueDto dto, Guid? userId = null);

    // Transaction History
    Task<PaginatedTransactionResult> GetTransactionsAsync(TransactionHistoryQueryDto query);

    // Inventory Reasons
    Task<IEnumerable<InventoryReasonDto>> GetReasonsAsync(bool? activeOnly = null);
    Task<InventoryReasonDto?> GetReasonByIdAsync(Guid id);
    Task<InventoryReasonDto> CreateReasonAsync(CreateInventoryReasonDto dto);
    Task<bool> UpdateReasonAsync(Guid id, CreateInventoryReasonDto dto);
    Task<bool> DeleteReasonAsync(Guid id);
}
