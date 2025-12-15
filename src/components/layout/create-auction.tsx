import { useState } from 'react';
import { ArrowLeft, Upload, X, Plus, Package, DollarSign, Calendar, Tag, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from './page-layout';
import { Button } from '@/components/ui/button';

const CreateAuction = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [auctionType, setAuctionType] = useState<'auction' | 'buy-now' | 'both'>('auction');

  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    description: '',
    condition: 'new',
    startingPrice: '',
    buyNowPrice: '',
    reservePrice: '',
    auctionDuration: '7',
    startTime: '',
    shippingFee: 'free',
    location: '',
  });

  // Format số tiền với dấu chấm
  const formatPrice = (value: string) => {
    // Loại bỏ tất cả dấu chấm
    const numericValue = value.replace(/\./g, '');
    // Chỉ giữ lại số
    if (!/^\d*$/.test(numericValue)) return value;
    // Thêm dấu chấm mỗi 3 chữ số
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handlePriceChange = (field: string, value: string) => {
    const formatted = formatPrice(value);
    setFormData({...formData, [field]: formatted});
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages].slice(0, 9)); // Tối đa 9 ảnh
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData, 'Images:', images, 'Type:', auctionType);
    // TODO: Gọi API tạo đấu giá
  };

  return (
    <PageLayout>
      <div className="bg-gray-50 min-h-screen py-6">
        <div className="max-w-5xl mx-auto px-4">
          
          {/* Header */}
          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-3 bg-white hover:bg-yellow-50 text-gray-800 font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
          >
            <ArrowLeft size={20} className="text-yellow-600" />
            <span>Trở về trang chủ</span>
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Đăng bán sản phẩm</h1>
                <p className="text-sm text-gray-600">Điền thông tin sản phẩm của bạn</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Loại hình bán */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Loại hình bán <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setAuctionType('auction')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      auctionType === 'auction'
                        ? 'border-orange-500 bg-orange-100 shadow-md'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">🎯 Đấu giá</div>
                    <div className="text-xs text-gray-600 mt-1">Người mua đặt giá cạnh tranh</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuctionType('buy-now')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      auctionType === 'buy-now'
                        ? 'border-green-500 bg-green-100 shadow-md'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">🛒 Mua ngay</div>
                    <div className="text-xs text-gray-600 mt-1">Giá cố định, không đấu giá</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuctionType('both')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      auctionType === 'both'
                        ? 'border-purple-500 bg-purple-100 shadow-md'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">⚡ Cả hai</div>
                    <div className="text-xs text-gray-600 mt-1">Đấu giá + Mua ngay</div>
                  </button>
                </div>
              </div>

              {/* Hình ảnh sản phẩm */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Hình ảnh sản phẩm <span className="text-red-500">*</span>
                  <span className="text-gray-500 font-normal ml-2">({images.length}/9)</span>
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group">
                      <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-orange-500 text-white text-xs text-center py-1">
                          Ảnh bìa
                        </div>
                      )}
                    </div>
                  ))}
                  {images.length < 9 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50 hover:bg-orange-50">
                      <Upload className="w-8 h-8 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-600">Thêm ảnh</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <Info className="w-3 h-3 inline mr-1" />
                  Ảnh đầu tiên sẽ là ảnh bìa. Tối đa 9 ảnh.
                </p>
              </div>

              {/* Thông tin sản phẩm */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-orange-600" />
                  Thông tin sản phẩm
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.productName}
                      onChange={(e) => setFormData({...formData, productName: e.target.value})}
                      placeholder="Ví dụ: iPhone 15 Pro Max 256GB"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      <option value="electronics">Điện tử</option>
                      <option value="fashion">Thời trang</option>
                      <option value="home">Nhà cửa & Đời sống</option>
                      <option value="sports">Thể thao</option>
                      <option value="books">Sách</option>
                      <option value="others">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả chi tiết <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Mô tả chi tiết về sản phẩm, tình trạng, xuất xứ..."
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tình trạng <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="new"
                        checked={formData.condition === 'new'}
                        onChange={(e) => setFormData({...formData, condition: e.target.value})}
                        className="w-4 h-4 text-orange-600"
                      />
                      <span>Mới</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="used"
                        checked={formData.condition === 'used'}
                        onChange={(e) => setFormData({...formData, condition: e.target.value})}
                        className="w-4 h-4 text-orange-600"
                      />
                      <span>Đã sử dụng</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Thông tin giá */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Thông tin giá
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(auctionType === 'auction' || auctionType === 'both') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giá khởi điểm <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.startingPrice}
                            onChange={(e) => handlePriceChange('startingPrice', e.target.value)}
                            placeholder="0"
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required={auctionType === 'auction' || auctionType === 'both'}
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₫</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giá dự trữ (tùy chọn)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.reservePrice}
                            onChange={(e) => handlePriceChange('reservePrice', e.target.value)}
                            placeholder="0"
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₫</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Giá tối thiểu bạn chấp nhận bán</p>
                      </div>
                    </>
                  )}

                  {(auctionType === 'buy-now' || auctionType === 'both') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá mua ngay <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.buyNowPrice}
                          onChange={(e) => handlePriceChange('buyNowPrice', e.target.value)}
                          placeholder="0"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required={auctionType === 'buy-now' || auctionType === 'both'}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₫</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Thời gian đấu giá */}
              {(auctionType === 'auction' || auctionType === 'both') && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-green-600" />
                    Thời gian đấu giá
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời điểm bắt đầu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required={auctionType === 'auction' || auctionType === 'both'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian đấu giá <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.auctionDuration}
                        onChange={(e) => setFormData({...formData, auctionDuration: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="1">1 ngày</option>
                        <option value="3">3 ngày</option>
                        <option value="7">7 ngày</option>
                        <option value="14">14 ngày</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Vận chuyển */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Vận chuyển</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phí vận chuyển
                    </label>
                    <select
                      value={formData.shippingFee}
                      onChange={(e) => setFormData({...formData, shippingFee: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="free">Miễn phí vận chuyển</option>
                      <option value="buyer">Người mua trả phí</option>
                      <option value="custom">Tự định giá</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa điểm
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Thành phố, Quận/Huyện"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <Button
                  type="button"
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg py-6 font-bold shadow-lg"
                >
                  Đăng bán ngay
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
