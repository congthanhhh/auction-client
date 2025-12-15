import { create } from 'zustand';
import { socketService } from '@/services/socketService';
import type { BidResponse, PriceUpdatePayload } from '@/types/bid';
import { bidService } from '@/services/bidService';
import type { NotificationResponse } from '@/types/common';
import { auctionService } from '@/services/auctionService';

interface AuctionState {
    currentPrice: number;
    highestBidder: string | null;
    recentBids: BidResponse[];
    sessionNotifications: NotificationResponse[];
    isConnected: boolean;
    reservePriceMet: boolean;
    startPrice: number;
    buyNowPrice: number | null;
    endTime: string | null;
    myMaxBid: number | null;

    initializeSocket: (sessionId: number) => void;
    leaveSocket: (sessionId: number) => void;
    placeBid: (sessionId: number, amount: number) => Promise<void>;
    fetchAuctionDetail: (sessionId: number) => Promise<void>;
    addSessionNotification: (notif: NotificationResponse) => void;
}

export const useAuctionStore = create<AuctionState>((set, get) => ({
    currentPrice: 0,
    highestBidder: 'Chưa có',
    recentBids: [],
    sessionNotifications: [],
    isConnected: false,
    reservePriceMet: false,
    startPrice: 0,
    buyNowPrice: null,
    endTime: null,
    myMaxBid: null,

    fetchAuctionDetail: async (sessionId: number) => {
        try {
            // 1. Lấy thông tin chi tiết phiên (để lấy reservePriceMet và giá hiện tại)
            const sessionRes = await auctionService.getDetail(sessionId);
            const sessionData = sessionRes.data;

            set({
                startPrice: sessionData.startPrice,
                buyNowPrice: sessionData.buyNowPrice,

                // Nếu chưa có ai bid, currentPrice từ API chính là startPrice (theo logic backend)
                currentPrice: sessionData.currentPrice,

                reservePriceMet: sessionData.reservePriceMet,
                highestBidder: sessionData.highestBidder ? sessionData.highestBidder.username : 'Chưa có',
                endTime: sessionData.endTime,
                myMaxBid: sessionData.myMaxBid
            });

            // 2. Lấy lịch sử đấu giá
            const history = await bidService.getBidHistory(sessionId, 1, 10);
            if (history.data.data.length > 0) {
                set({ recentBids: history.data.data });
            } else {
                set({ recentBids: [] });
            }
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
        socketService.connect();
        set({ isConnected: true });

        socketService.joinAuctionRoom(sessionId);

        // Sự kiện có bid mới (cập nhật danh sách lịch sử)
        socketService.off('new_bid');
        socketService.on('new_bid', (newBid: BidResponse) => {
            console.log('⚡ Realtime Bid:', newBid);
            set((state) => {
                const exists = state.recentBids.some(bid => bid.id === newBid.id);
                if (exists) return state;

                return {
                    recentBids: [newBid, ...state.recentBids].slice(0, 20),
                    // currentPrice: newBid.displayedAmount
                };
            });
        });

        // Sự kiện cập nhật giá và người thắng (Cập nhật cả reservePriceMet)
        socketService.off('price_update');
        socketService.on('price_update', (data: PriceUpdatePayload) => {
            console.log('⚡ Price Update:', data);
            set({
                currentPrice: data.currentPrice,
                highestBidder: data.highestBidder ? data.highestBidder.username : 'Chưa có',
                reservePriceMet: data.reservePriceMet // Cập nhật realtime từ socket
            });
        });
    },

    leaveSocket: (sessionId: number) => {
        socketService.leaveAuctionRoom(sessionId);
        const socket = (socketService as any).socket;
        if (socket) {
            socket.off('new_bid');
            socket.off('price_update');
        }
        set({ isConnected: false, recentBids: [], sessionNotifications: [] });
    },

    placeBid: async (sessionId: number, amount: number) => {
        await bidService.placeBid(sessionId, { amount });
        // c1: Sau khi bid xong, tự set myMaxBid luôn vì mình vừa đặt
        set({ myMaxBid: amount });

        // c2: await get().fetchAuctionDetail(sessionId);
    }
}));