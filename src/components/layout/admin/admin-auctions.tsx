import { useState } from "react";
import { Search, Play, Pause, StopCircle, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

interface Auction {
  id: number;
  productName: string;
  seller: string;
  startPrice: string;
  currentPrice: string;
  buyNowPrice: string;
  startTime: string;
  endTime: string;
  status: "upcoming" | "active" | "ended";
  totalBids: number;
  participants: number;
  highestBidder: string;
}

const AdminAuctions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "active" | "ended">("all");

  // Mock auctions data
  const [auctions] = useState<Auction[]>([
    {
      id: 1,
      productName: "iPhone 15 Pro Max 256GB",
      seller: "Nguyễn Văn A",
      startPrice: "20,000,000",
      currentPrice: "25,000,000",
      buyNowPrice: "30,000,000",
      startTime: "15/12/2024 10:00",
      endTime: "22/12/2024 22:00",
      status: "active",
      totalBids: 45,
      participants: 12,
      highestBidder: "Hoàng Văn E",
    },
    {
      id: 2,
      productName: "MacBook Pro M3 16inch",
      seller: "Trần Thị B",
      startPrice: "30,000,000",
      currentPrice: "35,000,000",
      buyNowPrice: "40,000,000",
      startTime: "16/12/2024 14:00",
      endTime: "23/12/2024 20:00",
      status: "active",
      totalBids: 38,
      participants: 10,
      highestBidder: "Phạm Thị D",
    },
    {
      id: 3,
      productName: "Samsung Galaxy S24 Ultra",
      seller: "Lê Văn C",
      startPrice: "15,000,000",
      currentPrice: "18,000,000",
      buyNowPrice: "22,000,000",
      startTime: "17/12/2024 09:00",
      endTime: "24/12/2024 18:00",
      status: "active",
      totalBids: 32,
      participants: 9,
      highestBidder: "Vũ Thị F",
    },
    {
      id: 4,
      productName: "iPad Pro M2 12.9inch",
      seller: "Phạm Thị D",
      startPrice: "18,000,000",
      currentPrice: "0",
      buyNowPrice: "25,000,000",
      startTime: "25/12/2024 10:00",
      endTime: "30/12/2024 22:00",
      status: "upcoming",
      totalBids: 0,
      participants: 0,
      highestBidder: "-",
    },
    {
      id: 5,
      productName: "Apple Watch Ultra 2",
      seller: "Hoàng Văn E",
      startPrice: "12,000,000",
      currentPrice: "15,000,000",
      buyNowPrice: "18,000,000",
      startTime: "10/12/2024 08:00",
      endTime: "20/12/2024 20:00",
      status: "ended",
      totalBids: 25,
      participants: 8,
      highestBidder: "Nguyễn Văn A",
    },
    {
      id: 6,
      productName: "Sony WH-1000XM5",
      seller: "Vũ Thị F",
      startPrice: "6,000,000",
      currentPrice: "8,500,000",
      buyNowPrice: "10,000,000",
      startTime: "12/12/2024 15:00",
      endTime: "21/12/2024 15:00",
      status: "ended",
      totalBids: 18,
      participants: 6,
      highestBidder: "Trần Thị B",
    },
  ]);

  // Filter auctions
  const filteredAuctions = auctions.filter((auction) => {
    const matchSearch = auction.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || auction.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: Auction["status"]) => {
    const badges = {
      upcoming: { bg: "bg-blue-100", text: "text-blue-800", label: "Sắp diễn ra" },
      active: { bg: "bg-green-100", text: "text-green-800", label: "Đang diễn ra" },
      ended: { bg: "bg-gray-100", text: "text-gray-800", label: "Đã kết thúc" },
    };
    const badge = badges[status];
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const handleStart = (id: number, name: string) => {
    toast.success(`Đã bắt đầu phiên đấu giá ${name}`);
  };

  const handlePause = (id: number, name: string) => {
    toast.warning(`Đã tạm dừng phiên đấu giá ${name}`);
  };

  const handleEnd = (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc muốn kết thúc phiên đấu giá ${name}?`)) {
      toast.info(`Đã kết thúc phiên đấu giá ${name}`);
    }
  };

  const handleEdit = (id: number) => {
    toast.info("Chức năng chỉnh sửa đang được phát triển");
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa phiên đấu giá ${name}?`)) {
      toast.success(`Đã xóa phiên đấu giá ${name}`);
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
              placeholder="Tìm kiếm phiên đấu giá..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="upcoming">Sắp diễn ra</option>
              <option value="active">Đang diễn ra</option>
              <option value="ended">Đã kết thúc</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Tổng phiên đấu giá</p>
            <p className="text-2xl font-bold text-gray-800">{auctions.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sắp diễn ra</p>
            <p className="text-2xl font-bold text-blue-600">
              {auctions.filter((a) => a.status === "upcoming").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đang diễn ra</p>
            <p className="text-2xl font-bold text-green-600">
              {auctions.filter((a) => a.status === "active").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đã kết thúc</p>
            <p className="text-2xl font-bold text-gray-600">
              {auctions.filter((a) => a.status === "ended").length}
            </p>
          </div>
        </div>
      </div>

      {/* Auctions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Giá khởi điểm
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Giá hiện tại
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mua ngay
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hoạt động
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAuctions.map((auction) => (
                <tr key={auction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">{auction.productName}</p>
                      <p className="text-sm text-gray-500">Người bán: {auction.seller}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {auction.startPrice} VNĐ
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-green-600">
                      {auction.currentPrice !== "0" ? `${auction.currentPrice} VNĐ` : "-"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-yellow-600">
                      {auction.buyNowPrice} VNĐ
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">Bắt đầu: {auction.startTime}</p>
                    <p className="text-sm text-gray-800">Kết thúc: {auction.endTime}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(auction.status)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{auction.totalBids} lượt đấu giá</p>
                    <p className="text-sm text-gray-600">{auction.participants} người tham gia</p>
                    {auction.highestBidder !== "-" && (
                      <p className="text-sm font-semibold text-yellow-600">
                        Cao nhất: {auction.highestBidder}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {auction.status === "upcoming" && (
                        <button
                          onClick={() => handleStart(auction.id, auction.productName)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Bắt đầu"
                        >
                          <Play size={18} />
                        </button>
                      )}
                      {auction.status === "active" && (
                        <>
                          <button
                            onClick={() => handlePause(auction.id, auction.productName)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Tạm dừng"
                          >
                            <Pause size={18} />
                          </button>
                          <button
                            onClick={() => handleEnd(auction.id, auction.productName)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Kết thúc"
                          >
                            <StopCircle size={18} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleEdit(auction.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(auction.id, auction.productName)}
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
            Hiển thị {filteredAuctions.length} / {auctions.length} phiên đấu giá
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

export default AdminAuctions;
