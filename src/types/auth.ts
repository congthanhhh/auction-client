export interface AuthenticationResponse {
    accessToken: string;
    refreshToken: null;
    authenticated: boolean;
}

// Type cho payload Login
export interface LoginRequest {
    username: string; // hoặc email tùy logic của bạn
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

// Enhanced request with additional fields
export interface UserCreationRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    isActive?: boolean;
    createdAt?: string;
}

// Dựa trên OtpVerificationRequest.java
export interface OtpVerifyRequest {
    email: string;
    otp: string;
}

export interface MessageResponse {
    message: string;
}

// Password creation request for Google OAuth users
export interface PasswordCreationRequest {
    password: string;
}

// Forgot password request
export interface ForgotPassRequest {
    email: string;
}

// Reset password request
export interface ResetPassRequest {
    email: string;
    otp: string;
    newPassword: string;
}