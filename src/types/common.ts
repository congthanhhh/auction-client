export interface PageResponse<T> {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    data: T[];
}

export interface NotificationResponse {
    id: number;
    message: string;
    createdAt: string;
    isRead: boolean;
    link: string;
}