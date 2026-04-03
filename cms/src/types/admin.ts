// Admin-specific types for CMS management

export interface Banner {
  id: string;
  title?: string;
  imageUrl: string;
  linkUrl?: string;
  position: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateBannerRequest {
  title?: string;
  imageUrl: string;
  linkUrl?: string;
  position: string;
  displayOrder: number;
  isActive: boolean;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnailUrl?: string;
  authorId?: string;
  authorName?: string;
  categoryId?: string;
  categoryName?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface CreateBlogPostRequest {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnailUrl?: string;
  categoryId?: string;
  isPublished: boolean;
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCouponRequest {
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  isActive: boolean;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  bannerImages?: string[];
  isActive: boolean;
  parentId?: string;
  parentName?: string;
  productCount: number;
  createdAt: string;
  products?: CategoryProduct[];
}

export interface CategoryProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  mainImageUrl?: string;
  isActive: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  bannerImages?: string[];
  isActive: boolean;
  parentId?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  isActive: boolean;
  emailConfirmed: boolean;
  roles: string[];
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  role: string;
}

export interface AdminDashboard {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  ordersToday: number;
  revenueToday: number;
  pendingOrders: number;
  recentOrders: RecentOrder[];
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName?: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  pageSize: number;
  data: T[];
}

// ─── Featured Section ──────────────────────────────────────────────────────

export interface FeaturedSection {
  id: string;
  title: string;
  subtitle?: string;
  type: 'Manual' | 'Category' | 'Media';
  categoryId?: string;
  categoryName?: string;
  gridColumns: number; // 1, 2, or 4
  displayOrder: number;
  isActive: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  linkUrl?: string;
  createdAt: string;
  items: FeaturedSectionItem[];
}

export interface FeaturedSectionItem {
  id: string;
  productId: string;
  productName: string;
  productSlug?: string;
  productImage?: string;
  productPrice: number;
  overlayText?: string;
  linkUrl?: string;
  imageUrl?: string;
  displayOrder: number;
}

export interface CreateFeaturedSectionRequest {
  title: string;
  subtitle?: string;
  type: 'Manual' | 'Category' | 'Media';
  categoryId?: string;
  gridColumns: number;
  displayOrder: number;
  isActive: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  linkUrl?: string;
  items: CreateFeaturedSectionItemRequest[];
}

export interface CreateFeaturedSectionItemRequest {
  productId: string;
  overlayText?: string;
  linkUrl?: string;
  imageUrl?: string;
  displayOrder: number;
}

// ─── Inventory ──────────────────────────────────────────────────────────────

export interface InventoryItem {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  sku: string;
  color: string;
  size: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface BulkUpdateStockRequest {
  items: { variantId: string; quantity: number }[];
}

// ─── Inventory Reasons ──────────────────────────────────────────────────────

export interface InventoryReason {
  id: string;
  name: string;
  description?: string;
  type: 'Receipt' | 'Issue' | 'Both';
  isActive: boolean;
  createdAt: string;
}

export interface CreateInventoryReasonRequest {
  name: string;
  description?: string;
  type: 'Receipt' | 'Issue' | 'Both';
  isActive: boolean;
}

// ─── Good Receipt / Good Issue ──────────────────────────────────────────────

export interface GoodReceiptRequest {
  items: { variantId: string; quantity: number }[];
  reasonId?: string;
  note?: string;
}

export interface GoodIssueRequest {
  items: { variantId: string; quantity: number }[];
  reasonId?: string;
  note?: string;
}

// ─── Transaction History ────────────────────────────────────────────────────

export interface InventoryTransactionRecord {
  id: string;
  productVariantId: string;
  productName: string;
  sku: string;
  color: string;
  size: string;
  quantityChanged: number;
  transactionType: string;
  reasonName?: string;
  note?: string;
  createdByUserId?: string;
  createdAt: string;
}

export interface PaginatedTransactions {
  total: number;
  page: number;
  pageSize: number;
  data: InventoryTransactionRecord[];
}


