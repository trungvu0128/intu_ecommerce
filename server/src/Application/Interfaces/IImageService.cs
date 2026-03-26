using LotusEcommerce.Application.DTOs;

namespace LotusEcommerce.Application.Interfaces;

public interface IImageService
{
    Task<ImageUploadResult> UploadImageAsync(Stream stream, string subfolder = "");
}
