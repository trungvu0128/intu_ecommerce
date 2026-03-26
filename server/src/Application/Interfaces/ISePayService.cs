using LotusEcommerce.Application.DTOs.Payment;

namespace LotusEcommerce.Application.Interfaces;

public interface ISePayService
{
    (string CheckoutUrl, Dictionary<string, string> FormFields) GeneratePaymentForm(SePayCheckoutRequest request);
    
    /// <summary>
    /// Verify the IPN request's X-Secret-Key header matches the configured secret.
    /// </summary>
    bool VerifyIpn(string secretKeyHeader);

    /// <summary>
    /// Process the full SePay IPN notification. Handles:
    /// - ORDER_PAID: marks the order as paid and transitions status
    /// - Idempotency: skip processing if order is already in the target state
    /// Returns (success, message) tuple.
    /// </summary>
    Task<(bool Success, string Message)> ProcessIpnAsync(SePayIpnRequest request);
}
