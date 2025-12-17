import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Plus, Package, DollarSign, Calendar, Tag, Info, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from './page-layout';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCreateAuctionStore } from '@/stores/useCreateAuctionStore';
import { toast } from 'sonner';

const CreateAuction = () => {
  const navigate = useNavigate();
  
  // Auth check
  const { isAuthenticated } = useAuthStore();
  
  // Zustand store cho tạo auction
  const {
    currentStep,
    createdProduct,
    categories,
    isCreatingProduct,
    isCreatingSession,
    isFetchingCategories,
    error,
    fetchCategories,
    createProduct,
    createAuctionSession,
    goToPreviousStep,
    clearError,
    reset
  } = useCreateAuctionStore();
  
  const [images, setImages] = useState<string[]>([]);
  
  // Step 1: Product form data
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    startPrice: '',
    categoryId: '',
    attributes: [] as string[],
  });

  // Step 2: Auction session form data
  const [sessionForm, setSessionForm] = useState({
    startTime: '',
    endTime: '',
    reservePrice: '',
    buyNowPrice: '',
  });

  // Attributes input
  const [attributeKey, setAttributeKey] = useState('');
  const [attributeValue, setAttributeValue] = useState('');

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để tạo phiên đấu giá');
      navigate('/');
      return;
    }
    
    // Fetch categories khi mount
    fetchCategories();
    
    // Reset store khi unmount
    return () => reset();
  }, [isAuthenticated, navigate, fetchCategories, reset]);

  // Handle error từ store
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Format số tiền với dấu chấm
  const formatPrice = (value: string) => {
    const numericValue = value.replace(/\./g, '');
    if (!/^\d*$/.test(numericValue)) return value;
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handlePriceChange = (field: 'startPrice' | 'reservePrice' | 'buyNowPrice', value: string) => {
    const formatted = formatPrice(value);
    if (field === 'startPrice') {
      setProductForm({...productForm, startPrice: formatted});
    } else {
      setSessionForm({...sessionForm, [field]: formatted});
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages].slice(0, 9));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_: string, i: number) => i !== index));
  };

  // Add attribute
  const addAttribute = () => {
    if (attributeKey.trim() && attributeValue.trim()) {
      setProductForm({
        ...productForm,
        attributes: [...productForm.attributes, attributeKey.trim(), attributeValue.trim()]
      });
      setAttributeKey('');
      setAttributeValue('');
    }
  };

  const removeAttribute = (index: number) => {
    const newAttributes = [...productForm.attributes];
    newAttributes.splice(index, 2); // Remove key-value pair
    setProductForm({...productForm, attributes: newAttributes});
  };

  // Step 1: Submit Product
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert attributes array to JSON string for database
    // Database expects JSON array: ["Màu sắc", "Đen", "Dung lượng", "256GB"]
    const attributesJson = JSON.stringify(productForm.attributes);
    
    const success = await createProduct({
      name: productForm.name,
      description: productForm.description,
      startPrice: parseInt(productForm.startPrice.replace(/\./g, '')),
      categoryId: parseInt(productForm.categoryId),
      attributes: attributesJson,
      imageIds: null
    });

    if (success) {
      toast.success('Tạo sản phẩm thành công! Tiếp tục tạo phiên đấu giá.');
    }
  };

  // Step 2: Submit Auction Session
  const handleSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await createAuctionSession({
      startTime: sessionForm.startTime,
      endTime: sessionForm.endTime,
      reservePrice: parseInt(sessionForm.reservePrice.replace(/\./g, '')),
      buyNowPrice: parseInt(sessionForm.buyNowPrice.replace(/\./g, ''))
    });

    if (success) {
      toast.success('Tạo phiên đấu giá thành công!');
      setTimeout(() => {
        navigate('/'); // Redirect về home
      }, 1500);
    }
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

          {/* Progress Steps */}
          <div className="mb-6 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep === 1 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-green-500 text-white'
                }`}>
                  {currentStep === 1 ? '1' : <CheckCircle className="w-6 h-6" />}
                </div>
                <span className={`font-semibold ${currentStep === 1 ? 'text-orange-600' : 'text-green-600'}`}>
                  Tạo sản phẩm
                </span>
              </div>

              <div className={`h-1 w-20 ${currentStep === 2 ? 'bg-orange-500' : 'bg-gray-300'}`} />

              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep === 2 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className={`font-semibold ${currentStep === 2 ? 'text-orange-600' : 'text-gray-500'}`}>
                  Tạo phiên đấu giá
                </span>
              </div>
            </div>
          </div>

          {/* Step 1: Create Product */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Bước 1: Tạo sản phẩm</h1>
                  <p className="text-sm text-gray-600">Điền thông tin về sản phẩm của bạn</p>
                </div>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-6">
                
                {/* Hình ảnh sản phẩm */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Hình ảnh sản phẩm <span className="text-red-500">*</span>
                    <span className="text-gray-500 font-normal ml-2">({images.length}/9)</span>
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {images.map((img: string, index: number) => (
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
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
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
                        value={productForm.categoryId}
                        onChange={(e) => setProductForm({...productForm, categoryId: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                        disabled={isFetchingCategories}
                      >
                        <option value="">
                          {isFetchingCategories ? 'Đang tải...' : 'Chọn danh mục'}
                        </option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả chi tiết <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      placeholder="Mô tả chi tiết về sản phẩm, tình trạng, xuất xứ..."
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá khởi điểm <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={productForm.startPrice}
                        onChange={(e) => handlePriceChange('startPrice', e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₫</span>
                    </div>
                  </div>

                  {/* Attributes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thuộc tính sản phẩm
                    </label>
                    
                    {/* Display existing attributes */}
                    {productForm.attributes.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {productForm.attributes.reduce((acc: React.ReactElement[], attr: string, i: number) => {
                          if (i % 2 === 0) {
                            acc.push(
                              <div key={i} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                                <span className="font-medium">{attr}:</span>
                                <span>{productForm.attributes[i + 1]}</span>
                                <button
                                  type="button"
                                  onClick={() => removeAttribute(i)}
                                  className="ml-auto text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          }
                          return acc;
                        }, [])}
                      </div>
                    )}

                    {/* Add new attribute */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={attributeKey}
                        onChange={(e) => setAttributeKey(e.target.value)}
                        placeholder="Tên thuộc tính (vd: Màu sắc)"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        type="text"
                        value={attributeValue}
                        onChange={(e) => setAttributeValue(e.target.value)}
                        placeholder="Giá trị (vd: Đen)"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                      <Button
                        type="button"
                        onClick={addAttribute}
                        variant="outline"
                        className="px-4"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Ví dụ: Màu sắc - Đen, Dung lượng - 256GB
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
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
                    disabled={isCreatingProduct}
                  >
                    {isCreatingProduct ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      'Tiếp tục →'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Create Auction Session */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Bước 2: Tạo phiên đấu giá</h1>
                  <p className="text-sm text-gray-600">
                    Sản phẩm: <strong>{createdProduct?.name}</strong>
                  </p>
                </div>
              </div>

              <form onSubmit={handleSessionSubmit} className="space-y-6">
                
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
                        value={sessionForm.startTime}
                        onChange={(e) => setSessionForm({...sessionForm, startTime: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Thời gian tương lai (YYYY-MM-DDTHH:mm:ss)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian kết thúc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={sessionForm.endTime}
                        onChange={(e) => setSessionForm({...sessionForm, endTime: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Sau thời gian bắt đầu ít nhất 1 ngày</p>
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
                        Giá dự sản (Reserve Price) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={sessionForm.reservePrice}
                          onChange={(e) => handlePriceChange('reservePrice', e.target.value)}
                          placeholder="0"
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₫</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Giá tối thiểu bạn chấp nhận bán</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá mua ngay (Buy Now) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={sessionForm.buyNowPrice}
                          onChange={(e) => handlePriceChange('buyNowPrice', e.target.value)}
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

                {/* Product Preview */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Thông tin sản phẩm</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Tên:</strong> {createdProduct?.name}</p>
                    <p><strong>Mô tả:</strong> {createdProduct?.description}</p>
                    <p><strong>Giá khởi điểm:</strong> {createdProduct?.startPrice.toLocaleString('vi-VN')} ₫</p>
                    <p><strong>Danh mục:</strong> {createdProduct?.category.name}</p>
                    {createdProduct?.attributes && (
                      <p><strong>Thuộc tính:</strong> {createdProduct.attributes}</p>
                    )}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    onClick={goToPreviousStep}
                    variant="outline"
                    className="flex-1"
                    disabled={isCreatingSession}
                  >
                    ← Quay lại
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white text-lg py-6 font-bold shadow-lg"
                    disabled={isCreatingSession}
                  >
                    {isCreatingSession ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Đang tạo phiên...
                      </>
                    ) : (
                      'Đăng phiên đấu giá'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </PageLayout>
  );
};

export default CreateAuction;
