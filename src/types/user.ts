
export interface UserResponse {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    noPassword?: boolean;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    roles: RoleResponse[];
}

// Dựa trên RoleResponse.java
export interface RoleResponse {
    name: string;
    description: string;
    permissions: PermissionResponse[];
}

export interface PermissionResponse {
    name: string;
    description: string;
}

// Public profile response (no authentication required)
export interface PublicUserProfileResponse {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    reputationScore: number;
    createdAt: string;
}

export interface SimpleUserResponse {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export interface UserProfileResponse {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    noPassword: boolean;
    isActive: boolean;
    strikeCount: number;
    reputationScore: number;
    createdAt: string;
    roles: RoleResponse[];
}

// Admin user search parameters
export interface UserSearchParams {
    page?: number;
    size?: number;
    isActive?: boolean;
    role?: 'ADMIN' | 'USER';
    sort?: 'newest' | 'oldest';
}

// Admin creation request
export interface AdminCreationRequest {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    isActive?: boolean;
    roles?: string[];
}

// Admin update request
export interface AdminUpdateRequest {
    password?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    isActive?: boolean;
    strikeCount?: number;
    reputationScore?: number;
    roles?: string[];
}