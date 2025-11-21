import axiosClient from "@/lib/axios";
import type { BidRequest, BidResponse } from "@/types/bid";
import type { PageResponse } from "@/types/common";


export const bidService = {
    placeBid(sessionId: number, data: BidRequest) {
        return axiosClient.post<BidResponse>(`/auction-sessions/${sessionId}/bids`, data);
    },

    getBidHistory(sessionId: number, page = 1, size = 10) {
        return axiosClient.get<PageResponse<BidResponse>>(`/auction-sessions/${sessionId}/bids`, {
            params: { page, size }
        });
    }
};