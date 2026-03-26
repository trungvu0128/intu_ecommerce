using LotusEcommerce.Application.Interfaces;

namespace LotusEcommerce.API.BackgroundServices;

public class LifecycleNotificationService : BackgroundService
{
    private readonly ILogger<LifecycleNotificationService> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly IHostApplicationLifetime _lifetime;
    private readonly IConfiguration _configuration;
    private readonly string _environmentName;

    public LifecycleNotificationService(
        ILogger<LifecycleNotificationService> logger,
        IServiceProvider serviceProvider,
        IHostApplicationLifetime lifetime,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
        _lifetime = lifetime;
        _configuration = configuration;
        _environmentName = environment.EnvironmentName;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // 1. Notify on Startup
        _logger.LogInformation("Application Started. Sending notification...");
        _ = SendAlertAsync($"🚀 <b>Application Started</b>\n\nEnvironment: <code>{_environmentName}</code>\nTime: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");

        // 2. Register for Shutdown notification
        _lifetime.ApplicationStopping.Register(() =>
        {
            _logger.LogInformation("Application Stopping. Sending notification...");
            // Run synchronously to ensure message is sent before process exits
            SendAlertAsync($"🛑 <b>Application Stopping</b>\n\nReason: Shutdown signal received\nTime: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC").GetAwaiter().GetResult();
        });

        return Task.CompletedTask;
    }

    private async Task SendAlertAsync(string message)
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var telegramService = scope.ServiceProvider.GetRequiredService<ITelegramService>();
            await telegramService.SendMessageAsync(message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send alert via TelegramService");
        }
    }
}
