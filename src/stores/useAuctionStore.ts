import { create } from 'zustand';
import { socketService } from '@/services/socketService';
import type { BidResponse, PriceUpdatePayload } from '@/types/bid';
import { bidService } from '@/services/bidService';
import type { NotificationResponse } from '@/types/common';


interface AuctionState {
    currentPrice: number;
    highestBidder: string | null;
    recentBids: BidResponse[]; // Public History
    sessionNotifications: NotificationResponse[]; // Private Messages cho phiên này
    isConnected: boolean;

    initializeSocket: (sessionId: number) => void;
    leaveSocket: (sessionId: number) => void;
    placeBid: (sessionId: number, amount: number) => Promise<void>;
    fetchAuctionDetail: (sessionId: number) => Promise<void>; // Fetch dữ liệu ban đầu
    addSessionNotification: (notif: NotificationResponse) => void;
}

export const useAuctionStore = create<AuctionState>((set, get) => ({
    currentPrice: 0,
    highestBidder: 'Chưa có',
    recentBids: [],
    sessionNotifications: [],
    isConnected: false,

    // Lấy dữ liệu ban đầu từ API (quan trọng để F5 không bị trắng)
    fetchAuctionDetail: async (sessionId: number) => {
        try {
            // 1. Lấy thông tin phiên (Giá, Người thắng) - Bạn cần có API này trong auctionSessionService
            // const session = await auctionSessionService.getDetail(sessionId); 
            // set({ currentPrice: session.currentPrice, highestBidder: session.highestBidder?.username });

            // 2. Lấy lịch sử đấu giá
            const history = await bidService.getBidHistory(sessionId, 1, 10);
            set({ recentBids: history.data.data });
        } catch (error) {
            console.error("Lỗi tải chi tiết phiên:", error);
        }
    },

    addSessionNotification: (notif: NotificationResponse) => {
        set(state => ({
            sessionNotifications: [notif, ...state.sessionNotifications]
        }));
    },

    initializeSocket: (sessionId: number) => {
        socketService.connect(); // Đảm bảo socket đã connect
        socketService.joinAuctionRoom(sessionId);
        set({ isConnected: true });

        // --- PUBLIC EVENTS ---
        socketService.off('new_bid');
        socketService.on('new_bid', (newBid: BidResponse) => {
            console.log('⚡ Public Bid:', newBid);
            set((state) => ({
                recentBids: [newBid, ...state.recentBids].slice(0, 20),
                // Cập nhật luôn giá nếu Backend gửi kèm trong BidResponse (optional)
                currentPrice: newBid.displayedAmount
            }));
        });

        socketService.off('price_update');
        socketService.on('price_update', (data: PriceUpdatePayload) => {
            console.log('⚡ Price Update:', data);
            set({
                currentPrice: data.currentPrice,
                highestBidder: data.highestBidder ? data.highestBidder.username : 'Chưa có'
            });
        });
    },

    leaveSocket: (sessionId: number) => {
        socketService.leaveAuctionRoom(sessionId);
        // Không disconnect hẳn vì notification store vẫn cần dùng socket chung
        set({ isConnected: false, recentBids: [], sessionNotifications: [] });
    },

    placeBid: async (sessionId: number, amount: number) => {
        await bidService.placeBid(sessionId, { amount });
    }
}));