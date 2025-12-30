import { ArrowLeft, Calendar, DollarSign, Package, Loader2, CheckCircle, Search } from 'lucide-react';
import PageLayout from './page-layout';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auctionService } from '@/services/auctionService';
import { productService } from '@/services/productService';
import { toast } from 'sonner';
import type { CreateAuctionSessionRequest } from '@/types/auction';
import type { CreateProductResponse, Product } from '@/types/product';

const CreateAuction = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState<CreateProductResponse | null>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form data for auction session
  const [auctionData, setAuctionData] = useState({
    startTime: '',
    endTime: '',
    reservePrice: '',
    buyNowPrice: '',
  });

  // Check if product is passed from create-product page
  useEffect(() => {
    if (location.state?.product) {
      setProduct(location.state.product);
      setShowProductSelector(false);
    } else {
      // Show product selector if no product is provided
      setShowProductSelector(true);
      fetchMyProducts();
    }
  }, [location.state]);

  // Fetch user's products
  const fetchMyProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await productService.getMyProducts();
      setMyProducts(response.data);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Handle product selection
  const handleSelectProduct = (selectedProduct: Product) => {
    setProduct(selectedProduct as CreateProductResponse);
    setShowProductSelector(false);
  };

  // Filter products by search query
  const filteredProducts = myProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle auction session submit
  const handleAuctionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) {
      toast.error('Không tìm thấy thông tin sản phẩm');
      return;
    }

    // Validation
    if (!auctionData.startTime) {
      toast.error('Vui lòng chọn thời gian bắt đầu');
      return;
    }

    if (!auctionData.endTime) {
      toast.error('Vui lòng chọn thời gian kết thúc');
      return;
    }

    const startTime = new Date(auctionData.startTime);
    const endTime = new Date(auctionData.endTime);
    const now = new Date();

    if (startTime <= now) {
      toast.error('Thời gian bắt đầu phải trong tương lai');
      return;
    }

    if (endTime <= startTime) {
      toast.error('Thời gian kết thúc phải sau thời gian bắt đầu');
      return;
    }

    const daysDiff = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    if (daysDiff < 10) {
      toast.error('Phiên đấu giá phải kéo dài ít nhất 10 phút');
      return;
    }

    if (!auctionData.buyNowPrice || Number(auctionData.buyNowPrice) <= 0) {
      toast.error('Giá mua ngay phải lớn hơn 0');
      return;
    }

    if (Number(auctionData.buyNowPrice) <= product.startPrice) {
      toast.error('Giá mua ngay phải lớn hơn giá khởi điểm');
      return;
    }

    // Validate reserve price if provided (> 0)
    if (auctionData.reservePrice && Number(auctionData.reservePrice) > 0) {
      if (Number(auctionData.reservePrice) <= product.startPrice) {
        toast.error('Giá sàn phải lớn hơn giá khởi điểm');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const auctionRequest: CreateAuctionSessionRequest = {
        productId: product.id,
        startTime: auctionData.startTime,
        endTime: auctionData.endTime,
        reservePrice: auctionData.reservePrice && Number(auctionData.reservePrice) > 0
          ? Number(auctionData.reservePrice)
          : 0,
        buyNowPrice: Number(auctionData.buyNowPrice),
      };

      const response = await auctionService.createAuctionSession(auctionRequest);

      // If has paymentUrl, redirect to VNPay
      if (response.data.paymentUrl) {
        toast.success('Chuyển đến trang thanh toán...');
        window.location.href = response.data.paymentUrl;
      } else {
        // No payment needed
        toast.success('Tạo phiên đấu giá thành công!');
        navigate('/seller/dashboard');
      }
    } catch (error: any) {
      console.error('Error creating auction session:', error);
      toast.error(error.response?.data?.message || 'Tạo phiên đấu giá thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format number to VND
  const formatNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAuctionPriceChange = (field: 'reservePrice' | 'buyNowPrice', value: string) => {
    const numValue = value.replace(/\D/g, '');
    setAuctionData({ ...auctionData, [field]: numValue });
  };

  // Product Selector UI
  if (showProductSelector) {
    return (
      <PageLayout>
        <div className="bg-gray-50 min-h-screen py-6">
          <div className="max-w-5xl mx-auto px-4">
            {/* Header */}
            <button
              onClick={() => navigate(-1)}
              className="mb-6 flex items-center gap-3 bg-white hover:bg-yellow-50 text-gray-800 font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              <ArrowLeft size={20} className="text-yellow-600" />
              <span>Quay lại</span>
            </button>

            {/* Product Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Chọn sản phẩm đấu giá</h1>
                  <p className="text-sm text-gray-600">Chọn sản phẩm bạn muốn tạo phiên đấu giá</p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Products List */}
              {isLoadingProducts ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
                  <p className="text-gray-600">Đang tải sản phẩm...</p>
                </div>
              ) : (
                <>
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        {myProducts.length === 0 ? 'Bạn chưa có sản phẩm nào' : 'Không tìm thấy sản phẩm'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {filteredProducts.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => handleSelectProduct(prod)}
                          className="flex gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition-all group"
                        >
                          {prod.images && prod.images[0] && (
                            <img
                              src={prod.images[0].url}
                              alt={prod.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 mb-1">
                              {prod.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{prod.description}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-purple-600">
                                Giá khởi điểm: {formatPrice(prod.startPrice)}
                              </p>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {prod.category.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Always show Create Product button */}
                  <div className="text-center pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => navigate('/create-product')}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    >
                      + Tạo sản phẩm mới
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Loading state
  if (isLoadingProducts) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // No product selected
  if (!product) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600 mb-4">Không tìm thấy sản phẩm</p>
            <Button onClick={() => setShowProductSelector(true)}>
              Chọn sản phẩm
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-gray-50 min-h-screen py-6">
        <div className="max-w-5xl mx-auto px-4">

          {/* Header */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-3 bg-white hover:bg-yellow-50 text-gray-800 font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
          >
            <ArrowLeft size={20} className="text-yellow-600" />
            <span>Quay lại</span>
          </button>

          {/* Create Auction Session */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Tạo phiên đấu giá</h1>
                <p className="text-sm text-gray-600">
                  Sản phẩm: <strong>{product.name}</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleAuctionSubmit} className="space-y-6">

              {/* Product Preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Thông tin sản phẩm
                </h3>
                <div className="flex gap-4">
                  {product.images && product.images[0] && (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 space-y-2 text-sm">
                    <p><strong>Tên:</strong> {product.name}</p>
                    <p><strong>Giá khởi điểm:</strong> {formatPrice(product.startPrice)}</p>
                    <p><strong>Danh mục:</strong> {product.category.name}</p>
                  </div>
                </div>
              </div>

              {/* Thời gian */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Thời gian đấu giá
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={auctionData.startTime}
                      onChange={(e) => setAuctionData({ ...auctionData, startTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Phải trong tương lai</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian kết thúc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={auctionData.endTime}
                      onChange={(e) => setAuctionData({ ...auctionData, endTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />

                  </div>
                </div>
              </div>

              {/* Giá */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Thông tin giá
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá sàn (Reserve Price) <span className="text-gray-500 font-normal">(Tùy chọn)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatNumber(auctionData.reservePrice)}
                        onChange={(e) => handleAuctionPriceChange('reservePrice', e.target.value)}
                        placeholder="Để trống nếu không cần giá sàn"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₫</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-600">
                        📌 Giá tối thiểu bạn chấp nhận bán
                      </p>
                      {auctionData.reservePrice && Number(auctionData.reservePrice) > 0 ? (
                        <p className="text-xs text-orange-600 font-semibold">
                          ⚠️ Có giá sàn → Cần thanh toán phí qua VNPay
                        </p>
                      ) : (
                        <p className="text-xs text-green-600 font-semibold">
                          ✓ Không có giá sàn → Không cần thanh toán phí
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá mua ngay (Buy Now) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatNumber(auctionData.buyNowPrice)}
                        onChange={(e) => handleAuctionPriceChange('buyNowPrice', e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₫</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Người mua có thể mua ngay với giá này</p>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowProductSelector(true)}
                >
                  ← Chọn sản phẩm khác
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white text-lg py-6 font-bold shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Đăng phiên đấu giá'}
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default CreateAuction;
