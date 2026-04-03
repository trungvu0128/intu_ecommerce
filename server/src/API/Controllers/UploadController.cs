using LotusEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IImageService _imageService;
    private readonly ILogger<UploadController> _logger;

    public UploadController(IImageService imageService, ILogger<UploadController> logger)
    {
        _imageService = imageService;
        _logger = logger;
    }

    [HttpPost("image")]
    [Authorize(Roles = "Admin")] // Uncomment if only admins should upload
    public async Task<IActionResult> UploadImage(IFormFile file, [FromForm] string subfolder = "")
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        try
        {
            using var stream = file.OpenReadStream();
            var result = await _imageService.UploadImageAsync(stream, subfolder);

            return Ok(new
            {
                message = "Image uploaded successfully",
                data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading image");
            return StatusCode(500, "An error occurred while uploading the image.");
        }
    }

    [HttpPost("video")]
    [Authorize(Roles = "Admin")] // Uncomment if only admins should upload
    public async Task<IActionResult> UploadVideo(IFormFile file, [FromForm] string subfolder = "")
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        try
        {
            using var stream = file.OpenReadStream();
            var result = await _imageService.UploadVideoAsync(stream, file.ContentType, subfolder);

            return Ok(new
            {
                message = "Video uploaded successfully",
                data = new { url = result }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading video");
            return StatusCode(500, "An error occurred while uploading the video.");
        }
    }


    [HttpGet()]
    [AllowAnonymous]
    public async Task<IActionResult> GetImageUrl(string key)
    {

        var result = await _imageService.GetAccessibleUrlAsync(key);
        return Ok(result);
    }
}
