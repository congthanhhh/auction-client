// src/services/invoiceService.ts

import axiosClient from "@/lib/axios";
import type { InvoiceResponse } from "@/types/invoice";
import type { PageResponse } from "@/types/common";

export const invoiceService = {
    // GET /invoices/my-invoices - Get my invoices with pagination
    getMyInvoices(page: number = 1, size: number = 10) {
        return axiosClient.get<PageResponse<InvoiceResponse>>('/invoices/my-invoices', {
            params: { page, size }
        });
    },

    // GET /invoices/{id} - Get invoice detail by ID
    getInvoiceById(id: number) {
        return axiosClient.get<InvoiceResponse>(`/invoices/${id}`);
    }
};
