using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Enums;
using LotusEcommerce.Domain.Interfaces;
using LotusEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LotusEcommerce.Infrastructure.Repositories;

public class InventoryTransactionRepository : IInventoryTransactionRepository
{
    private readonly AppDbContext _context;

    public InventoryTransactionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<InventoryTransaction>> GetAllAsync(
        Guid? variantId = null,
        TransactionType? type = null,
        DateTime? from = null,
        DateTime? to = null,
        int page = 1,
        int pageSize = 50)
    {
        var query = BuildQuery(variantId, type, from, to);

        return await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetTotalCountAsync(
        Guid? variantId = null,
        TransactionType? type = null,
        DateTime? from = null,
        DateTime? to = null)
    {
        return await BuildQuery(variantId, type, from, to).CountAsync();
    }

    public async Task AddAsync(InventoryTransaction transaction)
    {
        await _context.InventoryTransactions.AddAsync(transaction);
    }

    public async Task AddRangeAsync(IEnumerable<InventoryTransaction> transactions)
    {
        await _context.InventoryTransactions.AddRangeAsync(transactions);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    private IQueryable<InventoryTransaction> BuildQuery(
        Guid? variantId, TransactionType? type, DateTime? from, DateTime? to)
    {
        var query = _context.InventoryTransactions
            .Include(t => t.ProductVariant)
                .ThenInclude(v => v.Product)
            .Include(t => t.Reason)
            .AsNoTracking()
            .AsQueryable();

        if (variantId.HasValue)
            query = query.Where(t => t.ProductVariantId == variantId.Value);
        if (type.HasValue)
            query = query.Where(t => t.TransactionType == type.Value);
        if (from.HasValue)
            query = query.Where(t => t.CreatedAt >= from.Value);
        if (to.HasValue)
            query = query.Where(t => t.CreatedAt <= to.Value);

        return query;
    }
}
