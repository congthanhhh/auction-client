// Admin Statistics Service

import axiosClient from "@/lib/axios";
import type { StatisticResponse, StatisticParams } from "@/types/statistics";

export const adminStatisticsService = {
    // GET /admin/statistics - Lấy thống kê dashboard admin
    getStatistics(params?: StatisticParams) {
        return axiosClient.get<StatisticResponse>('/admin/statistics', {
            params
        });
    }
};
