// Admin Statistics Types

export interface StatisticResponse {
    totalUsers: number;              // Tổng số thành viên
    activeAuctions: number;          // Số phiên đấu giá đang chạy
    pendingProducts: number;         // Số sản phẩm chờ duyệt
    totalRevenue: number;            // Tổng doanh thu thực tế (Net Revenue)
    totalGMV: number;                // Tổng giá trị giao dịch (Gross Merchandise Value)
    totalListingFee: number;         // Tổng phí niêm yết (Listing Fee)
    commissionRevenue: number;       // Doanh thu từ hoa hồng (Commission Revenue)
}

export interface StatisticParams {
    month?: number;
    year?: number;
}
