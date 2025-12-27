// src/services/paymentService.ts

import axiosClient from "@/lib/axios";
import type { PaymentResponse } from "@/types/auction";

export const paymentService = {
    // GET /payments/vn-pay - Create VNPay payment URL
    // Note: This is already handled in createAuctionSession response
    // But keeping it here for potential direct calls
    createVnPayPayment(invoiceId: number, addressId: number) {
        return axiosClient.get<string>('/payments/vn-pay', {
            params: { invoiceId, addressId }
        });
    },

    // GET /payments/vn-pay-callback - Handle VNPay callback
    // This will be called with query params from VNPay redirect
    handleVnPayCallback(queryParams: URLSearchParams) {
        // Convert URLSearchParams to query string
        const queryString = queryParams.toString();
        return axiosClient.get<PaymentResponse>(`/payments/vn-pay-callback?${queryString}`);
    }
};
