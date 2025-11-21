

// Định nghĩa Interface cho Chi tiết Phiên Đấu Giá

import axiosClient from "@/lib/axios";

// Dựa trên AuctionSessionResponse của Backend
export interface AuctionSessionDetail {
    id: number;
    startTime: string;
    endTime: string;
    startPrice: number;
    currentPrice: number;
    buyNowPrice: number | null;
    status: string;
    reservePriceMet: boolean;

    product: {
        id: number;
        name: string;
        startPrice: number;
        // ... các trường khác nếu cần
    };

    highestBidder: {
        username: string;
        firstName: string;
        lastName: string;
        email: string;
    } | null;
}

export const auctionService = {
    // Gọi API lấy chi tiết phiên đấu giá
    // GET /auction-sessions/{id}
    getDetail(id: number) {
        return axiosClient.get<AuctionSessionDetail>(`/auction-sessions/${id}`);
    }
};