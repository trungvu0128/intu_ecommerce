using System;
using System.Collections.Generic;

namespace LotusEcommerce.Application.Models;

public class ProductSearchModel
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string CategorySlug { get; set; } = string.Empty;
    public List<string> Sizes { get; set; } = new();
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
    public bool IsActive { get; set; }
    public bool IsFeatured { get; set; }
    public string[]? Tags { get; set; }
}
