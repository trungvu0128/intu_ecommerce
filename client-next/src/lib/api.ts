import axios, { AxiosError, AxiosInstance } from 'axios';
import { 
  LoginRequest, 
  RegisterRequest, 
  User, 
  Product, 
  Category, 
  Basket,
  Order, 
  CheckoutDto, 
  ExternalAuthRequest,
  Address,
  ApiResponse,
  OrderCalculationRequest,
  OrderCalculationResponse,
  CartDto,
  AddToCartRequest,
  SyncCartRequest,
  UserProfileDto,
  UpdateProfileRequest,
  ChangePasswordRequest,
  TokenResponse,
} from '../types';

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7101',
  headers: {
    'Content-Type': 'application/json',
  },
  proxy: false, // Disable proxy to avoid DeprecationWarning: url.parse()
});

// Handle self-signed certificates in development (Server-side only)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  try {
    const https = require('https');
    api.defaults.httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });
  } catch (error) {
    console.error('Failed to configure https agent', error);
  }
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Primary source: dedicated 'token' key (kept in sync by setUser)
      let token = localStorage.getItem('token');

      // Fallback: read from Zustand persisted state (handles page-refresh case)
      if (!token) {
        try {
          const raw = localStorage.getItem('auth-storage');
          if (raw) {
            const parsed = JSON.parse(raw);
            token = parsed?.state?.token ?? null;
            // Re-sync so subsequent requests skip this fallback
            if (token) localStorage.setItem('token', token);
          }
        } catch {
          // ignore JSON parse errors
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized — token expired or invalid
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Dynamically import to avoid circular dependency
      import('@/store/useAuthStore').then(({ useAuthStore }) => {
        useAuthStore.getState().logout();
      });
    }
    return Promise.reject(error);
  }
);

// API Services
export const AuthService = {
  /** Returns TokenResponse — caller MUST call useAuthStore.setUser() to persist the token */
  login: (data: LoginRequest) =>
    api.post<ApiResponse<TokenResponse>>('/api/Auth/login', data).then(res => res.data.data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<TokenResponse>>('/api/Auth/register', data).then(res => res.data.data),

  /** Returns TokenResponse — caller MUST call useAuthStore.setUser() to persist the token */
  firebaseLogin: (idToken: string) =>
    api.post<ApiResponse<TokenResponse>>('/api/Auth/firebase-login', { idToken }).then(res => res.data.data),

  me: () =>
    api.get<ApiResponse<User>>('/api/Auth/me').then(res => res.data.data),

  /** No-op — token cleanup is owned by useAuthStore.logout() */
  logout: () => {},
};

export const UserService = {
  /** GET /api/users/me — fetch full profile (gender, dob, avatarUrl, etc.) */
  getProfile: () =>
    api.get<ApiResponse<UserProfileDto>>('/api/users/me').then(res => res.data.data),

  /** PATCH /api/users/me — partial update, only send changed fields */
  updateProfile: (data: UpdateProfileRequest) =>
    api.patch<ApiResponse<UserProfileDto>>('/api/users/me', data).then(res => res.data.data),

  /** POST /api/users/me/change-password */
  changePassword: (data: ChangePasswordRequest) =>
    api.post<ApiResponse<{ message: string }>>('/api/users/me/change-password', data).then(res => res.data.data),
};

export const ProductService = {
  getAll: (params?: { search?: string; categoryId?: string; isFeatured?: boolean; page?: number; pageSize?: number }) => 
    api.get<ApiResponse<Product[]>>('/api/Products', { params }).then(res => res.data.data || []),
  getAllAdmin: (params?: { search?: string; categoryId?: string; isFeatured?: boolean; page?: number; pageSize?: number }) => 
    api.get<ApiResponse<Product[]>>('/api/admin/products', { params: { ...params, isAdmin: true } }).then(res => res.data.data || []),
  getById: (id: string) => api.get<ApiResponse<Product>>(`/api/Products/${id}`).then(res => res.data.data),
  getBySlug: (slug: string) => api.get<ApiResponse<Product>>(`/api/Products/slug/${slug}`).then(res => res.data.data),
  getFeatured: () => api.get<ApiResponse<Product[]>>('/api/Products', { params: { isFeatured: true } }).then(res => res.data.data || []),
};

export const CategoryService = {
  getAll: () => api.get<ApiResponse<Category[]>>('/api/Categories').then(res => res.data.data || []),
  getById: (id: string) => api.get<ApiResponse<Category>>(`/api/Categories/${id}`).then(res => res.data.data),
};

export const BasketService = {
  get: (id: string) => api.get<ApiResponse<Basket>>(`/api/Basket?id=${id}`).then(res => res.data.data),
  update: (basket: Basket) => api.post<ApiResponse<Basket>>('/api/Basket', basket).then(res => res.data.data),
  delete: (id: string) => api.delete(`/api/Basket?id=${id}`),
};

export const OrderService = {
  calculate: (data: OrderCalculationRequest) => api.post<ApiResponse<OrderCalculationResponse>>('/api/Orders/calculate', data).then(res => res.data.data),
  create: (data: CheckoutDto) => api.post<ApiResponse<Order>>('/api/Orders/checkout', data).then(res => res.data.data),
  getAll: () => api.get<ApiResponse<Order[]>>('/api/Orders').then(res => res.data.data || []),
  getById: (id: string) => api.get<ApiResponse<Order>>(`/api/Orders/${id}`).then(res => res.data.data),
  getMyOrders: () => api.get<ApiResponse<Order[]>>('/api/Orders/my-orders').then(res => res.data.data || []),
  cancelOrder: (id: string) => api.post(`/api/Orders/${id}/cancel`).then(res => res.data),
};

export const AddressService = {
  create: (address: Partial<Address>) => api.post<ApiResponse<Address>>('/api/Address', address).then(res => res.data.data),
  getById: (id: string) => api.get<ApiResponse<Address>>(`/api/Address/${id}`).then(res => res.data.data),
  getUserAddresses: () => api.get<ApiResponse<Address[]>>('/api/Address/user').then(res => res.data.data || []),
  delete: (id: string) => api.delete(`/api/Address/${id}`),
};

export const CartService = {
  get: () => api.get<ApiResponse<CartDto>>('/api/Cart').then(res => res.data.data),
  add: (data: AddToCartRequest) => api.post<ApiResponse<CartDto>>('/api/Cart', data).then(res => res.data.data),
  remove: (variantId: string) => api.delete<ApiResponse<CartDto>>(`/api/Cart/item/${variantId}`).then(res => res.data.data),
  sync: (data: SyncCartRequest) => api.post<ApiResponse<CartDto>>('/api/Cart/sync', data).then(res => res.data.data),
  clear: () => api.delete('/api/Cart'),
};

export const PaymentService = {
  getCheckoutUrl: (data: {
    paymentMethod: string;
    orderInvoiceNumber: string;
    orderAmount: number;
    currency?: string;
    orderDescription: string;
    successUrl?: string;
    errorUrl?: string;
    cancelUrl?: string;
    customerId?: string;
  }) => api.post<{ checkoutUrl: string; fields: Record<string, string> }>('/api/Payment/checkout-url', data).then(res => res.data),
};

export default api;
