export type Language = 'ka' | 'en';

export interface Category {
  id: string;
  slug: string;
  nameKa: string;
  nameEn: string;
  iconName: string;
  descriptionKa: string;
  descriptionEn: string;
}

export interface ProductSpec {
  labelKa: string;
  labelEn: string;
  valueKa: string;
  valueEn: string;
}

export interface Product {
  id: string;
  nameKa: string;
  nameEn: string;
  categoryId: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  descriptionKa: string;
  descriptionEn: string;
  specs: ProductSpec[];
  isFeatured?: boolean;
  isSpecialOffer?: boolean;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  sizes?: string[];
  wheelSize?: string;
  weightKg?: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface OrderItem {
  productId: string;
  nameKa: string;
  nameEn: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'cod' | 'card';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  isAdmin: boolean;
  provider: 'google' | 'email';
}

export type ActiveView = 'home' | 'shop' | 'contact' | 'checkout' | 'admin';
