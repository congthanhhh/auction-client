// src/services/feedbackService.ts

import axiosClient from "@/lib/axios";
import type { FeedbackRequest, MessageResponse } from "@/types/feedback";

export const feedbackService = {
    // POST /feedbacks/invoice/{invoiceId} - Create feedback for invoice
    createFeedback(invoiceId: number, data: FeedbackRequest) {
        return axiosClient.post<MessageResponse>(`/feedback/invoice/${invoiceId}`, data);
    },

    // GET /feedbacks/my-total-feedback - Get total feedback count for current user
    getMyTotalFeedback() {
        return axiosClient.get<number>('/feedback/my-total-feedback');
    }
};
