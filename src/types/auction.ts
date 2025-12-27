// src/types/auction.ts

import type { Product, Category } from './product';

// Type alias cho response
export type CategoryResponse = Category;
export type ProductResponse = Product;

export interface HighestBidder {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface SimpleProductResponse {
    id: number;
    name: string;
    description: string;
    startPrice: number;
    images: Array<{ id: number; url: string }>;
}

export interface SimpleUserResponse {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

export type AuctionStatus = 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface AuctionSession {
    id: number;
    startTime: string;
    endTime: string;
    startPrice: number;
    currentPrice: number;
    buyNowPrice: number | null;
    status: AuctionStatus;
    product: SimpleProductResponse;
    highestBidder: SimpleUserResponse | null;
    reservePriceMet: boolean;
    myMaxBid: number | null;
}

// Response từ backend
export interface AuctionSessionResponse {
    id: number;
    startTime: string;
    endTime: string;
    startPrice: number;
    currentPrice: number;
    buyNowPrice: number | null;
    status: AuctionStatus;
    product: ProductResponse;  // Đổi từ SimpleProductResponse thành ProductResponse (Product đầy đủ)
    highestBidder: SimpleUserResponse | null;
    reservePriceMet: boolean;
    myMaxBid: number | null;
}

export interface CreateAuctionSessionRequest {
    productId: number;
    startTime: string; // ISO 8601 format: "2025-12-17T22:48:00"
    endTime: string;
    reservePrice: number; // Giá dự sản (0 = không có giá sàn, > 0 = có giá sàn)
    buyNowPrice: number; // Giá mua ngay
}

export interface CreateAuctionSessionResponse {
    message: string;
    paymentUrl?: string; // Only present if reservePrice is provided
    sessionDetails: AuctionSessionResponse;
}

export interface PaymentResponse {
    code: string; // "00": Success, others: Failed
    message: string;
    paymentTime?: string;
    transactionId?: string;
    invoiceId?: string;
}

export interface AuctionSessionListResponse {
    code: number;
    message: string;
    result: {
        content: AuctionSession[];
        totalPages: number;
        totalElements: number;
        size: number;
        number: number;
    };
}
