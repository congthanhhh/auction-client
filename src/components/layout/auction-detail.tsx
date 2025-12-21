import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from './page-layout';
import { useAuctionStore } from '@/stores/useAuctionStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatJavaDate } from '@/lib/dateUtils';
import CountdownTimer from './CountdownTimer';
import { getProductById } from '@/lib/productUtils';


const AuctionDetail = () => {
  const navigate = useNavigate();
  const [showProxyBiddingInfo, setShowProxyBiddingInfo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Product images array
  const productImages = [
    { id: 1, color: 'Gray', bgGradient: 'from-gray-300 to-gray-600', cameraColor: 'bg-gray-800', homeColor: 'bg-gray-400' },
    { id: 2, color: 'Yellow', bgGradient: 'from-yellow-400 to-yellow-600', cameraColor: 'bg-yellow-900', homeColor: 'bg-yellow-300', featured: true },
    { id: 3, color: 'Black', bgGradient: 'from-gray-800 to-black', cameraColor: 'bg-gray-900', homeColor: 'bg-gray-600', border: 'border-gray-700' },
    { id: 4, color: 'Blue', bgGradient: 'from-blue-400 to-blue-600', cameraColor: 'bg-blue-900', homeColor: 'bg-blue-300' },
    { id: 5, color: 'Red', bgGradient: 'from-red-400 to-red-600', cameraColor: 'bg-red-900', homeColor: 'bg-red-300' }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleGoBack = () => {
    navigate('/');
  };


  const { auctionId } = useParams<{ auctionId: string }>();
  const sessionId = Number(auctionId);

  // Lấy thông tin sản phẩm từ db.json theo auctionId
  const productData = getProductById(auctionId || '');

  // Lấy thông tin user hiện tại để so sánh trong lịch sử đấu giá
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
    addSessionNotification,
    startPrice,
    buyNowPrice,
    endTime,
    myMaxBid
  } = useAuctionStore();

  const [bidAmount, setBidAmount] = useState<number>(0);
  const [showProxyInfo, setShowProxyInfo] = useState(false); // State cho tooltip
  const isLeading = highestBidder === currentUser?.username;

  // 1. Khởi tạo dữ liệu và Socket
  useEffect(() => {
    if (sessionId) {
      fetchAuctionDetail(sessionId);
      initializeSocket(sessionId);
    }
    return () => {
      if (sessionId) leaveSocket(sessionId);
    };
  }, [sessionId]);

  // 3. Gợi ý giá bid tiếp theo (Giá hiện tại + bước giá ví dụ)
  useEffect(() => {
    // Logic: Nếu chưa có giá thì 100k, có rồi thì + thêm chút đỉnh hoặc giữ nguyên để user nhập
    setBidAmount(currentPrice > 0 ? currentPrice + 100000 : 100000);
  }, [currentPrice]);

  const handlePlaceBid = async () => {
    if (!isAuthenticated) return alert("Vui lòng đăng nhập để tham gia đấu giá!");

    // Validate cơ bản
    if (bidAmount <= currentPrice) {
      return alert("Giá đặt phải cao hơn giá hiện tại!");
    }

    try {
      await placeBid(sessionId, bidAmount);
      // Không cần alert success vì socket sẽ update UI ngay lập tức
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi đặt giá");
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) return alert("Vui lòng đăng nhập!");
    if (!buyNowPrice) return;

    // Confirm với user
    const confirm = window.confirm(`Bạn có chắc muốn mua ngay với giá ${buyNowPrice.toLocaleString()} VNĐ không?`);
    if (!confirm) return;

    try {
      // Gọi hàm placeBid với số tiền bằng giá Mua Ngay
      await placeBid(sessionId, buyNowPrice);
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi mua ngay");
    }
  };



  return (
    <PageLayout className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Back Button */}
      <div className="mb-8 pt-4 px-4 lg:px-0 max-w-6xl mx-auto">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-3 bg-white hover:bg-yellow-50 text-gray-800 font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
        >
          <ArrowLeft size={20} className="text-yellow-600" />
          <span>Trở về trang chủ</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto mb-8 px-4 lg:px-0">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="grid lg:grid-cols-2 gap-0">

            {/* --- CỘT TRÁI: GIAO DIỆN ĐẤU GIÁ --- */}
            <div className="lg:col-span-1 bg-white p-4 lg:p-6 flex flex-col justify-start border-r border-gray-200">
              {/* Product Title */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                  <h1 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                    {productData?.name || 'Sản phẩm đấu giá'}
                  </h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Đang đấu giá
                  </span>
                  <span>•</span>
                  <span>ID: #{sessionId}</span>
                  <span>•</span>
                  {/* TODO: Thay bằng {product.seller} */}
                  <span>Đăng bởi <strong className="text-yellow-600">Admin</strong></span>
                </div>
              </div>
              <div className="mb-4">
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-3">
                  <p className="text-center text-xs text-yellow-800 font-semibold mb-2">
                    THỜI GIAN CÒN LẠI
                  </p>

                  {/* Truyền endTime vào component */}
                  <CountdownTimer targetDate={endTime} />
                </div>
              </div>

              {/* Price Information */}
              <div className="mb-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 text-center">
                  <p className="text-xs font-semibold text-gray-700 mb-2">GIÁ ĐẤU HIỆN TẠI</p>
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-lg inline-block shadow-md">
                    <p className="text-2xl font-black tracking-tight">
                      {currentPrice.toLocaleString()} VNĐ
                    </p>
                    {recentBids.length === 0 && (
                      <span className="absolute -top-3 -right-3 bg-blue-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm">
                        Khởi điểm
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Giá khởi điểm: <span className="font-bold">{startPrice.toLocaleString()} VNĐ</span>
                  </p>

                  {/* <p className="text-sm text-gray-600 mt-3">
                    Người dẫn đầu: <span className="font-bold text-gray-800">{highestBidder}</span>
                  </p> */}

                  {buyNowPrice && (
                    <div className="mb-4 animate-pulse">
                      <button
                        onClick={handleBuyNow}
                        className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-black py-3 px-4 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] flex items-center justify-center gap-2 border-2 border-white/20"
                      >
                        <span className="text-xl">⚡</span>
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-medium uppercase tracking-wider opacity-90">Mua ngay với giá</span>
                          <span className="text-lg leading-none">{buyNowPrice.toLocaleString()} VNĐ</span>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Trạng thái giá sàn */}
                  <div className="mt-3">
                    {reservePriceMet ? (
                      <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">
                        <span className="text-xs">✨</span>
                        <span className="text-xs font-bold">Giá sàn đã đạt</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full border border-orange-200">
                        <span className="text-xs">🔒</span>
                        <span className="text-xs font-bold">Chưa đạt giá sàn</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Private Notification Box */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-yellow-800 text-sm mb-3 pb-2 border-b border-yellow-200 flex items-center gap-2">
                  <span>📢</span> Thông báo của bạn
                </h3>
                <ul className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {sessionNotifications.length === 0 && (
                    <li className="text-xs text-gray-500 italic text-center py-2">
                      Chưa có thông báo riêng nào.
                    </li>
                  )}
                  {sessionNotifications.map((notif, idx) => (
                    <li key={idx} className="text-xs bg-white p-3 rounded-md shadow-sm border border-yellow-100 text-gray-700 animate-fade-in">
                      <p className="font-medium leading-relaxed">{notif.message}</p>
                      <div className="text-[10px] text-gray-400 mt-1 text-right">
                        {formatJavaDate(notif.createdAt)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phần hiển thị Max Bid của tôi */}
              {isLeading && myMaxBid && (
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <span className="text-xs text-blue-700 font-semibold flex items-center gap-1">
                    <span>🎯</span> Giá max bạn đã đặt:
                  </span>
                  <span className="text-sm font-bold text-blue-800">
                    {myMaxBid.toLocaleString()} VNĐ
                  </span>
                </div>
              )}

              {/* Proxy Bidding Input */}
              <div className="mt-auto">
                <div className="bg-white border-2 border-yellow-400 rounded-xl p-4 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-yellow-400 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                    PROXY BIDDING
                  </div>

                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    <span>🎯</span>
                    <span>Đặt giá tối đa</span>
                    <button
                      onClick={() => setShowProxyInfo(!showProxyInfo)}
                      className="w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600 transition-colors"
                    >
                      ?
                    </button>
                  </label>

                  {showProxyInfo && (
                    <div className="mb-3 text-xs text-gray-500 bg-gray-50 p-2 rounded border">
                      Hệ thống sẽ tự động trả giá thay bạn từng bước một cho đến khi đạt mức tối đa này.
                    </div>
                  )}

                  <div className="relative mb-3">
                    <input
                      type="number"
                      placeholder="Nhập giá tối đa..."
                      value={bidAmount || ''}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-sm">
                      VNĐ
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceBid}
                    disabled={!bidAmount}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transform active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🚀 ĐẶT GIÁ NGAY
                  </button>
                </div>
              </div>
            </div>

            {/* --- CỘT PHẢI: LỊCH SỬ ĐẤU GIÁ --- */}
            <div className="lg:col-span-1 bg-gray-50 p-4 lg:p-6 flex flex-col h-[500px] lg:h-[680px] sticky top-24 rounded-2xl border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 shrink-0">
                <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow text-sm">📊</span>
                Lịch sử đấu giá
              </h2>

              {/* Phần danh sách này sẽ tự động có thanh trượt khi nội dung dài quá chiều cao cha */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar space-y-3">
                {recentBids.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                    <span className="text-4xl mb-2">📭</span>
                    <p className="text-sm">Chưa có lượt trả giá nào</p>
                  </div>
                )}

                {recentBids.map((bid, index) => {
                  const isMe = currentUser?.username === bid.user.username;
                  const isLeader = index === 0;

                  return (
                    <div
                      key={bid.id}
                      className={`
                        relative p-3 rounded-xl border shadow-sm transition-all duration-300
                        ${isLeader
                          ? 'bg-white border-green-300 shadow-green-100'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                        }
                    `}
                    >
                      {isLeader && (
                        <div className="absolute -top-2 -right-2">
                          <span className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800 text-sm">
                              {bid.user.username}
                            </span>
                            {isMe && (
                              <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Bạn
                              </span>
                            )}
                            {isLeader && (
                              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="text-[8px]">👑</span> Dẫn đầu
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                            <span>🕒</span>
                            {formatJavaDate(bid.bidTime)}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`font-bold text-sm ${isLeader ? 'text-green-600' : 'text-gray-600'}`}>
                            {bid.displayedAmount.toLocaleString()} ₫
                          </div>
                          <div className="mt-1">
                            {!isLeader && (
                              <span className="bg-red-50 text-red-500 text-[10px] font-medium px-2 py-0.5 rounded-full border border-red-100">
                                ❌ Bị vượt
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Row: Product Images + Description */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="grid lg:grid-cols-10 gap-0">
            {/* Product Images Section */}
            <div className="lg:col-span-4 bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 lg:p-8 flex flex-col justify-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-2xl"></div>

              {/* Main Image Display */}
              <div className="relative z-10 mb-6 flex justify-center">
                <div className="relative">
                  {productImages[currentImageIndex].featured && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-[1.5rem] blur opacity-75 animate-pulse"></div>
                  )}
                  <div className={`relative w-32 h-56 lg:w-40 lg:h-72 bg-gradient-to-b ${productImages[currentImageIndex].bgGradient} rounded-[1.5rem] shadow-2xl hover:shadow-yellow-500/40 transition-all duration-500 ${productImages[currentImageIndex].border || ''}`}>
                    {/* Camera Module */}
                    <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 ${productImages[currentImageIndex].cameraColor} rounded-xl flex items-center justify-center ${productImages[currentImageIndex].border ? 'border border-gray-600' : ''}`}>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                        <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                        <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                    </div>
                    {/* Home Button */}
                    <div className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 w-10 h-10 ${productImages[currentImageIndex].homeColor} rounded-full opacity-40`}></div>

                    {/* Featured Badge */}
                    {productImages[currentImageIndex].featured && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        HOT
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="relative z-10 flex justify-between items-center mb-4 px-4">
                <button
                  onClick={prevImage}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Color/Model Name */}
                <div className="text-center">
                  <h3 className="text-white font-bold text-lg mb-1 line-clamp-2 px-4">
                    {productData?.name.split('|')[0].trim() || 'Sản phẩm đấu giá'}
                  </h3>
                  <p className="text-yellow-400 font-semibold text-sm">{productImages[currentImageIndex].color}</p>
                </div>

                <button
                  onClick={nextImage}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Thumbnail Navigation */}
              <div className="relative z-10 flex justify-center gap-2">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                      ? 'bg-yellow-400 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                      }`}
                  />
                ))}
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {currentImageIndex + 1} / {productImages.length}
              </div>
            </div>

            {/* Product Description Section */}
            <div className="lg:col-span-6 bg-white p-6 lg:p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-lg">📝</span>
                Mô tả sản phẩm
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p className="text-base">
                  <span className="font-bold text-yellow-600">{productData?.name || 'Sản phẩm này'}</span> được thiết kế từ trong ra ngoài để trở thành phiên bản mạnh mẽ nhất từ trước đến nay.
                </p>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-l-4 border-yellow-400">
                  <p className="text-sm">
                    🔥 <strong>Đặc biệt:</strong> Cốt lõi của thiết kế mới là vỏ máy nguyên khối nhôm rèn nhịt tăng tối đa độ bền bỉ, hiệu năng và dung lượng pin.
                  </p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Chip A18 Pro với hiệu năng vượt trội
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Camera Pro Max 48MP với zoom quang học 5x
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Pin 4500mAh sạc nhanh 30W
                  </li>
                </ul>

                {/* Thông tin sản phẩm */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-black text-gray-900 mb-4 text-lg flex items-center gap-3">
                    <span className="text-2xl">📱</span>
                    Thông tin sản phẩm
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Danh mục:</span>
                          <span className="text-gray-900 font-bold">Điện thoại</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Tình trạng:</span>
                          <span className="text-green-600 font-bold">Hoàn toàn mới</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">ID sản phẩm:</span>
                          <span className="text-gray-900 font-bold">#0912</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Bước giá:</span>
                          {/* <span className="text-yellow-600 font-bold">{nextBidIncrement} VNĐ</span> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proxy Bidding Info Modal */}
      {showProxyBiddingInfo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pt-20 pointer-events-none animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setShowProxyBiddingInfo(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl transition-colors"
            >
              ×
            </button>

            {/* Modal Content */}
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤖</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Đấu giá tự động (Proxy Bidding)
                </h2>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Đặt giá</h3>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Hệ thống tự động đấu giá thay bạn</h3>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Chỉ tăng giá khi có người đấu cao hơn</h3>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">👑</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tiết kiệm thời gian, đảm bảo cơ hội thắng</h3>
                </div>
              </div>

              {/* Footer Button */}
              <button
                onClick={() => setShowProxyBiddingInfo(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Đã hiểu rồi!
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default AuctionDetail;