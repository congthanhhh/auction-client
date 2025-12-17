// src/types/auction.ts

import type { Product } from './product';

export interface HighestBidder {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface AuctionSession {
    id: number;
    startTime: string;
    endTime: string;
    startingPrice: number;
    currentPrice: number;
    buyNowPrice: number | null;
    status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    product: Product;
    highestBidder: HighestBidder | null;
    reservePriceMet: boolean;
    myMaxBid: number | null;
}

export interface CreateAuctionSessionRequest {
    productId: number;
    startTime: string; // ISO 8601 format: "2025-12-17T22:48:00"
    endTime: string;
    reservePrice: number; // Giá dự sản
    buyNowPrice: number; // Giá mua ngay
}

export interface CreateAuctionSessionResponse {
    id: number;
    startTime: string;
    endTime: string;
    startingPrice: number;
    currentPrice: number;
    buyNowPrice: number;
    status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    product: Product;
    highestBidder: HighestBidder | null;
    reservePriceMet: boolean;
    myMaxBid: number | null;
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
