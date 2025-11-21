import type { SimpleUserResponse } from "./user";

export interface BidRequest {
    amount: number;
}
export interface BidResponse {
    id: number;
    displayedAmount: number;
    bidTime: string; // LocalDateTime trả về chuỗi ISO
    user: SimpleUserResponse;
    auctionSessionId: number;
}

export interface PriceUpdatePayload {
    currentPrice: number;
    highestBidder: SimpleUserResponse | null;
}