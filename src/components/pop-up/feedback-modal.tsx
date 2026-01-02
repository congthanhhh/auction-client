import { useState } from 'react';
import { X, Star } from 'lucide-react';

// Types
export type FeedbackRating = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  targetUser: {
    id: string;
    name: string;
    avatar: string;
    role: 'seller' | 'buyer';
  };
  product: {
    name: string;
    image: string;
    auctionId: string;
  };
  onSubmit: (data: {
    orderId: string;
    targetUserId: string;
    rating: FeedbackRating;
    comment: string;
  }) => void;
}

const FeedbackModal = ({
  isOpen,
  onClose,
  orderId,
  targetUser,
  product,
  onSubmit
}: FeedbackModalProps) => {
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      alert('Vui lòng chọn mức độ hài lòng và nhập nội dung đánh giá!');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        orderId,
        targetUserId: targetUser.id,
        rating,
        comment: comment.trim()
      });

      // Reset form
      setRating(null);
      setComment('');
      onClose();
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingConfig = (ratingType: FeedbackRating) => {
    const configs = {
      POSITIVE: {
        emoji: '😊',
        label: 'Tích cực',
        description: 'Hài lòng',
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-500',
        textColor: 'text-green-700',
        hoverBg: 'hover:bg-green-100'
      },
      NEUTRAL: {
        emoji: '😐',
        label: 'Trung lập',
        description: 'Tạm được',
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-500',
        textColor: 'text-yellow-700',
        hoverBg: 'hover:bg-yellow-100'
      },
      NEGATIVE: {
        emoji: '☹️',
        label: 'Tiêu cực',
        description: 'Không hài lòng',
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-500',
        textColor: 'text-red-700',
        hoverBg: 'hover:bg-red-100'
      }
    };
    return configs[ratingType];
  };

  const getPlaceholder = () => {
    if (targetUser.role === 'seller') {
      return 'Chất lượng sản phẩm thế nào? Đóng gói có kỹ không? Giao hàng có nhanh không?...';
    }
    return 'Khách hàng có thanh toán đúng hạn không? Có thiện chí nhận hàng không?...';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                <Star size={28} />
                Đánh giá giao dịch
              </h2>
              <p className="text-indigo-100 text-sm">
                Chia sẻ trải nghiệm của bạn để giúp cộng đồng mua bán an toàn hơn
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Context Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-indigo-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Bạn đang đánh giá:</h3>

            {/* User Info */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={targetUser.avatar}
                alt={targetUser.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div>
                <p className="font-bold text-gray-800 text-lg">{targetUser.name}</p>
                <p className="text-sm text-gray-600">
                  {targetUser.role === 'seller' ? '👤 Người bán' : '🛍️ Người mua'}
                </p>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm line-clamp-1">{product.name}</p>
                <p className="text-xs text-gray-500">Phiên #{product.auctionId}</p>
              </div>
            </div>
          </div>

          {/* Rating Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Mức độ hài lòng <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {(['POSITIVE', 'NEUTRAL', 'NEGATIVE'] as FeedbackRating[]).map((ratingType) => {
                const config = getRatingConfig(ratingType);
                const isSelected = rating === ratingType;

                return (
                  <button
                    key={ratingType}
                    onClick={() => setRating(ratingType)}
                    className={`
                      relative p-5 rounded-xl border-2 transition-all
                      ${isSelected
                        ? `${config.borderColor} ${config.bgColor} shadow-lg scale-105`
                        : 'border-gray-200 bg-white hover:border-gray-300 opacity-70'
                      }
                      ${config.hoverBg}
                    `}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                    )}
                    <div className="text-5xl mb-3">{config.emoji}</div>
                    <p className={`font-bold text-lg mb-1 ${isSelected ? config.textColor : 'text-gray-700'}`}>
                      {config.label}
                    </p>
                    <p className="text-xs text-gray-500">{config.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Nội dung đánh giá <span className="text-red-500">*</span>
            </h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none resize-none transition-colors"
              rows={5}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right mt-2">
              {comment.length}/500 ký tự
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!rating || !comment.trim() || isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang gửi...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Star size={20} />
                  Gửi đánh giá
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
