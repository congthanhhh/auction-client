import { useState } from 'react';
import { Package, TrendingUp, ShoppingCart, Clock, CheckCircle, AlertCircle, Star } from 'lucide-react';
import PageLayout from './page-layout';
import ShippingTrackingModal from '../pop-up/shipping-tracking-modal';
import OrderDetailModal from '../pop-up/order-detail-modal';
import AuctionDetailModal from '../pop-up/auction-detail-modal';
import { toast } from 'sonner';

// Mock data cho phiên đấu giá
const MOCK_AUCTIONS = [
  {
    id: 1,
    productName: "iPhone 15 Pro Max 256GB",
    image: "https://images.unsplash.com/photo-1696446702183-cbd90e810a7e?w=300",
    startPrice: 15000000,
    currentPrice: 28500000,
    buyNowPrice: 32000000,
    totalBids: 45,
    status: "ACTIVE", // ACTIVE, ENDED, SOLD
    startDate: "2024-12-20 10:00",
    endDate: "2024-12-27 22:00",
    bidders: 12
  },
  {
    id: 2,
    productName: "MacBook Pro M3 16inch",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300",
    startPrice: 35000000,
    currentPrice: 42000000,
    buyNowPrice: null,
    totalBids: 28,
    status: "ENDED",
    startDate: "2024-12-15 14:00",
    endDate: "2024-12-22 20:00",
    winner: "nguyenvana@gmail.com",
    bidders: 8
  },
  {
    id: 3,
    productName: "Sony WH-1000XM5 Headphones",
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=300",
    startPrice: 3000000,
    currentPrice: 7200000,
    buyNowPrice: 8500000,
    totalBids: 67,
    status: "SOLD",
    startDate: "2024-12-10 09:00",
    endDate: "2024-12-18 18:00",
    winner: "tranvanb@gmail.com",
    soldPrice: 8500000,
    soldDate: "2024-12-16 15:30",
    bidders: 15
  },
  {
    id: 4,
    productName: "Canon EOS R6 Mark II",
    image: "https://images.unsplash.com/photo-1606980259767-c6d6d6f42c94?w=300",
    startPrice: 45000000,
    currentPrice: 48000000,
    buyNowPrice: 55000000,
    totalBids: 12,
    status: "ACTIVE",
    startDate: "2024-12-22 08:00",
    endDate: "2024-12-29 20:00",
    bidders: 5
  }
];

// Mock data cho đơn hàng
const MOCK_ORDERS = [
  {
    id: 1,
    orderId: "ORD-2024-001",
    productName: "Sony WH-1000XM5 Headphones",
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=300",
    buyer: "Trần Văn B",
    buyerEmail: "tranvanb@gmail.com",
    amount: 8500000,
    status: "PAID", // PAID, SHIPPING, COMPLETED, DISPUTE
    paidDate: "2024-12-18 16:00",
    shippedDate: null,
    trackingCode: null,
    buyerPhone: "0901234567",
    shippingAddress: "123 Nguyễn Văn Linh, Q.7, TP.HCM"
  },
  {
    id: 2,
    orderId: "ORD-2024-002",
    productName: "MacBook Pro M3 16inch",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300",
    buyer: "Nguyễn Văn A",
    buyerEmail: "nguyenvana@gmail.com",
    amount: 42000000,
    status: "SHIPPING",
    paidDate: "2024-12-22 10:30",
    shippedDate: "2024-12-23 09:15",
    trackingCode: "VN123456789",
    buyerPhone: "0912345678",
    shippingAddress: "456 Lê Văn Việt, Q.9, TP.HCM"
  },
  {
    id: 3,
    orderId: "ORD-2024-003",
    productName: "iPad Pro 12.9 M2",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300",
    buyer: "Lê Thị C",
    buyerEmail: "lethic@gmail.com",
    amount: 25000000,
    status: "COMPLETED",
    paidDate: "2024-12-10 14:00",
    shippedDate: "2024-12-11 08:00",
    completedDate: "2024-12-15 16:30",
    trackingCode: "VN987654321",
    buyerPhone: "0923456789",
    shippingAddress: "789 Võ Văn Ngân, Thủ Đức, TP.HCM",
    feedbackGiven: true,
    rating: 5
  }
];

type TabType = 'auctions' | 'orders' | 'stats';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('auctions');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [showAuctionDetailModal, setShowAuctionDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedAuction, setSelectedAuction] = useState<any>(null);

  // Thống kê
  const stats = {
    totalAuctions: 4,
    activeAuctions: 2,
    soldItems: 1,
    totalRevenue: 75500000,
    pendingOrders: 1,
    averageRating: 4.8,
    totalFeedbacks: 15
  };

  // Format tiền
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format ngày
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Lọc auctions
  const filteredAuctions = selectedStatus === 'ALL' 
    ? MOCK_AUCTIONS 
    : MOCK_AUCTIONS.filter(a => a.status === selectedStatus);

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'ENDED': return 'bg-blue-100 text-blue-700';
      case 'SOLD': return 'bg-purple-100 text-purple-700';
      case 'PAID': return 'bg-yellow-100 text-yellow-700';
      case 'SHIPPING': return 'bg-blue-100 text-blue-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'DISPUTE': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Dịch status
  const translateStatus = (status: string) => {
    const translations: { [key: string]: string } = {
      'ACTIVE': 'Đang đấu giá',
      'ENDED': 'Đã kết thúc',
      'SOLD': 'Đã bán',
      'PAID': 'Đã thanh toán',
      'SHIPPING': 'Đang giao hàng',
      'COMPLETED': 'Hoàn thành',
      'DISPUTE': 'Tranh chấp'
    };
    return translations[status] || status;
  };

  // Handle shipping modal
  const handleOpenShippingModal = (order: any) => {
    setSelectedOrder(order);
    setShowShippingModal(true);
  };

  const handleSubmitTracking = (trackingCode: string, shippingProvider: string) => {
    // Trong thực tế sẽ gọi API
    toast.success('Đã cập nhật mã vận đơn!', {
      description: `Mã vận đơn: ${trackingCode} - ${shippingProvider}`
    });
    console.log('Tracking code:', trackingCode, 'Provider:', shippingProvider);
  };

  // Handle order detail modal
  const handleOpenOrderDetail = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetailModal(true);
  };

  // Handle auction detail modal
  const handleOpenAuctionDetail = (auction: any) => {
    setSelectedAuction(auction);
    setShowAuctionDetailModal(true);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🏪 Quản Lý Cửa Hàng
          </h1>
          <p className="text-gray-600">
            Quản lý phiên đấu giá, đơn hàng và theo dõi doanh thu của bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Tổng phiên đấu giá</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalAuctions}</p>
                <p className="text-green-600 text-sm mt-1">
                  {stats.activeAuctions} đang hoạt động
                </p>
              </div>
              <Package className="w-12 h-12 text-purple-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-green-600 text-sm mt-1">
                  {stats.soldItems} sản phẩm đã bán
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Đơn hàng chờ xử lý</p>
                <p className="text-3xl font-bold text-gray-800">{stats.pendingOrders}</p>
                <p className="text-orange-600 text-sm mt-1">
                  Cần giao hàng
                </p>
              </div>
              <ShoppingCart className="w-12 h-12 text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Đánh giá</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.averageRating} <span className="text-xl">⭐</span>
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {stats.totalFeedbacks} lượt đánh giá
                </p>
              </div>
              <Star className="w-12 h-12 text-yellow-500 opacity-80" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('auctions')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  activeTab === 'auctions'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                📦 Phiên Đấu Giá
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                🚚 Đơn Hàng
                {stats.pendingOrders > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.pendingOrders}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                  activeTab === 'stats'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                📊 Thống Kê
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Tab: Phiên Đấu Giá */}
            {activeTab === 'auctions' && (
              <div>
                {/* Filter */}
                <div className="flex gap-2 mb-6">
                  {['ALL', 'ACTIVE', 'ENDED', 'SOLD'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedStatus === status
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'ALL' ? 'Tất cả' : translateStatus(status)}
                    </button>
                  ))}
                </div>

                {/* Auctions List */}
                <div className="space-y-4">
                  {filteredAuctions.map((auction) => (
                    <div
                      key={auction.id}
                      className="bg-gradient-to-r from-white to-purple-50 border border-purple-100 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex gap-6">
                        {/* Image */}
                        <img
                          src={auction.image}
                          alt={auction.productName}
                          className="w-32 h-32 object-cover rounded-lg"
                        />

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-1">
                                {auction.productName}
                              </h3>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(auction.status)}`}>
                                {translateStatus(auction.status)}
                              </span>
                            </div>
                            <button 
                              onClick={() => handleOpenAuctionDetail(auction)}
                              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                            >
                              Chi tiết
                            </button>
                          </div>

                          {/* Info Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-gray-500 text-sm">Giá khởi điểm</p>
                              <p className="text-gray-800 font-semibold">
                                {formatCurrency(auction.startPrice)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-sm">Giá hiện tại</p>
                              <p className="text-purple-600 font-bold text-lg">
                                {formatCurrency(auction.currentPrice)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-sm">Số lượt đấu</p>
                              <p className="text-gray-800 font-semibold">
                                {auction.totalBids} ({auction.bidders} người)
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-sm">
                                {auction.status === 'SOLD' ? 'Đã bán' : auction.buyNowPrice ? 'Mua ngay' : 'Không có'}
                              </p>
                              <p className="text-green-600 font-semibold">
                                {auction.status === 'SOLD' 
                                  ? formatCurrency(auction.soldPrice!) 
                                  : auction.buyNowPrice 
                                    ? formatCurrency(auction.buyNowPrice)
                                    : 'N/A'
                                }
                              </p>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Bắt đầu: {formatDate(auction.startDate)}</span>
                            </div>
                            <span>→</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Kết thúc: {formatDate(auction.endDate)}</span>
                            </div>
                          </div>

                          {/* Winner info */}
                          {(auction.status === 'ENDED' || auction.status === 'SOLD') && auction.winner && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-green-700 font-semibold">
                                🏆 Người thắng: {auction.winner}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Đơn Hàng */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {MOCK_ORDERS.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gradient-to-r from-white to-blue-50 border border-blue-100 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      <img
                        src={order.image}
                        alt={order.productName}
                        className="w-32 h-32 object-cover rounded-lg"
                      />

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">
                              Mã đơn: <span className="font-semibold text-gray-700">{order.orderId}</span>
                            </p>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                              {order.productName}
                            </h3>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {translateStatus(order.status)}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Tổng tiền</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {formatCurrency(order.amount)}
                            </p>
                          </div>
                        </div>

                        {/* Buyer Info */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-3">
                          <h4 className="font-semibold text-gray-700 mb-2">👤 Thông tin người mua</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <p><span className="text-gray-600">Tên:</span> <span className="font-semibold">{order.buyer}</span></p>
                            <p><span className="text-gray-600">Email:</span> <span className="font-semibold">{order.buyerEmail}</span></p>
                            <p><span className="text-gray-600">SĐT:</span> <span className="font-semibold">{order.buyerPhone}</span></p>
                            <p className="md:col-span-2">
                              <span className="text-gray-600">Địa chỉ:</span> <span className="font-semibold">{order.shippingAddress}</span>
                            </p>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-center gap-3 text-sm mb-3">
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Thanh toán: {formatDate(order.paidDate)}</span>
                          </div>
                          {order.shippedDate && (
                            <>
                              <span className="text-gray-400">→</span>
                              <div className="flex items-center gap-1 text-blue-600">
                                <CheckCircle className="w-4 h-4" />
                                <span>Giao hàng: {formatDate(order.shippedDate)}</span>
                              </div>
                            </>
                          )}
                          {order.completedDate && (
                            <>
                              <span className="text-gray-400">→</span>
                              <div className="flex items-center gap-1 text-purple-600">
                                <CheckCircle className="w-4 h-4" />
                                <span>Hoàn thành: {formatDate(order.completedDate)}</span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Tracking Code */}
                        {order.trackingCode && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                            <p className="text-blue-700">
                              📦 Mã vận đơn: <span className="font-mono font-bold">{order.trackingCode}</span>
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                          {order.status === 'PAID' && (
                            <button 
                              onClick={() => handleOpenShippingModal(order)}
                              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                            >
                              ✍️ Nhập mã vận đơn
                            </button>
                          )}
                          {order.status === 'SHIPPING' && (
                            <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold">
                              📞 Liên hệ người mua
                            </button>
                          )}
                          {order.status === 'COMPLETED' && !order.feedbackGiven && (
                            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold">
                              ⭐ Đánh giá người mua
                            </button>
                          )}
                          {order.status === 'COMPLETED' && order.feedbackGiven && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-semibold">Đã đánh giá ({order.rating} ⭐)</span>
                            </div>
                          )}
                          <button 
                            onClick={() => handleOpenOrderDetail(order)}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                          >
                            📄 Chi tiết đơn hàng
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Thống Kê */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <div className="inline-block p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
                    <TrendingUp className="w-16 h-16 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Thống Kê Chi Tiết
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Phần này sẽ hiển thị biểu đồ doanh thu, xu hướng đấu giá, và phân tích chi tiết
                  </p>

                  {/* Simple Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-6">
                      <p className="text-3xl font-bold mb-2">{stats.totalAuctions}</p>
                      <p className="opacity-90">Tổng phiên đấu giá</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-xl p-6">
                      <p className="text-3xl font-bold mb-2">{formatCurrency(stats.totalRevenue)}</p>
                      <p className="opacity-90">Tổng doanh thu</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-6">
                      <p className="text-3xl font-bold mb-2">{stats.averageRating} ⭐</p>
                      <p className="opacity-90">Đánh giá trung bình</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Modals */}
    {selectedOrder && (
      <>
        <ShippingTrackingModal
          isOpen={showShippingModal}
          onClose={() => setShowShippingModal(false)}
          onSubmit={handleSubmitTracking}
          orderId={selectedOrder.orderId}
          productName={selectedOrder.productName}
        />

        <OrderDetailModal
          isOpen={showOrderDetailModal}
          onClose={() => setShowOrderDetailModal(false)}
          order={selectedOrder}
        />
      </>
    )}

    {selectedAuction && (
      <AuctionDetailModal
        isOpen={showAuctionDetailModal}
        onClose={() => setShowAuctionDetailModal(false)}
        auction={selectedAuction}
      />
    )}
    </PageLayout>
  );
};

export default SellerDashboard;
