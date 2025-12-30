import { X, Package, User, Mail, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import type { InvoiceResponse } from '@/types/invoice';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: InvoiceResponse;
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
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'PAID': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'SHIPPING': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-300';
      case 'DISPUTE': return 'bg-red-100 text-red-700 border-red-300';
      case 'CANCELLED_NON_PAYMENT': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'REFUNDED': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const translateStatus = (status: string) => {
    const translations: { [key: string]: string } = {
      'PENDING': 'Chờ thanh toán',
      'PAID': 'Đã thanh toán',
      'SHIPPING': 'Đang giao hàng',
      'COMPLETED': 'Hoàn thành',
      'DISPUTE': 'Tranh chấp',
      'CANCELLED_NON_PAYMENT': 'Hủy do không thanh toán',
      'CANCELLED_BY_SELLER': 'Hủy bởi người bán',
      'REFUNDED': 'Đã hoàn tiền'
    };
    return translations[status] || status;
  };

  const isListingFee = order.type === 'LISTING_FEE';
  const isAuctionSale = order.type === 'AUCTION_SALE';

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
              <h2 className="text-2xl font-bold">Chi tiết {isListingFee ? 'hóa đơn phí giá sàn' : 'đơn hàng'}</h2>
              <p className="text-purple-100 text-sm mt-1">
                Mã: {isListingFee ? `FEE-${order.id}` : `INV-${order.id}`}
              </p>
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
              {isListingFee && (
                <span className="ml-2 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                  💰 Phí Giá Sàn (5%)
                </span>
              )}
            </h3>
            <div className="flex gap-4">
              {order.product.images && order.product.images[0] && (
                <img
                  src={order.product.images[0].url}
                  alt={order.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <p className="font-bold text-lg text-gray-800 mb-2">{order.product.name}</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(order.finalPrice)}</p>
                {isListingFee && (
                  <p className="text-sm text-gray-600 mt-2">
                    Phí này được tính khi phiên đấu giá kết thúc mà chưa đạt giá sàn (5% giá khởi điểm)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Buyer Info - Chỉ hiển thị cho AUCTION_SALE */}
          {isAuctionSale && (
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
                    <p className="font-semibold text-gray-800">{order.user.firstName} {order.user.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800 text-sm">{order.user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              {isListingFee ? 'Lịch sử thanh toán' : 'Lịch sử đơn hàng'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{isListingFee ? 'Hóa đơn được tạo' : 'Đơn hàng được tạo'}</p>
                  <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              {order.dueDate && order.status === 'PENDING' && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Hạn thanh toán</p>
                    <p className="text-sm text-gray-600">{formatDate(order.dueDate)}</p>
                  </div>
                </div>
              )}
              {order.paymentTime && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Đã thanh toán</p>
                    <p className="text-sm text-gray-600">{formatDate(order.paymentTime)}</p>
                  </div>
                </div>
              )}
              {order.shippedAt && isAuctionSale && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Đã gửi hàng</p>
                    <p className="text-sm text-gray-600">{formatDate(order.shippedAt)}</p>
                    {order.trackingCode && (
                      <p className="text-xs text-purple-600 mt-1 font-mono">
                        Mã vận đơn: {order.trackingCode} - {order.carrier}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Important Note - Chỉ cho AUCTION_SALE đang giao hàng */}
          {isAuctionSale && order.status === 'SHIPPING' && (
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
