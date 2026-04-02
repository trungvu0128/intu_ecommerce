using Amazon.S3;
using Amazon.S3.Model;
using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Infrastructure.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using System.Net;

namespace LotusEcommerce.Infrastructure.Services;

public class ImageService : IImageService
{
    private readonly AmazonS3Client _s3Client;
    private readonly S3Options _s3Options;
    private readonly ILogger<ImageService> _logger;

    public ImageService(IOptions<S3Options> s3Options, ILogger<ImageService> logger)
    {
        _s3Options = s3Options.Value;
        _logger = logger;

        var config = new AmazonS3Config
        {
            ServiceURL = _s3Options.Endpoint,
            AuthenticationRegion = "auto",
            ForcePathStyle = true,
            UseHttp = true,
        };
        
        _s3Client = new AmazonS3Client(_s3Options.AccessKey, _s3Options.SecretKey, config);
    }

    public async Task<ImageUploadResult> UploadImageAsync(Stream stream, string subfolder = "")
    {
        if (stream == null || stream.Length == 0)
            throw new ArgumentException("Stream is empty or null");

        var result = new ImageUploadResult();

        try
        {
            using var image = await Image.LoadAsync(stream);

            var fileId = Guid.NewGuid().ToString("N");
            var filename = $"{fileId}.webp";
            var thumbFilename = $"{fileId}-thumb.webp";
            
            var mainKey = string.IsNullOrEmpty(subfolder) ? filename : $"{subfolder}/{filename}";
            var thumbKey = string.IsNullOrEmpty(subfolder) ? thumbFilename : $"{subfolder}/{thumbFilename}";

            var encoder = new WebpEncoder { FileFormat = WebpFileFormatType.Lossy, Quality = 80 };

            using var mainOutput = new MemoryStream();
            await image.SaveAsync(mainOutput, encoder);
            mainOutput.Position = 0;
            await UploadToMinIOAsync(mainKey, mainOutput, "image/webp");
            result.OriginalUrl = GetPublicUrl(mainKey);

            var thumbWidth = Math.Max(1, image.Width / 2);
            var thumbHeight = Math.Max(1, image.Height / 2);

            using var thumbImage = image.Clone(x => x.Resize(thumbWidth, thumbHeight));
            using var thumbOutput = new MemoryStream();
            await thumbImage.SaveAsync(thumbOutput, encoder);
            thumbOutput.Position = 0;
            await UploadToMinIOAsync(thumbKey, thumbOutput, "image/webp");
            result.ThumbnailUrl = GetPublicUrl(thumbKey);

            _logger.LogInformation("Successfully uploaded image: {FileId}", fileId);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload image to MinIO");
            throw;
        }
    }

    private async Task UploadToMinIOAsync(string key, Stream stream, string contentType, int retryCount = 0)
    {
        var putRequest = new PutObjectRequest
        {
            BucketName = _s3Options.BucketName,
            Key = key,
            InputStream = stream,
            ContentType = contentType,
            DisablePayloadSigning = true,
            CannedACL = S3CannedACL.PublicRead
        };

        try
        {
            var response = await _s3Client.PutObjectAsync(putRequest);
            if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
            {
                throw new Exception($"Failed to upload to MinIO: {response.HttpStatusCode}");
            }
        }
        catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.Forbidden || 
                                              ex.StatusCode == System.Net.HttpStatusCode.Unauthorized)
        {
            _logger.LogWarning(ex, "Access denied when uploading {Key}. Attempt {RetryCount}/3", key, retryCount + 1);
            
            if (retryCount < 3)
            {
                await Task.Delay(1000 * (retryCount + 1));
                stream.Position = 0;
                await UploadToMinIOAsync(key, stream, contentType, retryCount + 1);
                return;
            }
            
            throw new Exception($"Access denied when uploading to MinIO after {retryCount + 1} attempts: {ex.Message}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload {Key} to MinIO", key);
            throw;
        }
    }

    public async Task<string> GetAccessibleUrlAsync(string key)
    {

        return await _s3Client.GetPreSignedURLAsync(new GetPreSignedUrlRequest
        {
            BucketName = _s3Options.BucketName,
            Key = key,
            Expires = DateTime.UtcNow.AddHours(1),
        });
    }

    private string GetPublicUrl(string key)
    {
        return $"{_s3Options.PublicUrl}/{key}";
    } 
}
