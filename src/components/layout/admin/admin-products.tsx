import { useState, useEffect } from "react";
import { Search, Eye, CheckCircle, XCircle, Trash2, Image as ImageIcon, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { productService } from "@/services/productService";
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
              <option value="oldest"> Cũ nhất</option>
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

                  // Debug log
                  if (product.id) {
                    console.log(`Product ${product.id} - ${product.name}:`, {
                      isActive: product.isActive,
                      isDeleted: isDeleted,
                      typeof_isActive: typeof product.isActive
                    });
                  }

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
    </div>
  );
};

export default AdminProducts;
