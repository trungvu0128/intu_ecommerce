using Amazon.S3;
using Amazon.S3.Model;
using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Infrastructure.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace LotusEcommerce.Infrastructure.Services;

public class ImageService : IImageService
{
    private readonly AmazonS3Client _s3Client;
    private readonly S3Options _s3Options;

    public ImageService(IOptions<S3Options> s3Options)
    {
        _s3Options = s3Options.Value;

        var config = new AmazonS3Config
        {
            ServiceURL = _s3Options.Endpoint,
            AuthenticationRegion = "auto"
        };
        _s3Client = new AmazonS3Client(_s3Options.AccessKey, _s3Options.SecretKey, config);
    }

    public async Task<ImageUploadResult> UploadImageAsync(Stream stream, string subfolder = "")
    {
        if (stream == null || stream.Length == 0)
            throw new ArgumentException("Stream is empty or null");

        var result = new ImageUploadResult();

        // 1. Process image
        using var image = await Image.LoadAsync(stream);

        // Name Generation
        var fileId = Guid.NewGuid().ToString("N");
        var filename = $"{fileId}.webp";
        var thumbFilename = $"{fileId}-thumb.webp";
        
        var mainKey = string.IsNullOrEmpty(subfolder) ? filename : $"{subfolder}/{filename}";
        var thumbKey = string.IsNullOrEmpty(subfolder) ? thumbFilename : $"{subfolder}/{thumbFilename}";

        // WebP Encoder
        var encoder = new WebpEncoder { FileFormat = WebpFileFormatType.Lossy, Quality = 80 };

        // Save Main Image
        using var mainOutput = new MemoryStream();
        await image.SaveAsync(mainOutput, encoder);
        mainOutput.Position = 0;
        await UploadToS3Async(mainKey, mainOutput, "image/webp");
        result.OriginalUrl = $"{_s3Options.PublicUrl}/{mainKey}";

        // 2. Clone and reduce size by 50%
        var thumbWidth = Math.Max(1, image.Width / 2);
        var thumbHeight = Math.Max(1, image.Height / 2);

        using var thumbImage = image.Clone(x => x.Resize(thumbWidth, thumbHeight));
        using var thumbOutput = new MemoryStream();
        await thumbImage.SaveAsync(thumbOutput, encoder);
        thumbOutput.Position = 0;
        await UploadToS3Async(thumbKey, thumbOutput, "image/webp");
        result.ThumbnailUrl = $"{_s3Options.PublicUrl}/{thumbKey}";

        return result;
    }

    private async Task UploadToS3Async(string key, Stream stream, string contentType)
    {
        var putRequest = new PutObjectRequest
        {
            BucketName = _s3Options.BucketName,
            Key = key,
            InputStream = stream,
            ContentType = contentType,
            DisablePayloadSigning = true
        };

        var response = await _s3Client.PutObjectAsync(putRequest);
        if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
        {
            throw new Exception($"Failed to upload to S3: {response.HttpStatusCode}");
        }
    }
}
