import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Phone,
  User,
  Calendar,
  Clock,
  Copy,
  MessageCircle,
  AlertTriangle,
  ArrowLeft,
  Navigation,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import PageLayout from './page-layout';

interface ShippingStatus {
  status: string;
  description: string;
  timestamp: string;
  location: string;
  completed: boolean;
}

// Mock shipping data
const MOCK_SHIPPING = {
  orderId: 2,
  productName: 'MacBook Pro M3 16 inch',
  productImage: 'https://via.placeholder.com/120',
  trackingCode: 'VN987654321',
  carrier: 'Giao Hàng Nhanh',
  estimatedDelivery: '2025-01-02T10:00:00Z',
  shippedAt: '2024-12-18T10:00:00Z',
  currentStatus: 'in_transit',
  
  sender: {
    name: 'Trần Thị B',
    phone: '0901234567',
    address: '123 Đường ABC, Quận 1, TP.HCM',
  },
  
  receiver: {
    name: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '456 Đường XYZ, Quận 7, TP.HCM',
  },
  
  shipper: {
    name: 'Lê Văn C',
    phone: '0923456789',
    vehicle: 'Xe máy',
  },
  
  timeline: [
    {
      status: 'Đơn hàng đã được tạo',
      description: 'Người bán đã xác nhận đơn hàng',
      timestamp: '2024-12-18T09:00:00Z',
      location: 'Quận 1, TP.HCM',
      completed: true,
    },
    {
      status: 'Đã lấy hàng',
      description: 'Shipper đã nhận hàng từ người bán',
      timestamp: '2024-12-18T10:30:00Z',
      location: 'Quận 1, TP.HCM',
      completed: true,
    },
    {
      status: 'Đang vận chuyển',
      description: 'Hàng đang trên đường giao đến bạn',
      timestamp: '2024-12-18T14:00:00Z',
      location: 'Đang di chuyển',
      completed: true,
    },
    {
      status: 'Giao hàng',
      description: 'Shipper sẽ giao hàng cho bạn',
      timestamp: '2025-01-02T10:00:00Z',
      location: 'Quận 7, TP.HCM',
      completed: false,
    },
    {
      status: 'Hoàn thành',
      description: 'Đơn hàng đã được giao thành công',
      timestamp: '',
      location: '',
      completed: false,
    },
  ],
};

const Shipping = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // In real app, get from location.state or API
  const shipment = location.state?.shipment || MOCK_SHIPPING;
  
  const [showContactShipper, setShowContactShipper] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi,
      });
    } catch {
      return 'Không xác định';
    }
  };

  const copyTrackingCode = () => {
    navigator.clipboard.writeText(shipment.trackingCode);
    toast.success('Đã sao chép mã vận đơn!');
  };

  const handleContactShipper = () => {
    toast.info(`Đang kết nối với shipper: ${shipment.shipper.name}`);
  };

  const handleReportIssue = () => {
    toast.warning('Mở form báo cáo vấn đề');
  };

  const getCurrentStep = () => {
    return shipment.timeline.findIndex(step => !step.completed);
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Theo dõi đơn hàng</h1>
            <p className="text-gray-500 mt-1">Cập nhật trạng thái vận chuyển</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Tracking Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Code Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Package size={28} />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Mã vận đơn</p>
                    <h2 className="text-2xl font-bold font-mono">{shipment.trackingCode}</h2>
                  </div>
                </div>
                <button
                  onClick={copyTrackingCode}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <Copy size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-sm opacity-90">Đơn vị vận chuyển</p>
                  <p className="font-semibold">{shipment.carrier}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Dự kiến giao hàng</p>
                  <p className="font-semibold">
                    {formatTimeAgo(shipment.estimatedDelivery)}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Thông tin sản phẩm</h3>
              <div className="flex gap-4">
                <img
                  src={shipment.productImage}
                  alt={shipment.productName}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{shipment.productName}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Mã đơn hàng: #{shipment.orderId}
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Navigation size={20} className="text-blue-600" />
                Lộ trình vận chuyển
              </h3>

              <div className="relative">
                {shipment.timeline.map((step, index) => (
                  <div key={index} className="relative pb-8 last:pb-0">
                    {/* Connection Line */}
                    {index < shipment.timeline.length - 1 && (
                      <div
                        className={`absolute left-5 top-12 w-0.5 h-full ${
                          step.completed ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}

                    {/* Step Content */}
                    <div className="relative flex gap-4">
                      {/* Step Icon */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-blue-600 text-white'
                            : index === getCurrentStep()
                            ? 'bg-yellow-500 text-white animate-pulse'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle size={20} />
                        ) : index === getCurrentStep() ? (
                          <Truck size={20} />
                        ) : (
                          <Clock size={20} />
                        )}
                      </div>

                      {/* Step Details */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4
                            className={`font-semibold ${
                              step.completed
                                ? 'text-gray-900'
                                : index === getCurrentStep()
                                ? 'text-yellow-600'
                                : 'text-gray-400'
                            }`}
                          >
                            {step.status}
                          </h4>
                          {step.timestamp && (
                            <span className="text-sm text-gray-500">
                              {formatTimeAgo(step.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                        {step.location && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin size={12} />
                            {step.location}
                          </p>
                        )}
                        {step.timestamp && (
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(step.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-yellow-900">
                    Dự kiến giao hàng: {formatDate(shipment.estimatedDelivery)}
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Shipper sẽ liên hệ với bạn trước khi giao hàng
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            {/* Shipper Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck size={20} className="text-blue-600" />
                Thông tin shipper
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="text-gray-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Tên shipper</p>
                    <p className="font-semibold text-gray-900">{shipment.shipper.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="text-gray-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="font-semibold text-gray-900">{shipment.shipper.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Truck className="text-gray-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Phương tiện</p>
                    <p className="font-semibold text-gray-900">{shipment.shipper.vehicle}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContactShipper}
                className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Liên hệ shipper
              </button>
            </div>

            {/* Sender Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Người gửi</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <User size={16} className="text-gray-500" />
                  <span className="font-semibold">{shipment.sender.name}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-500" />
                  <span>{shipment.sender.phone}</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>{shipment.sender.address}</span>
                </p>
              </div>
            </div>

            {/* Receiver Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Người nhận</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <User size={16} className="text-gray-500" />
                  <span className="font-semibold">{shipment.receiver.name}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-500" />
                  <span>{shipment.receiver.phone}</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>{shipment.receiver.address}</span>
                </p>
              </div>
            </div>

            {/* Report Issue */}
            <button
              onClick={handleReportIssue}
              className="w-full py-3 bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <AlertTriangle size={18} />
              Báo cáo vấn đề
            </button>

            {/* Help Text */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-600">
                💡 <span className="font-semibold">Lưu ý:</span> Vui lòng kiểm tra hàng trước khi nhận. 
                Nếu có vấn đề, hãy báo cáo ngay để được hỗ trợ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Shipping;
