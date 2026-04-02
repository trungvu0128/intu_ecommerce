// Auto-generated types from Swagger schema

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  isFeatured: boolean;
  isActive: boolean;
  sizeChartImage?: string;
  categoryId: string;
  brandId: string;
  variants: ProductVariant[];
  images: ProductImage[];
  category?: Category;
  categories?: Category[];
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
  thumbnailUrl?: string;
  isMain: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug?: string;
  isActive?: boolean;
}

export interface Basket {
  id: string;
  items: BasketItem[];
}

export interface BasketItem {
  id: string;
  productVariantId: string;
  productName: string;
  price: number;
  quantity: number;
  pictureUrl: string;
  category: string;
  brand: string;
  type: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  token?: string;
  roles?: string[];
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  password?: string;
  phoneNumber?: string;
}

export interface ExternalAuthRequest {
  idToken: string;
}

export interface CheckoutDto {
  userId?: string | null;
  shippingAddressId?: string;
  recipientName?: string;
  phoneNumber?: string;
  email?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  couponCode?: string | null;
  paymentMethod: PaymentMethod;
  guestItems?: CheckoutItemDto[];
}

export interface CheckoutItemDto {
  productVariantId: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  subTotal: number;
  shippingCost: number;
  discountAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  items: OrderItem[];
  shippingAddress: string;
  billingAddress: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
  total: number;
}

export enum OrderStatus {
  Pending = 0,
  PaymentReceived = 1,
  PaymentFailed = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5,
  Processing = 6
}

export enum PaymentMethod {
  COD = 0,
  CreditCard = 1,
  BankTransfer = 2
}

export enum PaymentStatus {
  Pending = 0,
  Paid = 1,
  Failed = 2,
  Completed = 3,
  Refunded = 4
}

export interface Address {
  id: string;
  recipientName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface OrderCalculationRequest {
  items: { productVariantId: string; quantity: number }[];
  shippingAddressId?: string | null;
  couponCode?: string | null;
}

export interface OrderCalculationResponse {
  subTotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
}

export interface CartDto {
  id: string;
  items: any[];
}

export interface AddToCartRequest {
  productVariantId?: string;
  productId?: string;
  quantity: number;
}

export interface SyncCartRequest {
  items: { productVariantId?: string; productId?: string; quantity: number }[];
}

export interface UserProfileDto {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface TokenResponse {
  token: string;
  refreshToken?: string;
  accessToken: string;
  userEmail: string;
  fullName: string;
  roles: string[];
}

