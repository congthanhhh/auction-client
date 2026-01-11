// src/api/axiosClient.ts (hoặc axios.ts)
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// QUAN TRỌNG: Xóa dòng import useAuthStore ở đầu file để tránh vòng lặp
// import { useAuthStore } from '@/stores/useAuthStore'; 

// 1. Khởi tạo instance
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 2. Request Interceptor
axiosClient.interceptors.request.use(
    async (config) => {
        // 🔴 SỬA LỖI: Không gắn token nếu đang gọi API refresh
        if (config.url?.indexOf('/auth/refresh-token') !== -1) {
            return config;
        }

        // FIX CIRCULAR DEPENDENCY
        const { useAuthStore } = await import('@/stores/useAuthStore');
        const accessToken = useAuthStore.getState().accessToken;

        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
// 3. Response Interceptor
axiosClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // FIX CIRCULAR DEPENDENCY: Import động store
        const { useAuthStore } = await import('@/stores/useAuthStore');

        // LOG DEBUG: Xem lỗi thực tế là gì
        console.log("Axios Error Interceptor:", {
            url: originalRequest?.url,
            status: error.response?.status,
            isRetry: originalRequest?._retry
        });

        // Kiểm tra cả 401 (Unauthorized) và 403 (Forbidden - đề phòng BE trả sai)
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {

            if (originalRequest.url?.includes('/auth/refresh-token')) {
                useAuthStore.getState().logout();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return axiosClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            console.log("Attempting to refresh token..."); // Log xem có chạy vào đây không

            try {
                const { data } = await axiosClient.post('/auth/refresh-token');
                const newAccessToken = data.accessToken;

                console.log("Refresh success! New token:", newAccessToken); // Log thành công

                useAuthStore.getState().setAccessToken(newAccessToken);
                processQueue(null, newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return axiosClient(originalRequest);

            } catch (refreshError) {
                console.error("Refresh failed:", refreshError); // Log thất bại
                processQueue(refreshError as AxiosError, null);
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;