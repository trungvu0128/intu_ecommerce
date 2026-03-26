namespace LotusEcommerce.Application.DTOs;

public class CartDto
{
    public Guid Id { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalPrice { get; set; }
    public int TotalItems { get; set; }
}

public class CartItemDto
{
    public Guid Id { get; set; } // CartItem ID or Variant ID? Let's use Variant ID to match frontend expectation of "id"
    public string Name { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty; // formatted string
    public string Image { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public Guid ProductId { get; set; }
    public Guid VariantId { get; set; }
}

public class AddToCartRequest
{
    public Guid ProductId { get; set; } // Can be ProductId or VariantId
    public int Quantity { get; set; }
}

public class SyncCartRequest
{
    public List<AddToCartRequest> Items { get; set; } = new();
}
