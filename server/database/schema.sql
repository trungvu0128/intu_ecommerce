-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users & Identity
CREATE TABLE "Users" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Email" VARCHAR(255) NOT NULL UNIQUE,
    "PasswordHash" VARCHAR(255),
    "FullName" VARCHAR(100),
    "PhoneNumber" VARCHAR(20),
    "Role" VARCHAR(20) NOT NULL DEFAULT 'Customer', -- 'Admin', 'Customer'
    "IsActive" BOOLEAN DEFAULT TRUE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Addresses" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "UserId" UUID NOT NULL REFERENCES "Users"("Id"),
    "RecipientName" VARCHAR(100) NOT NULL,
    "PhoneNumber" VARCHAR(20) NOT NULL,
    "Street" VARCHAR(255) NOT NULL,
    "City" VARCHAR(100) NOT NULL,
    "State" VARCHAR(100),
    "ZipCode" VARCHAR(20),
    "Country" VARCHAR(100) NOT NULL,
    "IsDefault" BOOLEAN DEFAULT FALSE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Catalog
CREATE TABLE "Categories" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "ParentId" UUID REFERENCES "Categories"("Id"),
    "Name" VARCHAR(100) NOT NULL,
    "Slug" VARCHAR(100) NOT NULL UNIQUE,
    "Description" TEXT,
    "IsActive" BOOLEAN DEFAULT TRUE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Brands" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Name" VARCHAR(100) NOT NULL,
    "Slug" VARCHAR(100) NOT NULL UNIQUE,
    "LogoUrl" VARCHAR(255),
    "IsActive" BOOLEAN DEFAULT TRUE
);

CREATE TABLE "Products" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "CategoryId" UUID REFERENCES "Categories"("Id"),
    "BrandId" UUID REFERENCES "Brands"("Id"),
    "Name" VARCHAR(255) NOT NULL,
    "Slug" VARCHAR(255) NOT NULL UNIQUE,
    "Description" TEXT,
    "ShortDescription" VARCHAR(500),
    "BasePrice" DECIMAL(18, 2) NOT NULL,
    "IsActive" BOOLEAN DEFAULT TRUE,
    "IsDeleted" BOOLEAN DEFAULT FALSE,
    "Tags" TEXT[], -- Array of tags
    "Attributes" JSONB, -- Flexible attributes
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ProductVariants" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "ProductId" UUID NOT NULL REFERENCES "Products"("Id"),
    "Sku" VARCHAR(50) NOT NULL UNIQUE,
    "Size" VARCHAR(50),
    "Color" VARCHAR(50),
    "PriceAdjustment" DECIMAL(18, 2) DEFAULT 0,
    "StockQuantity" INT DEFAULT 0,
    "IsActive" BOOLEAN DEFAULT TRUE
);

CREATE TABLE "InventoryTransactions" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "ProductVariantId" UUID NOT NULL REFERENCES "ProductVariants"("Id"),
    "QuantityChanged" INT NOT NULL,
    "TransactionType" VARCHAR(50) NOT NULL, -- 'Restock', 'Order', 'Adjustment'
    "ReferenceId" UUID, -- Can link to OrderId or AdjustmentId
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "Note" TEXT
);

CREATE TABLE "ProductImages" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "ProductId" UUID NOT NULL REFERENCES "Products"("Id"),
    "ImageUrl" VARCHAR(255) NOT NULL,
    "IsMain" BOOLEAN DEFAULT FALSE,
    "DisplayOrder" INT DEFAULT 0
);

-- Sales & Orders
CREATE TABLE "Carts" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "UserId" UUID REFERENCES "Users"("Id"), -- Nullable for guest carts
    "SessionId" VARCHAR(100), -- For guest identification
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "CartItems" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "CartId" UUID NOT NULL REFERENCES "Carts"("Id") ON DELETE CASCADE,
    "ProductVariantId" UUID NOT NULL REFERENCES "ProductVariants"("Id"),
    "Quantity" INT NOT NULL DEFAULT 1,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Coupons" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Code" VARCHAR(50) NOT NULL UNIQUE,
    "DiscountType" VARCHAR(20) NOT NULL, -- 'Percentage', 'FixedAmount'
    "DiscountValue" DECIMAL(18, 2) NOT NULL,
    "MinOrderAmount" DECIMAL(18, 2),
    "MaxDiscountAmount" DECIMAL(18, 2),
    "StartDate" TIMESTAMP WITH TIME ZONE,
    "EndDate" TIMESTAMP WITH TIME ZONE,
    "UsageLimit" INT,
    "UsedCount" INT DEFAULT 0,
    "IsActive" BOOLEAN DEFAULT TRUE
);

CREATE TABLE "Orders" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "UserId" UUID REFERENCES "Users"("Id"),
    "OrderNumber" VARCHAR(50) NOT NULL UNIQUE,
    "Status" VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'
    "TotalAmount" DECIMAL(18, 2) NOT NULL,
    "SubTotal" DECIMAL(18, 2) NOT NULL,
    "ShippingCost" DECIMAL(18, 2) DEFAULT 0,
    "DiscountAmount" DECIMAL(18, 2) DEFAULT 0,
    "CouponCode" VARCHAR(50),
    "ShippingAddress" JSONB NOT NULL, -- Snapshot of address
    "BillingAddress" JSONB,
    "PaymentStatus" VARCHAR(50) DEFAULT 'Pending',
    "PaymentMethod" VARCHAR(50),
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OrderItems" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "OrderId" UUID NOT NULL REFERENCES "Orders"("Id") ON DELETE CASCADE,
    "ProductVariantId" UUID REFERENCES "ProductVariants"("Id"),
    "ProductName" VARCHAR(255) NOT NULL, -- Snapshot
    "Sku" VARCHAR(50) NOT NULL, -- Snapshot
    "Price" DECIMAL(18, 2) NOT NULL, -- Snapshot unit price
    "Quantity" INT NOT NULL,
    "Total" DECIMAL(18, 2) NOT NULL
);

CREATE TABLE "Payments" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "OrderId" UUID NOT NULL REFERENCES "Orders"("Id"),
    "Amount" DECIMAL(18, 2) NOT NULL,
    "PaymentMethod" VARCHAR(50) NOT NULL, -- 'CreditCard', 'PayPal', 'COD'
    "TransactionId" VARCHAR(100),
    "Status" VARCHAR(50) NOT NULL, -- 'Pending', 'Completed', 'Failed', 'Refunded'
    "PaymentDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Shipments" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "OrderId" UUID NOT NULL REFERENCES "Orders"("Id"),
    "TrackingNumber" VARCHAR(100),
    "Carrier" VARCHAR(100),
    "Status" VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Shipped', 'Delivered', 'Returned'
    "ShippedDate" TIMESTAMP WITH TIME ZONE,
    "EstimatedDeliveryDate" TIMESTAMP WITH TIME ZONE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ShipmentTracking" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "ShipmentId" UUID NOT NULL REFERENCES "Shipments"("Id"),
    "Status" VARCHAR(50) NOT NULL,
    "Location" VARCHAR(255),
    "Description" TEXT,
    "Timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CMS
CREATE TABLE "BlogCategories" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Name" VARCHAR(100) NOT NULL,
    "Slug" VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE "BlogPosts" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Title" VARCHAR(255) NOT NULL,
    "Slug" VARCHAR(255) NOT NULL UNIQUE,
    "Content" TEXT NOT NULL,
    "Excerpt" VARCHAR(500),
    "ThumbnailUrl" VARCHAR(255),
    "AuthorId" UUID REFERENCES "Users"("Id"),
    "CategoryId" UUID REFERENCES "BlogCategories"("Id"),
    "IsPublished" BOOLEAN DEFAULT FALSE,
    "PublishedAt" TIMESTAMP WITH TIME ZONE,
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Banners" (
    "Id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "Title" VARCHAR(100),
    "ImageUrl" VARCHAR(255) NOT NULL,
    "LinkUrl" VARCHAR(255),
    "Position" VARCHAR(50) DEFAULT 'MainHero',
    "DisplayOrder" INT DEFAULT 0,
    "IsActive" BOOLEAN DEFAULT TRUE
);

-- Indexes
CREATE INDEX "IX_Products_CategoryId" ON "Products"("CategoryId");
CREATE INDEX "IX_Products_BrandId" ON "Products"("BrandId");
CREATE INDEX "IX_Products_Price" ON "Products"("BasePrice");
CREATE INDEX "IX_ProductVariants_ProductId" ON "ProductVariants"("ProductId");
CREATE INDEX "IX_Orders_UserId" ON "Orders"("UserId");
CREATE INDEX "IX_Orders_CreatedAt" ON "Orders"("CreatedAt");

-- Full text search index (PostgreSQL specific)
CREATE INDEX "IX_Products_Search" ON "Products" USING GIN (to_tsvector('english', "Name" || ' ' || coalesce("Description", '')));
