import { create } from 'zustand';
import { notificationService } from '@/services/notificationService';
import type { NotificationResponse, PageResponse } from '@/types/common';

interface NotificationState {
    notifications: NotificationResponse[];
    unreadCount: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchNotifications: (page?: number, size?: number) => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    resetNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    isLoading: false,
    error: null,

    // Lấy danh sách thông báo
    fetchNotifications: async (page = 1, size = 10) => {
        set({ isLoading: true, error: null });
        try {
            const response: PageResponse<NotificationResponse> = await notificationService.getNotifications(page, size);
            set({
                notifications: response.data,
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                pageSize: response.pageSize,
                isLoading: false,
            });
        } catch (error: any) {
            console.error('Error fetching notifications:', error);
            set({
                isLoading: false,
                error: error.message || 'Không thể tải thông báo',
            });
        }
    },

    // Lấy số lượng thông báo chưa đọc
    fetchUnreadCount: async () => {
        try {
            const count = await notificationService.getUnreadCount();
            set({ unreadCount: count });
        } catch (error: any) {
            console.error('Error fetching unread count:', error);
        }
    },

    // Đánh dấu một thông báo là đã đọc
    markAsRead: async (id: number) => {
        try {
            await notificationService.markAsRead(id);

            // Cập nhật trong danh sách notifications
            set((state) => ({
                notifications: state.notifications.map((notif) =>
                    notif.id === id ? { ...notif, isRead: true } : notif
                ),
                // Giảm unreadCount nếu notification chưa được đọc
                unreadCount: state.notifications.find((n) => n.id === id && !n.isRead)
                    ? state.unreadCount - 1
                    : state.unreadCount,
            }));
        } catch (error: any) {
            console.error('Error marking notification as read:', error);
            set({ error: error.message || 'Không thể đánh dấu đã đọc' });
        }
    },

    // Đánh dấu tất cả thông báo là đã đọc
    markAllAsRead: async () => {
        try {
            const { notifications } = get();

            // Gọi API cho tất cả notifications chưa đọc
            const unreadNotifications = notifications.filter((n) => !n.isRead);
            await Promise.all(
                unreadNotifications.map((notif) => notificationService.markAsRead(notif.id))
            );

            // Cập nhật state
            set({
                notifications: notifications.map((notif) => ({ ...notif, isRead: true })),
                unreadCount: 0,
            });
        } catch (error: any) {
            console.error('Error marking all as read:', error);
            set({ error: error.message || 'Không thể đánh dấu tất cả đã đọc' });
        }
    },

    // Reset state
    resetNotifications: () => {
        set({
            notifications: [],
            unreadCount: 0,
            currentPage: 1,
            totalPages: 1,
            isLoading: false,
            error: null,
        });
    },
}));
