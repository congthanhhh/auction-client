import axiosClient from "@/lib/axios";
import type { SystemParameter } from "@/types/systemParameter";

export const systemParameterService = {
    getAllSettings() {
        return axiosClient.get<SystemParameter[]>('/admin/settings');
    },

    updateSetting(key: string, value: string) {
        return axiosClient.put<SystemParameter>(`/admin/settings/${key}`, { value });
    }
};
