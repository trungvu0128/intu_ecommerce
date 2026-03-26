using System.Text.Json;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Domain.Entities;
using StackExchange.Redis;

namespace LotusEcommerce.Infrastructure.Repositories;

public class BasketRepository : IBasketRepository
{
    private readonly IDatabase _database;

    public BasketRepository(IConnectionMultiplexer redis)
    {
        _database = redis.GetDatabase();
    }

    public async Task<bool> DeleteBasketAsync(string basketId)
    {
        return await _database.KeyDeleteAsync($"basket:{basketId}");
    }

    public async Task<CustomerBasket?> GetBasketAsync(string basketId)
    {
        var data = await _database.StringGetAsync($"basket:{basketId}");

        return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<CustomerBasket>(data!);
    }

    public async Task<CustomerBasket?> UpdateBasketAsync(CustomerBasket basket)
    {
        var created = await _database.StringSetAsync($"basket:{basket.Id}", JsonSerializer.Serialize(basket), TimeSpan.FromDays(30));

        if (!created) return null;

        return await GetBasketAsync(basket.Id);
    }
}
