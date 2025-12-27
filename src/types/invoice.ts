// src/types/invoice.ts

import type { SimpleUserResponse, SimpleProductResponse } from './auction';

export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface InvoiceResponse {
    id: number;
    user: SimpleUserResponse;
    product: SimpleProductResponse;
    auctionSessionId: number;
    finalPrice: number;
    status: InvoiceStatus;
    createdAt: string; // ISO 8601 format
    dueDate: string; // ISO 8601 format
}
