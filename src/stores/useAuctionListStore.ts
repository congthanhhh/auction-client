import { create } from 'zustand';
import { auctionService } from '@/services/auctionService';
import type { AuctionSessionResponse } from '@/types/auction';
import type { PageResponse } from '@/types/common';

interface AuctionListState {
    // Active auctions
    activeAuctions: AuctionSessionResponse[];
    activeCurrentPage: number;
    activeTotalPages: number;
    activePageSize: number;
    activeLoading: boolean;
    activeError: string | null;

    // Scheduled auctions
    scheduledAuctions: AuctionSessionResponse[];
    scheduledCurrentPage: number;
    scheduledTotalPages: number;
    scheduledPageSize: number;
    scheduledLoading: boolean;
    scheduledError: string | null;

    // Popular auctions (Top products có nhiều bid)
    popularAuctions: AuctionSessionResponse[];
    popularLoading: boolean;
    popularError: string | null;
    bidCounts: Record<number, number>;

    // Actions
    fetchActiveAuctions: (page?: number, size?: number) => Promise<void>;
    fetchScheduledAuctions: (page?: number, size?: number) => Promise<void>;
    resetActiveAuctions: () => void;
    resetScheduledAuctions: () => void;
    fetchPopularAuctions: () => Promise<void>;
    fetchBidCount: (productId: number) => Promise<number>;
}

export const useAuctionListStore = create<AuctionListState>((set) => ({


    // Active auctions state
    activeAuctions: [],
    activeCurrentPage: 1,
    activeTotalPages: 1,
    activePageSize: 10,
    activeLoading: false,
    activeError: null,

    // Scheduled auctions state
    scheduledAuctions: [],
    scheduledCurrentPage: 1,
    scheduledTotalPages: 1,
    scheduledPageSize: 10,
    scheduledLoading: false,
    scheduledError: null,

    popularAuctions: [],
    popularLoading: false,
    popularError: null,
    bidCounts: {},

    // Fetch active auctions
    fetchActiveAuctions: async (page = 1, size = 12) => {
        set({ activeLoading: true, activeError: null });
        try {
            const response = await auctionService.getActiveAuctionsDesc(page, size);
            const data: PageResponse<AuctionSessionResponse> = response.data;

            set({
                activeAuctions: data.data,
                activeCurrentPage: data.currentPage,
                activeTotalPages: data.totalPages,
                activePageSize: data.pageSize,
                activeLoading: false,
            });
        } catch (error: any) {
            console.error('Error fetching active auctions:', error);
            set({
                activeLoading: false,
                activeError: error.message || 'Không thể tải danh sách đấu giá',
            });
        }
    },

    // Fetch scheduled auctions
    fetchScheduledAuctions: async (page = 1, size = 12) => {
        set({ scheduledLoading: true, scheduledError: null });
        try {
            const response = await auctionService.getScheduleAuctionsDesc(page, size);
            const data: PageResponse<AuctionSessionResponse> = response.data;

            set({
                scheduledAuctions: data.data,
                scheduledCurrentPage: data.currentPage,
                scheduledTotalPages: data.totalPages,
                scheduledPageSize: data.pageSize,
                scheduledLoading: false,
            });
        } catch (error: any) {
            console.error('Error fetching scheduled auctions:', error);
            set({
                scheduledLoading: false,
                scheduledError: error.message || 'Không thể tải danh sách đấu giá',
            });
        }
    },

    // Reset active auctions
    resetActiveAuctions: () => {
        set({
            activeAuctions: [],
            activeCurrentPage: 1,
            activeTotalPages: 1,
            activeLoading: false,
            activeError: null,
        });
    },

    // Reset scheduled auctions
    resetScheduledAuctions: () => {
        set({
            scheduledAuctions: [],
            scheduledCurrentPage: 1,
            scheduledTotalPages: 1,
            scheduledLoading: false,
            scheduledError: null,
        });
    },

    fetchPopularAuctions: async () => {
        set({ popularLoading: true, popularError: null });
        try {
            const response = await auctionService.getTopPopularSessions();
            set({
                popularAuctions: response.data,
                popularLoading: false,
            });
            const counts: Record<number, number> = {};
            for (const auction of response.data) {
                try {
                    const countRes = await auctionService.getBidCountByProduct(auction.product.id);
                    counts[auction.product.id] = countRes.data;
                } catch (err) {
                    console.error(`Error fetching bid count for product ${auction.product.id}:`, err);
                    counts[auction.product.id] = 0;
                }
            }
            set({ bidCounts: counts });
        } catch (error: any) {
            console.error('Error fetching popular auctions:', error);
            set({
                popularLoading: false,
                popularError: error.message || 'Không thể tải danh sách sản phẩm phổ biến',
            });
        }
    },

    fetchBidCount: async (productId: number) => {
        try {
            const response = await auctionService.getBidCountByProduct(productId);
            const count = response.data;

            // Cập nhật vào bidCounts map
            set((state) => ({
                bidCounts: {
                    ...state.bidCounts,
                    [productId]: count
                }
            }));

            return count;
        } catch (error) {
            console.error(`Error fetching bid count for product ${productId}:`, error);
            return 0;
        }
    },
}));
