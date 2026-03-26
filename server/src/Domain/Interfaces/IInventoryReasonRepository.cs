using LotusEcommerce.Domain.Entities;

namespace LotusEcommerce.Domain.Interfaces;

public interface IInventoryReasonRepository
{
    Task<IEnumerable<InventoryReason>> GetAllAsync(bool? activeOnly = null);
    Task<InventoryReason?> GetByIdAsync(Guid id);
    Task AddAsync(InventoryReason reason);
    void Update(InventoryReason reason);
    void Delete(InventoryReason reason);
    Task<bool> SaveChangesAsync();
}
