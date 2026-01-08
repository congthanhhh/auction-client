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
    getUser(userId: string) {
        return axiosClient.get<UserResponse>(`/users/${userId}`);
    },

    getMyProfile() {
        return axiosClient.get<UserProfileResponse>('/users/my-profile');
    },

    getMyInfo() {
        return axiosClient.get<UserResponse>('/users/my-info');
    },

    getPublicProfile(userId: string) {
        return axiosClient.get<PublicUserProfileResponse>(`/users/${userId}/public-profile`);
    },

    getPublicFeedbacks(userId: string, page: number = 0, size: number = 10) {
        return axiosClient.get<PageResponse<FeedbackDto>>(`/feedback/public/${userId}`, {
            params: { page, size }
        });
    },

    // ===== ADMIN ENDPOINTS =====

    searchUsers(params: UserSearchParams) {
        return axiosClient.get<PageResponse<UserResponse>>('/users/admin/search', { params });
    },

    updateUserActiveStatus(userId: string, isActive: boolean) {
        return axiosClient.patch<string>(`/users/admin/${userId}/active-status`, isActive, {
            headers: { 'Content-Type': 'application/json' }
        });
    },

    createUserByAdmin(data: AdminCreationRequest) {
        return axiosClient.post<UserResponse>('/users/admin-create', data);
    },


    updateUserByAdmin(userId: string, data: AdminUpdateRequest) {
        return axiosClient.put<UserResponse>(`/users/${userId}/admin-update`, data);
    },

    deleteUser(userId: string) {
        return axiosClient.delete<string>(`/users/delete/${userId}`);
    }
};
