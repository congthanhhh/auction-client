import { useState, useEffect } from "react";
import { Search, Eye, CheckCircle, XCircle, Trash2, Image as ImageIcon, RefreshCw, Edit, Upload, X, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { productService } from "@/services/productService";
import { imageService, type Image } from "@/services/imageService";
import { categoryService } from "@/services/categoryService";
import type { ProductResponse, ProductSearchRequest, ProductStatus } from "@/types/product";
import type { CategoryResponse } from "@/types/category";
import Pagination from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<ProductStatus | undefined>(undefined);
  const [filterCategory, setFilterCategory] = useState<number | undefined>(undefined);
  const [filterIsActive, setFilterIsActive] = useState<boolean | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<string>("createdAt,desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  // Image preview modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);

  // Edit Product Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductResponse | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editImages, setEditImages] = useState<Image[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    startPrice: '',
    categoryId: '',
    attributes: [] as { key: string; value: string }[],
    newAttributeKey: '',
    newAttributeValue: '',
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories(1, 100);
        setCategories(response.data.data);
      } catch (error) {
        console.error("Không thể tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const request: ProductSearchRequest = {
        keyword: searchQuery || undefined,
        categoryId: filterCategory,
        status: filterStatus,
        isActive: filterIsActive,
        sort: sortOrder,
      };

      const response = await productService.searchProductsAdmin(request, currentPage, pageSize);
      setProducts(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize, filterStatus, filterCategory, filterIsActive, sortOrder]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const handleVerifyProduct = async (productId: number, isApproved: boolean, productName: string) => {
    try {
      await productService.verifyProduct(productId, isApproved);
      toast.success(isApproved ? `Đã duyệt sản phẩm "${productName}"` : `Đã từ chối sản phẩm "${productName}"`);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể duyệt sản phẩm");
    }
  };

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}"?`)) {
      try {
        await productService.deleteProduct(productId);
        toast.success(`Đã xóa sản phẩm "${productName}"`);
        fetchProducts();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Không thể xóa sản phẩm");
      }
    }
  };

  const handleRestoreProduct = async (productId: number, productName: string) => {
    if (window.confirm(`Bạn có chắc muốn khôi phục sản phẩm "${productName}"?`)) {
      try {
        await productService.restoreProduct(productId);
        toast.success(`Đã khôi phục sản phẩm "${productName}"`);
        fetchProducts();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Không thể khôi phục sản phẩm");
      }
    }
  };

  const getStatusBadge = (status: ProductStatus) => {
    const badges = {
      WAITING_FOR_APPROVAL: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ duyệt" },
      ACTIVE: { bg: "bg-green-100", text: "text-green-800", label: "Đang hoạt động" },
      REJECTED: { bg: "bg-red-100", text: "text-red-800", label: "Từ chối" },
      BANNED: { bg: "bg-gray-100", text: "text-gray-800", label: "Bị khóa" },
    };
    const badge = badges[status];
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleViewProduct = async (productId: number) => {
    try {
      setLoading(true);
      const response = await productService.getProduct(productId);
      setSelectedProduct(response.data);
      setShowImageModal(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Handle open edit modal
  const handleOpenEditModal = async (product: ProductResponse) => {
    setProductToEdit(product);
    setEditImages(product.images ? Array.from(product.images) : []);
    setImagesToRemove([]);

    // Parse attributes from JSON string to array
    let attributesArray: { key: string; value: string }[] = [];
    if (product.attributes) {
      try {
        const parsed = JSON.parse(product.attributes);
        attributesArray = Object.entries(parsed).map(([key, value]) => ({
          key,
          value: String(value)
        }));
      } catch (e) {
        console.error('Error parsing attributes:', e);
      }
    }

    setEditFormData({
      name: product.name,
      description: product.description,
      startPrice: String(product.startPrice),
      categoryId: String(product.category.id),
      attributes: attributesArray,
      newAttributeKey: '',
      newAttributeValue: '',
    });
    setShowEditModal(true);
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

    setIsUpdating(true);
    try {
      // Convert attributes to JSON object format
      const attributesObject = editFormData.attributes.reduce((acc, attr) => {
        acc[attr.key] = attr.value;
        return acc;
      }, {} as Record<string, string>);

      const attributesString = editFormData.attributes.length > 0 ? JSON.stringify(attributesObject) : '';

      // Get new image IDs (images that weren't in the original product)
      const originalImageIds = productToEdit.images ? Array.from(productToEdit.images).map(img => img.id) : [];
      const newImageIds = editImages
        .filter(img => !originalImageIds.includes(img.id))
        .map(img => img.id);

      const updateRequest = {
        name: editFormData.name,
        description: editFormData.description,
        startPrice: Number(editFormData.startPrice),
        categoryId: Number(editFormData.categoryId),
        attributes: attributesString,
        imageIdsToAdd: newImageIds.length > 0 ? newImageIds : undefined,
        imageIdsToRemove: imagesToRemove.length > 0 ? imagesToRemove : undefined,
      };

      await productService.updateProductByAdmin(productToEdit.id, updateRequest);

      toast.success('Cập nhật sản phẩm thành công!');

      setShowEditModal(false);
      setProductToEdit(null);
      fetchProducts(); // Refresh list
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.message || 'Cập nhật sản phẩm thất bại');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <select
              value={filterStatus || "all"}
              onChange={(e) => {
                const value = e.target.value;
                setFilterStatus(value === "all" ? undefined : value as ProductStatus);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="WAITING_FOR_APPROVAL">Chờ duyệt</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="REJECTED">Từ chối</option>
              <option value="BANNED">Bị khóa</option>
            </select>

            <select
              value={filterCategory || "all"}
              onChange={(e) => {
                const value = e.target.value;
                setFilterCategory(value === "all" ? undefined : parseInt(value));
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={filterIsActive === undefined ? "all" : filterIsActive ? "active" : "inactive"}
              onChange={(e) => {
                const value = e.target.value;
                setFilterIsActive(value === "all" ? undefined : value === "active");
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="all">Tất cả</option>
              <option value="active">Kích hoạt</option>
              <option value="inactive">Đã xóa</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="price_desc">Giá cao nhất</option>
              <option value="price_asc">Giá thấp nhất</option>
            </select>

            <button
              onClick={handleSearch}
              className="px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Tổng sản phẩm</p>
            <p className="text-2xl font-bold text-gray-800">{totalElements}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Chờ duyệt</p>
            <p className="text-2xl font-bold text-yellow-600">
              {products.filter((p) => p.status === "WAITING_FOR_APPROVAL").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đang hoạt động</p>
            <p className="text-2xl font-bold text-green-600">
              {products.filter((p) => p.status === "ACTIVE").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Từ chối</p>
            <p className="text-2xl font-bold text-red-600">
              {products.filter((p) => p.status === "REJECTED").length}
            </p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Giá khởi điểm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Người bán
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const sellerName = `${product.seller.firstName} ${product.seller.lastName}`;
                  const isDeleted = product.isActive === false;

                  return (
                    <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${isDeleted ? 'bg-red-50 opacity-75' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => handleViewProduct(product.id)}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <ImageIcon size={20} className="text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-800 max-w-xs truncate">{product.name}</p>
                            <p className="text-sm text-gray-500 max-w-xs truncate">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-800">{formatPrice(product.startPrice)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-800">{sellerName}</p>
                        <p className="text-xs text-gray-500">@{product.seller.username}</p>
                        <p className="text-xs text-gray-500">{product.seller.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(product.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-800">{formatDate(product.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {(product.status === "WAITING_FOR_APPROVAL" || product.status === "REJECTED") && (
                            <button
                              onClick={() => handleVerifyProduct(product.id, true, product.name)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title={product.status === "REJECTED" ? "Duyệt lại sản phẩm" : "Duyệt sản phẩm"}
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          {(product.status === "WAITING_FOR_APPROVAL" || product.status === "ACTIVE") && (
                            <button
                              onClick={() => handleVerifyProduct(product.id, false, product.name)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title={product.status === "ACTIVE" ? "Từ chối sản phẩm đã duyệt" : "Từ chối sản phẩm"}
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleViewProduct(product.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết sản phẩm"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <Edit size={18} />
                          </button>
                          {isDeleted ? (
                            <button
                              onClick={() => handleRestoreProduct(product.id, product.name)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Khôi phục sản phẩm"
                            >
                              <RefreshCw size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Xóa sản phẩm"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && products.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Hiển thị {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalElements)} / {totalElements} sản phẩm
            </p>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={pageSize}
              totalItems={totalElements}
            />
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Images */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Hình ảnh sản phẩm:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProduct.images.map((image) => (
                      <div key={image.id} className="relative aspect-square">
                        <img
                          src={image.url}
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Info Grid */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mã sản phẩm:</p>
                  <p className="font-semibold text-gray-800">#{selectedProduct.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Trạng thái:</p>
                  {getStatusBadge(selectedProduct.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Giá khởi điểm:</p>
                  <p className="font-semibold text-gray-800">{formatPrice(selectedProduct.startPrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ngày tạo:</p>
                  <p className="font-semibold text-gray-800">{formatDate(selectedProduct.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Danh mục:</p>
                  <p className="font-semibold text-gray-800">{selectedProduct.category.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mô tả danh mục:</p>
                  <p className="text-sm text-gray-700">{selectedProduct.category.description || "N/A"}</p>
                </div>
              </div>

              {/* Seller Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 text-gray-800">Thông tin người bán:</h4>
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Tên:</p>
                    <p className="font-semibold text-gray-800">{selectedProduct.seller.firstName} {selectedProduct.seller.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Username:</p>
                    <p className="font-semibold text-gray-800">@{selectedProduct.seller.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email:</p>
                    <p className="font-semibold text-gray-800">{selectedProduct.seller.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại:</p>
                    <p className="font-semibold text-gray-800">{selectedProduct.seller.phoneNumber || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2 text-gray-800">Mô tả sản phẩm:</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedProduct.description}</p>
              </div>

              {/* Attributes */}
              {selectedProduct.attributes && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-gray-800">Thuộc tính:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedProduct.attributes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            {selectedProduct && selectedProduct.status === "WAITING_FOR_APPROVAL" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    handleVerifyProduct(selectedProduct.id, true, selectedProduct.name);
                    setShowImageModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Duyệt sản phẩm
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleVerifyProduct(selectedProduct.id, false, selectedProduct.name);
                    setShowImageModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Từ chối
                </button>
              </>
            )}
            {selectedProduct && selectedProduct.status === "ACTIVE" && (
              <button
                type="button"
                onClick={() => {
                  handleVerifyProduct(selectedProduct.id, false, selectedProduct.name);
                  setShowImageModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Từ chối sản phẩm
              </button>
            )}
            {selectedProduct && selectedProduct.status === "REJECTED" && (
              <button
                type="button"
                onClick={() => {
                  handleVerifyProduct(selectedProduct.id, true, selectedProduct.name);
                  setShowImageModal(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Duyệt lại sản phẩm
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="!max-w-[1250px] w-[98vw] max-h-[98vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Edit className="text-orange-600" size={32} />
              Chỉnh sửa sản phẩm
            </DialogTitle>
          </DialogHeader>
          {productToEdit && (
            <div className="overflow-y-auto px-6 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Images */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Hình ảnh sản phẩm (Tối đa 4 ảnh) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      {editImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url}
                            alt="Product"
                            className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(image.id)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                      {editImages.length < 4 && (
                        <label className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                          {isUploadingImage ? (
                            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
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
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-5 py-3.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>

                  {/* Start Price */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      Giá khởi điểm <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatNumber(editFormData.startPrice)}
                        onChange={(e) => setEditFormData({ ...editFormData, startPrice: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-5 py-3.5 pr-14 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="0"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-base">₫</span>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editFormData.categoryId}
                      onChange={(e) => setEditFormData({ ...editFormData, categoryId: e.target.value })}
                      className="w-full px-5 py-3.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      rows={10}
                      className="w-full px-5 py-3.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="Mô tả chi tiết sản phẩm"
                    />
                  </div>

                  {/* Attributes */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Thuộc tính sản phẩm
                    </label>
                    {editFormData.attributes.length > 0 && (
                      <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto pr-2">
                        {editFormData.attributes.map((attr, index) => (
                          <div key={index} className="flex gap-3 items-center bg-gray-50 p-4 rounded-lg">
                            <div className="flex-1 flex gap-3">
                              <span className="font-semibold text-gray-700 text-base">{attr.key}:</span>
                              <span className="text-gray-600 text-base">{attr.value}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleEditRemoveAttribute(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ))}\n                  </div>
                    )}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={editFormData.newAttributeKey}
                        onChange={(e) => setEditFormData({ ...editFormData, newAttributeKey: e.target.value })}
                        placeholder="Tên thuộc tính"
                        className="flex-1 px-5 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={editFormData.newAttributeValue}
                        onChange={(e) => setEditFormData({ ...editFormData, newAttributeValue: e.target.value })}
                        placeholder="Giá trị"
                        className="flex-1 px-5 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={handleEditAddAttribute}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-base font-medium whitespace-nowrap flex-shrink-0"
                      >
                        <Plus size={20} />
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="px-6 py-4 border-t gap-3 flex-shrink-0">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-8 py-3 text-base font-medium border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isUpdating}
            >
              Hủy
            </button>
            <button
              onClick={handleUpdateProduct}
              className="px-8 py-3 text-base font-semibold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                'Cập nhật sản phẩm'
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
