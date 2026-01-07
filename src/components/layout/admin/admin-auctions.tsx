import { useState, useEffect } from "react";
import { Search, Edit, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { auctionService } from "@/services/auctionService";
import type { AdminAuctionSessionResponse, AuctionStatus, SimpleProductResponse, SimpleUserResponse } from "@/types/auction";
import UpdateAuctionModal from "@/components/pop-up/update-auction-modal";
import DetailModal from "@/components/pop-up/detail-modal";
import Pagination from "@/components/ui/pagination";

const AdminAuctions = () => {
  const [auctions, setAuctions] = useState<AdminAuctionSessionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<AuctionStatus | "ALL">("ALL");
  const [sortOption, setSortOption] = useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Modals
  const [updateModal, setUpdateModal] = useState<AdminAuctionSessionResponse | null>(null);
  const [detailModal, setDetailModal] = useState<{ type: 'product' | 'user'; data: SimpleProductResponse | SimpleUserResponse | null }>({ type: 'product', data: null });

  // Fetch auctions
  const fetchAuctions = async () => {
    setLoading(true);
    try {
      const response = await auctionService.getAllSessionsForAdmin(
        {
          productName: searchQuery || undefined,
          status: filterStatus === "ALL" ? undefined : filterStatus,
          sort: sortOption === 'newest' ? undefined : sortOption,
        },
        currentPage,
        pageSize
      );

      setAuctions(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể tải danh sách phiên đấu giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [currentPage, filterStatus, sortOption]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchAuctions();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getStatusBadge = (status: AuctionStatus) => {
    const badges = {
      SCHEDULED: { bg: "bg-blue-100", text: "text-blue-800", label: "Đã lên lịch" },
      ACTIVE: { bg: "bg-green-100", text: "text-green-800", label: "Đang diễn ra" },
      ENDED: { bg: "bg-gray-100", text: "text-gray-800", label: "Đã kết thúc" },
      CANCELLED: { bg: "bg-red-100", text: "text-red-800", label: "Đã hủy" },
      FAILED: { bg: "bg-orange-100", text: "text-orange-800", label: "Thất bại" },
      WAITING_PAYMENT: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ thanh toán" },
    };
    const badge = badges[status];
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUpdate = (auction: AdminAuctionSessionResponse) => {
    setUpdateModal(auction);
  };

  const handleViewProduct = (product: SimpleProductResponse) => {
    setDetailModal({ type: 'product', data: product });
  };

  const handleViewUser = (user: SimpleUserResponse) => {
    setDetailModal({ type: 'user', data: user });
  };

  const statusCounts = {
    total: totalElements,
    scheduled: auctions.filter((a) => a.status === "SCHEDULED").length,
    active: auctions.filter((a) => a.status === "ACTIVE").length,
    ended: auctions.filter((a) => a.status === "ENDED").length,
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
              placeholder="Tìm kiếm theo tên sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as AuctionStatus | "ALL")}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="SCHEDULED">Đã lên lịch</option>
              <option value="ACTIVE">Đang diễn ra</option>
              <option value="ENDED">Đã kết thúc</option>
              <option value="CANCELLED">Đã hủy</option>
              <option value="FAILED">Thất bại</option>
              <option value="WAITING_PAYMENT">Chờ thanh toán</option>
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="price_asc">Giá hiện tại tăng dần</option>
              <option value="price_desc">Giá hiện tại giảm dần</option>
              <option value="start_price_asc">Giá khởi điểm tăng dần</option>
              <option value="start_price_desc">Giá khởi điểm giảm dần</option>
              <option value="reserve_price_asc">Giá sàn tăng dần</option>
              <option value="reserve_price_desc">Giá sàn giảm dần</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Tổng phiên đấu giá</p>
            <p className="text-2xl font-bold text-gray-800">{statusCounts.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đã lên lịch</p>
            <p className="text-2xl font-bold text-blue-600">{statusCounts.scheduled}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đang diễn ra</p>
            <p className="text-2xl font-bold text-green-600">{statusCounts.active}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đã kết thúc</p>
            <p className="text-2xl font-bold text-gray-600">{statusCounts.ended}</p>
          </div>
        </div>
      </div>

      {/* Auctions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Không có phiên đấu giá nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Người đặt giá
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {auctions.map((auction) => (
                    <tr key={auction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {auction.product.images && auction.product.images.length > 0 && (
                            <img
                              src={auction.product.images[0].url}
                              alt={auction.product.name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            />
                          )}
                          <div>
                            <button
                              onClick={() => handleViewProduct(auction.product)}
                              className="font-semibold text-blue-600 hover:text-blue-800 text-left"
                            >
                              {auction.product.name}
                            </button>
                            <p className="text-xs text-gray-500">ID: #{auction.id}</p>
                            <button
                              onClick={() => handleViewUser(auction.product.seller)}
                              className="text-xs text-gray-600 hover:text-blue-600"
                            >
                              Người bán: {auction.product.seller.firstName} {auction.product.seller.lastName}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div>
                            <p className="text-xs text-gray-600">Khởi điểm</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {auction.startPrice.toLocaleString()} đ
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Hiện tại</p>
                            <p className="text-sm font-semibold text-green-600">
                              {auction.currentPrice.toLocaleString()} đ
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Giá sàn</p>
                            <p className="text-sm font-semibold text-green-600">
                              {auction.reservePrice.toLocaleString()} đ
                            </p>
                          </div>
                          {auction.buyNowPrice && (
                            <div>
                              <p className="text-xs text-gray-600">Mua ngay</p>
                              <p className="text-sm font-semibold text-yellow-600">
                                {auction.buyNowPrice.toLocaleString()} đ
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div>
                            <p className="text-xs text-gray-600">Bắt đầu</p>
                            <p className="text-sm text-gray-800">{formatDate(auction.startTime)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Kết thúc</p>
                            <p className="text-sm text-gray-800">{formatDate(auction.endTime)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(auction.status)}
                      </td>
                      <td className="px-6 py-4">
                        {auction.highestBidder ? (
                          <button
                            onClick={() => handleViewUser(auction.highestBidder!)}
                            className="text-sm hover:text-blue-600"
                          >
                            <p className="font-semibold text-gray-800">
                              {auction.highestBidder.firstName} {auction.highestBidder.lastName}
                            </p>
                            <p className="text-xs text-gray-600">@{auction.highestBidder.username}</p>
                            {auction.highestMaxBid && (
                              <p className="text-xs text-green-600 font-semibold">
                                {auction.highestMaxBid.toLocaleString()} đ
                              </p>
                            )}
                          </button>
                        ) : (
                          <p className="text-sm text-gray-400">Chưa có</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdate(auction)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleViewProduct(auction.product)}
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
        <UpdateAuctionModal
          auction={updateModal}
          onClose={() => setUpdateModal(null)}
          onSuccess={fetchAuctions}
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

export default AdminAuctions;
