using LotusEcommerce.Domain.Entities;

namespace LotusEcommerce.Domain.Interfaces;

public interface IAddressRepository
{
    Task<Address?> GetByIdAsync(Guid id);
    Task<IEnumerable<Address>> GetUserAddressesAsync(Guid userId);
    Task AddAsync(Address address);
    void Update(Address address);
    void Delete(Address address);
    Task<bool> SaveChangesAsync();
}
