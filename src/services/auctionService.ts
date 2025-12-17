
import axiosClient from "@/lib/axios";
import type { CreateAuctionSessionRequest, CreateAuctionSessionResponse, AuctionSession, AuctionSessionListResponse } from "@/types/auction";

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
    },

    // GET list auction sessions với pagination
    getAuctionSessions(params?: { page?: number; size?: number; status?: string }) {
        return axiosClient.get<AuctionSessionListResponse>('/auction-sessions', { params });
    },

    // POST create auction session (Bước 3 sau khi tạo product)
    createAuctionSession(data: CreateAuctionSessionRequest) {
        return axiosClient.post<CreateAuctionSessionResponse>('/auction-sessions', data);
    },

    // PUT update auction session
    updateAuctionSession(sessionId: number, data: Partial<CreateAuctionSessionRequest>) {
        return axiosClient.put<CreateAuctionSessionResponse>(`/auction-sessions/${sessionId}`, data);
    },

    // DELETE auction session
    deleteAuctionSession(sessionId: number) {
        return axiosClient.delete(`/auction-sessions/${sessionId}`);
    }
};