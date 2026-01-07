// src/types/product.ts

import type { SimpleUserResponse } from "./user";

export type ProductStatus = 'WAITING_FOR_APPROVAL' | 'ACTIVE' | 'REJECTED' | 'BANNED';

export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface CategoryResponse {
    id: number;
    name: string;
    description: string;
}

export interface Image {
    id: number;
    publicId: string;
    url: string;
}

export interface ProductSearchRequest {
    keyword?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    status?: ProductStatus;
    sellerId?: string;
    isActive?: boolean;
}

export interface Seller {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface ProductImage {
    id: number;
    url: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    startPrice: number;
    createdAt: string;
    category: CategoryResponse;
    seller: SimpleUserResponse;
    status: ProductStatus;
    attributes: string;  // Backend expects String, not array
    images: Image[];
}

export interface ProductResponse {
    id: number;
    name: string;
    description: string;
    startPrice: number;
    createdAt: string;
    category: CategoryResponse;
    seller: SimpleUserResponse;
    status: ProductStatus;
    attributes: string;
    images: Image[];
    isActive?: boolean;
}

export interface CreateProductRequest {
    name: string;
    description: string;
    startPrice: number;
    categoryId: number;
    attributes: string;  // Backend expects String: "key1:value1,key2:value2"
    imageIds?: number[] | null;
}

export interface CreateProductResponse {
    id: number;
    name: string;
    description: string;
    startPrice: number;
    createdAt: string;
    category: Category;
    seller: SimpleUserResponse;
    status: ProductStatus;
    attributes: string;  // Backend returns String
    images: ProductImage[];
}

export interface ProductListResponse {
    code: number;
    message: string;
    result: {
        content: Product[];
        totalPages: number;
        totalElements: number;
        size: number;
        number: number;
    };
}

