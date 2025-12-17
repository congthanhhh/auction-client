// src/stores/useUserStore.ts

import { create } from 'zustand';
import { userService } from '@/services/userService';
import type { UserResponse } from '@/types/user';

interface UserState {
    // Profile data
    profileUser: UserResponse | null;
    
    // Loading states
    isLoadingProfile: boolean;
    
    // Error handling
    error: string | null;
    
    // Actions
    fetchUserProfile: (userId?: string) => Promise<void>;
    fetchMyProfile: () => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    // Initial state
    profileUser: null,
    isLoadingProfile: false,
    error: null,

    // Fetch user profile by ID
    fetchUserProfile: async (userId?: string) => {
        if (!userId) {
            set({ error: 'User ID is required' });
            return;
        }

        set({ isLoadingProfile: true, error: null });
        try {
            const response = await userService.getUser(userId);
            set({
                profileUser: response.data,
                isLoadingProfile: false
            });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            set({
                error: err.response?.data?.message || 'Không thể tải thông tin người dùng',
                isLoadingProfile: false
            });
        }
    },

    // Fetch current user profile (my-info)
    fetchMyProfile: async () => {
        set({ isLoadingProfile: true, error: null });
        try {
            const response = await userService.getMyInfo();
            set({
                profileUser: response.data,
                isLoadingProfile: false
            });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            set({
                error: err.response?.data?.message || 'Không thể tải thông tin cá nhân',
                isLoadingProfile: false
            });
        }
    },

    // Utilities
    clearError: () => set({ error: null }),
    reset: () => set({
        profileUser: null,
        isLoadingProfile: false,
        error: null
    })
}));
