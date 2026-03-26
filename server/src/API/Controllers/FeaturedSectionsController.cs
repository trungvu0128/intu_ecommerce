using LotusEcommerce.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers;

[Route("api/[controller]")]
public class FeaturedSectionsController : BaseApiController
{
    private readonly ICmsService _cmsService;

    public FeaturedSectionsController(ICmsService cmsService)
    {
        _cmsService = cmsService;
    }

    /// <summary>
    /// Get all active featured sections (public, for storefront)
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetActiveSections()
    {
        var sections = await _cmsService.GetFeaturedSectionsAsync(isActive: true);
        return OkResponse(sections);
    }
}
