using LotusEcommerce.Domain.Entities;

namespace LotusEcommerce.Domain.Interfaces;

public interface ICartItemRepository
{
    Task<CartItem?> GetByIdAsync(Guid id);
    Task AddAsync(CartItem cartItem);
    Task UpdateAsync(CartItem cartItem);
    Task DeleteAsync(CartItem cartItem);
    Task SaveChangesAsync();
}
