import { authService } from '@/services/authService';
import type { LoginRequest, OtpVerifyRequest, RegisterRequest } from '@/types/auth';
import type { UserResponse } from '@/types/user';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;
    currentUser: UserResponse | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    verifyOtp: (data: OtpVerifyRequest) => Promise<void>;
    fetchCurrentUser: () => Promise<void>;
    logout: () => Promise<void>;
    loginWithGoogle: (code: string) => Promise<void>;

    setAccessToken: (token: string) => void; // Dùng cho Axios Interceptor gọi

}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            isAuthenticated: false,
            currentUser: null,
            isLoading: false,
            error: null,

            // 1. Action Login
            login: async (data: LoginRequest) => {
                set({ isLoading: true, error: null });
                try {
                    // Gọi API Login
                    const response = await authService.login(data);

                    // Lưu AccessToken (RefreshToken đã vào Cookie)
                    set({
                        accessToken: response.data.accessToken,
                        isAuthenticated: true,
                        isLoading: false
                    });
                    console.log("Response login: ", response.data)

                    // Sau khi có token, gọi ngay API lấy thông tin user
                    await get().fetchCurrentUser();

                } catch (err: any) {
                    // Xử lý lỗi
                    const errorMessage = 'Tài khoản hoặc mật khẩu không đúng.';
                    set({
                        isLoading: false,
                        error: errorMessage,
                        isAuthenticated: false
                    });
                    throw err; // Ném lỗi để UI component bắt được (nếu cần hiển thị toast)
                }
            },

            loginWithGoogle: async (code: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.loginWithGoogle(code);
                    set({
                        accessToken: response.data.accessToken,
                        isAuthenticated: true,
                        isLoading: false
                    });
                    await get().fetchCurrentUser();

                } catch (err: any) {
                    console.error("Google Login Error:", err);
                    set({
                        isLoading: false,
                        error: 'Đăng nhập Google thất bại. Vui lòng thử lại.',
                        isAuthenticated: false
                    });
                    throw err;
                }
            },

            // 2. Action Lấy thông tin User
            fetchCurrentUser: async () => {
                try {
                    const response = await authService.getMyInfo();
                    set({ currentUser: response.data });
                    console.log("currentUser: ", response.data)
                } catch (err) {
                    console.error('Failed to fetch user info', err);
                    // Nếu lỗi lấy info (vd: token hỏng), có thể cân nhắc logout
                    // get().logout(); 
                }
            },

            // 3. Action Logout
            logout: async () => {
                try {
                    // Gọi API để xóa Cookie ở server
                    await authService.logout();
                } catch (err) {
                    console.error('Logout error', err);
                } finally {
                    // Luôn xóa state ở client dù API có lỗi hay không
                    set({
                        accessToken: null,
                        isAuthenticated: false,
                        currentUser: null
                    });
                    // Chuyển hướng trang login hoặc clear dữ liệu khác nếu cần
                }
            },

            // 4. Action Đăng ký (Gửi OTP)
            register: async (data: RegisterRequest) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.register(data);
                    // Thành công thì chỉ tắt loading, UI sẽ tự chuyển bước
                    set({ isLoading: false });
                } catch (err: any) {
                    const errorMessage = err.response?.data?.message || 'Đăng ký thất bại';
                    set({ isLoading: false, error: errorMessage });
                    throw err;
                }
            },

            // 5. Action Xác thực OTP
            verifyOtp: async (data: OtpVerifyRequest) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.verifyOtp(data);
                    set({ isLoading: false });
                } catch (err: any) {
                    const errorMessage = err.response?.data?.message || 'Mã OTP không đúng';
                    set({ isLoading: false, error: errorMessage });
                    throw err;
                }
            },

            // Helper cho Axios Interceptor
            setAccessToken: (token: string) => set({ accessToken: token, isAuthenticated: true }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            // Chỉ lưu accessToken và trạng thái auth, không cần lưu loading/error
            partialize: (state) => ({
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
                currentUser: state.currentUser // Có thể lưu user info để hiển thị ngay khi F5
            }),
        }
    )
);