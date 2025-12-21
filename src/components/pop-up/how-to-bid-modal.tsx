import { X, Gavel, TrendingUp, Shield, CheckCircle, AlertCircle, Zap } from 'lucide-react';

interface HowToBidModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToBidModal = ({ isOpen, onClose }: HowToBidModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Gavel size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Hướng dẫn đấu giá</h2>
                <p className="text-blue-100 text-sm">Proxy Bidding - Đấu giá thông minh</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Step 1 */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-500 text-white rounded-lg flex-shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-bold text-green-900 mb-2">1. Đặt giá tối đa</h3>
                <p className="text-sm text-green-800">
                  Nhập mức giá cao nhất bạn sẵn sàng trả. Hệ thống sẽ tự động đấu giá thay bạn.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500 text-white rounded-lg flex-shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-2">2. Tự động tăng giá</h3>
                <p className="text-sm text-blue-800">
                  Hệ thống chỉ tăng giá đủ để vượt qua người khác, không dùng hết giá tối đa ngay.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-500 text-white rounded-lg flex-shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-bold text-purple-900 mb-2">3. Bảo mật thông tin</h3>
                <p className="text-sm text-purple-800">
                  Giá tối đa của bạn được bảo mật. Người khác chỉ thấy giá đấu hiện tại.
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-500 text-white rounded-lg flex-shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">4. Thắng với giá tốt</h3>
                <p className="text-sm text-yellow-800">
                  Nếu thắng, bạn chỉ trả cao hơn 1 bước giá so với người thứ 2, không phải giá tối đa.
                </p>
              </div>
            </div>
          </div>

          {/* Example */}
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4 mt-6">
            <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <AlertCircle size={18} />
              Ví dụ minh họa
            </h3>
            <div className="space-y-2 text-sm text-indigo-800">
              <div className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                <p>
                  <span className="font-semibold">Bạn đặt:</span> 10,000,000đ (giá tối đa)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                <p>
                  <span className="font-semibold">Hệ thống bid:</span> 5,100,000đ (vừa đủ để thắng)
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                <p>
                  <span className="font-semibold">Người khác bid:</span> 8,000,000đ
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-indigo-600">•</span>
                <p>
                  <span className="font-semibold">Hệ thống tự tăng:</span> 8,100,000đ (vẫn trong giới hạn)
                </p>
              </div>
              <div className="flex items-start gap-2 mt-3 p-3 bg-green-100 rounded-lg">
                <span className="font-bold text-green-600">✓</span>
                <p className="font-semibold text-green-900">
                  Kết quả: Bạn thắng với 8,100,000đ thay vì 10,000,000đ!
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 mt-4">
            <h3 className="font-bold text-orange-900 mb-3">💡 Mẹo đấu giá</h3>
            <ul className="space-y-2 text-sm text-orange-800">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">→</span>
                <span>Đặt giá tối đa theo giá trị thực của sản phẩm với bạn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">→</span>
                <span>Không cần theo dõi liên tục, hệ thống đấu giá tự động</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 font-bold">→</span>
                <span>Đấu giá sớm để tăng cơ hội thắng</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Đã hiểu, bắt đầu đấu giá!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToBidModal;
