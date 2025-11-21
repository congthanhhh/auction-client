import { create } from 'zustand';
import { socketService } from '@/services/socketService';
import { notificationService } from '@/services/notificationService';
import type { NotificationResponse } from '@/types/common';

interface NotificationState {
    notifications: NotificationResponse[];
    unreadCount: number;

    // Actions
    connectGlobalSocket: () => void;
    disconnectGlobalSocket: () => void;
    addNotification: (notif: NotificationResponse) => void;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;

}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,

    // Gọi cái này ở App.tsx
    fetchNotifications: async () => {
        try {
            // 1. Lấy danh sách
            const res = await notificationService.getMyNotifications(1, 20);
            // 2. Lấy số lượng chưa đọc
            const countRes = await notificationService.getUnreadCount();

            set({
                notifications: res.data.data,
                unreadCount: countRes.data.count
            });
        } catch (error) {
            console.error("Lỗi tải thông báo:", error);
        }
    },

    markAsRead: async (id) => {
        try {
            await notificationService.markAsRead(id);
            set(state => ({
                notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
                unreadCount: Math.max(0, state.unreadCount - 1)
            }));
        } catch (error) {
            console.error("Lỗi đánh dấu đã đọc", error);
        }
    },

    connectGlobalSocket: () => {
        socketService.connect();
        const socket = (socketService as any).socket;

        if (socket) {
            socket.on('connect', () => {
                socket.emit('join_user_room');
            });
            if (socket.connected) socket.emit('join_user_room');

            socket.off('new_notification');
            socket.on('new_notification', (data: NotificationResponse) => {
                console.log("🔔 Realtime Notification:", data);
                get().addNotification(data);
            });
        }
    },

    disconnectGlobalSocket: () => {
        socketService.disconnect();
    },

    addNotification: (notif: NotificationResponse) => {
        set((state) => ({
            notifications: [notif, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }));
    }
}));