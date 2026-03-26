namespace LotusEcommerce.Application.DTOs.Payment;

public class SePayCheckoutRequest
{
    public string PaymentMethod { get; set; } = "BANK_TRANSFER";
    public string OrderInvoiceNumber { get; set; } = string.Empty;
    public decimal OrderAmount { get; set; }
    public string Currency { get; set; } = "VND";
    public string OrderDescription { get; set; } = string.Empty;
    public string? SuccessUrl { get; set; }
    public string? ErrorUrl { get; set; }
    public string? CancelUrl { get; set; }
    public string? CustomerId { get; set; }
}
