using System.Text.Json.Serialization;

namespace LotusEcommerce.Application.Models;

/// <summary>
/// Standardized API response wrapper for all endpoints.
/// </summary>
public class BaseResponse<T>
{
    [JsonPropertyName("correlationId")]
    public string CorrelationId { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    public string Status { get; set; } = "success";

    [JsonPropertyName("code")]
    public int Code { get; set; } = 200;

    [JsonPropertyName("data")]
    public T? Data { get; set; }

    public static BaseResponse<T> Success(T? data, int code = 200, string? correlationId = null)
    {
        return new BaseResponse<T>
        {
            CorrelationId = correlationId ?? Guid.NewGuid().ToString(),
            Status = "success",
            Code = code,
            Data = data
        };
    }

    public static BaseResponse<T> Fail(T? data, int code = 400, string? correlationId = null)
    {
        return new BaseResponse<T>
        {
            CorrelationId = correlationId ?? Guid.NewGuid().ToString(),
            Status = "error",
            Code = code,
            Data = data
        };
    }
}

/// <summary>
/// Non-generic version for error responses with message-based data.
/// </summary>
public class BaseResponse : BaseResponse<object>
{
    public static BaseResponse Success(object? data = null, int code = 200, string? correlationId = null)
    {
        return new BaseResponse
        {
            CorrelationId = correlationId ?? Guid.NewGuid().ToString(),
            Status = "success",
            Code = code,
            Data = data
        };
    }

    public static BaseResponse Error(string message, int code = 400, string? correlationId = null)
    {
        return new BaseResponse
        {
            CorrelationId = correlationId ?? Guid.NewGuid().ToString(),
            Status = "error",
            Code = code,
            Data = new { message }
        };
    }

    public static BaseResponse Error(string message, object? errors, int code = 400, string? correlationId = null)
    {
        return new BaseResponse
        {
            CorrelationId = correlationId ?? Guid.NewGuid().ToString(),
            Status = "error",
            Code = code,
            Data = new { message, errors }
        };
    }
}
