using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Enums;

namespace LotusEcommerce.Domain.Interfaces;

public interface IInventoryTransactionRepository
{
    Task<IEnumerable<InventoryTransaction>> GetAllAsync(
        Guid? variantId = null,
        TransactionType? type = null,
        DateTime? from = null,
        DateTime? to = null,
        int page = 1,
        int pageSize = 50);
    Task<int> GetTotalCountAsync(
        Guid? variantId = null,
        TransactionType? type = null,
        DateTime? from = null,
        DateTime? to = null);
    Task AddAsync(InventoryTransaction transaction);
    Task AddRangeAsync(IEnumerable<InventoryTransaction> transactions);
    Task<bool> SaveChangesAsync();
}
