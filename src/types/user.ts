
export interface UserResponse {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    roles: RoleResponse[];
    // Thêm các trường khác nếu BE trả về (createdAt, updatedAt...)
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

export interface SimpleUserResponse {
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