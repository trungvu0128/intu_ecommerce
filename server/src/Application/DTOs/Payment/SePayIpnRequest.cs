using System.Text.Json.Serialization;

namespace LotusEcommerce.Application.DTOs.Payment;

/// <summary>
/// Full IPN (Instant Payment Notification) payload from SePay.
/// Docs: https://developer.sepay.vn/vi/cong-thanh-toan/IPN
/// </summary>
public class SePayIpnRequest
{
    [JsonPropertyName("timestamp")]
    public long Timestamp { get; set; }

    [JsonPropertyName("notification_type")]
    public string NotificationType { get; set; } = string.Empty;

    [JsonPropertyName("order")]
    public SePayIpnOrder Order { get; set; } = new();

    [JsonPropertyName("transaction")]
    public SePayIpnTransaction? Transaction { get; set; }

    [JsonPropertyName("customer")]
    public SePayIpnCustomer? Customer { get; set; }
}

/// <summary>
/// Order information within the IPN payload.
/// </summary>
public class SePayIpnOrder
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("order_id")]
    public string OrderId { get; set; } = string.Empty;

    [JsonPropertyName("order_status")]
    public string OrderStatus { get; set; } = string.Empty;

    [JsonPropertyName("order_currency")]
    public string OrderCurrency { get; set; } = string.Empty;

    [JsonPropertyName("order_amount")]
    public string OrderAmount { get; set; } = string.Empty;

    [JsonPropertyName("order_invoice_number")]
    public string OrderInvoiceNumber { get; set; } = string.Empty;

    [JsonPropertyName("order_description")]
    public string? OrderDescription { get; set; }

    [JsonPropertyName("custom_data")]
    public object[]? CustomData { get; set; }

    [JsonPropertyName("user_agent")]
    public string? UserAgent { get; set; }

    [JsonPropertyName("ip_address")]
    public string? IpAddress { get; set; }
}

/// <summary>
/// Transaction details within the IPN payload.
/// </summary>
public class SePayIpnTransaction
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("payment_method")]
    public string PaymentMethod { get; set; } = string.Empty;

    [JsonPropertyName("transaction_id")]
    public string TransactionId { get; set; } = string.Empty;

    [JsonPropertyName("transaction_type")]
    public string TransactionType { get; set; } = string.Empty;

    [JsonPropertyName("transaction_date")]
    public string TransactionDate { get; set; } = string.Empty;

    [JsonPropertyName("transaction_status")]
    public string TransactionStatus { get; set; } = string.Empty;

    [JsonPropertyName("transaction_amount")]
    public string TransactionAmount { get; set; } = string.Empty;

    [JsonPropertyName("transaction_currency")]
    public string TransactionCurrency { get; set; } = string.Empty;

    [JsonPropertyName("authentication_status")]
    public string? AuthenticationStatus { get; set; }

    [JsonPropertyName("card_number")]
    public string? CardNumber { get; set; }

    [JsonPropertyName("card_holder_name")]
    public string? CardHolderName { get; set; }

    [JsonPropertyName("card_expiry")]
    public string? CardExpiry { get; set; }

    [JsonPropertyName("card_funding_method")]
    public string? CardFundingMethod { get; set; }

    [JsonPropertyName("card_brand")]
    public string? CardBrand { get; set; }
}

/// <summary>
/// Customer information within the IPN payload.
/// </summary>
public class SePayIpnCustomer
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("customer_id")]
    public string CustomerId { get; set; } = string.Empty;
}
