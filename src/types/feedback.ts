export type FeedbackRating = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export interface FeedbackRequest {
  rating: FeedbackRating;
  comment?: string;
}

export interface MessageResponse {
  message: string;
}

export interface Feedback {
  id: number;
  orderId: number;
  fromUserId: number;
  toUserId: number;
  rating: 1 | 0 | -1; // +1 (Tốt), 0 (Trung bình), -1 (Không hài lòng)
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
  totalScore: number; // Tổng điểm (tích lũy từ +1/0/-1)
  totalFeedbacks: number; // Tổng số đánh giá
  positiveCount: number; // Số đánh giá Tốt (+1)
  neutralCount: number; // Số đánh giá Trung bình (0)
  negativeCount: number; // Số đánh giá Không hài lòng (-1)
}

// Public feedback DTO (for public profile page)
export interface FeedbackDto {
  id: number;
  fromUsername: string;
  toUsername: string;
  rating: FeedbackRating;
  comment: string;
  createdAt: string;
  reviewAs: 'SELLER' | 'BUYER';
}

export interface FeedbackResponse {
  id: number;
  fromUser: {
    username: string;
    firstName: string;
    lastName: string;
  };
  toUser: {
    username: string;
    firstName: string;
    lastName: string;
  };
  rating: FeedbackRating;
  comment: string;
  createdAt: string;
  invoiceId: number;
  reviewAs: 'SELLER' | 'BUYER';
}
