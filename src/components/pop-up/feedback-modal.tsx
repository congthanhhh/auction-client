import { useState } from 'react';
import { X, Star } from 'lucide-react';
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

const FeedbackModal = ({ isOpen, onClose, targetUser, orderId, productName }: FeedbackModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Nhận xét phải có ít nhất 10 ký tự');
      return;
    }

    setIsSubmitting(true);

    // Mock API call
    setTimeout(() => {
      toast.success(`Đã gửi đánh giá ${rating} sao cho ${targetUser.name}`);
      setIsSubmitting(false);
      onClose();
      // Reset form
      setRating(0);
      setComment('');
    }, 1000);
  };

  const getRatingText = (stars: number) => {
    switch (stars) {
      case 1: return 'Rất tệ';
      case 2: return 'Tệ';
      case 3: return 'Trung bình';
      case 4: return 'Tốt';
      case 5: return 'Xuất sắc';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
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
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

          {/* Rating Stars */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Đánh giá của bạn <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col items-center gap-3 bg-gray-50 rounded-xl p-6">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={`${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              {(hoveredRating || rating) > 0 && (
                <p className="text-lg font-bold text-gray-800">
                  {getRatingText(hoveredRating || rating)}
                </p>
              )}
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
