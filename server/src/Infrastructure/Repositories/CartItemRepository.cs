using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Interfaces;
using LotusEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LotusEcommerce.Infrastructure.Repositories;

public class CartItemRepository : ICartItemRepository
{
    private readonly AppDbContext _context;

    public CartItemRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CartItem?> GetByIdAsync(Guid id)
    {
        return await _context.CartItems
            .Include(i => i.ProductVariant)
            .ThenInclude(v => v.Product)
            .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(i => i.Id == id);
    }

    public async Task AddAsync(CartItem cartItem)
    {
        await _context.CartItems.AddAsync(cartItem);
    }

    public async Task UpdateAsync(CartItem cartItem)
    {
        _context.CartItems.Update(cartItem);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(CartItem cartItem)
    {
        _context.CartItems.Remove(cartItem);
        await Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
