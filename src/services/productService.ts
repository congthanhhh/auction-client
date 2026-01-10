// src/services/productService.ts

import axiosClient from "@/lib/axios";
import type { CreateProductRequest, CreateProductResponse, Product, ProductListResponse, ProductSearchRequest, ProductResponse, ProductUpdateRequest } from "@/types/product";
import type { PageResponse } from "@/types/common";

export const productService = {
    // GET single product
    getProduct(productId: number) {
        return axiosClient.get<ProductResponse>(`/products/${productId}`);
    },

    // GET product by ID
    getProductById(productId: number) {
        return axiosClient.get<ProductResponse>(`/products/${productId}`);
    },

    // GET list products với pagination
    getProducts(params: { page?: number; size?: number; categoryId?: number }) {
        return axiosClient.get<ProductListResponse>('/products', { params });
    },

    // GET my products (seller's products)
    getMyProducts() {
        return axiosClient.get<Product[]>('/products/my-products');
    },

    // POST create product
    createProduct(data: CreateProductRequest) {
        return axiosClient.post<CreateProductResponse>('/products', data);
    },

    // PUT update product
    updateProduct(productId: number, data: ProductUpdateRequest) {
        return axiosClient.put<ProductResponse>(`/products/${productId}`, data);
    },

    // PATCH delete product (soft delete - set isActive=false)
    deleteProduct(productId: number) {
        return axiosClient.patch(`/products/${productId}`);
    },

    // PATCH restore product (set isActive=true)
    restoreProduct(productId: number) {
        return axiosClient.patch(`/products/${productId}/restore`);
    },

    // GET categories
    getCategories() {
        return axiosClient.get<any>('/categories');
    },

    // ADMIN: Search products with filters and pagination
    searchProductsAdmin(request: ProductSearchRequest, page: number = 1, size: number = 10) {
        return axiosClient.get<PageResponse<ProductResponse>>('/products/admin/search', {
            params: {
                ...request,
                page,
                size
            }
        });
    },

    // ADMIN: Verify (approve/reject) product
    verifyProduct(productId: number, isApproved: boolean) {
        return axiosClient.patch<string>(`/products/admin/${productId}/verify`, null, {
            params: { isApproved }
        });
    },

    // ADMIN: Update product by admin
    updateProductByAdmin(productId: number, data: ProductUpdateRequest) {
        return axiosClient.put<ProductResponse>(`/products/admin/update/${productId}`, data);
    }
};
