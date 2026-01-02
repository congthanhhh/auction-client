import { useEffect, useState } from 'react';
import { Heart, Share2, Printer, Facebook } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from './page-layout';
import { useAuctionStore } from '@/stores/useAuctionStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatJavaDate } from '@/lib/dateUtils';
import CountdownTimer from './CountdownTimer';

// Mock Product Data
const MOCK_PRODUCT = {
  id: 1,
  name: "Powers On IOB EUFY ROBOVAC 25C",
  description: `Robot hút bụi thông minh EUFY ROBOVAC 25C với công nghệ hút mạnh mẽ và điều khiển qua ứng dụng di động.

Đặc điểm nổi bật:
- Công suất hút 1500Pa
- Pin 2600mAh, thời gian hoạt động 100 phút
- Kết nối WiFi, điều khiển qua app
- Tự động sạc khi pin yếu
- Thiết kế mỏng chỉ 7.2cm, dễ dàng lau dọn gầm sofa, giường
- Cảm biến chống va chạm và chống rơi

Tình trạng: Đã qua sử dụng, hoạt động tốt. Có một số vết xước nhỏ bên ngoài nhưng không ảnh hưởng đến chức năng.

Bao gồm:
- Robot hút bụi
- Dock sạc
- Bộ lọc phụ
- Chổi quét phụ
- Hướng dẫn sử dụng`,
  startPrice: 1500000,
  createdAt: "2024-12-15T10:00:00",
  category: {
    id: 3,
    name: "Đồ gia dụng",
    description: "Thiết bị điện tử và đồ gia dụng"
  },
  seller: {
    username: "goodwill_store",
    firstName: "Heart of Texas",
    lastName: "Goodwill",
    email: "contact@goodwill.org"
  },
  attributes: "Màu sắc: Xanh đen, Trọng lượng: 2.7kg, Kích thước: 32.5 x 32.5 x 7.2cm, Công suất: 25W",
  images: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&q=80"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1625650004620-67c4a5c66e4e?w=600&q=80"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1595453348098-104a807f84f8?w=600&q=80"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80"
    }
  ]
};

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
    startPrice,
    buyNowPrice,
    startTime,
    endTime,
    status,
    myMaxBid,
  } = useAuctionStore();

  // Sử dụng mock product nếu store product chưa có
  const product = MOCK_PRODUCT;

  const [bidAmount, setBidAmount] = useState<number>(0);
  const isLeading = highestBidder === currentUser?.username;

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

  // Lấy danh sách ảnh sản phẩm - sử dụng mock nếu không có từ store
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
                <div>
                  <h3 className="font-bold text-lg mb-4">Mô tả sản phẩm</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {product?.description || 'Chưa có mô tả chi tiết.'}
                    </p>
                  </div>

                  {/* Product Attributes */}
                  {product?.attributes && (
                    <div className="mt-6 border-t pt-6">
                      <h4 className="font-semibold mb-3">Thông số kỹ thuật:</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700">{product.attributes}</p>
                      </div>
                    </div>
                  )}

                  {/* Category */}
                  <div className="mt-6 border-t pt-6">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Danh mục:</span>
                      <span className="font-semibold">{product?.category?.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">ID sản phẩm:</span>
                      <span className="font-semibold">#{product?.id}</span>
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

                  {recentBids.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Chưa có lượt đấu giá nào. Hãy là người đầu tiên!</p>
                    </div>
                  ) : (
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
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AuctionDetail;
