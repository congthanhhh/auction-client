
import type { ProductStatus } from '@/types/product';

export interface Product {
  id: string;
  name: string;
  currentPrice: string;
  image: string;
  status: 'active' | 'upcoming' | 'featured';
  description?: string;
  endTime?: string;
  startingPrice?: string;
  startTime?: string;
}

// Get product status badge config
export const getProductStatusBadge = (status: ProductStatus) => {
  const configs = {
    WAITING_FOR_APPROVAL: {
      label: 'Chờ duyệt',
      icon: '⏳',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300'
    },
    ACTIVE: {
      label: 'Đã duyệt',
      icon: '✅',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-300'
    },
    REJECTED: {
      label: 'Bị từ chối',
      icon: '❌',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-300'
    },
    BANNED: {
      label: 'Đã bị khóa',
      icon: '🚫',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-300'
    }
  };
  return configs[status];
};

