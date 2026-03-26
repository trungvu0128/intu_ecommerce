using System.Text;
using LotusEcommerce.API.Middlewares;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Application.Services;
using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Interfaces;
using LotusEcommerce.Infrastructure.Data;
using LotusEcommerce.Infrastructure.Repositories;
using LotusEcommerce.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// Services
builder.Services.AddScoped<ISePayService, SePayService>();

// CORS for local Next.js client
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClientNext", policy => 
        policy.WithOrigins("http://localhost:3000", "http://localhost:5174")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentity<User, IdentityRole<Guid>>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// Authentication & JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Secret"] ?? throw new InvalidOperationException("JWT Secret is missing");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
})
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"]!;
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;
});
//.AddFacebook(options =>
//{
//    options.AppId = builder.Configuration["Authentication:Facebook:AppId"]!;
//    options.AppSecret = builder.Configuration["Authentication:Facebook:AppSecret"]!;
//});

// Firebase Admin SDK
try 
{
    var firebaseSection = builder.Configuration.GetSection("Firebase");
    var projectId = firebaseSection["ProjectId"];
    var serviceAccountJson = firebaseSection.GetValue<string>("ServiceAccountJson");
    
    // Check if default instance already exists to avoid duplicate initialization
    if (FirebaseApp.DefaultInstance == null)
    {
        AppOptions options = new AppOptions { ProjectId = projectId };
        
        // Priority 1: Local JSON file
        var serviceAccountPath = Path.Combine(builder.Environment.ContentRootPath, "firebase-service-account.json");
        if (File.Exists(serviceAccountPath))
        {
            options.Credential = GoogleCredential.FromFile(serviceAccountPath);
        }
        // Priority 2: JSON string in appsettings
        else if (!string.IsNullOrEmpty(serviceAccountJson))
        {
            options.Credential = GoogleCredential.FromJson(serviceAccountJson);
        }
        // Priority 3: Application Default Credentials
        else 
        {
            try 
            {
                options.Credential = GoogleCredential.GetApplicationDefault();
            }
            catch 
            {
                Console.WriteLine("Warning: Firebase credentials not found in appsettings, file, or environment.");
            }
        }

        if (options.Credential != null)
        {
            FirebaseApp.Create(options);
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine($"Warning: Failed to initialize Firebase Admin SDK: {ex.Message}");
}

// Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("CustomerOnly", policy => policy.RequireRole("Customer"));
});

// Redis
var redisConnectionString = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379,abortConnect=false";

// Note: To bypass needing Redis running locally just to start EF migration, we don't strictly require it to be connected at boot if we aren't using the Basket.
// If it fails resolving later during use, it will throw, but startup will succeed.
// We register a dummy factory that throws if actually invoked, but satisfies constructor signatures.
builder.Services.AddSingleton<StackExchange.Redis.IConnectionMultiplexer>(sp => 
    throw new InvalidOperationException("Redis is not configured locally.")
);

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = redisConnectionString;
    options.InstanceName = "Lotus_";
});

// Dependency Injection - Repositories
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<ICouponRepository, CouponRepository>();
builder.Services.AddScoped<IAddressRepository, AddressRepository>();
builder.Services.AddScoped<IBasketRepository, BasketRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<ICartItemRepository, CartItemRepository>();
builder.Services.AddScoped<IInventoryReasonRepository, InventoryReasonRepository>();
builder.Services.AddScoped<IInventoryTransactionRepository, InventoryTransactionRepository>();


// Dependency Injection - Services
builder.Services.Configure<LotusEcommerce.Infrastructure.Configuration.S3Options>(builder.Configuration.GetSection("S3"));
builder.Services.Configure<LotusEcommerce.Infrastructure.Configuration.FirebaseOptions>(builder.Configuration.GetSection("Firebase"));
builder.Services.Configure<LotusEcommerce.Infrastructure.Configuration.GoogleAuthOptions>(builder.Configuration.GetSection("Authentication:Google"));
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<ISearchService, MeilisearchService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ITelegramService, TelegramService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<IAddressService, AddressService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICmsService, CmsService>();
builder.Services.AddScoped<ICouponService, CouponService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();

// HttpClientFactory (used by TelegramService)
builder.Services.AddHttpClient();

// Lifecycle Notification Service (Start/Stop Alerts)
builder.Services.AddHostedService<LotusEcommerce.API.BackgroundServices.LifecycleNotificationService>();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Lotus Ecommerce API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

// Seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        var userManager = services.GetRequiredService<UserManager<User>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        await DbInitializer.SeedAsync(context, userManager, roleManager);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Request logging middleware (trade log + error log + Telegram)
app.UseMiddleware<RequestLoggingMiddleware>();

// CORS must come before HTTPS redirect, otherwise preflight OPTIONS
// requests get redirected and the browser blocks them.
app.UseCors("AllowClientNext");

// Only redirect to HTTPS in production — in dev, HTTP is used by
// tunnels (cloudflared) and local CMS/client apps.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
