import { useState } from 'react';
import { TrendingUp, Users, Package, DollarSign, Calendar, Download } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_REVENUE_DATA = [
  { month: 'Tháng 1', revenue: 450000000, orders: 234, growth: 12 },
  { month: 'Tháng 2', revenue: 520000000, orders: 278, growth: 15.5 },
  { month: 'Tháng 3', revenue: 480000000, orders: 256, growth: -7.7 },
  { month: 'Tháng 4', revenue: 610000000, orders: 312, growth: 27.1 },
  { month: 'Tháng 5', revenue: 680000000, orders: 345, growth: 11.5 },
  { month: 'Tháng 6', revenue: 720000000, orders: 378, growth: 5.9 },
];

const MOCK_TOP_PRODUCTS = [
  { id: 1, name: 'iPhone 15 Pro Max', category: 'Điện thoại', bids: 234, revenue: 89000000 },
  { id: 2, name: 'MacBook Pro M3', category: 'Laptop', bids: 189, revenue: 76000000 },
  { id: 3, name: 'Sony A7 IV', category: 'Camera', bids: 156, revenue: 65000000 },
  { id: 4, name: 'AirPods Pro', category: 'Phụ kiện', bids: 312, revenue: 45000000 },
  { id: 5, name: 'iPad Air', category: 'Tablet', bids: 145, revenue: 42000000 },
];

const MOCK_USER_STATS = {
  totalUsers: 12456,
  activeUsers: 8234,
  newUsers: 456,
  verifiedUsers: 5678,
};

const AdminReports = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleExport = () => {
    toast.success('Đang xuất báo cáo PDF...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Phân tích</h1>
          <p className="text-gray-600 mt-1">Tổng quan về hiệu suất kinh doanh</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={20} />
          Xuất báo cáo
        </button>
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-3">
        <button
          onClick={() => setTimeRange('week')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            timeRange === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          7 ngày
        </button>
        <button
          onClick={() => setTimeRange('month')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            timeRange === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          30 ngày
        </button>
        <button
          onClick={() => setTimeRange('year')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            timeRange === 'year'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          12 tháng
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <DollarSign size={24} />
            </div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">+15.5%</span>
          </div>
          <h3 className="text-sm opacity-90">Doanh thu tháng này</h3>
          <p className="text-2xl font-bold mt-1">{formatPrice(720000000)}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Package size={24} />
            </div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">+12.3%</span>
          </div>
          <h3 className="text-sm opacity-90">Đơn hàng</h3>
          <p className="text-2xl font-bold mt-1">378</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Users size={24} />
            </div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">+8.7%</span>
          </div>
          <h3 className="text-sm opacity-90">Người dùng mới</h3>
          <p className="text-2xl font-bold mt-1">456</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">+18.2%</span>
          </div>
          <h3 className="text-sm opacity-90">Tỷ lệ thành công</h3>
          <p className="text-2xl font-bold mt-1">87.5%</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Doanh thu theo tháng</h2>
          <Calendar className="text-gray-400" size={20} />
        </div>
        
        <div className="space-y-3">
          {MOCK_REVENUE_DATA.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-24 text-sm text-gray-600">{item.month}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full flex items-center justify-end pr-3 text-white text-sm font-semibold transition-all duration-500"
                      style={{ width: `${(item.revenue / 720000000) * 100}%` }}
                    >
                      {formatPrice(item.revenue)}
                    </div>
                  </div>
                  <div className={`text-sm font-semibold w-16 text-right ${
                    item.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.growth >= 0 ? '+' : ''}{item.growth}%
                  </div>
                </div>
              </div>
              <div className="w-20 text-right text-sm text-gray-600">
                {item.orders} đơn
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sản phẩm bán chạy nhất</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Sản phẩm</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Danh mục</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Số lượt bid</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TOP_PRODUCTS.map((product, index) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700">{product.bids}</td>
                  <td className="py-3 px-4 text-right font-semibold text-green-600">
                    {formatPrice(product.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Thống kê người dùng</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{MOCK_USER_STATS.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Tổng người dùng</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{MOCK_USER_STATS.activeUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Đang hoạt động</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{MOCK_USER_STATS.newUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Người dùng mới</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{MOCK_USER_STATS.verifiedUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Đã xác minh</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
