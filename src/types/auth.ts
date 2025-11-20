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

// Dựa trên OtpVerificationRequest.java
export interface OtpVerifyRequest {
    email: string;
    otp: string;
}

export interface MessageResponse {
    message: string;
}