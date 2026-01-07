// src/services/paymentService.ts

import axiosClient from "@/lib/axios";
import type { PaymentResponse } from "@/types/auction";

export const paymentService = {
    createVnPayPayment(invoiceId: number, addressId: number) {
        return axiosClient.get<string>('/payments/vn-pay', {
            params: { invoiceId, addressId }
        });
    },

    handleVnPayCallback(queryParams: URLSearchParams) {
        const queryString = queryParams.toString();
        return axiosClient.get<PaymentResponse>(`/payments/vn-pay-callback?${queryString}`);
    }
};
