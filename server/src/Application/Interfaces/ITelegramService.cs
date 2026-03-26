namespace LotusEcommerce.Application.Interfaces;

public interface ITelegramService
{
    Task SendMessageAsync(string message);
    Task SendErrorNotificationAsync(string correlationId, string method, string path, string errorMessage, string? stackTrace = null);
}
