// src/services/cartService.ts

import axiosInstance from '@/lib/axios';
import type { 
  CartResponse, 
  AddToCartRequest, 
  RemoveFromCartRequest,
  CheckoutRequest,
  CheckoutResponse 
} from '@/types/cart';

export const cartService = {
  // Lấy danh sách giỏ hàng
  getCart: async (): Promise<CartResponse> => {
    const response = await axiosInstance.get<CartResponse>('/cart');
    return response.data;
  },

  // Thêm sản phẩm vào giỏ hàng (sau khi đấu giá thành công)
  addToCart: async (data: AddToCartRequest): Promise<CartResponse> => {
    const response = await axiosInstance.post<CartResponse>('/cart/add', data);
    return response.data;
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (data: RemoveFromCartRequest): Promise<CartResponse> => {
    const response = await axiosInstance.delete<CartResponse>(`/cart/${data.cartItemId}`);
    return response.data;
  },

  // Thanh toán giỏ hàng
  checkout: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
    const response = await axiosInstance.post<CheckoutResponse>('/cart/checkout', data);
    return response.data;
  },

  // Xóa nhiều sản phẩm cùng lúc
  removeMultiple: async (cartItemIds: number[]): Promise<CartResponse> => {
    const response = await axiosInstance.post<CartResponse>('/cart/remove-multiple', {
      cartItemIds,
    });
    return response.data;
  },
};
