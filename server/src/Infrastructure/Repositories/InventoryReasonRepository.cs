using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Interfaces;
using LotusEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LotusEcommerce.Infrastructure.Repositories;

public class InventoryReasonRepository : IInventoryReasonRepository
{
    private readonly AppDbContext _context;

    public InventoryReasonRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<InventoryReason>> GetAllAsync(bool? activeOnly = null)
    {
        var query = _context.InventoryReasons.AsQueryable();
        if (activeOnly == true)
            query = query.Where(r => r.IsActive);
        return await query.OrderBy(r => r.Name).ToListAsync();
    }

    public async Task<InventoryReason?> GetByIdAsync(Guid id)
    {
        return await _context.InventoryReasons.FindAsync(id);
    }

    public async Task AddAsync(InventoryReason reason)
    {
        await _context.InventoryReasons.AddAsync(reason);
    }

    public void Update(InventoryReason reason)
    {
        _context.InventoryReasons.Update(reason);
    }

    public void Delete(InventoryReason reason)
    {
        _context.InventoryReasons.Remove(reason);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
