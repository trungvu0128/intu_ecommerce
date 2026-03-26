using LotusEcommerce.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace LotusEcommerce.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context, UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager)
    {
        await context.Database.EnsureCreatedAsync();

        // Seed Roles
        string[] roles = { "Admin", "Customer" };
        foreach (var roleName in roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
            }
        }

        // Seed Admin User
        var adminEmail = "admin@lotus.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new User
            {
                UserName = adminEmail,
                Email = adminEmail,
                FullName = "System Admin",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(adminUser, "Admin@123");
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }

        // Seed Brands and Categories and Products
        if (!context.Brands.Any())
        {
            var brand = new Brand
            {
                Id = Guid.NewGuid(),
                Name = "Lotus",
                Slug = "lotus"
            };
            context.Brands.Add(brand);

            var categories = new Dictionary<string, Category>
            {
                { "New Arrival", new Category { Id = Guid.NewGuid(), Name = "New Arrival", Slug = "new-arrival", Description = "SS01 | THE KNOT", ImageUrl = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop", IsActive = true } },
                { "Tops", new Category { Id = Guid.NewGuid(), Name = "Tops", Slug = "tops", Description = "SS01 | ESSENTIAL TOPS", ImageUrl = "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=2000&auto=format&fit=crop", IsActive = true } },
                { "Bottoms", new Category { Id = Guid.NewGuid(), Name = "Bottoms", Slug = "bottoms", Description = "SS01 | TAILORED BOTTOMS", ImageUrl = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2000&auto=format&fit=crop", IsActive = true } },
                { "Dresses", new Category { Id = Guid.NewGuid(), Name = "Dresses", Slug = "dresses", Description = "SS01 | SILK & LACE", ImageUrl = "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=2000&auto=format&fit=crop", IsActive = true } },
                { "Outerwear", new Category { Id = Guid.NewGuid(), Name = "Outerwear", Slug = "outerwear", Description = "SS01 | LAYER UP", ImageUrl = "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=2000&auto=format&fit=crop", IsActive = true } },
                { "Accessories", new Category { Id = Guid.NewGuid(), Name = "Accessories", Slug = "accessories", Description = "SS01 | FINISHING TOUCH", ImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=2000&auto=format&fit=crop", IsActive = true } },

            };

            foreach (var cat in categories.Values)
            {
                context.Categories.Add(cat);
            }

            var productsData = new[]
            {
                new { name = "THE BLACK GROOM SHIRT", price = 1000000m, img = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&h=800&auto=format&fit=crop", img2 = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&h=800&auto=format&fit=crop", cat = "Tops", color = "Black" },
                new { name = "THE CROPPED SUEDE JACKET", price = 1200000m, img = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&h=800&auto=format&fit=crop", img2 = "https://images.unsplash.com/photo-1554412930-07416397efec?q=80&w=600&h=800&auto=format&fit=crop", cat = "Outerwear", color = "Beige" },
                new { name = "THE LACE SLIP", price = 850000m, img = "https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=600&h=800&auto=format&fit=crop", img2 = "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=600&h=800&auto=format&fit=crop", cat = "Dresses", color = "White" },
                new { name = "THE BROWN CROPPED SUEDE JACKET", price = 1100000m, img = "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600&h=800&auto=format&fit=crop", img2 = "https://images.unsplash.com/photo-1537244283804-9a9c2b4ad2f2?q=80&w=600&h=800&auto=format&fit=crop", cat = "Outerwear", color = "Brown" },
                new { name = "THE SOFT CUT SHORT", price = 650000m, img = "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=600&h=800&auto=format&fit=crop", img2 = "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&h=800&auto=format&fit=crop", cat = "Bottoms", color = "Black" },
                new { name = "THE VELVET BLAZER", price = 1800000m, img = "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&h=800&auto=format&fit=crop", img2 = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&h=800&auto=format&fit=crop", cat = "Outerwear", color = "Navy" },
                new { name = "THE BLACK BITE JEANS", price = 1500000m, img = "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&h=800&auto=format&fit=crop", img2 = "https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=600&h=800&auto=format&fit=crop", cat = "Bottoms", color = "Black" },
                new { name = "THE IVORY GROOM SHIRT", price = 1000000m, img = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&h=800&auto=format&fit=crop", img2 = "https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=600&h=800&auto=format&fit=crop", cat = "Tops", color = "White" },
                new { name = "THE TWIN TANKTOP", price = 1600000m, img = "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=600&h=600&auto=format&fit=crop", img2 = "", cat = "Tops", color = "Grey" },
                new { name = "THE SILK WRAP DRESS", price = 2200000m, img = "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Dresses", color = "Red" },
                new { name = "THE ESSENTIALS TEE", price = 450000m, img = "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&h=600&auto=format&fit=crop", img2 = "", cat = "Tops", color = "Beige" },
                new { name = "THE SKY BUTTON SHIRT", price = 750000m, img = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&h=600&auto=format&fit=crop", img2 = "", cat = "Tops", color = "Blue" },
                new { name = "THE NOIR DRESS", price = 950000m, img = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&h=600&auto=format&fit=crop", img2 = "", cat = "Dresses", color = "Black" },
                new { name = "THE CASHMERE KNIT", price = 1350000m, img = "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Tops", color = "Beige" },
                new { name = "THE WIDE LEG PANTS", price = 980000m, img = "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Bottoms", color = "Grey" },
                new { name = "THE TRENCH COAT", price = 2500000m, img = "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Outerwear", color = "Beige" },
                new { name = "THE SATIN CAMI", price = 550000m, img = "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Tops", color = "Pink" },
                new { name = "THE LEATHER BELT", price = 380000m, img = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Accessories", color = "Brown" },
                new { name = "THE MIDI SKIRT", price = 890000m, img = "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Bottoms", color = "Green" },
                new { name = "THE PUFFER VEST", price = 1450000m, img = "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Outerwear", color = "Black" },
                new { name = "THE LINEN SHIRT", price = 720000m, img = "https://images.unsplash.com/photo-1604695573706-53170668f6a6?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Tops", color = "White" },
                new { name = "THE MAXI DRESS", price = 1750000m, img = "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Dresses", color = "Navy" },
                new { name = "THE CARGO PANTS", price = 1150000m, img = "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Bottoms", color = "Green" },
                new { name = "THE SILK SCARF", price = 320000m, img = "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Accessories", color = "Red" },
                new { name = "THE DENIM JACKET", price = 1300000m, img = "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Outerwear", color = "Blue" },
                new { name = "THE WRAP BLOUSE", price = 680000m, img = "https://images.unsplash.com/photo-1562572159-4efc207f5aff?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Tops", color = "Pink" },
                new { name = "THE TAILORED SHORTS", price = 780000m, img = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Bottoms", color = "Beige" },
                new { name = "THE EVENING GOWN", price = 3200000m, img = "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Dresses", color = "Black" },
                new { name = "THE CANVAS TOTE", price = 420000m, img = "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Accessories", color = "Beige" },
                new { name = "THE BOMBER JACKET", price = 1950000m, img = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "Outerwear", color = "Navy" },
                new { name = "THE NEW ARRIVAL DRESS", price = 2100000m, img = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&h=800&auto=format&fit=crop", img2 = "", cat = "New Arrival", color = "White" }
            };

            int i = 0;
            foreach (var item in productsData)
            {
                var product = new Product
                {
                    Id = Guid.NewGuid(),
                    Name = item.name,
                    Slug = item.name.ToLower().Replace(" ", "-").Replace("'", ""),
                    Description = "Premium high-fashion piece curated for minimalist elegance.",
                    BasePrice = item.price,
                    IsFeatured = true,
                    IsActive = true,
                    BrandId = brand.Id,
                    CategoryId = categories.ContainsKey(item.cat) ? categories[item.cat].Id : categories["Tops"].Id,
                };
                context.Products.Add(product);
                
                var variantId = Guid.NewGuid();
                var variant = new ProductVariant
                {
                    Id = variantId,
                    ProductId = product.Id,
                    Sku = $"SKU-{i:000}-{product.Slug.Substring(0, Math.Min(4, product.Slug.Length)).ToUpper()}",
                    Color = item.color,
                    Size = "Free",
                    PriceAdjustment = 0,
                    StockQuantity = 50,
                };
                context.ProductVariants.Add(variant);

                context.ProductImages.Add(new ProductImage
                {
                    Id = Guid.NewGuid(),
                    ProductId = product.Id,
                    Url = item.img,
                    IsMain = true
                });

                if (!string.IsNullOrEmpty(item.img2))
                {
                    context.ProductImages.Add(new ProductImage
                    {
                        Id = Guid.NewGuid(),
                        ProductId = product.Id,
                        Url = item.img2,
                        IsMain = false
                    });
                }
                
                i++;
            }

            await context.SaveChangesAsync();
        }
    }
}
