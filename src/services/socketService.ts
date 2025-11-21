// src/services/socketService.ts
import { io, type Socket } from 'socket.io-client';
// 1. Import Store để lấy token
import { useAuthStore } from '@/stores/useAuthStore';

const SOCKET_URL = 'http://localhost:9092';

class SocketService {
    private socket: Socket | null = null;

    connect() {
        // Nếu đã kết nối rồi thì thôi
        if (this.socket?.connected) return;

        // 2. Lấy Access Token từ Zustand State (Lấy trực tiếp không qua Hook)
        const accessToken = useAuthStore.getState().accessToken;

        if (!accessToken) {
            console.warn("⚠️ SocketService: Không tìm thấy AccessToken, hủy kết nối.");
            return;
        }

        // 3. Khởi tạo Socket với Token trong Query
        this.socket = io(SOCKET_URL, {
            transports: ['websocket'], // Chỉ dùng websocket cho nhanh
            reconnection: true,
            // QUAN TRỌNG: Backend đang đọc data.getSingleUrlParam("token")
            // Nên bắt buộc phải truyền qua query
            query: {
                token: accessToken
            }
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket Connected! ID:', this.socket?.id);
        });

        this.socket.on('connect_error', (err) => {
            console.error('❌ Socket Connection Error:', err.message);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Socket Disconnected:', reason);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinAuctionRoom(sessionId: number | string) {
        // Kiểm tra socket tồn tại và đã kết nối chưa
        if (this.socket && this.socket.connected) {
            console.log(`📤 Joining auction room: session-${sessionId}`);
            this.socket.emit('join_auction_session', `session-${sessionId}`);
        } else {
            // Nếu chưa kết nối, thử kết nối lại rồi join (Optional logic)
            console.warn("⚠️ Socket not connected. Cannot join room.");
        }
    }

    leaveAuctionRoom(sessionId: number | string) {
        if (this.socket) {
            this.socket.emit('leave_auction_session', `session-${sessionId}`);
        }
    }

    on(event: string, callback: (data: any) => void) {
        this.socket?.on(event, callback);
    }

    off(event: string) {
        this.socket?.off(event);
    }
}

export const socketService = new SocketService();