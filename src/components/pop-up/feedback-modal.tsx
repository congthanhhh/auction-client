import { useState } from 'react';
import { X, ThumbsUp, Minus, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: number;
    name: string;
    role: 'buyer' | 'seller';
  };
  orderId: number;
  productName: string;
}

// Rating types: 1 = Positive (+1), 0 = Neutral (0), -1 = Negative (-1)
type RatingType = 1 | 0 | -1 | null;

const FeedbackModal = ({ isOpen, onClose, targetUser, orderId, productName }: FeedbackModalProps) => {
  const [rating, setRating] = useState<RatingType>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === null) {
      toast.error('Vui lòng chọn đánh giá');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Nhận xét phải có ít nhất 10 ký tự');
      return;
    }

    setIsSubmitting(true);

    // Mock API call
    setTimeout(() => {
      const ratingText = rating === 1 ? 'Tốt' : rating === 0 ? 'Trung bình' : 'Không hài lòng';
      toast.success(`Đã gửi đánh giá "${ratingText}" cho ${targetUser.name}`);
      setIsSubmitting(false);
      onClose();
      // Reset form
      setRating(null);
      setComment('');
    }, 1000);
  };

  const ratingOptions = [
    {
      value: 1,
      label: 'Tốt',
      icon: ThumbsUp,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
      description: '+1 điểm'
    },
    {
      value: 0,
      label: 'Trung bình',
      icon: Minus,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-600',
      description: '+0 điểm'
    },
    {
      value: -1,
      label: 'Không hài lòng',
      icon: ThumbsDown,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
      description: '-1 điểm'
    },
  ] as const;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Đánh giá {targetUser.role === 'seller' ? 'người bán' : 'người mua'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Đơn hàng: <span className="font-semibold">{productName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Target User Info */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-6 border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-lg">
                {targetUser.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{targetUser.name}</p>
                <p className="text-sm text-gray-600">
                  {targetUser.role === 'seller' ? '👤 Người bán' : '👤 Người mua'}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Options */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Đánh giá của bạn <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {ratingOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = rating === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRating(option.value as RatingType)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `${option.bgColor} ${option.borderColor} shadow-lg scale-105`
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <Icon
                      size={32}
                      className={`mx-auto mb-2 ${
                        isSelected ? option.iconColor : 'text-gray-400'
                      }`}
                    />
                    <p
                      className={`font-bold text-sm mb-1 ${
                        isSelected ? option.textColor : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nhận xét <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                targetUser.role === 'seller'
                  ? 'Ví dụ: Hàng đẹp, đóng gói kỹ, giao hàng nhanh...'
                  : 'Ví dụ: Người mua thanh toán nhanh, nhiệt tình...'
              }
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">
              {comment.length}/500 ký tự (tối thiểu 10)
            </p>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-blue-800 mb-2">💡 Lưu ý khi đánh giá:</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Đánh giá trung thực dựa trên trải nghiệm thực tế</li>
              <li>• Không sử dụng từ ngữ xúc phạm, mang tính chất công kích</li>
              <li>• Sau khi gửi đánh giá, bạn có thể xem đánh giá từ người kia</li>
              <li>• Đánh giá không thể chỉnh sửa sau khi gửi</li>
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
