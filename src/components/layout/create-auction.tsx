import { ArrowLeft, Calendar, DollarSign, Package, Loader2, CheckCircle, Search, Eye, Edit, Upload, X, Plus } from 'lucide-react';
import PageLayout from './page-layout';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auctionService } from '@/services/auctionService';
import { productService } from '@/services/productService';
import { imageService, type Image } from '@/services/imageService';
import { categoryService } from '@/services/categoryService';
import type { CategoryResponse } from '@/types/category';
import { getProductStatusBadge } from '@/lib/productUtils';
import { toast } from 'sonner';
import type { CreateAuctionSessionRequest } from '@/types/auction';
import type { CreateProductResponse, Product, ProductUpdateRequest } from '@/types/product';

const CreateAuction = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState<CreateProductResponse | null>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Product Detail Modal
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Product Edit Modal
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);
  const [editImages, setEditImages] = useState<Image[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    startPrice: '',
    categoryId: '',
    attributes: [] as { key: string; value: string }[],
    newAttributeKey: '',
    newAttributeValue: '',
  });

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

  // Fetch categories for edit modal
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories(1, 100);
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch user's products
  const fetchMyProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await productService.getMyProducts();
      // Show all products (including WAITING_FOR_APPROVAL)
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
    if (selectedProduct.status !== 'ACTIVE') {
      toast.error('Chỉ có thể tạo đấu giá cho sản phẩm đã được phê duyệt');
      return;
    }
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

  // Handle view product detail
  const handleViewDetail = async (prod: Product) => {
    setSelectedProductDetail(prod);
    setShowProductDetail(true);
    setIsLoadingDetail(true);
    try {
      const response = await productService.getProductById(prod.id);
      setSelectedProductDetail(response.data);
    } catch (error: any) {
      console.error('Error fetching product detail:', error);
      toast.error('Không thể tải chi tiết sản phẩm');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Handle open edit product modal
  const handleOpenEditProduct = async (prod: Product) => {
    setProductToEdit(prod);
    setEditImages(prod.images || []);
    setImagesToRemove([]);

    // Parse attributes from JSON string to array
    let attributesArray: { key: string; value: string }[] = [];
    if (prod.attributes) {
      try {
        const parsed = JSON.parse(prod.attributes);
        attributesArray = Object.entries(parsed).map(([key, value]) => ({
          key,
          value: String(value)
        }));
      } catch (e) {
        console.error('Error parsing attributes:', e);
      }
    }

    setEditFormData({
      name: prod.name,
      description: prod.description,
      startPrice: String(prod.startPrice),
      categoryId: String(prod.category.id),
      attributes: attributesArray,
      newAttributeKey: '',
      newAttributeValue: '',
    });
    setShowEditProduct(true);
  };

  // Handle image upload for edit
  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (editImages.length + files.length > 4) {
      toast.error('Tối đa 4 ảnh');
      return;
    }

    setIsUploadingImage(true);
    try {
      const uploadPromises = Array.from(files).map((file) => imageService.uploadImage(file));
      const uploadedImages = await Promise.all(uploadPromises);
      setEditImages((prev) => [...prev, ...uploadedImages]);
      toast.success(`Đã tải lên ${uploadedImages.length} ảnh`);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error(error.response?.data?.message || 'Upload ảnh thất bại');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  // Handle remove existing image
  const handleRemoveExistingImage = (imageId: number) => {
    setImagesToRemove((prev) => [...prev, imageId]);
    setEditImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  // Handle add attribute in edit form
  const handleEditAddAttribute = () => {
    const { newAttributeKey, newAttributeValue } = editFormData;
    if (!newAttributeKey.trim() || !newAttributeValue.trim()) {
      toast.error('Vui lòng điền đầy đủ tên và giá trị thuộc tính');
      return;
    }

    setEditFormData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { key: newAttributeKey, value: newAttributeValue }],
      newAttributeKey: '',
      newAttributeValue: '',
    }));
  };

  // Handle remove attribute in edit form
  const handleEditRemoveAttribute = (index: number) => {
    setEditFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  // Handle update product
  const handleUpdateProduct = async () => {
    if (!productToEdit) return;

    // Validation
    if (!editFormData.name.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm');
      return;
    }

    if (!editFormData.categoryId) {
      toast.error('Vui lòng chọn danh mục');
      return;
    }

    if (!editFormData.startPrice || Number(editFormData.startPrice) <= 0) {
      toast.error('Giá khởi điểm phải lớn hơn 0');
      return;
    }

    setIsUpdatingProduct(true);
    try {
      // Convert attributes to JSON object format
      const attributesObject = editFormData.attributes.reduce((acc, attr) => {
        acc[attr.key] = attr.value;
        return acc;
      }, {} as Record<string, string>);

      const attributesString = editFormData.attributes.length > 0 ? JSON.stringify(attributesObject) : '';

      // Get new image IDs (images that weren't in the original product)
      const originalImageIds = productToEdit.images?.map(img => img.id) || [];
      const newImageIds = editImages
        .filter(img => !originalImageIds.includes(img.id))
        .map(img => img.id);

      const updateRequest: ProductUpdateRequest = {
        name: editFormData.name,
        description: editFormData.description,
        startPrice: Number(editFormData.startPrice),
        categoryId: Number(editFormData.categoryId),
        attributes: attributesString,
        imageIdsToAdd: newImageIds.length > 0 ? newImageIds : undefined,
        imageIdsToRemove: imagesToRemove.length > 0 ? imagesToRemove : undefined,
      };

      const response = await productService.updateProduct(productToEdit.id, updateRequest);

      toast.success('Cập nhật sản phẩm thành công!');

      // Update product in list
      setMyProducts(prev => prev.map(p => p.id === productToEdit.id ? response.data : p));

      setShowEditProduct(false);
      setProductToEdit(null);
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Cập nhật sản phẩm thất bại');
    } finally {
      setIsUpdatingProduct(false);
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
      <>
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
                        {filteredProducts.map((prod) => {
                          const isDisabled = prod.status !== 'ACTIVE';
                          const statusBadge = prod.status ? getProductStatusBadge(prod.status) : null;

                          return (
                            <div
                              key={prod.id}
                              className={`flex gap-4 p-4 border-2 rounded-xl transition-all ${isDisabled
                                ? 'border-gray-200 bg-gray-50'
                                : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50'
                                }`}
                            >
                              {prod.images && prod.images[0] && (
                                <img
                                  src={prod.images[0].url}
                                  alt={prod.name}
                                  className="w-24 h-24 object-cover rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <h3 className={`font-semibold ${isDisabled ? 'text-gray-500' : 'text-gray-800'}`}>
                                    {prod.name}
                                  </h3>
                                  {statusBadge && (
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${statusBadge.bgColor
                                      } ${statusBadge.textColor} ${statusBadge.borderColor} whitespace-nowrap ml-2`}>
                                      {statusBadge.icon} {statusBadge.label}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{prod.description}</p>
                                <div className="flex items-center justify-between mb-3">
                                  <p className={`text-sm font-medium ${isDisabled ? 'text-gray-500' : 'text-purple-600'}`}>
                                    Giá khởi điểm: {formatPrice(prod.startPrice)}
                                  </p>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {prod.category.name}
                                  </span>
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDetail(prod);
                                    }}
                                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Chi tiết
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenEditProduct(prod);
                                    }}
                                    className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Chỉnh sửa
                                  </button>
                                  {!isDisabled && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectProduct(prod);
                                      }}
                                      className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      Chọn
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
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

        {/* Product Detail Modal */}
        {showProductDetail && selectedProductDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white rounded-2xl max-w-3xl w-full p-6 my-8 animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Eye className="text-blue-600" size={28} />
                  Chi tiết sản phẩm
                </h2>
                <button
                  onClick={() => setShowProductDetail(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {isLoadingDetail ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600">Đang tải...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Images */}
                  {selectedProductDetail.images && selectedProductDetail.images.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Hình ảnh</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {selectedProductDetail.images.map((img) => (
                          <img
                            key={img.id}
                            src={img.url}
                            alt={selectedProductDetail.name}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Basic Info */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Tên sản phẩm</p>
                      <p className="text-lg font-semibold text-gray-800">{selectedProductDetail.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mô tả</p>
                      <p className="text-gray-800">{selectedProductDetail.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Giá khởi điểm</p>
                        <p className="text-lg font-bold text-purple-600">{formatPrice(selectedProductDetail.startPrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Danh mục</p>
                        <p className="text-gray-800">{selectedProductDetail.category.name}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Trạng thái</p>
                      {(() => {
                        const badge = getProductStatusBadge(selectedProductDetail.status);
                        return badge ? (
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${badge.bgColor} ${badge.textColor} ${badge.borderColor}`}>
                            {badge.icon} {badge.label}
                          </span>
                        ) : null;
                      })()}
                    </div>
                  </div>

                  {/* Attributes */}
                  {selectedProductDetail.attributes && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Thuộc tính</h3>
                      <div className="bg-blue-50 rounded-lg p-4">
                        {(() => {
                          try {
                            const attrs = JSON.parse(selectedProductDetail.attributes);
                            return (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {Object.entries(attrs).map(([key, value]) => (
                                  <div key={key} className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">{key}:</span>
                                    <span className="text-sm text-gray-600">{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            );
                          } catch (e) {
                            return <p className="text-sm text-gray-600">Không có thuộc tính</p>;
                          }
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Close Button */}
                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={() => setShowProductDetail(false)}
                      variant="outline"
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditProduct && productToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 my-8 animate-in fade-in-0 zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Edit className="text-orange-600" size={28} />
                  Chỉnh sửa sản phẩm
                </h2>
                <button
                  onClick={() => setShowEditProduct(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Hình ảnh sản phẩm (Tối đa 4 ảnh) <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    {editImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt="Product"
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(image.id)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {editImages.length < 4 && (
                      <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
                        {isUploadingImage ? (
                          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600">Tải ảnh lên</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleEditImageUpload}
                          className="hidden"
                          disabled={isUploadingImage}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Mô tả chi tiết sản phẩm"
                  />
                </div>

                {/* Start Price and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá khởi điểm <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatNumber(editFormData.startPrice)}
                        onChange={(e) => setEditFormData({ ...editFormData, startPrice: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₫</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editFormData.categoryId}
                      onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Attributes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Thuộc tính sản phẩm
                  </label>
                  {editFormData.attributes.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {editFormData.attributes.map((attr, index) => (
                        <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg">
                          <div className="flex-1 flex gap-2">
                            <span className="font-medium text-gray-700">{attr.key}:</span>
                            <span className="text-gray-600">{attr.value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleEditRemoveAttribute(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editFormData.newAttributeKey}
                      onChange={(e) => setEditFormData({ ...editFormData, newAttributeKey: e.target.value })}
                      placeholder="Tên thuộc tính"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={editFormData.newAttributeValue}
                      onChange={(e) => setEditFormData({ ...editFormData, newAttributeValue: e.target.value })}
                      placeholder="Giá trị"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleEditAddAttribute}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Plus size={18} />
                      Thêm
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => setShowEditProduct(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={isUpdatingProduct}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleUpdateProduct}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    disabled={isUpdatingProduct}
                  >
                    {isUpdatingProduct ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Đang cập nhật...
                      </>
                    ) : (
                      'Cập nhật sản phẩm'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
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

      {/* Product Detail Modal */}
      {showProductDetail && selectedProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 my-8 animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Eye className="text-blue-600" size={28} />
                Chi tiết sản phẩm
              </h2>
              <button
                onClick={() => setShowProductDetail(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {isLoadingDetail ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Đang tải...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Images */}
                {selectedProductDetail.images && selectedProductDetail.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Hình ảnh</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {selectedProductDetail.images.map((img) => (
                        <img
                          key={img.id}
                          src={img.url}
                          alt={selectedProductDetail.name}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Basic Info */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Tên sản phẩm</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedProductDetail.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mô tả</p>
                    <p className="text-gray-800">{selectedProductDetail.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Giá khởi điểm</p>
                      <p className="text-lg font-bold text-purple-600">{formatPrice(selectedProductDetail.startPrice)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Danh mục</p>
                      <p className="text-gray-800">{selectedProductDetail.category.name}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái</p>
                    {(() => {
                      const badge = getProductStatusBadge(selectedProductDetail.status);
                      return badge ? (
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${badge.bgColor} ${badge.textColor} ${badge.borderColor}`}>
                          {badge.icon} {badge.label}
                        </span>
                      ) : null;
                    })()}
                  </div>
                </div>

                {/* Attributes */}
                {selectedProductDetail.attributes && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Thuộc tính</h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                      {(() => {
                        try {
                          const attrs = JSON.parse(selectedProductDetail.attributes);
                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {Object.entries(attrs).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-700">{key}:</span>
                                  <span className="text-sm text-gray-600">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          );
                        } catch (e) {
                          return <p className="text-sm text-gray-600">Không có thuộc tính</p>;
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    onClick={() => setShowProductDetail(false)}
                    variant="outline"
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProduct && productToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 my-8 animate-in fade-in-0 zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Edit className="text-orange-600" size={28} />
                Chỉnh sửa sản phẩm
              </h2>
              <button
                onClick={() => setShowEditProduct(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Hình ảnh sản phẩm (Tối đa 4 ảnh) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  {editImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt="Product"
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(image.id)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {editImages.length < 4 && (
                    <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
                      {isUploadingImage ? (
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Tải ảnh lên</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleEditImageUpload}
                        className="hidden"
                        disabled={isUploadingImage}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Mô tả chi tiết sản phẩm"
                />
              </div>

              {/* Start Price and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá khởi điểm <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formatNumber(editFormData.startPrice)}
                      onChange={(e) => setEditFormData({ ...editFormData, startPrice: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₫</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editFormData.categoryId}
                    onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Attributes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Thuộc tính sản phẩm
                </label>
                {editFormData.attributes.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {editFormData.attributes.map((attr, index) => (
                      <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1 flex gap-2">
                          <span className="font-medium text-gray-700">{attr.key}:</span>
                          <span className="text-gray-600">{attr.value}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleEditRemoveAttribute(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editFormData.newAttributeKey}
                    onChange={(e) => setEditFormData({ ...editFormData, newAttributeKey: e.target.value })}
                    placeholder="Tên thuộc tính"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={editFormData.newAttributeValue}
                    onChange={(e) => setEditFormData({ ...editFormData, newAttributeValue: e.target.value })}
                    placeholder="Giá trị"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleEditAddAttribute}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    <Plus size={18} />
                    Thêm
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => setShowEditProduct(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={isUpdatingProduct}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleUpdateProduct}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  disabled={isUpdatingProduct}
                >
                  {isUpdatingProduct ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Đang cập nhật...
                    </>
                  ) : (
                    'Cập nhật sản phẩm'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default CreateAuction;
