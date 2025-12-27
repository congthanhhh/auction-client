// src/types/product.ts

export interface Category {
    id: number;
    name: string;
    description: string;
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
    category: Category;
    seller: Seller;
    attributes: string;  // Backend expects String, not array
    images: ProductImage[];
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
    seller: Seller;
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

