namespace LotusEcommerce.Domain.Entities;

public class CustomerBasket
{
    public CustomerBasket()
    {
    }

    public CustomerBasket(string id)
    {
        Id = id;
    }

    public string Id { get; set; } = string.Empty;
    public List<BasketItem> Items { get; set; } = new();
}
