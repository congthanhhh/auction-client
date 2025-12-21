import { X, Star, MessageSquare, Clock, CheckCircle } from 'lucide-react';

interface Feedback {
  id: number;
  rating: number;
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

interface ViewFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackGiven?: Feedback | null;
  feedbackReceived?: Feedback | null;
  orderId: number;
  productName: string;
  hasGivenFeedback: boolean;
}

const ViewFeedbackModal = ({
  isOpen,
  onClose,
  feedbackGiven,
  feedbackReceived,
  orderId,
  productName,
  hasGivenFeedback,
}: ViewFeedbackModalProps) => {
  if (!isOpen) return null;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={`${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Chi tiết đánh giá</h2>
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

        <div className="p-6 space-y-6">
          {/* Feedback Given */}
          {feedbackGiven ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="text-green-600" size={24} />
                <h3 className="text-lg font-bold text-gray-800">
                  Đánh giá bạn đã gửi
                </h3>
              </div>

              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">
                    {feedbackGiven.toUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {feedbackGiven.toUser.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {feedbackGiven.toUser.role === 'seller' ? 'Người bán' : 'Người mua'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  {renderStars(feedbackGiven.rating)}
                  <span className="text-sm font-semibold text-gray-700">
                    {getRatingText(feedbackGiven.rating)}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-700 leading-relaxed">{feedbackGiven.comment}</p>
                </div>

                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <Clock size={14} />
                  <span>
                    Đánh giá lúc: {new Date(feedbackGiven.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="text-yellow-600" size={24} />
                <h3 className="text-lg font-bold text-gray-800">
                  Chưa gửi đánh giá
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                Bạn chưa gửi đánh giá cho đơn hàng này.
              </p>
            </div>
          )}

          {/* Feedback Received */}
          {!hasGivenFeedback ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="text-blue-600" size={24} />
                <h3 className="text-lg font-bold text-gray-800">
                  Đánh giá bạn nhận được
                </h3>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="text-blue-600" size={32} />
                </div>
                <p className="text-gray-700 font-semibold mb-2">
                  Gửi đánh giá của bạn để xem đánh giá từ người kia
                </p>
                <p className="text-sm text-gray-600">
                  💡 Đây là cơ chế khuyến khích cả hai bên đều để lại đánh giá trung thực
                </p>
              </div>
            </div>
          ) : feedbackReceived ? (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Star className="text-purple-600 fill-purple-600" size={24} />
                <h3 className="text-lg font-bold text-gray-800">
                  Đánh giá bạn nhận được
                </h3>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                    {feedbackReceived.fromUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {feedbackReceived.fromUser.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {feedbackReceived.fromUser.role === 'seller' ? 'Người bán' : 'Người mua'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  {renderStars(feedbackReceived.rating)}
                  <span className="text-sm font-semibold text-gray-700">
                    {getRatingText(feedbackReceived.rating)}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-700 leading-relaxed">{feedbackReceived.comment}</p>
                </div>

                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <Clock size={14} />
                  <span>
                    Đánh giá lúc: {new Date(feedbackReceived.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-gray-600" size={24} />
                <h3 className="text-lg font-bold text-gray-800">
                  Đánh giá bạn nhận được
                </h3>
              </div>
              <p className="text-sm text-gray-700">
                Người kia chưa gửi đánh giá cho bạn.
              </p>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewFeedbackModal;
