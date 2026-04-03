using LotusEcommerce.Application.DTOs.Payment;
using LotusEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly ISePayService _sePayService;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(ISePayService sePayService, ILogger<PaymentController> logger)
    {
        _sePayService = sePayService;
        _logger = logger;
    }

    [HttpPost("checkout-url")]
    public IActionResult GenerateCheckoutUrl([FromBody] SePayCheckoutRequest request)
    {
        var (checkoutUrl, fields) = _sePayService.GeneratePaymentForm(request);
        return Ok(new 
        { 
            checkoutUrl, 
            fields
        });
    }

    /// <summary>
    /// SePay IPN (Instant Payment Notification) webhook endpoint.
    /// SePay sends a POST request here when a transaction status changes.
    /// Must return HTTP 200 to acknowledge receipt — otherwise SePay will retry.
    /// Docs: https://developer.sepay.vn/vi/cong-thanh-toan/IPN
    /// </summary>
    [HttpPost("ipn")]
    [AllowAnonymous]
    public async Task<IActionResult> SePayIpn([FromBody] SePayIpnRequest request)
    {
        // 1. Verify the X-Secret-Key header
        //if (!Request.Headers.TryGetValue("X-Secret-Key", out var secretKeyHeader))
        //{
        //    _logger.LogWarning("SePay IPN received without X-Secret-Key header from {IP}",
        //        HttpContext.Connection.RemoteIpAddress);
        //    return Unauthorized(new { success = false, error = "Missing secret key header" });
        //}

        //if (!_sePayService.VerifyIpn(secretKeyHeader!))
        //{
        //    _logger.LogWarning("SePay IPN received with invalid X-Secret-Key from {IP}",
        //        HttpContext.Connection.RemoteIpAddress);
        //    return Unauthorized(new { success = false, error = "Invalid secret key" });
        //}

        // 2. Delegate processing to the service layer
        var (success, message) = await _sePayService.ProcessIpnAsync(request);

        if (!success)
        {
            // Return 200 even on business-logic failures so SePay doesn't endlessly retry.
            // Only return non-200 if we genuinely want SePay to retry (e.g. internal error).
            if (message == "Internal error processing payment")
            {
                _logger.LogError("SePay IPN processing failed with internal error — returning 500 for retry. Invoice={Invoice}",
                    request.Order.OrderInvoiceNumber);
                return StatusCode(500, new { success = false, message });
            }

            // Business-logic "failure" (e.g. missing invoice) — acknowledge receipt to stop retries
            return Ok(new { success = false, message });
        }

        return Ok(new { success = true, message });
    }
}
