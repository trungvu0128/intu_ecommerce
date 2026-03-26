using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.DTOs.Payment;
using LotusEcommerce.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LotusEcommerce.Application.Services;

public class SePayService : ISePayService
{
    private readonly IConfiguration _configuration;
    private readonly IOrderService _orderService;
    private readonly ILogger<SePayService> _logger;
    private readonly string _merchantId;
    private readonly string _secretKey;
    private readonly string _webhookSecretKey;
    private readonly string _environment;

    public SePayService(
        IConfiguration configuration,
        IOrderService orderService,
        ILogger<SePayService> logger)
    {
        _configuration = configuration;
        _orderService = orderService;
        _logger = logger;
        _merchantId = _configuration["SePay:MerchantId"] ?? throw new ArgumentNullException("SePay:MerchantId is missing");
        _secretKey = _configuration["SePay:SecretKey"] ?? throw new ArgumentNullException("SePay:SecretKey is missing");
        _webhookSecretKey = _configuration["SePay:WebhookSecretKey"] ?? throw new ArgumentNullException("SePay:WebhookSecretKey is missing");
        _environment = _configuration["SePay:Environment"] ?? "sandbox";
    }

    public (string CheckoutUrl, Dictionary<string, string> FormFields) GeneratePaymentForm(SePayCheckoutRequest request)
    {
        string baseCheckoutUrl = _environment == "sandbox"
            ? "https://pay-sandbox.sepay.vn/v1/checkout"
            : "https://pay.sepay.vn/v1/checkout";
            
        string checkoutUrl = $"{baseCheckoutUrl}/init";

        // SePay strictly requires these fields in this SPECIFIC order for BOTH the form and the signature
        var requiredOrderedKeys = new List<string>
        {
            "merchant", "operation", "payment_method", "order_amount", "currency", 
            "order_invoice_number", "order_description", "customer_id", 
            "success_url", "error_url", "cancel_url"
        };

        var fields = new Dictionary<string, string>();
        foreach (var key in requiredOrderedKeys)
        {
            string? value = key switch
            {
                "merchant" => _merchantId,
                "operation" => "PURCHASE",
                "payment_method" => request.PaymentMethod,
                "order_amount" => request.OrderAmount.ToString("0"), // Important: no decimals
                "currency" => request.Currency,
                "order_invoice_number" => request.OrderInvoiceNumber,
                "order_description" => request.OrderDescription,
                "customer_id" => request.CustomerId,
                "success_url" => request.SuccessUrl,
                "error_url" => request.ErrorUrl,
                "cancel_url" => request.CancelUrl,
                _ => null
            };

            // Only add fields that have a value
            if (!string.IsNullOrEmpty(value))
            {
                fields[key] = value;
            }
        }

        // Generate signature string joining exactly the keys present in the dictionary, 
        // strictly maintaining the required ordering from requiredOrderedKeys.
        var signedString = string.Join(",", requiredOrderedKeys
            .Where(k => fields.ContainsKey(k))
            .Select(k => $"{k}={fields[k]}"));

        string signature;
        using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_secretKey)))
        {
            byte[] hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(signedString));
            signature = Convert.ToBase64String(hash);
        }

        fields["signature"] = signature;
        
        return (checkoutUrl, fields);
    }

    public bool VerifyIpn(string secretKeyHeader)
    {
        return secretKeyHeader == _webhookSecretKey;
    }

    public async Task<(bool Success, string Message)> ProcessIpnAsync(SePayIpnRequest request)
    {
        var invoiceNumber = request.Order.OrderInvoiceNumber;
        var notificationType = request.NotificationType;
        var transactionId = request.Transaction?.TransactionId;

        _logger.LogInformation(
            "Processing SePay IPN: Type={NotificationType}, Invoice={Invoice}, OrderStatus={OrderStatus}, TransactionId={TransactionId}",
            notificationType,
            invoiceNumber,
            request.Order.OrderStatus,
            transactionId);

        if (string.IsNullOrEmpty(invoiceNumber))
        {
            _logger.LogWarning("SePay IPN received with empty order_invoice_number");
            return (false, "Missing order_invoice_number");
        }

        switch (notificationType)
        {
            case "ORDER_PAID":
                return await HandleOrderPaidAsync(request);

            default:
                _logger.LogInformation(
                    "SePay IPN notification_type={NotificationType} not handled, acknowledging receipt",
                    notificationType);
                return (true, $"Notification type '{notificationType}' acknowledged");
        }
    }

    // ─── Private Handlers ─────────────────────────────────────────────────────

    private async Task<(bool Success, string Message)> HandleOrderPaidAsync(SePayIpnRequest request)
    {
        var invoiceNumber = request.Order.OrderInvoiceNumber;

        try
        {
            var result = await _orderService.MarkOrderAsPaidAsync(invoiceNumber);

            if (!result)
            {
                _logger.LogWarning(
                    "MarkOrderAsPaidAsync returned false for Invoice={Invoice}. Order may not exist or is already paid/cancelled.",
                    invoiceNumber);
                return (true, "Order not found or already processed");
            }

            _logger.LogInformation(
                "Order marked as paid: Invoice={Invoice}, Amount={Amount}, TransactionId={TransactionId}, PaymentMethod={PaymentMethod}",
                invoiceNumber,
                request.Order.OrderAmount,
                request.Transaction?.TransactionId,
                request.Transaction?.PaymentMethod);

            return (true, "Order marked as paid");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to process ORDER_PAID for Invoice={Invoice}", invoiceNumber);
            return (false, "Internal error processing payment");
        }
    }
}
