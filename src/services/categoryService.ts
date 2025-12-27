import axiosClient from "@/lib/axios";

export interface CategoryResponse {
    id: number;
    name: string;
    description: string;
}

export const categoryService = {
    // Get all categories
    getAllCategories: async (): Promise<CategoryResponse[]> => {
        const response = await axiosClient.get<CategoryResponse[]>('/categories');
        return response.data;
    },

    // Get category by ID
    getCategoryById: async (id: number): Promise<CategoryResponse> => {
        const response = await axiosClient.get<CategoryResponse>(`/categories/${id}`);
        return response.data;
    },
};
