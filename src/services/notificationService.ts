import axiosClient from "@/lib/axios";
import type { NotificationResponse, PageResponse } from "@/types/common";


export const notificationService = {
    // Lấy danh sách thông báo với phân trang
    getNotifications: async (page: number = 1, size: number = 10): Promise<PageResponse<NotificationResponse>> => {
        const response = await axiosClient.get('/notifications', {
            params: { page, size }
        });
        return response.data;
    },

    // Đánh dấu thông báo là đã đọc
    markAsRead: async (id: number): Promise<NotificationResponse> => {
        const response = await axiosClient.patch(`/notifications/${id}/read`);
        return response.data;
    },

    // Lấy số lượng thông báo chưa đọc
    getUnreadCount: async (): Promise<number> => {
        const response = await axiosClient.get<{ count: number }>('/notifications/unread-count');
        return response.data.count;
    }
};
