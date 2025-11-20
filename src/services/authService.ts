// src/services/authService.ts

import axiosClient from "@/lib/axios";
import type { AuthenticationResponse, LoginRequest, MessageResponse, OtpVerifyRequest, RegisterRequest } from "@/types/auth";
import type { UserResponse } from "@/types/user";


export const authService = {

    login(data: LoginRequest) {
        return axiosClient.post<AuthenticationResponse>('/auth/authenticate', data);
    },

    register(data: RegisterRequest) {
        return axiosClient.post<MessageResponse>('/users/otp', data);
    },

    verifyOtp(data: OtpVerifyRequest) {
        return axiosClient.post<MessageResponse>('/auth/verify-otp', data);
    },

    getMyInfo() {
        return axiosClient.get<UserResponse>('/users/my-info');
    },

    // Đăng xuất
    // Không cần truyền tham số, Browser tự gửi Cookie, Interceptor tự gửi Header Authorization
    logout() {
        return axiosClient.post<MessageResponse>('/auth/logout');
    },

    // Google Login (Outbound)
    loginWithGoogle(code: string) {
        return axiosClient.post<AuthenticationResponse>('/auth/outbound/authenticate', null, {
            params: { code }
        });
    }
};