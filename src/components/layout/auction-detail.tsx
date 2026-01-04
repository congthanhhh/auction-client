import { useEffect, useState } from 'react';
import { Heart, Share2, Printer, Facebook, Loader2, HelpCircle, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from './page-layout';
import { useAuctionStore } from '@/stores/useAuctionStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatJavaDate } from '@/lib/dateUtils';
import CountdownTimer from './CountdownTimer';
import Pagination from '@/components/ui/pagination';

const AuctionDetail = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'info' | 'shipping' | 'seller' | 'bids'>('info');

  const { auctionId } = useParams<{ auctionId: string }>();
  const sessionId = Number(auctionId);

  const { isAuthenticated, currentUser } = useAuthStore();

  const {
    currentPrice,
    highestBidder,
    recentBids,
    sessionNotifications,
    reservePriceMet,
    initializeSocket,
    leaveSocket,
    placeBid,
    fetchAuctionDetail,
    fetchBidHistory,
    startPrice,
    buyNowPrice,
    startTime,
    endTime,
    status,
    myMaxBid,
    product,
    bidHistoryPage,
    bidHistoryTotalPages,
    bidHistoryTotalElements,
    isLoadingBidHistory
  } = useAuctionStore();

  const [bidAmount, setBidAmount] = useState<number>(0);
  const isLeading = highestBidder === currentUser?.username;
  const [showBidIncrementInfo, setShowBidIncrementInfo] = useState(false);

  // Parse attributes JSON nếu có
  const parseAttributes = (attributesStr: string | undefined) => {
    if (!attributesStr) return null;
    try {
      return JSON.parse(attributesStr);
    } catch {
      // Nếu không phải JSON, trả về string gốc
      return attributesStr;
    }
  };

  // Khởi tạo dữ liệu và Socket
  useEffect(() => {
    if (sessionId) {
      fetchAuctionDetail(sessionId);
      initializeSocket(sessionId);
    }
    return () => {
      if (sessionId) leaveSocket(sessionId);
    };
  }, [sessionId, fetchAuctionDetail, initializeSocket, leaveSocket]);

  // Gợi ý giá bid tiếp theo
  useEffect(() => {
    const minNextBid = currentPrice > 0 ? currentPrice + 100000 : startPrice + 100000;
    setBidAmount(minNextBid);
  }, [currentPrice, startPrice]);

  const handlePlaceBid = async () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để tham gia đấu giá!");
      return;
    }

    if (bidAmount <= currentPrice) {
      alert("Giá đặt phải cao hơn giá hiện tại!");
      return;
    }

    try {
      await placeBid(sessionId, bidAmount);
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi đặt giá");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const calculateMinBid = () => {
    return currentPrice > 0 ? currentPrice + 100000 : startPrice + 100000;
  };

  const handleBidHistoryPageChange = (page: number) => {
    if (sessionId) {
      fetchBidHistory(sessionId, page);
    }
  };

  // Lấy danh sách ảnh sản phẩm
  const productImages = product?.images || [];

  return (
    <PageLayout>
      <div className="bg-gray-50 min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4">

          {/* Breadcrumb */}
          <div className="mb-4 text-sm">
            <span className="text-gray-500 hover:text-purple-600 cursor-pointer" onClick={() => navigate('/')}>
              Trang chủ
            </span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-500 hover:text-purple-600 cursor-pointer" onClick={() => navigate('/auctions')}>
              Phiên đấu giá
            </span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">{product?.name}</span>
          </div>

          {/* Main Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* LEFT: Image Gallery */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-4">
                {/* Seller Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-purple-600 text-white text-xs px-3 py-1 rounded">
                    {product?.seller?.username || 'Người bán'}
                  </span>
                </div>

                {/* Main Image */}
                <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4" style={{ height: '450px' }}>
                  {productImages.length > 0 ? (
                    <img
                      src={productImages[currentImageIndex]?.url}
                      alt={product?.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Không có hình ảnh
                    </div>
                  )}

                  {/* Watermark */}
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    AUCTION SYSTEM
                  </div>

                  {/* Favorite Button */}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Thumbnail Strip */}
                {productImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {productImages.map((img: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden transition ${idx === currentImageIndex ? 'border-purple-600' : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Bidding Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">

                {/* Product Title */}
                <h1 className="text-xl font-bold text-gray-900 mb-4">
                  {product?.name}
                </h1>

                {/* Time Left */}
                <div className="mb-4 pb-4 border-b">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      {status === 'SCHEDULED' ? 'Bắt đầu vào lúc:' : 'Thời gian còn lại:'}
                    </span>
                    <div className="text-sm font-bold text-red-600">
                      {status === 'SCHEDULED' && startTime ? (
                        <span className="text-blue-600">{formatJavaDate(startTime)}</span>
                      ) : endTime ? (
                        <CountdownTimer targetDate={endTime} />
                      ) : (
                        <span className="text-gray-400">--:--:--</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Lượt đấu giá:</span>
                    <span className="text-purple-600 font-semibold hover:underline cursor-pointer">
                      {recentBids.length}
                    </span>
                  </div>
                </div>

                {/* Current Price */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    {formatCurrency(currentPrice)} ₫
                  </h2>
                  <p className="text-sm text-gray-600">
                    Giá khởi điểm: <span className="font-semibold">{formatCurrency(startPrice)} ₫</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Giá tối thiểu: <span className="font-semibold">{formatCurrency(calculateMinBid())} ₫</span>
                  </p>
                </div>

                {/* Reserve Price Status */}
                {!reservePriceMet && (
                  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-xs text-orange-800">
                      <strong>🔒 Lưu ý:</strong> Giá sàn chưa đạt. Phiên đấu giá có thể không hoàn tất nếu không đạt giá sàn.
                    </p>
                  </div>
                )}

                {/* My Max Bid Info */}
                {isLeading && myMaxBid && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-800 flex items-center justify-between">
                      <span>🎯 Giá tối đa của bạn:</span>
                      <span className="font-bold">{formatCurrency(myMaxBid)} ₫</span>
                    </p>
                  </div>
                )}

                {/* Maximum Bid Input */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Đặt giá tối đa của bạn:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={bidAmount || ''}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      placeholder="0"
                      className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₫</span>
                  </div>
                  {bidAmount < calculateMinBid() && bidAmount > 0 && (
                    <p className="text-red-600 text-xs mt-1">Vui lòng nhập giá cao hơn {formatCurrency(calculateMinBid())} ₫</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Hệ thống sẽ tự động đấu giá thay bạn cho đến khi đạt giá tối đa này.
                  </p>
                </div>

                {/* Place Bid Button */}
                <button
                  onClick={handlePlaceBid}
                  disabled={!bidAmount || bidAmount < calculateMinBid()}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition mb-4"
                >
                  🚀 Đặt giá ngay
                </button>

                {/* Buy Now Option */}
                {buyNowPrice && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Bạn có muốn mua ngay với giá ${formatCurrency(buyNowPrice)} ₫?`)) {
                        placeBid(sessionId, buyNowPrice);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition mb-4"
                  >
                    ⚡ Mua ngay {formatCurrency(buyNowPrice)} ₫
                  </button>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mb-4 pt-4 border-t">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition">
                    Liên hệ người bán
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition">
                    <Printer className="w-4 h-4" />
                  </button>
                </div>

                {/* Share */}
                <div className="flex items-center justify-between text-sm border-t pt-4">
                  <span className="font-semibold text-gray-700">Chia sẻ:</span>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabs Section */}
          <div className="mt-6 bg-white rounded-lg shadow">
            {/* Tab Headers */}
            <div className="flex border-b overflow-x-auto">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'info'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Thông tin sản phẩm
              </button>
              <button
                onClick={() => setActiveTab('seller')}
                className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'seller'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Thông tin người bán
              </button>
              <button
                onClick={() => setActiveTab('bids')}
                className={`px-6 py-3 font-semibold whitespace-nowrap ${activeTab === 'bids'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Lịch sử đấu giá
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Item Info Tab */}
              {activeTab === 'info' && (
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* LEFT: Item Details Card */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-purple-600 text-white px-4 py-3">
                        <h3 className="font-bold text-base">Thông tin đấu giá</h3>
                      </div>
                      <div className="p-4 space-y-3 text-sm">
                        {/* Item ID */}
                        <div className="flex justify-between items-start border-b border-gray-200 pb-2">
                          <span className="font-semibold text-gray-700">ID Phiên:</span>
                          <span className="text-gray-900 font-mono">{sessionId}</span>
                        </div>

                        {/* Number of Bids */}
                        <div className="flex justify-between items-start border-b border-gray-200 pb-2">
                          <span className="font-semibold text-gray-700">Số lượt đấu:</span>
                          <div className="text-right">
                            <span className="text-gray-900 font-bold">{bidHistoryTotalElements}</span>
                            {highestBidder && highestBidder !== 'Chưa có' && (
                              <p className="text-xs text-gray-500 mt-1">
                                Cao nhất: {highestBidder.charAt(0)}****{highestBidder.slice(-1)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Bid Increment */}
                        <div className="flex justify-between items-start border-b border-gray-200 pb-2">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-gray-700">Bước giá:</span>
                            <button
                              onClick={() => setShowBidIncrementInfo(true)}
                              className="text-gray-400 hover:text-purple-600 transition-colors"
                              title="Xem cách tính bước giá"
                            >
                              <HelpCircle size={16} />
                            </button>
                          </div>
                          <span className="text-gray-900 font-semibold">
                            {formatCurrency((() => {
                              const price = currentPrice;
                              if (price < 50000) return 5000;
                              if (price < 200000) return 10000;
                              if (price < 500000) return 20000;
                              if (price < 1000000) return 50000;
                              if (price < 5000000) return 100000;
                              if (price < 10000000) return 200000;
                              if (price < 50000000) return 500000;
                              return 1000000;
                            })())} ₫
                          </span>
                        </div>

                        {/* Shipping Info */}
                        <div className="flex justify-between items-start border-b border-gray-200 pb-2">
                          <span className="font-semibold text-gray-700">Vận chuyển:</span>
                          <span className="text-blue-600 hover:underline cursor-pointer text-sm">
                            Xem chi tiết
                          </span>
                        </div>

                        {/* Ends On */}
                        <div className="flex justify-between items-start border-b border-gray-200 pb-2">
                          <span className="font-semibold text-gray-700">Kết thúc:</span>
                          <div className="text-right">
                            <p className="text-gray-900 font-medium">{formatJavaDate(endTime)}</p>
                            <div className="text-red-600 font-bold text-xs mt-1">
                              {status === 'SCHEDULED' ? (
                                <span className="text-blue-600">Chưa bắt đầu</span>
                              ) : endTime ? (
                                <CountdownTimer targetDate={endTime} />
                              ) : (
                                '--:--:--'
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Seller */}
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-gray-700">Người bán:</span>
                          <button
                            onClick={() => setActiveTab('seller')}
                            className="text-blue-600 hover:underline text-right font-medium"
                          >
                            {product?.seller?.username || 'N/A'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Description & Attributes */}
                  <div className="lg:col-span-2">
                    {/* Product Title & Description */}
                    <div className="mb-6">
                      <h3 className="font-bold text-xl text-gray-900 mb-3">{product?.name}</h3>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {product?.description || 'Chưa có mô tả chi tiết.'}
                        </p>
                      </div>
                    </div>

                    {/* Product Attributes */}
                    {product?.attributes && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-base mb-3 text-gray-800">Thông số kỹ thuật:</h4>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          {(() => {
                            const attrs = parseAttributes(product.attributes);

                            // Nếu là object JSON, hiển thị dạng key-value
                            if (attrs && typeof attrs === 'object' && !Array.isArray(attrs)) {
                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {Object.entries(attrs).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                      <span className="text-sm text-gray-600 capitalize">{key}:</span>
                                      <span className="text-sm font-semibold text-gray-800">{String(value)}</span>
                                    </div>
                                  ))}
                                </div>
                              );
                            }

                            // Nếu là string hoặc format khác, hiển thị như cũ
                            return <p className="text-sm text-gray-700">{product.attributes}</p>;
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Category & ID */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Danh mục:</span>
                          <span className="font-semibold text-gray-900">{product?.category?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">ID Sản phẩm:</span>
                          <span className="font-semibold text-gray-900">#{product?.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Ngày tạo:</span>
                          <span className="text-gray-900">{formatJavaDate(product?.createdAt)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Trạng thái:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                            status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                              status === 'ENDED' ? 'bg-gray-100 text-gray-700' :
                                'bg-yellow-100 text-yellow-700'
                            }`}>
                            {status === 'ACTIVE' ? 'Đang diễn ra' :
                              status === 'SCHEDULED' ? 'Sắp diễn ra' :
                                status === 'ENDED' ? 'Đã kết thúc' :
                                  status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Seller Info Tab */}
              {activeTab === 'seller' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg mb-4">Thông tin người bán</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {product?.seller?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{product?.seller?.username}</h4>
                      <p className="text-sm text-gray-600">
                        {product?.seller?.firstName} {product?.seller?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{product?.seller?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Tên người dùng:</span>
                      <span className="font-semibold">{product?.seller?.username}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-semibold">{product?.seller?.email}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bid History Tab */}
              {activeTab === 'bids' && (
                <div>
                  <h3 className="font-bold text-lg mb-4">Lịch sử đấu giá</h3>

                  {/* Notifications for current user */}
                  {sessionNotifications.length > 0 && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">📢 Thông báo của bạn:</h4>
                      <ul className="space-y-2">
                        {sessionNotifications.map((notif: any, idx: number) => (
                          <li key={idx} className="text-xs text-gray-700">
                            • {notif.message} <span className="text-gray-400">({formatJavaDate(notif.createdAt)})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {isLoadingBidHistory ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
                      <p className="text-gray-600">Đang tải...</p>
                    </div>
                  ) : recentBids.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Chưa có lượt đấu giá nào. Hãy là người đầu tiên!</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Người đấu giá</th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Số tiền</th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Thời gian</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {recentBids.map((bid, index) => {
                              const isMe = currentUser?.username === bid.user.username;
                              const isLeader = index === 0;

                              return (
                                <tr key={bid.id} className={isLeader ? 'bg-green-50' : ''}>
                                  <td className="px-4 py-3 text-sm">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {bid.user.username.charAt(0)}****{bid.user.username.slice(-1)}
                                      </span>
                                      {isMe && (
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Bạn</span>
                                      )}
                                      {isLeader && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Dẫn đầu</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right">
                                    <span className={isLeader ? 'font-bold text-green-600' : 'text-gray-600'}>
                                      {formatCurrency(bid.displayedAmount)} ₫
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-600">
                                    {formatJavaDate(bid.bidTime)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {bidHistoryTotalPages > 1 && (
                        <div className="mt-6">
                          <Pagination
                            currentPage={bidHistoryPage}
                            totalPages={bidHistoryTotalPages}
                            onPageChange={handleBidHistoryPageChange}
                            itemsPerPage={2}
                            totalItems={bidHistoryTotalElements}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bid Increment Info Modal */}
      {showBidIncrementInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowBidIncrementInfo(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <HelpCircle className="text-purple-600" size={28} />
                Cách tính Bước giá
              </h2>
              <button
                onClick={() => setShowBidIncrementInfo(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 mb-4">
                Bước giá được hệ thống tự động tính dựa trên giá hiện tại của phiên đấu giá để đảm bảo tính cạnh tranh hợp lý:
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-600 text-white">
                    <th className="px-4 py-3 text-left font-semibold">Giá hiện tại</th>
                    <th className="px-4 py-3 text-right font-semibold">Bước giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">Dưới 50,000₫</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">5,000₫</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">Từ 50,000₫ - 199,999₫</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">10,000₫</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">Từ 200,000₫ - 499,999₫</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">20,000₫</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">Từ 500,000₫ - 999,999₫</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">50,000₫</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">Từ 1,000,000₫ - 4,999,999₫</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">100,000₫</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">Từ 5,000,000₫ - 9,999,999₫</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">200,000₫</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">Từ 10,000,000₫ - 49,999,999₫</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">500,000₫</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">Từ 50,000,000₫ trở lên</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">1,000,000₫</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-800">
                <strong>💡 Lưu ý:</strong> Bước giá hiện tại của phiên này là <strong>{formatCurrency((() => {
                  const price = currentPrice;
                  if (price < 50000) return 5000;
                  if (price < 200000) return 10000;
                  if (price < 500000) return 20000;
                  if (price < 1000000) return 50000;
                  if (price < 5000000) return 100000;
                  if (price < 10000000) return 200000;
                  if (price < 50000000) return 500000;
                  return 1000000;
                })())}₫</strong> (dựa trên giá hiện tại <strong>{formatCurrency(currentPrice)}₫</strong>).
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowBidIncrementInfo(false)}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default AuctionDetail;
