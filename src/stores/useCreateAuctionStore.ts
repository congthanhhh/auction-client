// src/stores/useCreateAuctionStore.ts

import { create } from 'zustand';
import { productService } from '@/services/productService';
import { auctionService } from '@/services/auctionService';
import type { CreateProductRequest, CreateProductResponse, Category } from '@/types/product';
import type { CreateAuctionSessionRequest, CreateAuctionSessionResponse } from '@/types/auction';

interface CreateAuctionState {
    // Step tracking
    currentStep: 1 | 2;
    
    // Product data (Step 1)
    createdProduct: CreateProductResponse | null;
    categories: Category[];
    
    // Loading states
    isCreatingProduct: boolean;
    isCreatingSession: boolean;
    isFetchingCategories: boolean;
    
    // Error handling
    error: string | null;
    
    // Success state
    createdSession: CreateAuctionSessionResponse | null;
    
    // Actions
    fetchCategories: () => Promise<void>;
    createProduct: (data: CreateProductRequest) => Promise<boolean>;
    createAuctionSession: (data: Omit<CreateAuctionSessionRequest, 'productId'>) => Promise<boolean>;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    clearError: () => void;
    reset: () => void;
}

export const useCreateAuctionStore = create<CreateAuctionState>((set, get) => ({
    // Initial state
    currentStep: 1,
    createdProduct: null,
    categories: [],
    isCreatingProduct: false,
    isCreatingSession: false,
    isFetchingCategories: false,
    error: null,
    createdSession: null,

    // Fetch categories cho dropdown
    fetchCategories: async () => {
        set({ isFetchingCategories: true, error: null });
        try {
            const response = await productService.getCategories();
            // API có thể trả về { result: [...] } hoặc trực tiếp array
            const categoriesData = response.data.result || response.data;
            set({
                categories: categoriesData,
                isFetchingCategories: false
            });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            set({
                error: err.response?.data?.message || 'Không thể tải danh mục',
                isFetchingCategories: false
            });
        }
    },

    // Step 1: Create Product
    createProduct: async (data: CreateProductRequest) => {
        set({ isCreatingProduct: true, error: null });
        try {
            const response = await productService.createProduct(data);
            // Response từ Postman: direct object, không có wrapper
            set({
                createdProduct: response.data,
                isCreatingProduct: false,
                currentStep: 2 // Tự động chuyển sang step 2
            });
            return true;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            set({
                error: err.response?.data?.message || 'Tạo sản phẩm thất bại',
                isCreatingProduct: false
            });
            return false;
        }
    },

    // Step 2: Create Auction Session (sử dụng productId từ step 1)
    createAuctionSession: async (data: Omit<CreateAuctionSessionRequest, 'productId'>) => {
        const { createdProduct } = get();
        
        if (!createdProduct) {
            set({ error: 'Vui lòng tạo sản phẩm trước' });
            return false;
        }

        set({ isCreatingSession: true, error: null });
        try {
            const response = await auctionService.createAuctionSession({
                ...data,
                productId: createdProduct.id
            });
            // Response từ Postman: direct object
            set({
                createdSession: response.data,
                isCreatingSession: false
            });
            return true;
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            set({
                error: err.response?.data?.message || 'Tạo phiên đấu giá thất bại',
                isCreatingSession: false
            });
            return false;
        }
    },

    // Navigation
    goToNextStep: () => {
        const { currentStep, createdProduct } = get();
        if (currentStep === 1 && createdProduct) {
            set({ currentStep: 2 });
        }
    },

    goToPreviousStep: () => {
        const { currentStep } = get();
        if (currentStep === 2) {
            set({ currentStep: 1 });
        }
    },

    // Utilities
    clearError: () => set({ error: null }),
    
    reset: () => set({
        currentStep: 1,
        createdProduct: null,
        categories: [],
        isCreatingProduct: false,
        isCreatingSession: false,
        isFetchingCategories: false,
        error: null,
        createdSession: null
    })
}));
