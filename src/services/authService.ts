// src/services/authService.ts

import axiosClient from "@/lib/axios";
import type { AuthenticationResponse, LoginRequest, MessageResponse, OtpVerifyRequest, RegisterRequest, UserCreationRequest, PasswordCreationRequest, ForgotPassRequest, ResetPassRequest } from "@/types/auth";
import type { UserResponse, UserUpdateRequest } from "@/types/user";


export const authService = {

    login(data: LoginRequest) {
        return axiosClient.post<AuthenticationResponse>('/auth/authenticate', data);
    },

    register(data: UserCreationRequest) {
        return axiosClient.post<MessageResponse>('/users/otp', data);
    },

    verifyOtp(data: OtpVerifyRequest) {
        return axiosClient.post<MessageResponse>('/auth/verify-otp', data);
    },

    createPassword(data: PasswordCreationRequest) {
        return axiosClient.post<MessageResponse>('/users/create-password', data);
    },

    updateMyInfo(data: UserUpdateRequest) {
        return axiosClient.put<UserResponse>('/users/update-my-info', data);
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
    },

    // Forgot password - send OTP to email
    forgotPassword(data: ForgotPassRequest) {
        return axiosClient.post<MessageResponse>('/users/forgot-password', data);
    },

    // Reset password with OTP
    resetPassword(data: ResetPassRequest) {
        return axiosClient.post<MessageResponse>('/users/reset-password', data);
    }
};