// src/services/userService.ts

import axiosClient from "@/lib/axios";
import type { UserResponse, SimpleUserResponse } from "@/types/user";

export const userService = {
    // GET thông tin user theo ID
    getUser(userId: string) {
        return axiosClient.get<UserResponse>(`/users/${userId}`);
    },

    // GET thông tin user hiện tại (đã login)
    getMyInfo() {
        return axiosClient.get<UserResponse>('/users/my-info');
    },

    // GET danh sách users với pagination
    getUsers(params: { page?: number; size?: number }) {
        return axiosClient.get<any>('/users', { params });
    },

    // UPDATE thông tin user
    updateUser(userId: string, data: any) {
        return axiosClient.put<UserResponse>(`/users/${userId}`, data);
    },

    // DELETE user
    deleteUser(userId: string) {
        return axiosClient.delete(`/users/${userId}`);
    }
};
