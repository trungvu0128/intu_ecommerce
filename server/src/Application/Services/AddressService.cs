using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Interfaces;

namespace LotusEcommerce.Application.Services;

public class AddressService : IAddressService
{
    private readonly IAddressRepository _addressRepository;

    public AddressService(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<AddressDto> CreateAsync(CreateAddressDto createAddressDto, Guid? userId = null)
    {
        var address = new Address
        {
            Id = Guid.NewGuid(),
            UserId = userId ?? Guid.Empty, // Guest checkout
            RecipientName = createAddressDto.RecipientName,
            PhoneNumber = createAddressDto.PhoneNumber,
            Street = createAddressDto.Street,
            City = createAddressDto.City,
            State = createAddressDto.State,
            ZipCode = createAddressDto.ZipCode,
            Country = createAddressDto.Country,
            IsDefault = createAddressDto.IsDefault,
            CreatedAt = DateTime.UtcNow
        };

        await _addressRepository.AddAsync(address);
        await _addressRepository.SaveChangesAsync();

        return new AddressDto
        {
            Id = address.Id,
            RecipientName = address.RecipientName,
            PhoneNumber = address.PhoneNumber,
            Street = address.Street,
            City = address.City,
            State = address.State,
            ZipCode = address.ZipCode,
            Country = address.Country,
            IsDefault = address.IsDefault
        };
    }

    public async Task<IEnumerable<AddressDto>> GetUserAddressesAsync(Guid userId)
    {
        var addresses = await _addressRepository.GetUserAddressesAsync(userId);
        return addresses.Select(a => new AddressDto
        {
            Id = a.Id,
            RecipientName = a.RecipientName,
            PhoneNumber = a.PhoneNumber,
            Street = a.Street,
            City = a.City,
            State = a.State,
            ZipCode = a.ZipCode,
            Country = a.Country,
            IsDefault = a.IsDefault
        });
    }

    public async Task<AddressDto?> GetByIdAsync(Guid id)
    {
        var address = await _addressRepository.GetByIdAsync(id);
        if (address == null) return null;

        return new AddressDto
        {
            Id = address.Id,
            RecipientName = address.RecipientName,
            PhoneNumber = address.PhoneNumber,
            Street = address.Street,
            City = address.City,
            State = address.State,
            ZipCode = address.ZipCode,
            Country = address.Country,
            IsDefault = address.IsDefault
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var address = await _addressRepository.GetByIdAsync(id);
        if (address == null) return false;

        _addressRepository.Delete(address);
        return await _addressRepository.SaveChangesAsync();
    }
}