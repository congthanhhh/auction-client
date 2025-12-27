import axiosClient from "@/lib/axios";

export interface Image {
    id: number;
    url: string;
}

export const imageService = {
    // Upload single image
    uploadImage: async (file: File): Promise<Image> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosClient.post<Image>('/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete image by ID
    deleteImage: async (imageId: number): Promise<void> => {
        await axiosClient.delete(`/images/${imageId}`);
    },
};
