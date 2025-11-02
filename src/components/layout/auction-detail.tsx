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
    <div className="bg-gray-100 rounded p-2">
      <p className="text-xs text-gray-600 mb-1 text-center">THỜI GIAN CÒN LẠI</p>
      <div className="flex gap-1 text-center justify-center">
        <div className="bg-white rounded px-2 py-1 min-w-[30px]">
          <div className="text-sm font-bold text-gray-900">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500">hrs</div>
        </div>
        <div className="bg-white rounded px-2 py-1 min-w-[30px]">
          <div className="text-sm font-bold text-gray-900">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500">min</div>
        </div>
        <div className="bg-white rounded px-2 py-1 min-w-[30px]">
          <div className="text-sm font-bold text-gray-900">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500">sec</div>
        </div>
      </div>
    </div>
  );
};

const AuctionDetail = () => {
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState('');
  const [currentPrice] = useState('28.898.989');
  const [startingPrice] = useState('19.999.999');

  const handleGoBack = () => {
    navigate('/'); // Navigate back to home page
  };

  const handleBid = () => {
    if (bidAmount) {
      console.log('Đấu giá với số tiền:', bidAmount);
      // Handle bid logic here
    }
  };

  return (
    <PageLayout className="bg-gray-50">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Trở về</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Product Images Section */}
            <div className="bg-black p-6 lg:p-8 flex items-center justify-center">
              <div className="flex gap-3 lg:gap-4">
                {/* Gray iPhone */}
                <div className="transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                  <div className="w-28 h-48 lg:w-32 lg:h-56 bg-gradient-to-b from-gray-300 to-gray-600 rounded-3xl relative shadow-2xl">
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-400 rounded-full opacity-30"></div>
                  </div>
                </div>
                
                {/* Orange iPhone */}
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <div className="w-32 h-56 lg:w-36 lg:h-64 bg-gradient-to-b from-orange-400 to-orange-600 rounded-3xl relative shadow-2xl">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-orange-900 rounded-2xl flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="w-3 h-3 bg-black rounded-full"></div>
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                        <div className="w-1 h-1 bg-orange-700 rounded-full"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-orange-300 rounded-full opacity-30"></div>
                  </div>
                </div>

                {/* Blue iPhone */}
                <div className="transform rotate-12 hover:rotate-0 transition-transform duration-300">
                  <div className="w-28 h-48 lg:w-32 lg:h-56 bg-gradient-to-b from-blue-400 to-blue-800 rounded-3xl relative shadow-2xl">
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                        <div className="w-1 h-1 bg-blue-700 rounded-full"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-300 rounded-full opacity-30"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="p-4 lg:p-6 flex flex-col justify-start">
              {/* Product Title */}
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                iPhone 17 Seri
              </h1>
              <p className="text-xs text-gray-500 mb-4">
                Được đăng bởi NguyenCuong vào ngày 11/02/2025
              </p>

              {/* Countdown Timer */}
              <div className="mb-4">
                <CountdownTimer endTime={new Date(Date.now() + 23 * 60 * 60 * 1000 + 12 * 60 * 1000 + 59 * 1000)} />
              </div>

              {/* Price Information */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Giá đấu hiện tại</p>
                <p className="text-2xl font-bold text-blue-600 mb-2">{currentPrice} VNĐ</p>
                <p className="text-xs text-gray-500">
                  Giá khởi điểm: {startingPrice} VNĐ
                </p>
              </div>

              {/* Bid Input */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder=""
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Giá đấu tối thiểu: 20.999.999 VNĐ
                </p>
              </div>

              {/* Bid Button */}
              <button
                onClick={handleBid}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded text-sm transition-colors duration-200 mb-4"
                disabled={!bidAmount}
              >
                Đấu giá
              </button>

              {/* Product Information Table */}
              <div className="border border-gray-200 rounded p-3">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">Thông tin sản phẩm</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Danh mục:</span>
                    <span className="text-gray-900">Điện thoại</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tình trạng:</span>
                    <span className="text-gray-900">Hoàn toàn mới</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID sản phẩm:</span>
                    <span className="text-gray-900">#0912</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Sections */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Product Description Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Mô tả sản phẩm</h2>
          <div className="text-sm text-gray-700 leading-relaxed">
            <p>
              iPhone 17 Pro và iPhone 17 Pro Max được thiết kế từ trong ra ngoài để trở thành những phiên bản iPhone mạnh mẽ nhất. Cốt lõi của thiết kế mới là vỏ máy nguyên khối nhôm rèn nhịt tăng tối đa độ bền bỉ, hiệu năng và dung lượng pin.
            </p>
          </div>
        </div>

        {/* Auction History Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Lịch sử đấu giá</h2>
          <div className="space-y-3">
            {/* Bid Entry 1 */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="font-semibold text-gray-900 text-sm">CuongV_09</p>
                <p className="text-xs text-gray-500">Vào ngày 11/02/2025 lúc 07:20:21 PM</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600 text-sm">28.898.989 VNĐ</p>
              </div>
            </div>

            {/* Bid Entry 2 */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="font-semibold text-gray-900 text-sm">ThanhCong_Ng</p>
                <p className="text-xs text-gray-500">Vào ngày 11/02/2025 lúc 07:20:21 PM</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600 text-sm">26.777.123 VNĐ</p>
              </div>
            </div>

            {/* Bid Entry 3 */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="font-semibold text-gray-900 text-sm">NCui603</p>
                <p className="text-xs text-gray-500">Vào ngày 11/02/2025 lúc 07:20:21 PM</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600 text-sm">22.000.000 VNĐ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AuctionDetail;