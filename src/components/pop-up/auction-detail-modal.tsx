import { X, Package, TrendingUp, Users, Clock, DollarSign, Trophy, Calendar, Gavel, CheckCircle, AlertCircle } from 'lucide-react';

interface AuctionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction: {
    id: number;
    productName: string;
    image: string;
    startPrice: number;
    currentPrice: number;
    buyNowPrice: number | null;
    totalBids: number;
    status: string;
    startDate: string;
    endDate: string;
    bidders: number;
    winner?: string;
    soldPrice?: number;
    soldDate?: string;
  };
}

// Mock bid history data
const mockBidHistory = [
  { id: 1, bidder: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', amount: 28500000, time: '2024-12-26 21:45:30', isProxyBid: false },
  { id: 2, bidder: 'Trần Thị B', email: 'tranthib@gmail.com', amount: 28000000, time: '2024-12-26 20:30:15', isProxyBid: true },
  { id: 3, bidder: 'Lê Văn C', email: 'levanc@gmail.com', amount: 27500000, time: '2024-12-26 19:15:22', isProxyBid: false },
  { id: 4, bidder: 'Phạm Thị D', email: 'phamthid@gmail.com', amount: 27000000, time: '2024-12-26 18:00:45', isProxyBid: false },
  { id: 5, bidder: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', amount: 26500000, time: '2024-12-26 16:30:10', isProxyBid: true },
];

const AuctionDetailModal = ({ isOpen, onClose, auction }: AuctionDetailModalProps) => {
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
      case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-300';
      case 'ENDED': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'SOLD': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const translateStatus = (status: string) => {
    const translations: { [key: string]: string } = {
      'ACTIVE': 'Đang đấu giá',
      'ENDED': 'Đã kết thúc',
      'SOLD': 'Đã bán'
    };
    return translations[status] || status;
  };

  // Calculate time remaining (for ACTIVE auctions)
  const getTimeRemaining = () => {
    const endTime = new Date(auction.endDate).getTime();
    const now = new Date().getTime();
    const diff = endTime - now;
    
    if (diff <= 0) return 'Đã kết thúc';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} ngày ${hours} giờ`;
    if (hours > 0) return `${hours} giờ ${minutes} phút`;
    return `${minutes} phút`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Chi tiết phiên đấu giá</h2>
              <p className="text-purple-100 text-sm mt-1">ID: #{auction.id}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold border-2 ${getStatusColor(auction.status)}`}>
              {auction.status === 'ACTIVE' && <Clock className="w-5 h-5 animate-pulse" />}
              {auction.status === 'ENDED' && <CheckCircle className="w-5 h-5" />}
              {auction.status === 'SOLD' && <Trophy className="w-5 h-5" />}
              {translateStatus(auction.status)}
            </span>
          </div>

          {/* Product Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Image & Basic Info */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                <img
                  src={auction.image}
                  alt={auction.productName}
                  className="w-full h-80 object-cover rounded-lg mb-4"
                />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{auction.productName}</h3>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Gavel className="w-4 h-4 text-purple-600" />
                      <p className="text-xs text-gray-500">Tổng lượt đấu</p>
                    </div>
                    <p className="text-xl font-bold text-purple-600">{auction.totalBids}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-pink-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-pink-600" />
                      <p className="text-xs text-gray-500">Người tham gia</p>
                    </div>
                    <p className="text-xl font-bold text-pink-600">{auction.bidders}</p>
                  </div>
                </div>
              </div>

              {/* Time Info */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Thời gian đấu giá
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bắt đầu:</span>
                    <span className="font-semibold text-gray-800">{formatDate(auction.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kết thúc:</span>
                    <span className="font-semibold text-gray-800">{formatDate(auction.endDate)}</span>
                  </div>
                  {auction.status === 'ACTIVE' && (
                    <div className="flex justify-between items-center bg-orange-100 p-2 rounded-lg mt-2">
                      <span className="text-orange-700 font-semibold">⏱️ Thời gian còn lại:</span>
                      <span className="font-bold text-orange-700 text-lg">{getTimeRemaining()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Price Info & Bid History */}
            <div className="space-y-4">
              {/* Price Stats */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border-2 border-green-200">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Thông tin giá
                </h4>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-gray-500 mb-1">Giá khởi điểm</p>
                    <p className="text-xl font-bold text-gray-700">{formatCurrency(auction.startPrice)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-green-400">
                    <p className="text-sm text-gray-500 mb-1">Giá hiện tại</p>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(auction.currentPrice)}</p>
                    {auction.status === 'ACTIVE' && (
                      <p className="text-xs text-green-600 mt-1">
                        +{formatCurrency(auction.currentPrice - auction.startPrice)} so với giá khởi điểm
                      </p>
                    )}
                  </div>
                  {auction.buyNowPrice && (
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <p className="text-sm text-gray-500 mb-1">Giá mua ngay</p>
                      <p className="text-xl font-bold text-orange-600">{formatCurrency(auction.buyNowPrice)}</p>
                    </div>
                  )}
                  {auction.status === 'SOLD' && auction.soldPrice && (
                    <div className="bg-purple-100 rounded-lg p-4 border-2 border-purple-400">
                      <p className="text-sm text-purple-600 mb-1">✨ Đã bán với giá</p>
                      <p className="text-2xl font-bold text-purple-700">{formatCurrency(auction.soldPrice)}</p>
                      {auction.soldDate && (
                        <p className="text-xs text-purple-600 mt-1">Ngày bán: {formatDate(auction.soldDate)}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Winner Info */}
              {(auction.status === 'ENDED' || auction.status === 'SOLD') && auction.winner && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-300">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-yellow-900" />
                    </div>
                    <div>
                      <p className="text-sm text-yellow-700 font-semibold">🏆 Người thắng đấu giá</p>
                      <p className="text-lg font-bold text-yellow-900">{auction.winner}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bid History */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border-2 border-gray-200">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              Lịch sử đấu giá ({mockBidHistory.length} lượt gần nhất)
            </h4>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {mockBidHistory.map((bid, index) => (
                <div
                  key={bid.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    index === 0 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-800">{bid.bidder}</p>
                        {bid.isProxyBid && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                            🤖 Tự động
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{bid.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatDate(bid.time)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${index === 0 ? 'text-green-600' : 'text-gray-700'}`}>
                      {formatCurrency(bid.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

export default AuctionDetailModal;
