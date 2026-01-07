import axiosClient from "@/lib/axios";
import type { CategoryRequest, CategoryResponse } from "@/types/category";
import type { PageResponse } from "@/types/common";

export const categoryService = {
    getAllCategories(page: number = 1, size: number = 10) {
        return axiosClient.get<PageResponse<CategoryResponse>>('/categories', {
            params: { page, size }
        });
    },

    getCategoryById(categoryId: number) {
        return axiosClient.get<CategoryResponse>(`/categories/${categoryId}`);
    },

    createCategory(request: CategoryRequest) {
        return axiosClient.post<CategoryResponse>('/categories', request);
    },

    updateCategory(categoryId: number, request: CategoryRequest) {
        return axiosClient.post<CategoryResponse>(`/categories/${categoryId}`, request);
    },

    deleteCategory(categoryId: number) {
        return axiosClient.delete<void>(`/categories/${categoryId}`);
    }
};
