// src/services/addressService.ts

import axiosClient from "@/lib/axios";

export interface AddressResponse {
    id: number;
    recipientName: string;
    phoneNumber: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    isDefault: boolean;
    fullAddress: string;
}

export interface AddressRequest {
    recipientName: string;
    phoneNumber: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    isDefault?: boolean;
}

export interface MessageResponse {
    message: string;
}

export const addressService = {
    // GET /address - Get all my addresses
    getMyAddresses() {
        return axiosClient.get<AddressResponse[]>('/address');
    },

    // POST /address - Create new address
    createAddress(data: AddressRequest) {
        return axiosClient.post<AddressResponse>('/address', data);
    },

    // PATCH /address/{id}/default - Set default address
    setDefaultAddress(id: number) {
        return axiosClient.patch<MessageResponse>(`/address/${id}/default`);
    },

    // DELETE /address/{id} - Delete address
    deleteAddress(id: number) {
        return axiosClient.delete<string>(`/address/${id}`);
    }
};
