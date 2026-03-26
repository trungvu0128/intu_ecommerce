using LotusEcommerce.Application.DTOs;

namespace LotusEcommerce.Application.Interfaces;

public interface IAddressService
{
    Task<AddressDto> CreateAsync(CreateAddressDto createAddressDto, Guid? userId = null);
    Task<IEnumerable<AddressDto>> GetUserAddressesAsync(Guid userId);
    Task<AddressDto?> GetByIdAsync(Guid id);
    Task<bool> DeleteAsync(Guid id);
}