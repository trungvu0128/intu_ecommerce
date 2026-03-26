using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Enums;

namespace LotusEcommerce.Domain.Interfaces;

public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(Guid id);
    Task<Order?> GetByOrderNumberAsync(string orderNumber);
    Task<IEnumerable<Order>> GetUserOrdersAsync(Guid userId);
    Task<IEnumerable<Order>> GetAllAsync(OrderStatus? status = null);
    Task AddAsync(Order order);
    void Update(Order order);
    Task<bool> SaveChangesAsync();
}
