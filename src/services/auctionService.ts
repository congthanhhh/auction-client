
import axiosClient from "@/lib/axios";
import type { CreateAuctionSessionRequest, CreateAuctionSessionResponse, AuctionSessionResponse, AuctionStatus } from "@/types/auction";
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

    // GET /auction-sessions/my-sessions - Lấy các phiên đấu giá của seller
    getMyAuctionSessions(params: { status?: AuctionStatus; page?: number; size?: number }) {
        return axiosClient.get<PageResponse<AuctionSessionResponse>>('/auction-sessions/my-sessions', {
            params
        });
    },

    // GET /auction-sessions/my-joined - Lấy các phiên đấu giá user đang tham gia
    getMyJoinedSessions(params: { status?: AuctionStatus; page?: number; size?: number }) {
        return axiosClient.get<PageResponse<AuctionSessionResponse>>('/auction-sessions/my-joined', {
            params
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
    },

    getTopPopularSessions() {
        return axiosClient.get<AuctionSessionResponse[]>('/auction-sessions/top-popular');
    },

    getBidCountByProduct(productId: number) {
        return axiosClient.get<number>(`/auction-sessions/count/${productId}`);
    },

    // GET seller's active auctions (public - no authentication required)
    getSellerActiveSessions(sellerId: string, page: number = 0, size: number = 10) {
        return axiosClient.get<PageResponse<AuctionSessionResponse>>(`/auction-sessions/seller/${sellerId}/active`, {
            params: { page, size }
        });
    },

    // Admin endpoints
    // GET /auction-sessions/admin/search - Get all auction sessions for admin
    getAllSessionsForAdmin(request: import('@/types/auction').AuctionSessionAdminSearchRequest, page: number = 1, size: number = 10) {
        return axiosClient.get<PageResponse<import('@/types/auction').AdminAuctionSessionResponse>>('/auction-sessions/admin/search', {
            params: { ...request, page, size }
        });
    },

    // PUT /auction-sessions/admin/{auctionId} - Update auction session for admin
    updateSessionForAdmin(auctionId: number, request: import('@/types/auction').AdminUpdateSessionRequest) {
        return axiosClient.put<import('@/types/auction').AdminAuctionSessionResponse>(`/auction-sessions/admin/${auctionId}`, request);
    },

    // POST /auction-sessions/{auctionId}/buy-now - Buy now
    buyNow(auctionId: number) {
        return axiosClient.post<import('@/types/invoice').InvoiceResponse>(`/auction-sessions/${auctionId}/buy-now`);
    }
};