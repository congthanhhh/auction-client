
import axiosClient from "@/lib/axios";
import type { CreateAuctionSessionRequest, CreateAuctionSessionResponse, AuctionSessionResponse } from "@/types/auction";
import type { PageResponse } from "@/types/common";

export const auctionService = {
    // GET /auction-sessions/{id} - Lấy chi tiết phiên đấu giá
    getDetail(id: number) {
        return axiosClient.get<AuctionSessionResponse>(`/auction-sessions/${id}`);
    },

    // GET /auction-sessions/active-desc - Lấy danh sách phiên đấu giá đang active
    getActiveAuctionsDesc(page: number = 1, size: number = 10) {
        return axiosClient.get<PageResponse<AuctionSessionResponse>>('/auction-sessions/active-desc', {
            params: { page, size }
        });
    },

    // GET /auction-sessions/schedule-desc - Lấy danh sách phiên đấu giá đã lên lịch
    getScheduleAuctionsDesc(page: number = 1, size: number = 10) {
        return axiosClient.get<PageResponse<AuctionSessionResponse>>('/auction-sessions/schedule-desc', {
            params: { page, size }
        });
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