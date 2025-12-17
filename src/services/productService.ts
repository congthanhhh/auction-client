// src/services/productService.ts

import axiosClient from "@/lib/axios";
import type { CreateProductRequest, CreateProductResponse, Product, ProductListResponse } from "@/types/product";

export const productService = {
    // GET single product
    getProduct(productId: number) {
        return axiosClient.get<CreateProductResponse>(`/products/${productId}`);
    },

    // GET list products với pagination
    getProducts(params: { page?: number; size?: number; categoryId?: number }) {
        return axiosClient.get<ProductListResponse>('/products', { params });
    },

    // POST create product
    createProduct(data: CreateProductRequest) {
        return axiosClient.post<CreateProductResponse>('/products', data);
    },

    // PUT update product
    updateProduct(productId: number, data: Partial<CreateProductRequest>) {
        return axiosClient.put<CreateProductResponse>(`/products/${productId}`, data);
    },

    // DELETE product
    deleteProduct(productId: number) {
        return axiosClient.delete(`/products/${productId}`);
    },

    // GET categories
    getCategories() {
        return axiosClient.get<any>('/categories');
    }
};
