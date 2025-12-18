// src/stores/useCartStore.ts

import { create } from 'zustand';
import { cartService } from '@/services/cartService';
import type { CartItem } from '@/types/cart';
import { toast } from 'sonner';

// Mock data cho development
const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    auctionId: 101,
    product: {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB - Titan Tự Nhiên',
      description: 'iPhone 15 Pro Max mới nguyên seal, chính hãng VN/A',
      startPrice: 25000000,
      createdAt: '2024-12-15T10:00:00Z',
      category: { id: 1, name: 'Điện thoại', description: 'Điện thoại di động' },
      seller: {
        username: 'seller1',
        firstName: 'Nguyễn',
        lastName: 'Văn A',
        email: 'seller1@example.com',
      },
      attributes: 'Màu:Titan Tự Nhiên,Bộ nhớ:256GB,Chip:A17 Pro',
      images: [
        { id: 1, url: 'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/09/13/image-removebg-preview-3.png' },
      ],
    },
    winningPrice: 28500000,
    wonAt: '2024-12-17T15:30:00Z',
    isPaid: false,
    paymentStatus: 'PENDING',
    deliveryStatus: 'PENDING_PAYMENT',
    addedToCartAt: '2024-12-17T15:30:00Z',
  },
  {
    id: 2,
    auctionId: 102,
    product: {
      id: 2,
      name: 'MacBook Pro 14" M3 Pro 18GB 512GB',
      description: 'MacBook Pro 14 inch M3 Pro, 18GB RAM, 512GB SSD - Chính hãng Apple',
      startPrice: 45000000,
      createdAt: '2024-12-16T10:00:00Z',
      category: { id: 2, name: 'Laptop', description: 'Laptop & máy tính xách tay' },
      seller: {
        username: 'seller2',
        firstName: 'Trần',
        lastName: 'Thị B',
        email: 'seller2@example.com',
      },
      attributes: 'Chip:M3 Pro,RAM:18GB,SSD:512GB,Màn hình:14 inch',
      images: [
        { id: 2, url: 'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/11/07/mbp14-spacegray-select-202310.png' },
      ],
    },
    winningPrice: 48000000,
    wonAt: '2024-12-16T18:00:00Z',
    isPaid: true,
    paymentStatus: 'COMPLETED',
    deliveryStatus: 'PAID',
    addedToCartAt: '2024-12-16T18:00:00Z',
  },
  {
    id: 3,
    auctionId: 103,
    product: {
      id: 3,
      name: 'AirPods Pro 2 (USB-C)',
      description: 'AirPods Pro thế hệ 2 với cổng sạc USB-C, chống ồn chủ động',
      startPrice: 5000000,
      createdAt: '2024-12-17T08:00:00Z',
      category: { id: 4, name: 'Phụ kiện', description: 'Phụ kiện công nghệ' },
      seller: {
        username: 'seller3',
        firstName: 'Lê',
        lastName: 'Văn C',
        email: 'seller3@example.com',
      },
      attributes: 'Kết nối:Bluetooth 5.3,Chống ồn:Có,Cổng sạc:USB-C',
      images: [
        { id: 3, url: 'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2023/09/26/mtjv3.png' },
      ],
    },
    winningPrice: 5500000,
    wonAt: '2024-12-17T12:00:00Z',
    isPaid: true,
    paymentStatus: 'COMPLETED',
    deliveryStatus: 'SHIPPING',
    addedToCartAt: '2024-12-17T12:00:00Z',
  },
  {
    id: 4,
    auctionId: 104,
    product: {
      id: 4,
      name: 'iPad Pro 11" M2 WiFi 128GB',
      description: 'iPad Pro 11 inch chip M2, màn hình Liquid Retina',
      startPrice: 18000000,
      createdAt: '2024-12-14T10:00:00Z',
      category: { id: 3, name: 'Tablet', description: 'Máy tính bảng' },
      seller: {
        username: 'seller4',
        firstName: 'Phạm',
        lastName: 'Văn D',
        email: 'seller4@example.com',
      },
      attributes: 'Chip:M2,Bộ nhớ:128GB,Kết nối:WiFi,Màn hình:11 inch',
      images: [
        { id: 4, url: 'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2022/10/19/ipad-pro-11-select-wifi-spacegray-202210.png' },
      ],
    },
    winningPrice: 19500000,
    wonAt: '2024-12-14T16:00:00Z',
    isPaid: true,
    paymentStatus: 'COMPLETED',
    deliveryStatus: 'DELIVERED',
    addedToCartAt: '2024-12-14T16:00:00Z',
  },
  {
    id: 5,
    auctionId: 105,
    product: {
      id: 5,
      name: 'Samsung Galaxy S24 Ultra 256GB',
      description: 'Samsung Galaxy S24 Ultra, Snapdragon 8 Gen 3',
      startPrice: 28000000,
      createdAt: '2024-12-18T09:00:00Z',
      category: { id: 1, name: 'Điện thoại', description: 'Điện thoại di động' },
      seller: {
        username: 'seller5',
        firstName: 'Hoàng',
        lastName: 'Thị E',
        email: 'seller5@example.com',
      },
      attributes: 'Màu:Titanium Black,Bộ nhớ:256GB,Chip:Snapdragon 8 Gen 3',
      images: [
        { id: 5, url: 'https://cdn.hoanghamobile.com/i/productlist/dsp/Uploads/2024/01/17/image-removebg-preview-49.png' },
      ],
    },
    winningPrice: 29800000,
    wonAt: '2024-12-18T10:30:00Z',
    isPaid: false,
    paymentStatus: 'PENDING',
    deliveryStatus: 'PENDING_PAYMENT',
    addedToCartAt: '2024-12-18T10:30:00Z',
  },
];

interface CartState {
  cartItems: CartItem[];
  selectedItems: number[];
  isLoading: boolean;
  
  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (auctionId: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  removeMultiple: (cartItemIds: number[]) => Promise<void>;
  toggleSelectItem: (cartItemId: number) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  getTotalAmount: () => number;
  getSelectedItemsCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: MOCK_CART_ITEMS, // Mock data ban đầu
  selectedItems: [],
  isLoading: false,

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      // TODO: Uncomment khi có API thật
      // const response = await cartService.getCart();
      // set({ cartItems: response.data });
      
      // Mock delay để giống real API
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ cartItems: MOCK_CART_ITEMS });
    } catch (error: unknown) {
      console.error('Failed to fetch cart:', error);
      toast.error('Không thể tải giỏ hàng');
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (auctionId: number) => {
    try {
      const response = await cartService.addToCart({ auctionId });
      set({ cartItems: response.data });
      toast.success('Đã thêm vào giỏ hàng');
    } catch (error: unknown) {
      console.error('Failed to add to cart:', error);
      const errorMessage = error instanceof Error ? error.message : 'Không thể thêm vào giỏ hàng';
      toast.error(errorMessage);
    }
  },

  removeFromCart: async (cartItemId: number) => {
    try {
      const response = await cartService.removeFromCart({ cartItemId });
      set({ 
        cartItems: response.data,
        selectedItems: get().selectedItems.filter(id => id !== cartItemId)
      });
      toast.success('Đã xóa khỏi giỏ hàng');
    } catch (error: unknown) {
      console.error('Failed to remove from cart:', error);
      toast.error('Không thể xóa khỏi giỏ hàng');
    }
  },

  removeMultiple: async (cartItemIds: number[]) => {
    try {
      const response = await cartService.removeMultiple(cartItemIds);
      set({ 
        cartItems: response.data,
        selectedItems: []
      });
      toast.success(`Đã xóa ${cartItemIds.length} sản phẩm`);
    } catch (error: unknown) {
      console.error('Failed to remove multiple items:', error);
      toast.error('Không thể xóa các sản phẩm');
    }
  },

  toggleSelectItem: (cartItemId: number) => {
    const { selectedItems } = get();
    if (selectedItems.includes(cartItemId)) {
      set({ selectedItems: selectedItems.filter(id => id !== cartItemId) });
    } else {
      set({ selectedItems: [...selectedItems, cartItemId] });
    }
  },

  toggleSelectAll: () => {
    const { cartItems, selectedItems } = get();
    // Chỉ chọn những items có deliveryStatus = PENDING_PAYMENT
    const selectableItems = cartItems.filter(item => item.deliveryStatus === 'PENDING_PAYMENT');
    
    if (selectedItems.length === selectableItems.length && selectableItems.length > 0) {
      set({ selectedItems: [] });
    } else {
      set({ selectedItems: selectableItems.map(item => item.id) });
    }
  },

  clearSelection: () => {
    set({ selectedItems: [] });
  },

  getTotalAmount: () => {
    const { cartItems, selectedItems } = get();
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.winningPrice, 0);
  },

  getSelectedItemsCount: () => {
    return get().selectedItems.length;
  },
}));
