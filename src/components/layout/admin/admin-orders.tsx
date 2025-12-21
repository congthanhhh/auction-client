import { useState } from "react";
import { Search, CheckCircle, XCircle, Package, Truck, Eye } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: number;
  orderCode: string;
  productName: string;
  buyer: string;
  seller: string;
  amount: string;
  orderDate: string;
  deliveryStatus: "pending" | "processing" | "shipping" | "delivered" | "cancelled" | "dispute";
  paymentStatus: "pending" | "paid" | "refunded";
  shippingAddress: string;
  trackingCode?: string;
  shippedAt?: string;
}

const AdminOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDelivery, setFilterDelivery] = useState<"all" | Order["deliveryStatus"]>("all");
  const [filterPayment, setFilterPayment] = useState<"all" | Order["paymentStatus"]>("all");

  // Mock orders data
  const [orders] = useState<Order[]>([
    {
      id: 1,
      orderCode: "ORD001",
      productName: "iPhone 15 Pro Max 256GB",
      buyer: "Hoàng Văn E",
      seller: "Nguyễn Văn A",
      amount: "25,000,000",
      orderDate: "20/12/2024",
      deliveryStatus: "shipping",
      paymentStatus: "paid",
      shippingAddress: "123 Nguyễn Văn Linh, Q7, TP.HCM",
      trackingCode: "VN123456789",
      shippedAt: "2024-12-20 10:00",
    },
    {
      id: 2,
      orderCode: "ORD002",
      productName: "MacBook Pro M3 16inch",
      buyer: "Phạm Thị D",
      seller: "Trần Thị B",
      amount: "35,000,000",
      orderDate: "19/12/2024",
      deliveryStatus: "delivered",
      paymentStatus: "paid",
      shippingAddress: "456 Lê Văn Việt, Q9, TP.HCM",
    },
    {
      id: 3,
      orderCode: "ORD003",
      productName: "Samsung Galaxy S24 Ultra",
      buyer: "Vũ Thị F",
      seller: "Lê Văn C",
      amount: "18,000,000",
      orderDate: "21/12/2024",
      deliveryStatus: "processing",
      paymentStatus: "paid",
      shippingAddress: "789 Võ Văn Ngân, Thủ Đức, TP.HCM",
    },
    {
      id: 4,
      orderCode: "ORD004",
      productName: "iPad Pro M2 12.9inch",
      buyer: "Đỗ Văn G",
      seller: "Phạm Thị D",
      amount: "20,000,000",
      orderDate: "18/12/2024",
      deliveryStatus: "pending",
      paymentStatus: "pending",
      shippingAddress: "321 Đinh Tiên Hoàng, Q1, TP.HCM",
    },
    {
      id: 5,
      orderCode: "ORD005",
      productName: "Apple Watch Ultra 2",
      buyer: "Nguyễn Văn A",
      seller: "Hoàng Văn E",
      amount: "15,000,000",
      orderDate: "20/12/2024",
      deliveryStatus: "delivered",
      paymentStatus: "paid",
      shippingAddress: "654 Phan Văn Trị, Gò Vấp, TP.HCM",
    },
    {
      id: 6,
      orderCode: "ORD006",
      productName: "Sony WH-1000XM5",
      buyer: "Trần Thị B",
      seller: "Vũ Thị F",
      amount: "8,500,000",
      orderDate: "21/12/2024",
      deliveryStatus: "cancelled",
      paymentStatus: "refunded",
      shippingAddress: "987 Nguyễn Thị Minh Khai, Q3, TP.HCM",
    },    {
      id: 7,
      orderCode: "ORD007",
      productName: "AirPods Max Silver",
      buyer: "Nguyễn Văn H",
      seller: "Lê Văn I",
      amount: "12,000,000",
      orderDate: "19/12/2024",
      deliveryStatus: "dispute",
      paymentStatus: "paid",
      shippingAddress: "456 Lý Thường Kiệt, Q10, TP.HCM",
      trackingCode: "VN777888999",
      shippedAt: "2024-12-20 08:00",
    },  ]);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchSearch = order.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDelivery = filterDelivery === "all" || order.deliveryStatus === filterDelivery;
    const matchPayment = filterPayment === "all" || order.paymentStatus === filterPayment;
    return matchSearch && matchDelivery && matchPayment;
  });

  const getDeliveryBadge = (status: Order["deliveryStatus"]) => {
    const badges = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ xử lý" },
      processing: { bg: "bg-blue-100", text: "text-blue-800", label: "Đang xử lý" },
      shipping: { bg: "bg-purple-100", text: "text-purple-800", label: "Đang giao" },
      delivered: { bg: "bg-green-100", text: "text-green-800", label: "Đã giao" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Đã hủy" },
      dispute: { bg: "bg-orange-100", text: "text-orange-800", label: "Khiếu nại" },
    };
    const badge = badges[status];
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getPaymentBadge = (status: Order["paymentStatus"]) => {
    const badges = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ thanh toán" },
      paid: { bg: "bg-green-100", text: "text-green-800", label: "Đã thanh toán" },
      refunded: { bg: "bg-gray-100", text: "text-gray-800", label: "Đã hoàn tiền" },
    };
    const badge = badges[status];
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const handleConfirmPayment = (orderId: number, orderCode: string) => {
    toast.success(`Đã xác nhận thanh toán đơn hàng ${orderCode}`);
  };

  const handleUpdateDelivery = (orderId: number, orderCode: string, newStatus: string) => {
    toast.success(`Đã cập nhật trạng thái giao hàng đơn ${orderCode}`);
  };

  const handleCancelOrder = (orderId: number, orderCode: string) => {
    if (window.confirm(`Bạn có chắc muốn hủy đơn hàng ${orderCode}?`)) {
      toast.warning(`Đã hủy đơn hàng ${orderCode}`);
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
              placeholder="Tìm kiếm đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <select
              value={filterDelivery}
              onChange={(e) => setFilterDelivery(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="all">Tất cả giao hàng</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipping">Đang giao</option>
              <option value="delivered">Đã giao</option>
              <option value="dispute">Khiếu nại</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="all">Tất cả thanh toán</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="refunded">Đã hoàn tiền</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Tổng đơn hàng</p>
            <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Chờ xử lý</p>
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter((o) => o.deliveryStatus === "pending").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đang giao</p>
            <p className="text-2xl font-bold text-purple-600">
              {orders.filter((o) => o.deliveryStatus === "shipping").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đã giao</p>
            <p className="text-2xl font-bold text-green-600">
              {orders.filter((o) => o.deliveryStatus === "delivered").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Khiếu nại</p>
            <p className="text-2xl font-bold text-orange-600">
              {orders.filter((o) => o.deliveryStatus === "dispute").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Doanh thu</p>
            <p className="text-2xl font-bold text-yellow-600">
              {(orders
                .filter((o) => o.paymentStatus === "paid")
                .reduce((sum, o) => sum + parseInt(o.amount.replace(/,/g, "")), 0) / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Đơn hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người mua/bán
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Giao hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{order.orderCode}</p>
                    <p className="text-sm text-gray-500">{order.orderDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{order.productName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">Mua: {order.buyer}</p>
                    <p className="text-sm text-gray-500">Bán: {order.seller}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-green-600">{order.amount} VNĐ</p>
                  </td>
                  <td className="px-6 py-4">
                    {getPaymentBadge(order.paymentStatus)}
                  </td>
                  <td className="px-6 py-4">
                    {getDeliveryBadge(order.deliveryStatus)}
                    {order.trackingCode && (
                      <p className="text-xs text-gray-600 mt-1">
                        Mã vận đơn: <span className="font-mono font-semibold">{order.trackingCode}</span>
                      </p>
                    )}
                    {order.shippedAt && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Đã gửi: {order.shippedAt}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800 max-w-xs truncate">
                      {order.shippingAddress}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {order.paymentStatus === "pending" && (
                        <button
                          onClick={() => handleConfirmPayment(order.id, order.orderCode)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Xác nhận thanh toán"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {order.deliveryStatus !== "delivered" && order.deliveryStatus !== "cancelled" && (
                        <button
                          onClick={() => handleUpdateDelivery(order.id, order.orderCode, "shipping")}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Cập nhật giao hàng"
                        >
                          <Truck size={18} />
                        </button>
                      )}
                      {order.deliveryStatus === "pending" && (
                        <button
                          onClick={() => handleCancelOrder(order.id, order.orderCode)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hủy đơn"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                      <button
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
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
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

export default AdminOrders;
