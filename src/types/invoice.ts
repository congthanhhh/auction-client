// src/types/invoice.ts

import type { SimpleUserResponse, SimpleProductResponse } from './auction';

export type InvoiceStatus = 'PENDING' | 'PAID' | 'SHIPPING' | 'COMPLETED' | 'DISPUTE' | 'CANCELLED_NON_PAYMENT' | 'CANCELLED_BY_SELLER' | 'REFUNDED';

export type InvoiceType = 'AUCTION_SALE' | 'LISTING_FEE';

export interface InvoiceResponse {
    id: number;
    user: SimpleUserResponse;
    product: SimpleProductResponse;
    auctionSessionId: number;
    finalPrice: number;
    status: InvoiceStatus;
    type: InvoiceType; // Phân loại: AUCTION_SALE (đơn bán hàng) hoặc LISTING_FEE (phí giá sàn)
    createdAt: string; // ISO 8601 format
    dueDate: string; // ISO 8601 format
    hasFeedback?: boolean; // Đã được đánh giá chưa
    // Shipping info (chỉ có khi type = AUCTION_SALE)
    shippingAddress?: string;
    recipientName?: string;
    recipientPhone?: string;
    trackingCode?: string;
    carrier?: string;
    shippedAt?: string; // ISO 8601 format
    paymentTime?: string; // ISO 8601 format
}

export interface ShipInvoiceRequest {
    trackingCode: string;
    carrier: string;
}

export interface DisputeRequest {
    reason: string;
}

export type DisputeDecision = 'PENDING' | 'REFUND_TO_BUYER' | 'RELEASE_TO_SELLER';

export interface DisputeSearchRequest {
    decision?: DisputeDecision;
    sort?: string; // "oldest", "resolved_newest", "resolved_oldest", or default (newest)
}

export interface ResolveDisputeRequest {
    decision: DisputeDecision;
    adminNote?: string;
}

export interface DisputeResponse {
    id: number;
    invoiceId: number;
    reason: string;
    decision: DisputeDecision;
    adminNote?: string;
    createdAt: string; // ISO 8601 format
    resolvedAt?: string; // ISO 8601 format
}

export interface MessageResponse {
    message: string;
}

// Admin types
export interface InvoiceAdminSearchRequest {
    keyword?: string; // Tìm chung cho: ID Invoice, Username, Tên sản phẩm
    status?: InvoiceStatus;
    type?: InvoiceType;
    sort?: string; // 'oldest' | 'price_asc' | 'price_desc' | 'due_date_asc' | 'due_date_desc'
}

export interface AdminUpdateInvoiceRequest {
    status?: InvoiceStatus;
    trackingCode?: string;
    carrier?: string;
    recipientName?: string;
    recipientPhone?: string;
    shippingAddress?: string;
    note?: string;
}
