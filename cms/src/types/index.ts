// Auto-generated types from Swagger schema

export interface ApiResponse<T> {
  correlationId: string;
  status: string;
  code: number;
  data: T;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  isFeatured: boolean;
  categoryId: string;
  brandId: string;
  variants: ProductVariant[];
  images: ProductImage[];
  category?: Category;
}

export interface ProductVariant {
  id: string;
  sku: string;
  color: string;
  size: string;
  priceAdjustment: number;
  stockQuantity: number;
}

export interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  token?: string;
  roles?: string[];
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiration: string;
  userEmail: string;
  fullName: string;
  roles: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: Address;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productImage: string;
}

export interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  street: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}
