// src/services/invoiceService.ts

import axiosClient from "@/lib/axios";
import type { InvoiceResponse, InvoiceStatus, ShipInvoiceRequest, MessageResponse } from "@/types/invoice";
import type { PageResponse } from "@/types/common";

export const invoiceService = {
    // GET /invoices/my-invoices - Get my invoices with pagination, status, and type filters
    getMyInvoices(params: { page?: number; size?: number; status?: InvoiceStatus; type?: 'AUCTION_SALE' | 'LISTING_FEE' }) {
        return axiosClient.get<PageResponse<InvoiceResponse>>('/invoices/my-invoices', {
            params
        });
    },

    // GET /invoices/{id} - Get invoice detail by ID
    getInvoiceById(id: number) {
        return axiosClient.get<InvoiceResponse>(`/invoices/${id}`);
    },

    // GET /invoices/my-sales - Get seller's AUCTION_SALE invoices (đơn bán hàng)
    getMySales(params: { status?: InvoiceStatus; page?: number; size?: number }) {
        return axiosClient.get<PageResponse<InvoiceResponse>>('/invoices/my-sales', {
            params
        });
    },

    // GET /invoices/my-listing-fees - Get seller's LISTING_FEE invoices (phí giá sàn)
    getMyListingFees(params: { status?: InvoiceStatus; page?: number; size?: number }) {
        return axiosClient.get<PageResponse<InvoiceResponse>>('/invoices/my-listing-fees', {
            params
        });
    },

    // POST /invoices/{id}/ship - Ship invoice (seller nhập mã vận đơn)
    shipInvoice(id: number, data: ShipInvoiceRequest) {
        return axiosClient.post<MessageResponse>(`/invoices/${id}/ship`, data);
    },

    // GET /invoices/seller-stats - Get seller statistics (tổng phiên đấu giá & doanh thu)
    getSellerStats() {
        return axiosClient.get<SellerRevenueResponse>('/invoices/seller-stats');
    }
};

export interface SellerRevenueResponse {
    totalAuctionSessions: number;
    totalRevenue: number;
}
