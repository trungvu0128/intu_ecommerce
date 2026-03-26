using LotusEcommerce.Application.Interfaces;
using Microsoft.Extensions.Logging;

namespace LotusEcommerce.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;

    public EmailService(ILogger<EmailService> logger)
    {
        _logger = logger;
    }

    public Task SendEmailAsync(string to, string subject, string body)
    {
        _logger.LogInformation("Sending email to {To} with subject {Subject}. Body: {Body}", to, subject, body);
        return Task.CompletedTask;
    }
}
