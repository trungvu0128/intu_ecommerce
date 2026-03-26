using LotusEcommerce.Application.Models;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers;

/// <summary>
/// Base controller providing standardized response helpers.
/// All API controllers should inherit from this.
/// </summary>
[ApiController]
public abstract class BaseApiController : ControllerBase
{
    /// <summary>
    /// Gets the correlation ID from the current request context.
    /// </summary>
    protected string CorrelationId =>
        HttpContext.Items["CorrelationId"]?.ToString() ?? HttpContext.TraceIdentifier;

    /// <summary>
    /// Returns 200 OK with wrapped response.
    /// </summary>
    protected IActionResult OkResponse<T>(T data)
    {
        return Ok(BaseResponse<T>.Success(data, 200, CorrelationId));
    }

    /// <summary>
    /// Returns 201 Created with wrapped response.
    /// </summary>
    protected IActionResult CreatedResponse<T>(T data, string actionName, object routeValues)
    {
        var response = BaseResponse<T>.Success(data, 201, CorrelationId);
        return CreatedAtAction(actionName, routeValues, response);
    }

    /// <summary>
    /// Returns 204 No Content with wrapped response.
    /// </summary>
    protected IActionResult NoContentResponse()
    {
        return Ok(BaseResponse.Success(code: 204, correlationId: CorrelationId));
    }

    /// <summary>
    /// Returns 400 Bad Request with error message.
    /// </summary>
    protected IActionResult BadRequestResponse(string message)
    {
        return BadRequest(BaseResponse.Error(message, 400, CorrelationId));
    }

    /// <summary>
    /// Returns 401 Unauthorized with error message.
    /// </summary>
    protected IActionResult UnauthorizedResponse(string message)
    {
        return Unauthorized(BaseResponse.Error(message, 401, CorrelationId));
    }

    /// <summary>
    /// Returns 404 Not Found with error message.
    /// </summary>
    protected IActionResult NotFoundResponse(string message = "Resource not found")
    {
        return NotFound(BaseResponse.Error(message, 404, CorrelationId));
    }
}
