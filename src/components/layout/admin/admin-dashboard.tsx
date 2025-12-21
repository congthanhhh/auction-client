import { Users, Package, Gavel, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const AdminDashboard = () => {
  // Mock statistics data
  const stats = [
    {
      title: "Tổng người dùng",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Sản phẩm đang bán",
      value: "456",
      change: "+8.2%",
      trend: "up",
      icon: Package,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Phiên đấu giá",
      value: "89",
      change: "-3.1%",
      trend: "down",
      icon: Gavel,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Doanh thu tháng",
      value: "2.5 tỷ",
      change: "+23.4%",
      trend: "up",
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
    },
  ];

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      action: "đã đấu giá thành công",
      product: "iPhone 15 Pro Max",
      time: "5 phút trước",
      amount: "25,000,000 VNĐ",
    },
    {
      id: 2,
      user: "Trần Thị B",
      action: "đã đăng ký tài khoản",
      product: "",
      time: "15 phút trước",
      amount: "",
    },
    {
      id: 3,
      user: "Lê Văn C",
      action: "đã tạo phiên đấu giá",
      product: "MacBook Pro M3",
      time: "30 phút trước",
      amount: "30,000,000 VNĐ",
    },
    {
      id: 4,
      user: "Phạm Thị D",
      action: "đã thanh toán đơn hàng",
      product: "AirPods Pro",
      time: "1 giờ trước",
      amount: "5,500,000 VNĐ",
    },
    {
      id: 5,
      user: "Hoàng Văn E",
      action: "đã đấu giá",
      product: "iPad Air",
      time: "2 giờ trước",
      amount: "12,000,000 VNĐ",
    },
  ];

  // Mock top products
  const topProducts = [
    { name: "iPhone 15 Pro Max", bids: 45, current: "25,000,000 VNĐ" },
    { name: "MacBook Pro M3", bids: 38, current: "35,000,000 VNĐ" },
    { name: "Samsung Galaxy S24", bids: 32, current: "18,000,000 VNĐ" },
    { name: "iPad Pro M2", bids: 28, current: "20,000,000 VNĐ" },
    { name: "Apple Watch Ultra", bids: 25, current: "15,000,000 VNĐ" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                >
                  <Icon size={24} className="text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <TrendIcon size={16} />
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
            Hoạt động gần đây
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{activity.user}</span>{" "}
                    <span className="text-gray-600">{activity.action}</span>
                    {activity.product && (
                      <>
                        {" "}
                        <span className="font-semibold text-yellow-600">
                          {activity.product}
                        </span>
                      </>
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    {activity.amount && (
                      <>
                        <span className="text-gray-300">•</span>
                        <p className="text-xs font-semibold text-green-600">
                          {activity.amount}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
            Sản phẩm hot nhất
          </h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-600">{product.bids} lượt đấu giá</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-600">{product.current}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simple Chart Representation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
          Doanh thu 7 ngày qua
        </h3>
        <div className="flex items-end justify-between gap-4 h-64">
          {[
            { day: "T2", value: 70 },
            { day: "T3", value: 85 },
            { day: "T4", value: 60 },
            { day: "T5", value: 90 },
            { day: "T6", value: 100 },
            { day: "T7", value: 75 },
            { day: "CN", value: 95 },
          ].map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-100 rounded-lg overflow-hidden relative" style={{ height: "200px" }}>
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-lg transition-all duration-300 hover:from-yellow-600 hover:to-yellow-500"
                  style={{ height: `${item.value}%` }}
                ></div>
              </div>
              <p className="text-sm font-semibold text-gray-600">{item.day}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
