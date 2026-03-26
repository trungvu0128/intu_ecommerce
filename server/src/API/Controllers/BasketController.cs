using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LotusEcommerce.API.Controllers;

[Route("api/[controller]")]
public class BasketController : BaseApiController
{
    private readonly IBasketRepository _basketRepository;

    public BasketController(IBasketRepository basketRepository)
    {
        _basketRepository = basketRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetBasketById(string id)
    {
        var basket = await _basketRepository.GetBasketAsync(id);
        return OkResponse(basket ?? new CustomerBasket(id));
    }

    [HttpPost]
    public async Task<IActionResult> UpdateBasket(CustomerBasket basket)
    {
        var updatedBasket = await _basketRepository.UpdateBasketAsync(basket);
        return OkResponse(updatedBasket);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteBasketAsync(string id)
    {
        await _basketRepository.DeleteBasketAsync(id);
        return NoContentResponse();
    }
}
