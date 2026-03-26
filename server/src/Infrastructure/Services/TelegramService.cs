using System.Net.Http.Json;
using System.Text;
using LotusEcommerce.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LotusEcommerce.Infrastructure.Services;

public class TelegramService : ITelegramService
{
    private readonly HttpClient _httpClient;
    private readonly string _botToken;
    private readonly string _chatId;
    private readonly ILogger<TelegramService> _logger;
    private readonly bool _isEnabled;

    public TelegramService(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<TelegramService> logger)
    {
        _httpClient = httpClientFactory.CreateClient("Telegram");
        _botToken = configuration["Telegram:BotToken"] ?? string.Empty;
        _chatId = configuration["Telegram:ChatId"] ?? string.Empty;
        _logger = logger;
        _isEnabled = !string.IsNullOrEmpty(_botToken) && !string.IsNullOrEmpty(_chatId);
    }

    public async Task SendMessageAsync(string message)
    {
        if (!_isEnabled)
        {
            _logger.LogWarning("Telegram is not configured. Skipping notification.");
            return;
        }

        try
        {
            var url = $"https://api.telegram.org/bot{_botToken}/sendMessage";
            var payload = new
            {
                chat_id = _chatId,
                text = message,
                parse_mode = "HTML"
            };

            var response = await _httpClient.PostAsJsonAsync(url, payload);
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to send Telegram message. Status: {Status}, Body: {Body}",
                    response.StatusCode, body);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending Telegram notification");
        }
    }

    public async Task SendErrorNotificationAsync(
        string correlationId,
        string method,
        string path,
        string errorMessage,
        string? stackTrace = null)
    {
        var sb = new StringBuilder();
        sb.AppendLine("🚨 <b>API Error Alert</b>");
        sb.AppendLine();
        sb.AppendLine($"📋 <b>Correlation ID:</b> <code>{EscapeHtml(correlationId)}</code>");
        sb.AppendLine($"🔗 <b>Endpoint:</b> <code>{EscapeHtml(method)} {EscapeHtml(path)}</code>");
        sb.AppendLine($"⏰ <b>Time:</b> {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
        sb.AppendLine();
        sb.AppendLine($"❌ <b>Error:</b>");
        sb.AppendLine($"<pre>{EscapeHtml(Truncate(errorMessage, 500))}</pre>");

        if (!string.IsNullOrEmpty(stackTrace))
        {
            sb.AppendLine();
            sb.AppendLine($"📜 <b>Stack Trace:</b>");
            sb.AppendLine($"<pre>{EscapeHtml(Truncate(stackTrace, 1500))}</pre>");
        }

        await SendMessageAsync(sb.ToString());
    }

    private static string EscapeHtml(string text)
    {
        return text
            .Replace("&", "&amp;")
            .Replace("<", "&lt;")
            .Replace(">", "&gt;");
    }

    private static string Truncate(string text, int maxLength)
    {
        if (string.IsNullOrEmpty(text)) return text;
        return text.Length <= maxLength ? text : text[..maxLength] + "...";
    }
}
