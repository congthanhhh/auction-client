import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from './page-layout';

// Countdown Timer Component (reuse from Home)
const CountdownTimer = ({ endTime }: { endTime: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="text-center">
      <p className="text-sm font-semibold text-yellow-700 mb-3 flex items-center justify-center gap-2">
        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
        THỜI GIAN CÒN LẠI
      </p>
      <div className="flex gap-3 justify-center">
        <div className="bg-white border-2 border-yellow-300 rounded-xl px-4 py-3 min-w-[60px] shadow-lg">
          <div className="text-2xl font-black text-gray-900">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-xs font-medium text-yellow-600 uppercase">Giờ</div>
        </div>
        <div className="bg-white border-2 border-yellow-300 rounded-xl px-4 py-3 min-w-[60px] shadow-lg">
          <div className="text-2xl font-black text-gray-900">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-xs font-medium text-yellow-600 uppercase">Phút</div>
        </div>
        <div className="bg-white border-2 border-yellow-300 rounded-xl px-4 py-3 min-w-[60px] shadow-lg">
          <div className="text-2xl font-black text-gray-900">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-xs font-medium text-yellow-600 uppercase">Giây</div>
        </div>
      </div>
    </div>
  );
};

const AuctionDetail = () => {
  const navigate = useNavigate();
  const [maxBidAmount, setMaxBidAmount] = useState('');
  const [currentPrice] = useState('28.898.989');
  const [startingPrice] = useState('19.999.999');
  const [nextBidIncrement] = useState('100.000');
  const [userMaxBid, setUserMaxBid] = useState('32.000.000'); // Giá tối đa hiện tại của user
  const [isHighestBidder, setIsHighestBidder] = useState(true); // User có phải là người đấu giá cao nhất
  const [showBidConfirmation, setShowBidConfirmation] = useState(false);
  const [reservePrice] = useState('25.000.000'); // Giá sàn cố định
  const [isReserveMet, setIsReserveMet] = useState(false); // Trạng thái đạt giá sàn

  // Kiểm tra xem đã đạt giá sàn chưa
  useEffect(() => {
    const current = parseFloat(currentPrice.replace(/\./g, ''));
    const reserve = parseFloat(reservePrice.replace(/\./g, ''));
    setIsReserveMet(current >= reserve);
  }, [currentPrice, reservePrice]);

  // Format số tiền với dấu chấm phân cách
  const formatNumber = (value: string) => {
    // Loại bỏ tất cả ký tự không phải số
    const numericValue = value.replace(/\D/g, '');
    
    // Thêm dấu chấm phân cách hàng nghìn
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Tạo gợi ý số tiền dựa trên input
  const generateSuggestions = (input: string) => {
    const numericValue = input.replace(/\D/g, '');
    if (!numericValue || numericValue.length === 0) return [];

    const baseNumber = parseInt(numericValue);
    if (isNaN(baseNumber)) return [];

    const suggestions = [];
    
    // Nếu chỉ nhập 1 số (ví dụ: 8)
    if (numericValue.length === 1) {
      suggestions.push(baseNumber * 10000);      // 80.000
      suggestions.push(baseNumber * 100000);     // 800.000  
      suggestions.push(baseNumber * 1000000);    // 8.000.000
      suggestions.push(baseNumber * 10000000);   // 80.000.000
    }
    // Nếu nhập 2 số (ví dụ: 25)
    else if (numericValue.length === 2) {
      suggestions.push(baseNumber * 1000);       // 25.000
      suggestions.push(baseNumber * 10000);      // 250.000
      suggestions.push(baseNumber * 100000);     // 2.500.000
      suggestions.push(baseNumber * 1000000);    // 25.000.000
    }
    // Nếu nhập 3 số trở lên
    else {
      const currentValue = parseInt(numericValue);
      suggestions.push(currentValue * 10);       // x10
      suggestions.push(currentValue * 100);      // x100
      suggestions.push(currentValue * 1000);     // x1000
    }

    // Lọc các gợi ý hợp lý (lớn hơn giá hiện tại)
    const currentPriceValue = parseFloat(currentPrice.replace(/\./g, ''));
    return suggestions
      .filter(val => val > currentPriceValue && val <= 999999999) // Giới hạn tối đa
      .slice(0, 4) // Chỉ lấy 4 gợi ý
      .map(val => formatNumber(val.toString()));
  };

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showProxyBiddingInfo, setShowProxyBiddingInfo] = useState(false);

  // Xử lý khi người dùng nhập giá
  const handleMaxBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatNumber(inputValue);
    setMaxBidAmount(formattedValue);
    
    // Cập nhật gợi ý chỉ khi có input và input không quá dài
    if (inputValue.replace(/\D/g, '').length > 0 && inputValue.replace(/\D/g, '').length <= 3) {
      const newSuggestions = generateSuggestions(inputValue);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Xử lý khi chọn gợi ý
  const handleSuggestionClick = (suggestion: string) => {
    setMaxBidAmount(suggestion);
    setSuggestions([]); // Ẩn gợi ý sau khi chọn
  };

  const handleGoBack = () => {
    navigate('/'); // Navigate back to home page
  };

  const handleMaxBidSubmit = () => {
    if (maxBidAmount) {
      const bidValue = parseFloat(maxBidAmount.replace(/\./g, ''));
      const currentValue = parseFloat(currentPrice.replace(/\./g, ''));
      
      if (bidValue <= currentValue) {
        alert('Giá tối đa phải cao hơn giá hiện tại!');
        return;
      }
      
      setUserMaxBid(maxBidAmount);
      setIsHighestBidder(true);
      setShowBidConfirmation(true);
      console.log('Đặt giá tối đa:', maxBidAmount);
      
      // Ẩn thông báo sau 3 giây
      setTimeout(() => setShowBidConfirmation(false), 3000);
    }
  };

  return (
    <PageLayout className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Back Button */}
      <div className="mb-8">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-3 bg-white hover:bg-yellow-50 text-gray-800 font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
        >
          <ArrowLeft size={20} className="text-yellow-600" />
          <span>Trở về trang chủ</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Product Images Section */}
            <div className="lg:col-span-3 bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 lg:p-12 flex items-center justify-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-2xl"></div>
              
              <div className="flex gap-4 lg:gap-6 relative z-10">
                {/* Gray iPhone */}
                <div className="transform -rotate-12 hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-pointer">
                  <div className="w-32 h-56 lg:w-40 lg:h-72 bg-gradient-to-b from-gray-300 to-gray-600 rounded-[2rem] relative shadow-2xl hover:shadow-yellow-500/20">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-400 rounded-full opacity-30"></div>
                  </div>
                </div>
                
                {/* Featured Yellow iPhone */}
                <div className="transform hover:scale-110 transition-all duration-500 cursor-pointer relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-[2.5rem] blur opacity-75 animate-pulse"></div>
                  <div className="relative w-36 h-64 lg:w-44 lg:h-80 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-[2rem] shadow-2xl hover:shadow-yellow-500/40">
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-yellow-900 rounded-2xl flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="w-3.5 h-3.5 bg-black rounded-full"></div>
                        <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                        <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-yellow-700 rounded-full"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-yellow-300 rounded-full opacity-40"></div>
                    {/* Premium badge */}
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      HOT
                    </div>
                  </div>
                </div>

                {/* Black iPhone */}
                <div className="transform rotate-12 hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-pointer">
                  <div className="w-32 h-56 lg:w-40 lg:h-72 bg-gradient-to-b from-gray-800 to-black rounded-[2rem] relative shadow-2xl hover:shadow-yellow-500/20 border border-gray-700">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-600">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-600 rounded-full opacity-30"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="lg:col-span-2 bg-white p-8 lg:p-10 flex flex-col justify-start">
              {/* Product Title */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    iPhone 17 Series
                  </h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Đang đấu giá
                  </span>
                  <span>•</span>
                  <span>ID: #0912</span>
                  <span>•</span>
                  <span>Đăng bởi <strong className="text-yellow-600">NguyenCuong</strong></span>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-2xl p-5">
                  <CountdownTimer endTime={new Date(Date.now() + 23 * 60 * 60 * 1000 + 12 * 60 * 1000 + 59 * 1000)} />
                </div>
              </div>

              {/* Price Information */}
              <div className="mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <div className="text-center mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">GIÁ ĐẤU HIỆN TẠI</p>
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-3 rounded-xl inline-block">
                      <p className="text-3xl font-black">{currentPrice} VNĐ</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Khởi điểm: <span className="font-semibold">{startingPrice} VNĐ</span>
                    </p>
                    
                    {/* Trạng thái giá sàn */}
                    <div className="mt-4">
                      {isReserveMet ? (
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-2xl font-bold shadow-xl border border-emerald-400 hover:scale-105 transform transition-all duration-300">
                          <span className="text-lg animate-pulse">✨</span>
                          <span>Giá sàn đã đạt</span>
                          
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-2xl font-bold shadow-xl border border-yellow-400 hover:scale-105 transform transition-all duration-300">
                          <span className="text-lg animate-bounce">🔒</span>
                          <span>Có giá sàn</span>
                          <span className="text-lg">⚡</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Proxy Bidding Status */}
                  {isHighestBidder && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-lg font-bold text-green-800">🏆 Bạn đang dẫn đầu!</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-green-700">
                          💰 Giá tối đa: <span className="font-bold">{userMaxBid} VNĐ</span>
                        </p>
                        <p className="text-sm text-green-700">
                          🤖 Hệ thống đang tự động đấu giá cho bạn
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Bid Confirmation */}
                  {showBidConfirmation && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                      <p className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Đặt giá thành công!
                      </p>
                      <p className="text-sm text-blue-700">
                        🎯 Giá tối đa: <span className="font-bold">{maxBidAmount} VNĐ</span>
                      </p>
                      <p className="text-sm text-blue-700">
                        ⚡ Hệ thống sẽ tự động đấu giá thay bạn
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Max Bid Input */}
              <div className="mb-6">
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
                  <label className="flex items-center gap-3 text-lg font-bold text-gray-800 mb-4">
                    <span className="text-2xl">🎯</span>
                    <span>Đặt giá tối đa (Proxy Bidding)</span>
                    <button
                      onClick={() => setShowProxyBiddingInfo(true)}
                      className="w-6 h-6 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200"
                      title="Tìm hiểu về Proxy Bidding"
                    >
                      ?
                    </button>
                  </label>
                  
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Nhập giá tối đa..."
                      value={maxBidAmount}
                      onChange={handleMaxBidChange}
                      className="w-full px-6 py-4 pr-16 border-2 border-yellow-300 rounded-xl text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:border-yellow-400 transition-all duration-300 bg-white"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                      VNĐ
                    </div>
                  </div>

                  {/* Gợi ý số tiền */}
                  {suggestions.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">💡 Có thể bạn muốn nhập:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 border border-yellow-300 hover:border-yellow-400 rounded-lg text-sm font-semibold text-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
                          >
                            {suggestion} VNĐ
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Bid Buttons */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">⚡ Đặt nhanh:</p>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => {
                          // Lấy giá trị hiện tại từ input (nếu có) hoặc giá đấu hiện tại
                          const baseValue = maxBidAmount ? 
                            parseFloat(maxBidAmount.replace(/\./g, '')) : 
                            parseFloat(currentPrice.replace(/\./g, ''));
                          const newValue = baseValue + 1000000; // +1 triệu
                          setMaxBidAmount(formatNumber(newValue.toString()));
                          setSuggestions([]); // Ẩn gợi ý sau khi đặt nhanh
                        }}
                        className="px-4 py-3 bg-white hover:bg-yellow-100 border-2 border-yellow-300 hover:border-yellow-400 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105"
                      >
                        +1M
                      </button>
                      <button
                        onClick={() => {
                          // Lấy giá trị hiện tại từ input (nếu có) hoặc giá đấu hiện tại
                          const baseValue = maxBidAmount ? 
                            parseFloat(maxBidAmount.replace(/\./g, '')) : 
                            parseFloat(currentPrice.replace(/\./g, ''));
                          const newValue = baseValue + 2000000; // +2 triệu
                          setMaxBidAmount(formatNumber(newValue.toString()));
                          setSuggestions([]); // Ẩn gợi ý sau khi đặt nhanh
                        }}
                        className="px-4 py-3 bg-white hover:bg-yellow-100 border-2 border-yellow-300 hover:border-yellow-400 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105"
                      >
                        +2M
                      </button>
                      <button
                        onClick={() => {
                          // Lấy giá trị hiện tại từ input (nếu có) hoặc giá đấu hiện tại
                          const baseValue = maxBidAmount ? 
                            parseFloat(maxBidAmount.replace(/\./g, '')) : 
                            parseFloat(currentPrice.replace(/\./g, ''));
                          const newValue = baseValue + 5000000; // +5 triệu
                          setMaxBidAmount(formatNumber(newValue.toString()));
                          setSuggestions([]); // Ẩn gợi ý sau khi đặt nhanh
                        }}
                        className="px-4 py-3 bg-white hover:bg-yellow-100 border-2 border-yellow-300 hover:border-yellow-400 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105"
                      >
                        +5M
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      💰 Giá tối thiểu: <span className="font-bold text-gray-800">{(parseFloat(currentPrice.replace(/\./g, '')) + parseFloat(nextBidIncrement.replace(/\./g, ''))).toLocaleString('vi-VN')} VNĐ</span>
                    </p>
                    <p className="text-yellow-700 bg-yellow-100 px-3 py-2 rounded-lg">
                      🤖 Hệ thống sẽ tự động đấu giá thay bạn với mức tăng tối thiểu
                    </p>
                  </div>
                </div>
              </div>

              {/* Max Bid Button */}
              <button
                onClick={handleMaxBidSubmit}
                disabled={!maxBidAmount}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 disabled:from-gray-300 disabled:to-gray-400 text-black font-black py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:cursor-not-allowed disabled:transform-none mb-6"
              >
                {maxBidAmount ? '🚀 Đặt giá tối đa ngay!' : 'Nhập giá để tiếp tục'}
              </button>



              {/* Product Information Table */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6">
                <h3 className="font-black text-gray-900 mb-4 text-lg flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  Thông tin sản phẩm
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3 border border-gray-200">
                    <span className="text-gray-600 font-medium">Danh mục:</span>
                    <span className="text-gray-900 font-bold">Điện thoại</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3 border border-gray-200">
                    <span className="text-gray-600 font-medium">Tình trạng:</span>
                    <span className="text-green-600 font-bold">Hoàn toàn mới</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3 border border-gray-200">
                    <span className="text-gray-600 font-medium">ID sản phẩm:</span>
                    <span className="text-gray-900 font-bold">#0912</span>
                  </div>
                  <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3 border border-gray-200">
                    <span className="text-gray-600 font-medium">Bước giá:</span>
                    <span className="text-yellow-600 font-bold">{nextBidIncrement} VNĐ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Sections */}
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        {/* Product Description Section */}
        <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-lg">📝</span>
            Mô tả sản phẩm
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p className="text-base">
              <span className="font-bold text-yellow-600">iPhone 17 Series</span> được thiết kế từ trong ra ngoài để trở thành những phiên bản iPhone mạnh mẽ nhất từ trước đến nay.
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
          </div>
        </div>

        {/* Auction History Section */}
        <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-lg">📈</span>
            Lịch sử đấu giá
          </h2>
          <div className="space-y-4">
            {/* Current Bid Entry */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-300/20 rounded-full blur-xl"></div>
              <div className="relative flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900 text-base flex items-center gap-3">
                    <span className="text-2xl">👑</span>
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-sm font-black">
                      CuongV_09 (Bạn)
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">🤖 Proxy Bidding • 11/02/2025 lúc 07:20:21 PM</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-green-600 text-lg">28.898.989 VNĐ</p>
                  <p className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">🏆 Đang dẫn đầu</p>
                </div>
              </div>
            </div>

            {/* Previous Bid Entry 1 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900 text-base flex items-center gap-2">
                    <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">2</span>
                    ThanhCong_Ng
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🤖 Proxy Bidding • 11/02/2025 lúc 07:18:15 PM</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-600 text-base">28.798.989 VNĐ</p>
                  <p className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded-full">❌ Bị vượt qua</p>
                </div>
              </div>
            </div>

            {/* Previous Bid Entry 2 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900 text-base flex items-center gap-2">
                    <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">3</span>
                    NCui603
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🤖 Proxy Bidding • 11/02/2025 lúc 07:15:30 PM</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-600 text-base">26.777.123 VNĐ</p>
                  <p className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded-full">❌ Bị vượt qua</p>
                </div>
              </div>
            </div>

            {/* Starting Bid */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900 text-base flex items-center gap-2">
                    <span className="text-2xl">🏁</span>
                    Hệ thống
                  </p>
                  <p className="text-sm text-gray-500 mt-1">⭐ Giá khởi điểm • 10/02/2025 lúc 09:00:00 AM</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600 text-base">19.999.999 VNĐ</p>
                  <p className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">🚀 Khởi điểm</p>
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
                  <h3 className="font-semibold text-gray-900 mb-2">Đặt giá tối đa bạn sẵn sàng trả</h3>
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