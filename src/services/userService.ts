// src/services/userService.ts

import axiosClient from "@/lib/axios";
import type {
    UserResponse,
    UserProfileResponse,
    PublicUserProfileResponse,
    UserSearchParams,
    AdminCreationRequest,
    AdminUpdateRequest
} from "@/types/user";
import type { FeedbackDto } from "@/types/feedback";
import type { PageResponse } from "@/types/common";

export const userService = {
    // GET thông tin user theo ID
    getUser(userId: string) {
        return axiosClient.get<UserResponse>(`/users/${userId}`);
    },

    // GET my profile (authenticated user)
    getMyProfile() {
        return axiosClient.get<UserProfileResponse>('/users/my-profile');
    },

    // GET thông tin user hiện tại (đã login)
    getMyInfo() {
        return axiosClient.get<UserResponse>('/users/my-info');
    },

    // GET public profile (no authentication required)
    getPublicProfile(userId: string) {
        return axiosClient.get<PublicUserProfileResponse>(`/users/${userId}/public-profile`);
    },

    // GET public feedbacks (no authentication required)
    getPublicFeedbacks(userId: string, page: number = 0, size: number = 10) {
        return axiosClient.get<PageResponse<FeedbackDto>>(`/feedback/public/${userId}`, {
            params: { page, size }
        });
    },

    // ===== ADMIN ENDPOINTS =====

    // GET danh sách users với search và filter (ADMIN)
    searchUsers(params: UserSearchParams) {
        return axiosClient.get<PageResponse<UserResponse>>('/users/admin/search', { params });
    },

    // PATCH cập nhật trạng thái active của user (ADMIN)
    updateUserActiveStatus(userId: string, isActive: boolean) {
        return axiosClient.patch<string>(`/users/admin/${userId}/active-status`, isActive, {
            headers: { 'Content-Type': 'application/json' }
        });
    },

    // POST tạo user mới (ADMIN)
    createUserByAdmin(data: AdminCreationRequest) {
        return axiosClient.post<UserResponse>('/users/admin-create', data);
    },

    // PUT cập nhật thông tin user (ADMIN)
    updateUserByAdmin(userId: string, data: AdminUpdateRequest) {
        return axiosClient.put<UserResponse>(`/users/${userId}/admin-update`, data);
    },

    // DELETE xóa user (ADMIN)
    deleteUser(userId: string) {
        return axiosClient.delete<string>(`/users/delete/${userId}`);
    }
};
