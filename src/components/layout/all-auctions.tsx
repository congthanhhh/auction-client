import { useState, useEffect } from 'react';
import { Grid, List, Clock, Search } from 'lucide-react';
import PageLayout from './page-layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '../ui/pagination';
import { useAuctionListStore } from '@/stores/useAuctionListStore';

const AllAuctionsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const typeParam = searchParams.get('type');
  const [auctionType, setAuctionType] = useState<'active' | 'scheduled'>(
    typeParam === 'scheduled' ? 'scheduled' : 'active'
  );

  // Sử dụng store để fetch auctions
  const {
    activeAuctions,
    activeLoading,
    activeCurrentPage,
    activeTotalPages,
    fetchActiveAuctions,
    scheduledAuctions,
    scheduledLoading,
    scheduledCurrentPage,
    scheduledTotalPages,
    fetchScheduledAuctions,
  } = useAuctionListStore();

  // Fetch auctions khi component mount hoặc page thay đổi
  useEffect(() => {
    if (auctionType === 'active') {
      fetchActiveAuctions(activeCurrentPage, 9);
    } else {
      fetchScheduledAuctions(scheduledCurrentPage, 9);
    }
  }, [auctionType, activeCurrentPage, scheduledCurrentPage, fetchActiveAuctions, fetchScheduledAuctions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getTimeRemaining = (endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) return 'Đã kết thúc';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} ngày`;
    if (hours > 0) return `${hours} giờ`;
    return `${minutes} phút`;
  };

  const getTimeUntilStart = (startTime: string) => {
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const diff = start - now;

    if (diff <= 0) return 'Đã bắt đầu';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `Còn ${days} ngày`;
    if (hours > 0) return `Còn ${hours} giờ`;
    return `Còn ${minutes} phút`;
  };

  // Filter and sort auctions từ API data
  const currentAuctions = auctionType === 'active' ? activeAuctions : scheduledAuctions;
  const isLoading = auctionType === 'active' ? activeLoading : scheduledLoading;
  const currentPage = auctionType === 'active' ? activeCurrentPage : scheduledCurrentPage;
  const totalPages = auctionType === 'active' ? activeTotalPages : scheduledTotalPages;

  let filteredAuctions = [...currentAuctions];

  // Client-side search filter (nếu cần)
  if (searchQuery) {
    filteredAuctions = filteredAuctions.filter(auction =>
      auction.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Client-side sort (nếu cần)
  filteredAuctions.sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.currentPrice - b.currentPrice;
      case 'price-desc': return b.currentPrice - a.currentPrice;
      case 'ending-soon': return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
      default: return b.id - a.id; // newest
    }
  });

  const handlePageChange = (page: number) => {
    if (auctionType === 'active') {
      fetchActiveAuctions(page, 9);
    } else {
      fetchScheduledAuctions(page, 9);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">

          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm">
            <button onClick={() => navigate('/')} className="text-purple-600 hover:text-purple-700 font-medium">
              Trang chủ
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-semibold">Tất cả phiên đấu giá</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              🔥 Tất Cả Phiên Đấu Giá
            </h1>
            <p className="text-gray-600">Khám phá sản phẩm đang được đấu giá</p>
          </div>

          {/* Auction Type Tabs */}
          <div className="mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex gap-2">
              <button
                onClick={() => setAuctionType('active')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${auctionType === 'active'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                🔥 Đang đấu giá
              </button>
              <button
                onClick={() => setAuctionType('scheduled')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${auctionType === 'scheduled'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                ⏰ Sắp đấu giá
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>

              {/* Sort */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none bg-white font-medium"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá thấp → cao</option>
                  <option value="price-desc">Giá cao → thấp</option>
                  <option value="ending-soon">Sắp kết thúc</option>
                </select>

                {/* View Mode Toggle */}
                <div className="hidden lg:flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'
                      }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'
                      }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Main Content - Full Width */}
            <main className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">
                  Hiển thị <span className="font-bold text-purple-600">{filteredAuctions.length}</span> phiên đấu giá
                </p>
              </div>

              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {isLoading ? (
                    <div className="col-span-full text-center py-12">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600 text-lg">Đang tải phiên đấu giá...</p>
                    </div>
                  ) : filteredAuctions.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500 text-lg">Không tìm thấy phiên đấu giá nào</p>
                    </div>
                  ) : (
                    filteredAuctions.map((auction) => (
                      <div
                        key={auction.id}
                        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group"
                        onClick={() => navigate(`/auction/${auction.id}`)}
                      >
                        {/* Image */}
                        <div className="relative overflow-hidden">
                          <img
                            src={auction.product.images[0]?.url || 'https://via.placeholder.com/400'}
                            alt={auction.product.name}
                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {auctionType === 'active'
                              ? getTimeRemaining(auction.endTime)
                              : getTimeUntilStart(auction.startTime)
                            }
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                            {auction.product.name}
                          </h3>

                          <div className="mb-3">
                            <p className="text-xs text-gray-500">Giá hiện tại</p>
                            <p className="text-xl font-bold text-purple-600">{formatCurrency(auction.currentPrice)}</p>
                          </div>

                          {auction.buyNowPrice && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
                              <p className="text-xs text-green-700">💚 Mua ngay: <span className="font-bold">{formatCurrency(auction.buyNowPrice)}</span></p>
                            </div>
                          )}

                          {auction.highestBidder && (
                            <div className="mb-3">
                              <p className="text-xs text-gray-500">Người đấu giá cao nhất</p>
                              <p className="text-sm font-medium text-gray-700">{auction.highestBidder.username}</p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/auction/${auction.id}`);
                              }}
                              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${auctionType === 'active'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                                }`}
                            >
                              {auctionType === 'active' ? 'Đặt giá' : 'Xem chi tiết'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600 text-lg">Đang tải phiên đấu giá...</p>
                    </div>
                  ) : filteredAuctions.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">Không tìm thấy phiên đấu giá nào</p>
                    </div>
                  ) : (
                    filteredAuctions.map((auction) => (
                      <div
                        key={auction.id}
                        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex gap-4 p-4"
                        onClick={() => navigate(`/auction/${auction.id}`)}
                      >
                        <img
                          src={auction.product.images[0]?.url || 'https://via.placeholder.com/400'}
                          alt={auction.product.name}
                          className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-2">{auction.product.name}</h3>
                          <div className="flex items-center gap-6 mb-2">
                            <div>
                              <p className="text-xs text-gray-500">Giá hiện tại</p>
                              <p className="text-xl font-bold text-purple-600">{formatCurrency(auction.currentPrice)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                {auctionType === 'active' ? 'Thời gian còn lại' : 'Bắt đầu sau'}
                              </p>
                              <p className="text-lg font-bold text-orange-600">
                                {auctionType === 'active'
                                  ? getTimeRemaining(auction.endTime)
                                  : getTimeUntilStart(auction.startTime)
                                }
                              </p>
                            </div>
                            {auction.highestBidder && (
                              <div>
                                <p className="text-xs text-gray-500">Người đấu giá cao nhất</p>
                                <p className="text-sm font-medium text-gray-700">{auction.highestBidder.username}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <button className={`px-6 py-3 rounded-lg font-semibold transition-all self-center ${auctionType === 'active'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                          }`}>
                          {auctionType === 'active' ? 'Đặt giá' : 'Xem chi tiết'}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Pagination */}
              {!isLoading && filteredAuctions.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AllAuctionsPage;
