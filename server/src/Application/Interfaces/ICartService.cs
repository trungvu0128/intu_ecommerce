using LotusEcommerce.Application.DTOs;

namespace LotusEcommerce.Application.Interfaces;

public interface ICartService
{
    Task<CartDto> GetCartAsync(Guid userId);
    Task<CartDto> AddToCartAsync(Guid userId, AddToCartRequest request);
    Task<CartDto> RemoveFromCartAsync(Guid userId, Guid variantId);
    Task<CartDto> SyncCartAsync(Guid userId, SyncCartRequest request);
    Task ClearCartAsync(Guid userId);
}
