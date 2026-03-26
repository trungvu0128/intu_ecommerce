using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Application.Models;
using Meilisearch;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LotusEcommerce.Infrastructure.Services;

public class MeilisearchService : ISearchService
{
    private readonly MeilisearchClient _client;
    private readonly string _indexName;

    public MeilisearchService(IConfiguration configuration)
    {
        var url = configuration["Meilisearch:Url"] ?? "http://localhost:7700";
        var apiKey = configuration["Meilisearch:ApiKey"] ?? "masterKey";
        _indexName = configuration["Meilisearch:IndexName"] ?? "products";
        _client = new MeilisearchClient(url, apiKey);
        
        // Ensure index exists and is configured
        _ = InitializeIndexAsync();
    }

    private async Task InitializeIndexAsync()
    {
        var index = _client.Index(_indexName);
        
        // Configure filterable and sortable attributes
        await index.UpdateFilterableAttributesAsync(new[] 
        { 
            "categoryName", 
            "categorySlug", 
            "sizes", 
            "minPrice", 
            "maxPrice", 
            "isActive", 
            "isFeatured" 
        });
        
        await index.UpdateSortableAttributesAsync(new[] 
        { 
            "minPrice", 
            "maxPrice", 
            "name" 
        });
    }

    public async Task<IEnumerable<ProductSearchModel>> SearchAsync(string query, string? category = null, string? size = null, decimal? minPrice = null, decimal? maxPrice = null)
    {
        var index = _client.Index(_indexName);
        
        var filters = new List<string>();
        if (!string.IsNullOrEmpty(category))
            filters.Add($"categorySlug = \"{category}\"");
        
        if (!string.IsNullOrEmpty(size))
            filters.Add($"sizes = \"{size}\"");
            
        if (minPrice.HasValue)
            filters.Add($"minPrice >= {minPrice.Value}");
            
        if (maxPrice.HasValue)
            filters.Add($"maxPrice <= {maxPrice.Value}");

        var searchParams = new SearchQuery
        {
            Filter = filters.Any() ? string.Join(" AND ", filters) : null,
            Limit = 20
        };

        var result = await index.SearchAsync<ProductSearchModel>(query, searchParams);
        return result.Hits;
    }

    public async Task IndexProductAsync(ProductSearchModel product)
    {
        var index = _client.Index(_indexName);
        await index.AddDocumentsAsync(new[] { product });
    }

    public async Task DeleteProductAsync(Guid productId)
    {
        var index = _client.Index(_indexName);
        await index.DeleteOneDocumentAsync(productId.ToString());
    }

    public async Task BulkIndexProductsAsync(IEnumerable<ProductSearchModel> products)
    {
        var index = _client.Index(_indexName);
        await index.AddDocumentsAsync(products);
    }
}
