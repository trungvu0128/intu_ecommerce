using LotusEcommerce.Application.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LotusEcommerce.Application.Interfaces;

public interface ISearchService
{
    Task<IEnumerable<ProductSearchModel>> SearchAsync(string query, string? category = null, string? size = null, decimal? minPrice = null, decimal? maxPrice = null);
    Task IndexProductAsync(ProductSearchModel product);
    Task DeleteProductAsync(Guid productId);
    Task BulkIndexProductsAsync(IEnumerable<ProductSearchModel> products);
}
