import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Heart, Share2, ShoppingCart, Minus, Plus, Store, Shield, Truck, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from './page-layout';
import { Button } from '@/components/ui/button';
import { getProductById, getAllProducts } from '@/lib/productUtils';
import ProductCard from '@/components/ui/product-card';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [recommendedIndex, setRecommendedIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  const handleNextProducts = () => {
    const allProducts = getAllProducts().filter(p => p.id !== productId);
    if (recommendedIndex + 6 < allProducts.length) {
      setSlideDirection('left');
      setTimeout(() => {
        setRecommendedIndex(recommendedIndex + 6);
        setSlideDirection(null);
      }, 50);
    }
  };

  const handlePrevProducts = () => {
    if (recommendedIndex > 0) {
      setSlideDirection('right');
      setTimeout(() => {
        setRecommendedIndex(Math.max(0, recommendedIndex - 6));
        setSlideDirection(null);
      }, 50);
    }
  };

  // Lấy dữ liệu sản phẩm thực từ db.json
  const productData = getProductById(productId || '');
  
  if (!productData) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy sản phẩm</h2>
            <Button onClick={() => navigate('/')}>Quay về trang chủ</Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Product images array - giống auction-detail
  const productImages = [
    { id: 1, color: 'Gray', bgGradient: 'from-gray-300 to-gray-600', cameraColor: 'bg-gray-800', homeColor: 'bg-gray-400' },
    { id: 2, color: 'Yellow', bgGradient: 'from-yellow-400 to-yellow-600', cameraColor: 'bg-yellow-900', homeColor: 'bg-yellow-300', featured: true },
    { id: 3, color: 'Black', bgGradient: 'from-gray-800 to-black', cameraColor: 'bg-gray-900', homeColor: 'bg-gray-600', border: 'border-gray-700' },
    { id: 4, color: 'Blue', bgGradient: 'from-blue-400 to-blue-600', cameraColor: 'bg-blue-900', homeColor: 'bg-blue-300' },
    { id: 5, color: 'Red', bgGradient: 'from-red-400 to-red-600', cameraColor: 'bg-red-900', homeColor: 'bg-red-300' }
  ];

  // Mock data - sử dụng data thực từ productData
  const product = {
    id: productId,
    name: productData.name || 'iPhone 15 Pro Max 256GB | Chính hãng VN/A',
    price: parseInt(productData.currentPrice?.replace(/[^\d]/g, '') || '28990000'),
    originalPrice: parseInt(productData.currentPrice?.replace(/[^\d]/g, '') || '28990000') * 1.14, // Giả lập giá gốc cao hơn 14%
    discount: 12,
    rating: 4.8,
    sold: Math.floor(Math.random() * 500) + 50, // Random số lượng đã bán
    stock: 50,
    images: productImages,
    description: `
      <h3>Thông tin sản phẩm</h3>
      <p>iPhone 15 Pro Max - Chiếc điện thoại cao cấp nhất của Apple với nhiều tính năng vượt trội.</p>
      <ul>
        <li>Chip A17 Pro mạnh mẽ nhất</li>
        <li>Camera 48MP với zoom quang học 5x</li>
        <li>Màn hình Super Retina XDR 6.7 inch</li>
        <li>Pin lên đến 29 giờ phát video</li>
        <li>Khung viền titan cao cấp</li>
      </ul>
    `,
    specifications: {
      'Màn hình': '6.7 inch, Super Retina XDR, 2796 x 1290 pixels',
      'Camera sau': '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
      'Camera trước': '12MP TrueDepth',
      'Chip': 'Apple A17 Pro',
      'RAM': '8GB',
      'Bộ nhớ': '256GB',
      'Pin': '4422 mAh, sạc nhanh 27W',
      'Hệ điều hành': 'iOS 17',
    },
    colors: ['Titan Tự nhiên', 'Titan Xanh', 'Titan Trắng', 'Titan Đen'],
    seller: {
      name: 'Apple Store Official',
      rating: 4.9,
      followers: 15420,
      joinDate: '3 năm trước',
    }
  };

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase' && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <PageLayout>
      <div className="bg-gray-50 min-h-screen py-6">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="mb-4 flex items-center gap-3 bg-white hover:bg-yellow-50 text-gray-800 font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
          >
            <ArrowLeft size={20} className="text-yellow-600" />
            <span>Trở về trang chủ</span>
          </button>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left - Images */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6">
                {/* Main Image */}
                <div className="aspect-square bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-12 relative overflow-hidden">
                  {/* Phone mockup giống auction-detail */}
                  <div className={`relative w-64 h-[500px] bg-gradient-to-br ${product.images[selectedImage].bgGradient} rounded-[3rem] shadow-2xl ${product.images[selectedImage].border || ''} transition-all duration-500`}>
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl"></div>
                    
                    {/* Screen */}
                    <div className="absolute inset-3 bg-black rounded-[2.5rem] overflow-hidden">
                      {/* Status bar */}
                      <div className="h-12 bg-gradient-to-b from-gray-900 to-transparent"></div>
                      
                      {/* Camera app UI */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-20 h-20 ${product.images[selectedImage].cameraColor} rounded-full flex items-center justify-center`}>
                          <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Home indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                        <div className={`w-32 h-1 ${product.images[selectedImage].homeColor} rounded-full`}></div>
                      </div>
                    </div>
                    
                    {/* Buttons */}
                    <div className="absolute right-0 top-24 w-1 h-16 bg-black/20 rounded-l"></div>
                    <div className="absolute left-0 top-32 w-1 h-12 bg-black/20 rounded-r"></div>
                  </div>

                  {/* Navigation Buttons */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all backdrop-blur-sm"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>

                  {/* Product Title & Color Overlay */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center w-full px-8">
                    <h3 className="text-white text-xl sm:text-2xl font-bold mb-1 line-clamp-2">
                      {product.name.split('|')[0].trim()}
                    </h3>
                    <p className="text-yellow-400 font-semibold text-sm sm:text-base">{product.images[selectedImage].color}</p>
                  </div>

                  {/* Indicator Dots */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          selectedImage === index 
                            ? 'bg-yellow-400 w-8' 
                            : 'bg-gray-500 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Image Counter */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-white text-sm font-medium">
                      {selectedImage + 1} / {product.images.length}
                    </span>
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="p-4 grid grid-cols-5 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-orange-500 ring-2 ring-orange-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-full bg-gradient-to-br ${image.bgGradient} flex items-center justify-center`}>
                        <span className="text-xs font-semibold text-white">{image.color}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="p-4 border-t flex gap-3">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
                      isFavorite 
                        ? 'bg-red-50 border-red-300 text-red-600' 
                        : 'bg-white border-gray-300 text-gray-600 hover:border-red-300'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-600' : ''}`} />
                    <span className="font-medium">Yêu thích</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 text-gray-600 hover:border-blue-300 transition-all bg-white">
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">Chia sẻ</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Product Name & Rating */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between mb-3">
                  <h1 className="text-2xl font-bold text-gray-800 flex-1 pr-4">
                    {product.name}
                  </h1>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discount}%
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-orange-500 font-semibold">{product.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <span className="text-gray-600">
                    <span className="font-semibold text-gray-800">{product.sold}</span> Đã bán
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-md p-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-red-600">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {product.originalPrice.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Thông tin vận chuyển</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Truck className="w-5 h-5 text-green-600" />
                    <span>Miễn phí vận chuyển toàn quốc</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span>Giao hàng trong 2-3 ngày</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span>Bảo hành chính hãng 12 tháng</span>
                  </div>
                </div>
              </div>

              {/* Color Selection */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-3">Màu sắc</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        index === 0 
                          ? 'border-orange-500 bg-orange-50 text-orange-700' 
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Số lượng</h3>
                  <span className="text-sm text-gray-500">{product.stock} sản phẩm có sẵn</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity === 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-16 text-center font-semibold focus:outline-none"
                    />
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity === product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-gray-600">
                    Tổng: <span className="text-xl font-bold text-red-600">
                      {(product.price * quantity).toLocaleString('vi-VN')}₫
                    </span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex gap-4">
                  <Button className="flex-1 bg-gradient-to-r from-orange-100 to-red-100 hover:from-orange-200 hover:to-red-200 text-orange-600 border-2 border-orange-500 text-lg py-6 font-bold">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Thêm vào giỏ hàng
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg py-6 font-bold shadow-lg hover:shadow-xl">
                    Mua ngay
                  </Button>
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <Store className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{product.seller.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                        <span>{product.seller.rating}/5</span>
                        <span>•</span>
                        <span>{product.seller.followers.toLocaleString()} Người theo dõi</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                    Xem shop
                  </Button>
                </div>
              </div>

            </div>
          </div>

          {/* Product Description & Specs */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Description */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 lg:p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-lg">📝</span>
                Mô tả sản phẩm
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p className="text-base">
                  <span className="font-bold text-yellow-600">iPhone 15 Pro Max</span> được thiết kế từ trong ra ngoài để trở thành phiên bản iPhone mạnh mẽ nhất từ trước đến nay.
                </p>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-l-4 border-yellow-400">
                  <p className="text-sm">
                    🔥 <strong>Đặc biệt:</strong> Cốt lõi của thiết kế mới là khung viền titan nguyên khối cao cấp, tăng tối đa độ bền bỉ, hiệu năng và dung lượng pin.
                  </p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Chip A17 Pro với hiệu năng vượt trội
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Camera 48MP với zoom quang học 5x
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Pin 4422mAh sạc nhanh 27W
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Màn hình Super Retina XDR 6.7 inch
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Hệ điều hành iOS 17 mới nhất
                  </li>
                </ul>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-2xl">📱</span>
                Thông số kỹ thuật
              </h2>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium mb-1">{key}</div>
                    <div className="text-sm text-gray-900 font-semibold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sản phẩm đề xuất */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                Sản phẩm đề xuất
              </h2>
            </div>
            <div className="relative">
              {/* Nút lùi - bên trái */}
              <button
                onClick={handlePrevProducts}
                disabled={recommendedIndex === 0}
                className="absolute left-0 z-10 p-3 rounded-full bg-white border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 disabled:opacity-0 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-110"
                style={{ top: '40%', transform: 'translate(-16px, -50%)' }}
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>

              {/* Grid sản phẩm với hiệu ứng */}
              <div className="overflow-hidden">
                <div 
                  className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 transition-all duration-700 ease-in-out ${
                    slideDirection === 'left' ? '-translate-x-12 opacity-50' : 
                    slideDirection === 'right' ? 'translate-x-12 opacity-50' : 
                    'translate-x-0 opacity-100'
                  }`}
                >
                  {getAllProducts()
                    .filter(p => p.id !== productId)
                    .slice(recommendedIndex, recommendedIndex + 6)
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name.split('|')[0].trim()}
                        currentPrice={product.currentPrice}
                        image={product.image}
                        status={product.status}
                      />
                    ))}
                </div>
              </div>

              {/* Nút tới - bên phải */}
              <button
                onClick={handleNextProducts}
                disabled={recommendedIndex + 6 >= getAllProducts().filter(p => p.id !== productId).length}
                className="absolute right-0 z-10 p-3 rounded-full bg-white border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 disabled:opacity-0 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-110"
                style={{ top: '40%', transform: 'translate(16px, -50%)' }}
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};

export default ProductDetail;
