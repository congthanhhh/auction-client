import axiosClient from "@/lib/axios";
import type { PageResponse } from "@/types/common";


export interface Notification {
    id: number;
    message: string;
    isRead: boolean;
    link: string;
    createdAt: string;
}

export const notificationService = {
    getMyNotifications(page = 1, size = 10) {
        return axiosClient.get<PageResponse<Notification>>('/notifications', {
            params: { page, size }
        });
    },

    markAsRead(id: number) {
        return axiosClient.patch(`/notifications/${id}/read`);
    },

    markAllAsRead() {
        return axiosClient.patch('/notifications/read-all');
    },

    getUnreadCount() {
        return axiosClient.get<{ count: number }>('/notifications/unread-count');
    }
};