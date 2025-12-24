import { useState } from 'react';
import { ChevronDown, SlidersHorizontal, Grid, List, TrendingUp, Clock, DollarSign, Search, Filter } from 'lucide-react';
import PageLayout from './page-layout';
import { useNavigate } from 'react-router-dom';

// Mock data - 20 sản phẩm
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "iPhone 15 Pro Max 256GB",
    image: "https://images.unsplash.com/photo-1696446702183-cbd90e810a7e?w=400",
    currentPrice: 28990000,
    buyNowPrice: 32000000,
    totalBids: 45,
    endTime: "2024-12-27 22:00",
    category: "Điện thoại",
    status: "ACTIVE"
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra 512GB",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
    currentPrice: 25500000,
    buyNowPrice: null,
    totalBids: 32,
    endTime: "2024-12-26 18:00",
    category: "Điện thoại",
    status: "ACTIVE"
  },
  {
    id: 3,
    name: "MacBook Air M3 13 inch 256GB",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    currentPrice: 27999000,
    buyNowPrice: 30000000,
    totalBids: 28,
    endTime: "2024-12-28 20:00",
    category: "Laptop",
    status: "ACTIVE"
  },
  {
    id: 4,
    name: "iPad Pro 12.9 M2 WiFi 128GB",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    currentPrice: 22990000,
    buyNowPrice: 25000000,
    totalBids: 41,
    endTime: "2024-12-25 16:00",
    category: "Máy tính bảng",
    status: "ACTIVE"
  },
  {
    id: 5,
    name: "AirPods Pro 2nd Gen | USB-C",
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400",
    currentPrice: 5990000,
    buyNowPrice: 6500000,
    totalBids: 67,
    endTime: "2024-12-26 14:00",
    category: "Tai nghe",
    status: "ACTIVE"
  },
  {
    id: 6,
    name: "Apple Watch Series 9 45mm GPS",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
    currentPrice: 9990000,
    buyNowPrice: 11000000,
    totalBids: 23,
    endTime: "2024-12-27 10:00",
    category: "Đồng hồ thông minh",
    status: "ACTIVE"
  },
  {
    id: 7,
    name: "Sony WH-1000XM5 Wireless Headphones",
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400",
    currentPrice: 7200000,
    buyNowPrice: 8500000,
    totalBids: 34,
    endTime: "2024-12-26 12:00",
    category: "Tai nghe",
    status: "ACTIVE"
  },
  {
    id: 8,
    name: "Canon EOS R6 Mark II Body",
    image: "https://images.unsplash.com/photo-1606980259767-c6d6d6f42c94?w=400",
    currentPrice: 48000000,
    buyNowPrice: 55000000,
    totalBids: 12,
    endTime: "2024-12-29 20:00",
    category: "Máy ảnh",
    status: "ACTIVE"
  },
  {
    id: 9,
    name: "Dell XPS 15 9530 i7 32GB 1TB RTX 4060",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
    currentPrice: 42000000,
    buyNowPrice: 48000000,
    totalBids: 18,
    endTime: "2024-12-28 15:00",
    category: "Laptop",
    status: "ACTIVE"
  },
  {
    id: 10,
    name: "Nintendo Switch OLED White",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400",
    currentPrice: 8500000,
    buyNowPrice: 9500000,
    totalBids: 56,
    endTime: "2024-12-25 18:00",
    category: "Gaming",
    status: "ACTIVE"
  },
  {
    id: 11,
    name: "PlayStation 5 Slim Digital Edition",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
    currentPrice: 12500000,
    buyNowPrice: 14000000,
    totalBids: 89,
    endTime: "2024-12-27 16:00",
    category: "Gaming",
    status: "ACTIVE"
  },
  {
    id: 12,
    name: "Samsung Galaxy Tab S9+ 12.4 inch 256GB",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
    currentPrice: 18990000,
    buyNowPrice: 22000000,
    totalBids: 27,
    endTime: "2024-12-26 20:00",
    category: "Máy tính bảng",
    status: "ACTIVE"
  },
  {
    id: 13,
    name: "Xiaomi 14 Ultra 16GB 512GB",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
    currentPrice: 22500000,
    buyNowPrice: 25000000,
    totalBids: 43,
    endTime: "2024-12-27 14:00",
    category: "Điện thoại",
    status: "ACTIVE"
  },
  {
    id: 14,
    name: "Asus ROG Zephyrus G14 2024 RTX 4060",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
    currentPrice: 38000000,
    buyNowPrice: 42000000,
    totalBids: 15,
    endTime: "2024-12-28 22:00",
    category: "Laptop",
    status: "ACTIVE"
  },
  {
    id: 15,
    name: "GoPro Hero 12 Black",
    image: "https://images.unsplash.com/photo-1548356031-f5d7f8d2f422?w=400",
    currentPrice: 9800000,
    buyNowPrice: 11500000,
    totalBids: 31,
    endTime: "2024-12-26 16:00",
    category: "Máy ảnh",
    status: "ACTIVE"
  },
  {
    id: 16,
    name: "Bose QuietComfort 45 Headphones",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    currentPrice: 6500000,
    buyNowPrice: 7500000,
    totalBids: 48,
    endTime: "2024-12-25 20:00",
    category: "Tai nghe",
    status: "ACTIVE"
  },
  {
    id: 17,
    name: "Samsung Galaxy Watch 6 Classic 47mm",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    currentPrice: 7990000,
    buyNowPrice: 9000000,
    totalBids: 22,
    endTime: "2024-12-27 12:00",
    category: "Đồng hồ thông minh",
    status: "ACTIVE"
  },
  {
    id: 18,
    name: "Microsoft Surface Pro 9 i7 16GB 512GB",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400",
    currentPrice: 32000000,
    buyNowPrice: 36000000,
    totalBids: 19,
    endTime: "2024-12-28 18:00",
    category: "Máy tính bảng",
    status: "ACTIVE"
  },
  {
    id: 19,
    name: "DJI Mini 4 Pro Fly More Combo",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400",
    currentPrice: 24000000,
    buyNowPrice: 28000000,
    totalBids: 14,
    endTime: "2024-12-29 16:00",
    category: "Máy ảnh",
    status: "ACTIVE"
  },
  {
    id: 20,
    name: "Logitech G Pro X Superlight 2",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    currentPrice: 3200000,
    buyNowPrice: 3800000,
    totalBids: 76,
    endTime: "2024-12-25 22:00",
    category: "Gaming",
    status: "ACTIVE"
  }
];

const CATEGORIES = [
  "Tất cả danh mục",
  "Điện thoại",
  "Laptop",
  "Máy tính bảng",
  "Tai nghe",
  "Đồng hồ thông minh",
  "Máy ảnh",
  "Gaming"
];

const AllAuctionsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Tất cả danh mục");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);

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

  // Filter and sort products
  let filteredProducts = MOCK_PRODUCTS.filter(product => {
    if (selectedCategory !== "Tất cả danh mục" && product.category !== selectedCategory) return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (priceRange.min && product.currentPrice < Number(priceRange.min)) return false;
    if (priceRange.max && product.currentPrice > Number(priceRange.max)) return false;
    return true;
  });

  // Sort
  filteredProducts.sort((a, b) => {
    switch(sortBy) {
      case 'price-asc': return a.currentPrice - b.currentPrice;
      case 'price-desc': return b.currentPrice - a.currentPrice;
      case 'ending-soon': return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
      case 'most-bids': return b.totalBids - a.totalBids;
      default: return b.id - a.id; // newest
    }
  });

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
            <p className="text-gray-600">Khám phá {MOCK_PRODUCTS.length} sản phẩm đang được đấu giá</p>
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
                  <option value="most-bids">Nhiều lượt đấu</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    showFilters ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  <span className="hidden md:inline">Bộ lọc</span>
                </button>

                {/* View Mode Toggle */}
                <div className="hidden lg:flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Sidebar Filters */}
            {showFilters && (
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-purple-600" />
                    Bộ Lọc
                  </h3>

                  {/* Categories */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Danh mục</h4>
                    <div className="space-y-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            selectedCategory === cat
                              ? 'bg-purple-100 text-purple-700 font-semibold'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Khoảng giá</h4>
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="Từ (VNĐ)"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Đến (VNĐ)"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Reset */}
                  <button
                    onClick={() => {
                      setSelectedCategory("Tất cả danh mục");
                      setPriceRange({ min: '', max: '' });
                      setSearchQuery('');
                    }}
                    className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
                  >
                    🔄 Đặt lại bộ lọc
                  </button>
                </div>
              </aside>
            )}

            {/* Products Grid/List */}
            <main className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">
                  Hiển thị <span className="font-bold text-purple-600">{filteredProducts.length}</span> sản phẩm
                </p>
              </div>

              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group"
                      onClick={() => navigate(`/auction/${product.id}`)}
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {getTimeRemaining(product.endTime)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {product.name}
                        </h3>

                        <div className="mb-3">
                          <p className="text-xs text-gray-500">Giá hiện tại</p>
                          <p className="text-xl font-bold text-purple-600">{formatCurrency(product.currentPrice)}</p>
                        </div>

                        {product.buyNowPrice && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
                            <p className="text-xs text-green-700">💚 Mua ngay: <span className="font-bold">{formatCurrency(product.buyNowPrice)}</span></p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/auction/${product.id}`);
                            }}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                          >
                            Đặt giá
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex gap-4 p-4"
                      onClick={() => navigate(`/auction/${product.id}`)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{product.name}</h3>
                        <div className="flex items-center gap-6 mb-2">
                          <div>
                            <p className="text-xs text-gray-500">Giá hiện tại</p>
                            <p className="text-xl font-bold text-purple-600">{formatCurrency(product.currentPrice)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Thời gian còn lại</p>
                            <p className="text-lg font-bold text-orange-600">{getTimeRemaining(product.endTime)}</p>
                          </div>
                        </div>
                      </div>
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all self-center">
                        Đặt giá
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AllAuctionsPage;
