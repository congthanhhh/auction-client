// src/types/cart.ts

import type { Product } from './product';

export interface CartItem {
  id: number;
  auctionId: number;
  product: Product;
  winningPrice: number;
  wonAt: string;
  isPaid: boolean;
  paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  deliveryStatus: 'PENDING_PAYMENT' | 'PAID' | 'SHIPPING' | 'DELIVERED';
  addedToCartAt: string;
}

export interface CartResponse {
  code: number;
  message: string;
  data: CartItem[];
}

export interface AddToCartRequest {
  auctionId: number;
}

export interface RemoveFromCartRequest {
  cartItemId: number;
}

export interface CheckoutRequest {
  cartItemIds: number[];
  paymentMethod: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'COD';
}

export interface CheckoutResponse {
  code: number;
  message: string;
  data: {
    orderId: string;
    totalAmount: number;
    paymentUrl?: string;
  };
}
