export interface Feedback {
  id: number;
  orderId: number;
  fromUserId: number;
  toUserId: number;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  fromUser: {
    id: number;
    name: string;
    role: 'buyer' | 'seller';
  };
  toUser: {
    id: number;
    name: string;
    role: 'buyer' | 'seller';
  };
}

export interface UserRating {
  userId: number;
  averageRating: number; // Điểm trung bình
  totalFeedbacks: number; // Tổng số đánh giá
  positiveCount: number; // Số đánh giá 4-5 sao
  neutralCount: number; // Số đánh giá 3 sao
  negativeCount: number; // Số đánh giá 1-2 sao
}
