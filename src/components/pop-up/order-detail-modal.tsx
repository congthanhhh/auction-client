import { X, Package, User, MapPin, Phone, Mail, Clock, CheckCircle, Truck, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: number;
    orderId: string;
    productName: string;
    image: string;
    buyer: string;
    buyerEmail: string;
    buyerPhone: string;
    shippingAddress: string;
    amount: number;
    status: string;
    paidDate: string;
    shippedDate?: string;
    completedDate?: string;
    trackingCode?: string;
    feedbackGiven?: boolean;
    rating?: number;
  };
}

const OrderDetailModal = ({ isOpen, onClose, order }: OrderDetailModalProps) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PAID': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'SHIPPING': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-300';
      case 'DISPUTE': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const translateStatus = (status: string) => {
    const translations: { [key: string]: string } = {
      'PAID': 'Đã thanh toán',
      'SHIPPING': 'Đang giao hàng',
      'COMPLETED': 'Hoàn thành',
      'DISPUTE': 'Tranh chấp'
    };
    return translations[status] || status;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã copy vào clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Chi tiết đơn hàng</h2>
              <p className="text-purple-100 text-sm mt-1">Mã đơn: {order.orderId}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold border-2 ${getStatusColor(order.status)}`}>
              {order.status === 'COMPLETED' && <CheckCircle className="w-5 h-5" />}
              {order.status === 'SHIPPING' && <Truck className="w-5 h-5" />}
              {order.status === 'DISPUTE' && <AlertCircle className="w-5 h-5" />}
              {translateStatus(order.status)}
            </span>
          </div>

          {/* Product Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Thông tin sản phẩm
            </h3>
            <div className="flex gap-4">
              <img
                src={order.image}
                alt={order.productName}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-bold text-lg text-gray-800 mb-2">{order.productName}</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(order.amount)}</p>
              </div>
            </div>
          </div>

          {/* Buyer Info */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Thông tin người mua
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Họ tên</p>
                  <p className="font-semibold text-gray-800">{order.buyer}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800 text-sm">{order.buyerEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Số điện thoại</p>
                  <p className="font-semibold text-gray-800">{order.buyerPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Địa chỉ giao hàng</p>
                  <p className="font-semibold text-gray-800">{order.shippingAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Lịch sử đơn hàng
            </h3>
            <div className="space-y-4">
              {/* Paid */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  {(order.shippedDate || order.completedDate) && (
                    <div className="w-0.5 h-12 bg-green-300 my-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-bold text-gray-800">Đã thanh toán</p>
                  <p className="text-sm text-gray-600">{formatDate(order.paidDate)}</p>
                  <p className="text-xs text-gray-500 mt-1">Người mua đã hoàn tất thanh toán qua PayPal Sandbox</p>
                </div>
              </div>

              {/* Shipped */}
              {order.shippedDate && (
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      ✓
                    </div>
                    {order.completedDate && (
                      <div className="w-0.5 h-12 bg-blue-300 my-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-bold text-gray-800">Đã giao cho đơn vị vận chuyển</p>
                    <p className="text-sm text-gray-600">{formatDate(order.shippedDate)}</p>
                    {order.trackingCode && (
                      <div className="mt-2 flex items-center gap-2">
                        <code className="bg-blue-100 text-blue-700 px-3 py-1 rounded font-mono font-bold">
                          {order.trackingCode}
                        </code>
                        <button
                          onClick={() => copyToClipboard(order.trackingCode!)}
                          className="p-1 hover:bg-blue-100 rounded transition-colors"
                          title="Copy mã vận đơn"
                        >
                          <Copy className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Completed */}
              {order.completedDate && (
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                      ✓
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">Hoàn thành</p>
                    <p className="text-sm text-gray-600">{formatDate(order.completedDate)}</p>
                    <p className="text-xs text-gray-500 mt-1">Người mua đã xác nhận nhận được hàng</p>
                    {order.feedbackGiven && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Đã đánh giá {order.rating} ⭐
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pending States */}
              {!order.shippedDate && (
                <div className="flex items-start gap-4 opacity-50">
                  <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">
                    ?
                  </div>
                  <div>
                    <p className="font-bold text-gray-600">Chờ giao hàng</p>
                    <p className="text-xs text-gray-500">Vui lòng nhập mã vận đơn</p>
                  </div>
                </div>
              )}

              {order.shippedDate && !order.completedDate && (
                <div className="flex items-start gap-4 opacity-50">
                  <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">
                    ?
                  </div>
                  <div>
                    <p className="font-bold text-gray-600">Chờ người mua xác nhận</p>
                    <p className="text-xs text-gray-500">Hoặc tự động hoàn thành sau 15 ngày</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Important Note */}
          {order.status === 'SHIPPING' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-yellow-800 mb-1">Lưu ý quan trọng</p>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Người mua có thể theo dõi đơn hàng bằng mã vận đơn</li>
                    <li>• Đơn hàng sẽ tự động hoàn thành sau 15 ngày kể từ khi giao hàng</li>
                    <li>• Nếu có vấn đề, người mua có thể mở khiếu nại trong vòng 15 ngày</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
