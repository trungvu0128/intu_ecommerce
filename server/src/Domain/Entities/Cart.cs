namespace LotusEcommerce.Domain.Entities;

public class Cart : BaseEntity
{
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    public string? SessionId { get; set; } // For guest carts
    public List<CartItem> Items { get; set; } = new();
}
