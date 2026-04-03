import type {
  AdminDashboard,
  Banner,
  CreateBannerRequest,
  BlogCategory,
  BlogPost,
  CreateBlogPostRequest,
  AdminCoupon,
  CreateCouponRequest,
  AdminCategory,
  CreateCategoryRequest,
  AdminUser,
  CreateUserRequest,
  PaginatedResponse,
  FeaturedSection,
  CreateFeaturedSectionRequest,
  InventoryItem,
  BulkUpdateStockRequest,
  InventoryReason,
  CreateInventoryReasonRequest,
  GoodReceiptRequest,
  GoodIssueRequest,
  PaginatedTransactions,
} from '@/types/admin';
import type { ApiResponse, Order } from '@/types';

// Reuse the same base Axios instance (with auth interceptor)
import api from './api';

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const AdminService = {
  getDashboard: () =>
    api.get<ApiResponse<AdminDashboard>>('/api/admin/dashboard').then(r => r.data.data),

  // ─── Products (wraps existing admin product endpoints) ──────────────────────
  getProducts: (params?: { search?: string; categoryId?: string; page?: number; pageSize?: number }) =>
    api.get<ApiResponse<any[]>>('/api/admin/products', { params: { ...params, isAdmin: true } }).then(r => r.data.data ?? []),

  getProductById: (id: string) =>
    api.get<ApiResponse<any>>(`/api/admin/products/${id}`).then(r => r.data.data),

  createProduct: (dto: any) =>
    api.post<ApiResponse<any>>('/api/admin/products', dto).then(r => r.data.data),

  createProductWithImages: (formData: FormData) =>
    api.post<ApiResponse<any>>('/api/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data.data),

  updateProduct: (id: string, dto: any) =>
    api.put(`/api/admin/products/${id}`, dto),

  updateProductWithImages: (id: string, formData: FormData) =>
    api.put(`/api/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteProduct: (id: string) =>
    api.delete(`/api/admin/products/${id}`),

  updateStock: (variantId: string, quantity: number) =>
    api.patch('/api/admin/products/stock', { variantId, quantity }),

  importProducts: (formData: FormData) => {
    return api.post<ApiResponse<{ success: number; failed: number; errors: string[]; importedProducts?: any[] }>>('/api/admin/products/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data.data);
  },

  // ─── Banners ─────────────────────────────────────────────────────────────────
  getBanners: () =>
    api.get<ApiResponse<Banner[]>>('/api/admin/cms/banners').then(r => r.data.data ?? []),

  createBanner: (dto: CreateBannerRequest) =>
    api.post<ApiResponse<Banner>>('/api/admin/cms/banners', dto).then(r => r.data.data),

  updateBanner: (id: string, dto: CreateBannerRequest) =>
    api.put(`/api/admin/cms/banners/${id}`, dto),

  deleteBanner: (id: string) =>
    api.delete(`/api/admin/cms/banners/${id}`),

  // ─── Blog Categories ──────────────────────────────────────────────────────────
  getBlogCategories: () =>
    api.get<ApiResponse<BlogCategory[]>>('/api/admin/cms/blog-categories').then(r => r.data.data ?? []),

  createBlogCategory: (dto: { name: string; slug: string }) =>
    api.post<ApiResponse<BlogCategory>>('/api/admin/cms/blog-categories', dto).then(r => r.data.data),

  updateBlogCategory: (id: string, dto: { name: string; slug: string }) =>
    api.put(`/api/admin/cms/blog-categories/${id}`, dto),

  deleteBlogCategory: (id: string) =>
    api.delete(`/api/admin/cms/blog-categories/${id}`),

  // ─── Blog Posts ───────────────────────────────────────────────────────────────
  getBlogPosts: (isPublished?: boolean) =>
    api.get<ApiResponse<BlogPost[]>>('/api/admin/cms/blogs', { params: { isPublished } }).then(r => r.data.data ?? []),

  getBlogPost: (id: string) =>
    api.get<ApiResponse<BlogPost>>(`/api/admin/cms/blogs/${id}`).then(r => r.data.data),

  createBlogPost: (dto: CreateBlogPostRequest) =>
    api.post<ApiResponse<BlogPost>>('/api/admin/cms/blogs', dto).then(r => r.data.data),

  updateBlogPost: (id: string, dto: CreateBlogPostRequest) =>
    api.put(`/api/admin/cms/blogs/${id}`, dto),

  deleteBlogPost: (id: string) =>
    api.delete(`/api/admin/cms/blogs/${id}`),

  // ─── Coupons ──────────────────────────────────────────────────────────────────
  getCoupons: () =>
    api.get<ApiResponse<AdminCoupon[]>>('/api/admin/coupons').then(r => r.data.data ?? []),

  createCoupon: (dto: CreateCouponRequest) =>
    api.post<ApiResponse<AdminCoupon>>('/api/admin/coupons', dto).then(r => r.data.data),

  updateCoupon: (id: string, dto: CreateCouponRequest) =>
    api.put(`/api/admin/coupons/${id}`, dto),

  deleteCoupon: (id: string) =>
    api.delete(`/api/admin/coupons/${id}`),

  toggleCoupon: (id: string) =>
    api.patch(`/api/admin/coupons/${id}/toggle`),

  // ─── Categories ───────────────────────────────────────────────────────────────
  getAdminCategories: () =>
    api.get<ApiResponse<AdminCategory[]>>('/api/admin/categories').then(r => r.data.data ?? []),

  getCategoryById: (id: string) =>
    api.get<ApiResponse<AdminCategory>>(`/api/admin/categories/${id}`).then(r => r.data.data),

  createCategory: (dto: CreateCategoryRequest) =>
    api.post<ApiResponse<any>>('/api/admin/categories', dto).then(r => r.data.data),

  updateCategory: (id: string, dto: CreateCategoryRequest) =>
    api.put(`/api/admin/categories/${id}`, dto),

  deleteCategory: (id: string) =>
    api.delete(`/api/admin/categories/${id}`),

  updateCategoryProducts: (id: string, productIds: string[]) =>
    api.post(`/api/admin/categories/${id}/products`, productIds),

  // ─── Orders ───────────────────────────────────────────────────────────────────
  getAdminOrders: (status?: string) =>
    api.get<ApiResponse<Order[]>>('/api/admin/orders', { params: { status } }).then(r => r.data.data ?? []),

  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/api/admin/orders/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' },
    }),

  updateOrderInfo: (id: string, dto: { status?: string, paymentStatus?: string, shippingAddress?: string }) =>
    api.put(`/api/admin/orders/${id}`, dto),

  cancelOrder: (id: string) =>
    api.post(`/api/admin/orders/${id}/cancel`),

  // ─── Users ────────────────────────────────────────────────────────────────────
  getUsers: (params?: { search?: string; role?: string; page?: number; pageSize?: number }) =>
    api.get<ApiResponse<PaginatedResponse<AdminUser>>>('/api/admin/users', { params }).then(r => r.data.data),

  createUser: (dto: CreateUserRequest) =>
    api.post<ApiResponse<AdminUser>>('/api/admin/users', dto).then(r => r.data.data),

  updateUserRole: (id: string, role: string) =>
    api.patch(`/api/admin/users/${id}/role`, { role }),

  toggleUserActive: (id: string) =>
    api.patch(`/api/admin/users/${id}/toggle-active`),

  // ─── Featured Sections ──────────────────────────────────────────────────────
  getFeaturedSections: () =>
    api.get<ApiResponse<FeaturedSection[]>>('/api/admin/cms/featured-sections').then(r => r.data.data ?? []),

  getFeaturedSection: (id: string) =>
    api.get<ApiResponse<FeaturedSection>>(`/api/admin/cms/featured-sections/${id}`).then(r => r.data.data),

  createFeaturedSection: (dto: CreateFeaturedSectionRequest) =>
    api.post<ApiResponse<FeaturedSection>>('/api/admin/cms/featured-sections', dto).then(r => r.data.data),

  updateFeaturedSection: (id: string, dto: CreateFeaturedSectionRequest) =>
    api.put(`/api/admin/cms/featured-sections/${id}`, dto),

  deleteFeaturedSection: (id: string) =>
    api.delete(`/api/admin/cms/featured-sections/${id}`),

  // ─── Inventory ──────────────────────────────────────────────────────────────
  getInventory: (params?: { search?: string; lowStockThreshold?: number }) =>
    api.get<ApiResponse<InventoryItem[]>>('/api/admin/inventory', { params }).then(r => r.data.data ?? []),

  bulkUpdateStock: (dto: BulkUpdateStockRequest) =>
    api.patch('/api/admin/inventory/bulk-update', dto),

  createGoodReceipt: (dto: GoodReceiptRequest) =>
    api.post('/api/admin/inventory/good-receipt', dto),

  createGoodIssue: (dto: GoodIssueRequest) =>
    api.post('/api/admin/inventory/good-issue', dto),

  getTransactions: (params?: { variantId?: string; type?: string; from?: string; to?: string; page?: number; pageSize?: number }) =>
    api.get<ApiResponse<PaginatedTransactions>>('/api/admin/inventory/transactions', { params }).then(r => r.data.data),

  // ─── Inventory Reasons ────────────────────────────────────────────────────
  getInventoryReasons: (activeOnly?: boolean) =>
    api.get<ApiResponse<InventoryReason[]>>('/api/admin/inventory-reasons', { params: { activeOnly } }).then(r => r.data.data ?? []),

  createInventoryReason: (dto: CreateInventoryReasonRequest) =>
    api.post<ApiResponse<InventoryReason>>('/api/admin/inventory-reasons', dto).then(r => r.data.data),

  updateInventoryReason: (id: string, dto: CreateInventoryReasonRequest) =>
    api.put(`/api/admin/inventory-reasons/${id}`, dto),

  deleteInventoryReason: (id: string) =>
    api.delete(`/api/admin/inventory-reasons/${id}`),

  // ─── Uploads ──────────────────────────────────────────────────────────────
  uploadImage: (file: File, subfolder: string = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (subfolder) formData.append('subfolder', subfolder);
    return api.post<{ message: string; data: { originalUrl: string; thumbnailUrl: string } }>('/api/Upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data.data);
  },

  uploadVideo: (file: File, subfolder: string = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (subfolder) formData.append('subfolder', subfolder);
    return api.post<{ message: string; data: { url: string } }>('/api/Upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data.data);
  },
};

