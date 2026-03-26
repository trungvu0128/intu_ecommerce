using System.Diagnostics;
using System.Text;
using System.Text.Json;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Application.Models;
using LotusEcommerce.Domain.Exceptions;

namespace LotusEcommerce.API.Middlewares;

/// <summary>
/// Middleware to log all non-GET requests (trade log) and 500 responses.
/// Sends error notifications to Telegram on 500 errors.
/// </summary>
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, ITelegramService telegramService)
    {
        var correlationId = context.TraceIdentifier;
        context.Items["CorrelationId"] = correlationId;

        var method = context.Request.Method;
        var path = context.Request.Path.ToString();
        var queryString = context.Request.QueryString.ToString();
        var stopwatch = Stopwatch.StartNew();

        // Read request body for non-GET methods
        string? requestBody = null;
        if (!HttpMethods.IsGet(method))
        {
            context.Request.EnableBuffering();
            using var reader = new StreamReader(
                context.Request.Body,
                Encoding.UTF8,
                detectEncodingFromByteOrderMarks: false,
                leaveOpen: true);
            requestBody = await reader.ReadToEndAsync();
            context.Request.Body.Position = 0;
        }

        // Capture response body
        var originalBodyStream = context.Response.Body;
        using var responseBodyStream = new MemoryStream();
        context.Response.Body = responseBodyStream;

        try
        {
            await _next(context);
        }
        catch (BadRequestException ex)
        {
            // Specifically handle Bad Request
            stopwatch.Stop();
            var elapsed = stopwatch.ElapsedMilliseconds;

            _logger.LogWarning("[{CorrelationId}] BAD REQUEST | {Method} {Path}{Query} | Duration: {Duration}ms | Message: {Message}",
                correlationId, method, path, queryString, elapsed, ex.Message);

            context.Response.Body = originalBodyStream;
            context.Response.StatusCode = 400;
            context.Response.ContentType = "application/json";

            var errorResponse = BaseResponse.Error(ex.Message, 400, correlationId);
            var json = JsonSerializer.Serialize(errorResponse);
            await context.Response.WriteAsync(json);
            return;
        }
        catch (Exception ex)
        {
            // Unhandled exception => 500
            stopwatch.Stop();
            var elapsed = stopwatch.ElapsedMilliseconds;

            _logger.LogError(ex,
                "[{CorrelationId}] UNHANDLED EXCEPTION | {Method} {Path}{Query} | Duration: {Duration}ms | RequestBody: {RequestBody}",
                correlationId, method, path, queryString, elapsed, requestBody ?? "N/A");

            // Send Telegram notification
            await telegramService.SendErrorNotificationAsync(
                correlationId, method, path, ex.Message, ex.StackTrace);

            // Write 500 response
            context.Response.Body = originalBodyStream;
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";

            var errorResponse = BaseResponse.Error(
                "An unexpected error occurred. Please try again later.",
                code: 500,
                correlationId: correlationId);

            var json = JsonSerializer.Serialize(errorResponse);
            await context.Response.WriteAsync(json);
            return;
        }

        stopwatch.Stop();
        var elapsedMs = stopwatch.ElapsedMilliseconds;

        // Read response body
        responseBodyStream.Seek(0, SeekOrigin.Begin);
        var responseBody = await new StreamReader(responseBodyStream).ReadToEndAsync();
        responseBodyStream.Seek(0, SeekOrigin.Begin);

        // Copy response to original stream
        await responseBodyStream.CopyToAsync(originalBodyStream);

        var statusCode = context.Response.StatusCode;

        // Log non-GET requests (trade log)
        if (!HttpMethods.IsGet(method))
        {
            _logger.LogInformation(
                "[{CorrelationId}] TRADE LOG | {Method} {Path}{Query} | Status: {StatusCode} | Duration: {Duration}ms | RequestBody: {RequestBody} | ResponseBody: {ResponseBody}",
                correlationId, method, path, queryString, statusCode, elapsedMs,
                TruncateBody(requestBody), TruncateBody(responseBody));
        }

        // Log 500 responses
        if (statusCode >= 500)
        {
            _logger.LogError(
                "[{CorrelationId}] ERROR RESPONSE | {Method} {Path}{Query} | Status: {StatusCode} | Duration: {Duration}ms | RequestBody: {RequestBody} | ResponseBody: {ResponseBody}",
                correlationId, method, path, queryString, statusCode, elapsedMs,
                TruncateBody(requestBody), TruncateBody(responseBody));

            // Send Telegram notification for 500 errors
            await telegramService.SendErrorNotificationAsync(
                correlationId, method, path,
                $"HTTP {statusCode} response returned. Response: {TruncateBody(responseBody, 500)}");
        }
    }

    private static string? TruncateBody(string? body, int maxLength = 2000)
    {
        if (string.IsNullOrEmpty(body)) return body;
        return body.Length <= maxLength ? body : body[..maxLength] + "...[truncated]";
    }
}
