// src/services/socketService.ts
import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/useAuthStore';

// const SOCKET_URL = 'http://localhost:9092';
const SOCKET_URL = 'http://70.153.80.120:9092';


class SocketService {
    private socket: Socket | null = null;

    // Getter để truy cập biến socket từ bên ngoài (cho NotificationStore dùng)
    get socketInstance() {
        return this.socket;
    }

    connect() {
        if (this.socket?.connected) return;

        const accessToken = useAuthStore.getState().accessToken;
        if (!accessToken) return;

        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            query: { token: accessToken }
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket Connected:', this.socket?.id);
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Socket Disconnected');
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // --- SỬA ĐOẠN NÀY: BỎ IF CHECK ---
    joinAuctionRoom(sessionId: number | string) {
        if (this.socket) {
            // Socket.IO sẽ tự buffer lệnh này nếu chưa connect
            // Khi nào connect xong nó tự gửi đi ngay lập tức
            console.log(`📤 Request joining room: session-${sessionId}`);
            this.socket.emit('join_auction_session', `session-${sessionId}`);
        }
    }

    leaveAuctionRoom(sessionId: number | string) {
        if (this.socket) {
            this.socket.emit('leave_auction_session', `session-${sessionId}`);
        }
    }
    // ---------------------------------

    on(event: string, callback: (data: any) => void) {
        this.socket?.on(event, callback);
    }

    off(event: string) {
        this.socket?.off(event);
    }
}

export const socketService = new SocketService();