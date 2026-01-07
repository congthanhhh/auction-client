import axiosClient from "@/lib/axios";
import type { AuditLog } from "@/types/auditLog";
import type { PageResponse } from "@/types/common";

export const auditLogService = {
    getLogs(page: number = 1, size: number = 10) {
        return axiosClient.get<PageResponse<AuditLog>>('/admin/logs', {
            params: { page, size }
        });
    }
};
