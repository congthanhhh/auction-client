import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import FeedbackModal from '../pop-up/feedback-modal';
import type { FeedbackRating } from '../pop-up/feedback-modal';
import {
  Package,
  Truck,
  CheckCircle,
  Copy,
  ExternalLink,
  Clock,
  Star,
  ChevronRight,
  MapPin
} from 'lucide-react';

// Types
interface Order {
  id: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  shopName: string;
  status: 'PAID' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  carrier?: string;
  trackingCode?: string;
  orderDate: string;
  shippingDate?: string;
  completedDate?: string;
  shippingAddress: string;
}

// Mock Data
const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD001',
    productName: 'iPhone 15 Pro Max 256GB - Titan Tự Nhiên',
    productImage: 'https://picsum.photos/seed/iphone/300',
    quantity: 1,
    price: 29990000,
    shopName: 'Hàng Hiệu 247',
    status: 'SHIPPING',
    carrier: 'GHTK',
    trackingCode: 'GHTK123456789',
    orderDate: '2024-12-25',
    shippingDate: '2024-12-26',
    shippingAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM'
  },
  {
    id: 'ORD002',
    productName: 'MacBook Air M3 2024 - 16GB RAM 512GB SSD',
    productImage: 'https://picsum.photos/seed/macbook/300',
    quantity: 1,
    price: 32990000,
    shopName: 'Tech Store VN',
    status: 'PAID',
    orderDate: '2024-12-28',
    shippingAddress: '456 Lê Lợi, Quận 3, TP.HCM'
  },
  {
    id: 'ORD003',
    productName: 'Sony WH-1000XM5 - Tai Nghe Chống Ồn',
    productImage: 'https://picsum.photos/seed/sony/300',
    quantity: 2,
    price: 7500000,
    shopName: 'Audio Pro Shop',
    status: 'COMPLETED',
    carrier: 'ViettelPost',
    trackingCode: 'VTP987654321',
    orderDate: '2024-12-20',
    shippingDate: '2024-12-21',
    completedDate: '2024-12-24',
    shippingAddress: '789 Trần Hưng Đạo, Quận 5, TP.HCM'
  }
];

const MyOrder = () => {
  const navigate = useNavigate();
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [activeTab, setActiveTab] = useState<'PAID' | 'SHIPPING' | 'COMPLETED'>('SHIPPING');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-yellow-600 bg-yellow-50';
      case 'SHIPPING':
        return 'text-blue-600 bg-blue-50';
      case 'COMPLETED':
        return 'text-green-600 bg-green-50';
      case 'CANCELLED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return '⏳ Chờ lấy hàng';
      case 'SHIPPING':
        return '🚚 Người bán đã gửi hàng';
      case 'COMPLETED':
        return '✅ Đã hoàn thành';
      case 'CANCELLED':
        return '❌ Đã hủy';
      default:
        return status;
    }
  };

  const getTrackingUrl = (carrier?: string, trackingCode?: string) => {
    if (!carrier || !trackingCode) return null;

    const carrierUrls: { [key: string]: string } = {
      'GHTK': `https://i.ghtk.vn/${trackingCode}`,
      'GHN': `https://donhang.ghn.vn/?order_code=${trackingCode}`,
      'ViettelPost': `https://viettelpost.com.vn/tra-cuu-hanh-trinh-don/${trackingCode}`,
      'BEST': `https://best-inc.vn/vi/tracking?billcode=${trackingCode}`
    };

    return carrierUrls[carrier] || `https://www.google.com/search?q=${trackingCode}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleConfirmReceived = (orderId: string) => {
    // TODO: Call API to confirm order received
    alert(`Xác nhận đã nhận hàng cho đơn ${orderId}`);
  };

  const handleDispute = (orderId: string) => {
    // TODO: Navigate to dispute page
    alert(`Khiếu nại đơn hàng ${orderId}`);
  };

  const handleOpenFeedback = (orderId: string) => {
    setFeedbackOrderId(orderId);
    setIsFeedbackModalOpen(true);
  };

  const handleSubmitFeedback = async (data: {
    orderId: string;
    targetUserId: string;
    rating: FeedbackRating;
    comment: string;
  }) => {
    try {
      // TODO: Call API to submit feedback
      // const response = await feedbackService.create(data);
      console.log('Feedback submitted:', data);
      alert('Gửi đánh giá thành công! Cảm ơn bạn đã chia sẻ.');
      setIsFeedbackModalOpen(false);
      setFeedbackOrderId(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  };

  // Order Detail Modal/Page
  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-8 mt-20 max-w-5xl">
          {/* Back Button */}
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
          >
            ← Quay lại danh sách đơn hàng
          </button>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            {/* Header */}
            <div className="border-b pb-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng</h1>
                <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusText(selectedOrder.status)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Mã đơn hàng</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Ngày đặt</p>
                  <p className="font-semibold text-gray-800">{selectedOrder.orderDate}</p>
                </div>
              </div>
            </div>

            {/* Progress Stepper */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Tiến trình đơn hàng</h2>
              <div className="flex items-center justify-between relative">
                {/* Step 1 */}
                <div className="flex flex-col items-center flex-1 relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedOrder.status !== 'CANCELLED' ? 'bg-green-500' : 'bg-gray-300'
                    } text-white mb-2`}>
                    <CheckCircle size={24} />
                  </div>
                  <p className="text-xs text-center font-medium">Đã thanh toán</p>
                  {selectedOrder.orderDate && (
                    <p className="text-xs text-gray-500">{selectedOrder.orderDate}</p>
                  )}
                </div>

                {/* Line 1 */}
                <div className={`absolute top-6 left-1/4 w-1/4 h-1 ${selectedOrder.status === 'SHIPPING' || selectedOrder.status === 'COMPLETED'
                  ? 'bg-green-500'
                  : 'bg-gray-300'
                  }`} style={{ transform: 'translateX(-50%)' }} />

                {/* Step 2 */}
                <div className="flex flex-col items-center flex-1 relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedOrder.status === 'SHIPPING' || selectedOrder.status === 'COMPLETED'
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                    } text-white mb-2`}>
                    <Truck size={24} />
                  </div>
                  <p className="text-xs text-center font-medium">Đã giao ĐVVC</p>
                  {selectedOrder.shippingDate && (
                    <p className="text-xs text-gray-500">{selectedOrder.shippingDate}</p>
                  )}
                </div>

                {/* Line 2 */}
                <div className={`absolute top-6 right-1/4 w-1/4 h-1 ${selectedOrder.status === 'COMPLETED' ? 'bg-green-500' : 'bg-gray-300'
                  }`} style={{ transform: 'translateX(50%)' }} />

                {/* Step 3 */}
                <div className="flex flex-col items-center flex-1 relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedOrder.status === 'COMPLETED' ? 'bg-green-500' : 'bg-gray-300'
                    } text-white mb-2`}>
                    <CheckCircle size={24} />
                  </div>
                  <p className="text-xs text-center font-medium">Hoàn thành</p>
                  {selectedOrder.completedDate && (
                    <p className="text-xs text-gray-500">{selectedOrder.completedDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Info / Tracking */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Truck className="text-blue-600" />
                Thông tin vận chuyển
              </h2>

              {selectedOrder.status === 'PAID' ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="text-yellow-800 flex items-center gap-2">
                    <Clock size={20} />
                    Người bán đang chuẩn bị hàng. Mã vận đơn sẽ sớm được cập nhật.
                  </p>
                </div>
              ) : selectedOrder.status === 'COMPLETED' ? (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-green-800 flex items-center gap-2">
                    <CheckCircle size={20} />
                    Đơn hàng đã hoàn tất vào ngày {selectedOrder.completedDate}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Đơn vị vận chuyển</p>
                      <p className="text-xl font-bold text-blue-600">{selectedOrder.carrier}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Mã vận đơn</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-bold text-gray-800">{selectedOrder.trackingCode}</p>
                        <button
                          onClick={() => copyToClipboard(selectedOrder.trackingCode!)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Copy mã vận đơn"
                        >
                          {copiedCode === selectedOrder.trackingCode ? (
                            <CheckCircle size={20} className="text-green-500" />
                          ) : (
                            <Copy size={20} className="text-blue-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      💡 Vui lòng truy cập trang chủ <span className="font-semibold">{selectedOrder.carrier}</span> để theo dõi hành trình chi tiết.
                    </p>
                  </div>

                  {getTrackingUrl(selectedOrder.carrier, selectedOrder.trackingCode) && (
                    <a
                      href={getTrackingUrl(selectedOrder.carrier, selectedOrder.trackingCode)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      <ExternalLink size={20} />
                      Tra cứu hành trình ngay
                    </a>
                  )}
                </>
              )}
            </div>

            {/* Product Info */}
            <div className="border-t pt-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin sản phẩm</h2>
              <div className="flex gap-4">
                <img
                  src={selectedOrder.productImage}
                  alt={selectedOrder.productName}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">{selectedOrder.productName}</h3>
                  <p className="text-gray-600 text-sm mb-1">Số lượng: {selectedOrder.quantity}</p>
                  <p className="text-xl font-bold text-indigo-600">{formatCurrency(selectedOrder.price)}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border-t pt-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="text-red-500" />
                Địa chỉ nhận hàng
              </h2>
              <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
            </div>

            {/* Action Buttons */}
            {selectedOrder.status === 'SHIPPING' && (
              <div className="border-t pt-6">
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded mb-4">
                  <p className="text-orange-800 text-sm">
                    ⚠️ Sau khi nhận hàng thực tế, vui lòng bấm "Đã nhận được hàng" để hệ thống chuyển tiền cho người bán.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleConfirmReceived(selectedOrder.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    ✅ Đã nhận được hàng
                  </button>
                  <button
                    onClick={() => handleDispute(selectedOrder.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    ⚠️ Khiếu nại / Trả hàng
                  </button>
                </div>
              </div>
            )}

            {selectedOrder.status === 'COMPLETED' && (
              <div className="border-t pt-6">
                <button
                  onClick={() => handleOpenFeedback(selectedOrder.id)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Star size={20} />
                  Đánh giá Shop
                </button>
              </div>
            )}
          </div>
        </main>

        <Footer />

        {/* Feedback Modal */}
        {feedbackOrderId && selectedOrder && (
          <FeedbackModal
            isOpen={isFeedbackModalOpen}
            onClose={() => {
              setIsFeedbackModalOpen(false);
              setFeedbackOrderId(null);
            }}
            orderId={feedbackOrderId}
            targetUser={{
              id: 'seller_123', // TODO: Get from order/product data
              name: selectedOrder.shopName,
              avatar: 'https://i.pravatar.cc/150?u=seller',
              role: 'seller'
            }}
            product={{
              name: selectedOrder.productName,
              image: selectedOrder.productImage,
              auctionId: selectedOrder.id
            }}
            onSubmit={handleSubmitFeedback}
          />
        )}
      </div>
    );
  }

  // Orders List
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 mt-20 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Đơn hàng của tôi</h1>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('PAID')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors relative ${activeTab === 'PAID'
                ? 'text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              <span className="flex items-center justify-center gap-2">
                ⏳ Chờ lấy hàng
                {orders.filter(o => o.status === 'PAID').length > 0 && (
                  <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {orders.filter(o => o.status === 'PAID').length}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('SHIPPING')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors relative ${activeTab === 'SHIPPING'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              <span className="flex items-center justify-center gap-2">
                🚚 Người bán đã gửi hàng
                {orders.filter(o => o.status === 'SHIPPING').length > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {orders.filter(o => o.status === 'SHIPPING').length}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors relative ${activeTab === 'COMPLETED'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              <span className="flex items-center justify-center gap-2">
                ✅ Đã hoàn thành
                {orders.filter(o => o.status === 'COMPLETED').length > 0 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {orders.filter(o => o.status === 'COMPLETED').length}
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Orders Content */}
        {(() => {
          const filteredOrders = orders.filter(order => order.status === activeTab);

          if (filteredOrders.length === 0) {
            return (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Package size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Chưa có đơn hàng nào
                </h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === 'PAID' && 'Chưa có đơn hàng nào đang chờ lấy hàng'}
                  {activeTab === 'SHIPPING' && 'Chưa có đơn hàng nào đang được vận chuyển'}
                  {activeTab === 'COMPLETED' && 'Chưa có đơn hàng nào hoàn thành'}
                </p>
                <button
                  onClick={() => navigate('/all-auctions')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Khám phá đấu giá
                </button>
              </div>
            );
          }

          return (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 flex items-center justify-between border-b">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="text-gray-600 text-sm">Shop: <span className="font-semibold text-gray-800">{order.shopName}</span></span>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium text-sm"
                    >
                      Chi tiết <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="flex gap-4 mb-4">
                      <img
                        src={order.productImage}
                        alt={order.productName}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2 hover:text-indigo-600 cursor-pointer">
                          {order.productName}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Số lượng: {order.quantity}</span>
                          <span className="text-xl font-bold text-indigo-600">{formatCurrency(order.price)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Info Box */}
                    {order.status === 'SHIPPING' && order.trackingCode && (
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Truck className="text-blue-600" size={20} />
                            <span className="font-semibold text-gray-800">Đơn vị vận chuyển:</span>
                            <span className="text-blue-600 font-bold">{order.carrier}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-600">Mã vận đơn:</span>
                          <code className="bg-white px-3 py-1 rounded border font-mono text-sm font-semibold">
                            {order.trackingCode}
                          </code>
                          <button
                            onClick={() => copyToClipboard(order.trackingCode!)}
                            className="p-1 hover:bg-blue-100 rounded transition-colors"
                            title="Copy"
                          >
                            {copiedCode === order.trackingCode ? (
                              <CheckCircle size={18} className="text-green-500" />
                            ) : (
                              <Copy size={18} className="text-blue-600" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">
                          💡 Vui lòng truy cập trang chủ {order.carrier} để theo dõi.
                        </p>
                        {getTrackingUrl(order.carrier, order.trackingCode) && (
                          <a
                            href={getTrackingUrl(order.carrier, order.trackingCode)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                          >
                            <ExternalLink size={16} />
                            Tra cứu ngay
                          </a>
                        )}
                      </div>
                    )}

                    {order.status === 'PAID' && (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="text-yellow-800 text-sm flex items-center gap-2">
                          <Clock size={18} />
                          Người bán đang chuẩn bị hàng. Mã vận đơn sẽ sớm được cập nhật.
                        </p>
                      </div>
                    )}

                    {order.status === 'COMPLETED' && (
                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                        <p className="text-green-800 text-sm flex items-center gap-2">
                          <CheckCircle size={18} />
                          Đơn hàng đã hoàn tất vào ngày {order.completedDate}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {order.status === 'SHIPPING' && (
                      <div className="border-t pt-4">
                        <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded mb-3">
                          <p className="text-orange-800 text-sm">
                            ⚠️ Sau khi nhận hàng thực tế, vui lòng bấm "Đã nhận được hàng" để hệ thống chuyển tiền cho người bán.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConfirmReceived(order.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors text-sm"
                          >
                            ✅ Đã nhận được hàng
                          </button>
                          <button
                            onClick={() => handleDispute(order.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors text-sm"
                          >
                            ⚠️ Khiếu nại / Trả hàng
                          </button>
                        </div>
                      </div>
                    )}

                    {order.status === 'COMPLETED' && (
                      <div className="border-t pt-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            handleOpenFeedback(order.id);
                          }}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <Star size={18} />
                          Đánh giá Shop
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </main>

      <Footer />

      {/* Feedback Modal */}
      {feedbackOrderId && (() => {
        const order = orders.find(o => o.id === feedbackOrderId);
        if (!order) return null;

        return (
          <FeedbackModal
            isOpen={isFeedbackModalOpen}
            onClose={() => {
              setIsFeedbackModalOpen(false);
              setFeedbackOrderId(null);
            }}
            orderId={feedbackOrderId}
            targetUser={{
              id: 'seller_123', // TODO: Get from order/product data
              name: order.shopName,
              avatar: 'https://i.pravatar.cc/150?u=seller',
              role: 'seller'
            }}
            product={{
              name: order.productName,
              image: order.productImage,
              auctionId: order.id
            }}
            onSubmit={handleSubmitFeedback}
          />
        );
      })()}
    </div>
  );
};

export default MyOrder;
