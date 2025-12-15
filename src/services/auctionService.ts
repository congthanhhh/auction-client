

import axiosClient from "@/lib/axios";

export interface AuctionSessionDetail {
    id: number;
    startTime: string;
    endTime: string;
    startPrice: number;
    currentPrice: number;
    buyNowPrice: number | null;
    status: string;
    reservePriceMet: boolean;

    myMaxBid: number | null;


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