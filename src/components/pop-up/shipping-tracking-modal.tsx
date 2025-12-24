import { X, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface ShippingTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (trackingCode: string, shippingProvider: string) => void;
  orderId: string;
  productName: string;
}

const ShippingTrackingModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  orderId,
  productName 
}: ShippingTrackingModalProps) => {
  const [trackingCode, setTrackingCode] = useState('');
  const [shippingProvider, setShippingProvider] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Validation
    if (!trackingCode.trim()) {
      setError('Vui lòng nhập mã vận đơn');
      return;
    }
    if (!shippingProvider) {
      setError('Vui lòng chọn đơn vị vận chuyển');
      return;
    }

    // Call parent handler
    onSubmit(trackingCode, shippingProvider);
    
    // Reset form
    setTrackingCode('');
    setShippingProvider('');
    setError('');
    onClose();
  };

  const shippingProviders = [
    { value: 'GHTK', label: 'Giao Hàng Tiết Kiệm (GHTK)', website: 'https://giaohangtietkiem.vn' },
    { value: 'GHN', label: 'Giao Hàng Nhanh (GHN)', website: 'https://ghn.vn' },
    { value: 'VIETTEL_POST', label: 'Viettel Post', website: 'https://viettelpost.vn' },
    { value: 'VN_POST', label: 'Bưu điện Việt Nam', website: 'https://vnpost.vn' },
    { value: 'J&T', label: 'J&T Express', website: 'https://jtexpress.vn' },
    { value: 'BEST_EXPRESS', label: 'Best Express', website: 'https://best-inc.vn' },
    { value: 'NINJA_VAN', label: 'Ninja Van', website: 'https://ninjavan.co' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Xác nhận giao hàng</h2>
              <p className="text-blue-100 text-sm mt-1">
                Nhập mã vận đơn để cập nhật trạng thái đơn hàng
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Mã đơn hàng</p>
                <p className="font-bold text-gray-800">{orderId}</p>
                <p className="text-sm text-gray-700 mt-1">{productName}</p>
              </div>
            </div>
          </div>

          {/* Shipping Provider Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Đơn vị vận chuyển *
            </label>
            <select
              value={shippingProvider}
              onChange={(e) => {
                setShippingProvider(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            >
              <option value="">-- Chọn đơn vị vận chuyển --</option>
              {shippingProviders.map((provider) => (
                <option key={provider.value} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
            {shippingProvider && (
              <p className="text-xs text-gray-500 mt-2">
                Website theo dõi: <a 
                  href={shippingProviders.find(p => p.value === shippingProvider)?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {shippingProviders.find(p => p.value === shippingProvider)?.website}
                </a>
              </p>
            )}
          </div>

          {/* Tracking Code Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mã vận đơn (Tracking Code) *
            </label>
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => {
                setTrackingCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="Ví dụ: VN123456789"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-mono text-lg"
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Mã vận đơn được cung cấp bởi bưu cục khi bạn gửi hàng
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Timeline Instruction */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Quy trình giao hàng
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-800">Bạn nhập mã vận đơn</p>
                  <p className="text-gray-600">Đơn hàng chuyển sang trạng thái "Đang giao hàng"</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-800">Người mua theo dõi</p>
                  <p className="text-gray-600">Họ sẽ thấy mã vận đơn và tự tra cứu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-800">Người mua nhận hàng</p>
                  <p className="text-gray-600">Họ bấm "Đã nhận được hàng" hoặc hệ thống tự động sau 15 ngày</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-800">Đánh giá lẫn nhau</p>
                  <p className="text-gray-600">Cả 2 bên có thể để lại feedback</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Truck className="w-5 h-5" />
            Xác nhận đã gửi hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingTrackingModal;
