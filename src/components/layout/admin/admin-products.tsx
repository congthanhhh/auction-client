import { useState } from "react";
import { Search, Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  category: string;
  condition: string;
  startPrice: string;
  currentPrice: string;
  status: "pending" | "approved" | "rejected" | "selling";
  seller: string;
  createdDate: string;
  views: number;
  bids: number;
}

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected" | "selling">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Mock products data
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "iPhone 15 Pro Max 256GB",
      category: "Điện thoại",
      condition: "Mới 99%",
      startPrice: "20,000,000",
      currentPrice: "25,000,000",
      status: "selling",
      seller: "Nguyễn Văn A",
      createdDate: "15/12/2024",
      views: 1250,
      bids: 45,
    },
    {
      id: 2,
      name: "MacBook Pro M3 16inch",
      category: "Laptop",
      condition: "Mới 100%",
      startPrice: "30,000,000",
      currentPrice: "35,000,000",
      status: "selling",
      seller: "Trần Thị B",
      createdDate: "16/12/2024",
      views: 980,
      bids: 38,
    },
    {
      id: 3,
      name: "Samsung Galaxy S24 Ultra",
      category: "Điện thoại",
      condition: "Mới 99%",
      startPrice: "15,000,000",
      currentPrice: "18,000,000",
      status: "selling",
      seller: "Lê Văn C",
      createdDate: "17/12/2024",
      views: 850,
      bids: 32,
    },
    {
      id: 4,
      name: "iPad Pro M2 12.9inch",
      category: "Tablet",
      condition: "Mới 100%",
      startPrice: "18,000,000",
      currentPrice: "20,000,000",
      status: "approved",
      seller: "Phạm Thị D",
      createdDate: "18/12/2024",
      views: 620,
      bids: 0,
    },
    {
      id: 5,
      name: "Apple Watch Ultra 2",
      category: "Đồng hồ",
      condition: "Mới 99%",
      startPrice: "12,000,000",
      currentPrice: "15,000,000",
      status: "selling",
      seller: "Hoàng Văn E",
      createdDate: "19/12/2024",
      views: 540,
      bids: 25,
    },
    {
      id: 6,
      name: "Sony WH-1000XM5",
      category: "Tai nghe",
      condition: "Mới 100%",
      startPrice: "6,000,000",
      currentPrice: "0",
      status: "pending",
      seller: "Vũ Thị F",
      createdDate: "20/12/2024",
      views: 120,
      bids: 0,
    },
    {
      id: 7,
      name: "Dell XPS 15 9520",
      category: "Laptop",
      condition: "Cũ 95%",
      startPrice: "18,000,000",
      currentPrice: "0",
      status: "rejected",
      seller: "Đỗ Văn G",
      createdDate: "20/12/2024",
      views: 85,
      bids: 0,
    },
  ]);

  const categories = ["all", "Điện thoại", "Laptop", "Tablet", "Đồng hồ", "Tai nghe"];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || product.status === filterStatus;
    const matchCategory = filterCategory === "all" || product.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const getStatusBadge = (status: Product["status"]) => {
    const badges = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ duyệt" },
      approved: { bg: "bg-blue-100", text: "text-blue-800", label: "Đã duyệt" },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Từ chối" },
      selling: { bg: "bg-green-100", text: "text-green-800", label: "Đang bán" },
    };
    const badge = badges[status];
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const handleApprove = (id: number, name: string) => {
    toast.success(`Đã duyệt sản phẩm ${name}`);
  };

  const handleReject = (id: number, name: string) => {
    toast.error(`Đã từ chối sản phẩm ${name}`);
  };

  const handleEdit = (id: number) => {
    toast.info("Chức năng chỉnh sửa đang được phát triển");
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm ${name}?`)) {
      toast.success(`Đã xóa sản phẩm ${name}`);
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="selling">Đang bán</option>
              <option value="rejected">Từ chối</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.filter(c => c !== "all").map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg">
              <Plus size={20} />
              <span className="font-medium">Thêm sản phẩm</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Tổng sản phẩm</p>
            <p className="text-2xl font-bold text-gray-800">{products.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Chờ duyệt</p>
            <p className="text-2xl font-bold text-yellow-600">
              {products.filter((p) => p.status === "pending").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đang bán</p>
            <p className="text-2xl font-bold text-green-600">
              {products.filter((p) => p.status === "selling").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Từ chối</p>
            <p className="text-2xl font-bold text-red-600">
              {products.filter((p) => p.status === "rejected").length}
            </p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
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
                  Giá hiện tại
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người bán
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thống kê
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.condition}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-800">{product.startPrice} VNĐ</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-green-600">
                      {product.currentPrice !== "0" ? `${product.currentPrice} VNĐ` : "-"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{product.seller}</p>
                    <p className="text-xs text-gray-500">{product.createdDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{product.views} lượt xem</p>
                    <p className="text-sm text-gray-600">{product.bids} lượt đấu giá</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {product.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(product.id, product.name)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Duyệt"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleReject(product.id, product.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Từ chối"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị {filteredProducts.length} / {products.length} sản phẩm
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Trước
            </button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
