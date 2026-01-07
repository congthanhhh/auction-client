import { useState, useEffect } from "react";
import { Search, Edit, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { invoiceService } from "@/services/invoiceService";
import type { InvoiceResponse, InvoiceStatus, InvoiceType } from "@/types/invoice";
import UpdateInvoiceModal from "@/components/pop-up/update-invoice-modal";
import DetailModal from "@/components/pop-up/detail-modal";
import Pagination from "@/components/ui/pagination";

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | "ALL">("ALL");
  const [filterType, setFilterType] = useState<InvoiceType | "ALL">("ALL");
  const [sortOption, setSortOption] = useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Modals
  const [updateModal, setUpdateModal] = useState<InvoiceResponse | null>(null);
  const [detailModal, setDetailModal] = useState<{ type: 'product' | 'user'; data: any | null }>({ type: 'product', data: null });

  // Fetch invoices
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await invoiceService.getAllInvoicesForAdmin(
        {
          keyword: searchQuery || undefined,
          status: filterStatus === "ALL" ? undefined : filterStatus,
          type: filterType === "ALL" ? undefined : filterType,
          sort: sortOption === 'newest' ? undefined : sortOption,
        },
        currentPage,
        pageSize
      );

      setInvoices(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể tải danh sách hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, filterStatus, filterType, sortOption]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchInvoices();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getStatusBadge = (status: InvoiceStatus) => {
    const badges = {
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ thanh toán" },
      PAID: { bg: "bg-blue-100", text: "text-blue-800", label: "Đã thanh toán" },
      SHIPPING: { bg: "bg-purple-100", text: "text-purple-800", label: "Đang giao" },
      COMPLETED: { bg: "bg-green-100", text: "text-green-800", label: "Hoàn thành" },
      DISPUTE: { bg: "bg-orange-100", text: "text-orange-800", label: "Khiếu nại" },
      CANCELLED_NON_PAYMENT: { bg: "bg-red-100", text: "text-red-800", label: "Hủy - Không TT" },
      CANCELLED_BY_SELLER: { bg: "bg-red-100", text: "text-red-800", label: "Hủy - Seller" },
      REFUNDED: { bg: "bg-gray-100", text: "text-gray-800", label: "Hoàn tiền" },
    };
    const badge = badges[status];
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUpdate = (invoice: InvoiceResponse) => {
    setUpdateModal(invoice);
  };

  const handleViewProduct = (product: any) => {
    setDetailModal({ type: 'product', data: product });
  };

  const handleViewUser = (user: any) => {
    setDetailModal({ type: 'user', data: user });
  };

  const statusCounts = {
    total: totalElements,
    pending: invoices.filter((i) => i.status === "PENDING").length,
    paid: invoices.filter((i) => i.status === "PAID").length,
    completed: invoices.filter((i) => i.status === "COMPLETED").length,
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
              placeholder="Tìm kiếm theo ID, username, tên sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as InvoiceStatus | "ALL")}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ thanh toán</option>
              <option value="PAID">Đã thanh toán</option>
              <option value="SHIPPING">Đang giao</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="DISPUTE">Khiếu nại</option>
              <option value="CANCELLED_NON_PAYMENT">Hủy - Không TT</option>
              <option value="CANCELLED_BY_SELLER">Hủy - Seller</option>
              <option value="REFUNDED">Hoàn tiền</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as InvoiceType | "ALL")}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="ALL">Tất cả loại</option>
              <option value="AUCTION_SALE">Đơn bán hàng</option>
              <option value="LISTING_FEE">Phí đăng sản phẩm</option>
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="due_date_asc">Hạn TT sớm nhất</option>
              <option value="due_date_desc">Hạn TT muộn nhất</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Tổng hóa đơn</p>
            <p className="text-2xl font-bold text-gray-800">{statusCounts.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Chờ thanh toán</p>
            <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đã thanh toán</p>
            <p className="text-2xl font-bold text-blue-600">{statusCounts.paid}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Hoàn thành</p>
            <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Không có hóa đơn nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Hóa đơn
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Người dùng / Sản phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Giá / Loại
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Vận chuyển
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800">#{invoice.id}</p>
                        <p className="text-xs text-gray-500">
                          Auction: #{invoice.auctionSessionId}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <button
                            onClick={() => handleViewUser(invoice.user)}
                            className="text-sm hover:text-blue-600"
                          >
                            <p className="font-semibold text-gray-800">
                              {invoice.user.firstName} {invoice.user.lastName}
                            </p>
                            <p className="text-xs text-gray-600">@{invoice.user.username}</p>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-green-600">
                          {invoice.finalPrice.toLocaleString()} đ
                        </p>
                        <p className="text-xs text-gray-600">
                          {invoice.type === 'AUCTION_SALE' ? 'Đơn bán hàng' : 'Phí đăng SP'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-xs">
                          <p className="text-gray-600">
                            Tạo: {formatDate(invoice.createdAt)}
                          </p>
                          <p className="text-gray-600">
                            Hạn: {formatDate(invoice.dueDate)}
                          </p>
                          {invoice.paymentTime && (
                            <p className="text-green-600">
                              TT: {formatDate(invoice.paymentTime)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-6 py-4">
                        {invoice.type === 'AUCTION_SALE' ? (
                          <div className="space-y-1 text-xs">
                            {invoice.trackingCode ? (
                              <>
                                <p className="text-gray-600">
                                  Mã: <span className="font-mono font-semibold">{invoice.trackingCode}</span>
                                </p>
                                {invoice.carrier && (
                                  <p className="text-gray-600">ĐV: {invoice.carrier}</p>
                                )}
                                {invoice.shippedAt && (
                                  <p className="text-gray-500">
                                    Gửi: {formatDate(invoice.shippedAt)}
                                  </p>
                                )}
                              </>
                            ) : (
                              <p className="text-gray-400">Chưa có</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400">N/A</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdate(invoice)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleViewProduct(invoice.product)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {updateModal && (
        <UpdateInvoiceModal
          invoice={updateModal}
          onClose={() => setUpdateModal(null)}
          onSuccess={fetchInvoices}
        />
      )}

      {detailModal.data && (
        <DetailModal
          type={detailModal.type}
          data={detailModal.data}
          onClose={() => setDetailModal({ type: 'product', data: null })}
        />
      )}
    </div>
  );
};

export default AdminInvoices;
