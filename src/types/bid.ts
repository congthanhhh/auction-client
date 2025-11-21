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

export interface AuctionSessionDetail {
    id: number;
    currentPrice: number;
    reservePriceMet: boolean; // <--- Thay reservePrice bằng cái này
    highestBidder: { username: string } | null;
}

export interface PriceUpdatePayload {
    currentPrice: number;
    highestBidder: SimpleUserResponse | null;
    reservePriceMet: boolean;
}