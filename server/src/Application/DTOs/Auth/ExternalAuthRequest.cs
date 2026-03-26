using System.ComponentModel.DataAnnotations;

namespace LotusEcommerce.Application.DTOs.Auth;

public class ExternalAuthRequest
{
    [Required]
    public string IdToken { get; set; } = string.Empty;
}
