import { useState, useEffect } from "react";
import { Users, Package, Gavel, DollarSign, Loader2, Calendar } from "lucide-react";
import { adminStatisticsService } from "@/services/adminStatisticsService";
import type { StatisticResponse } from "@/types/statistics";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState<StatisticResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth, selectedYear]);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      const response = await adminStatisticsService.getStatistics({
        month: selectedMonth,
        year: selectedMonth ? selectedYear : undefined
      });
      setStatistics(response.data);
    } catch (error: any) {
      console.error('Error fetching statistics:', error);
      toast.error('Không thể tải thống kê');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không có dữ liệu thống kê</p>
      </div>
    );
  }

  // Stats cards data
  const stats = [
    {
      title: "Tổng người dùng",
      value: formatNumber(statistics.totalUsers),
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50"
    },
    {
      title: "Phiên đấu giá đang chạy",
      value: formatNumber(statistics.activeAuctions),
      icon: Gavel,
      color: "from-green-500 to-green-600",
      bgLight: "bg-green-50"
    },
    {
      title: "Sản phẩm chờ duyệt",
      value: formatNumber(statistics.pendingProducts),
      icon: Package,
      color: "from-yellow-500 to-yellow-600",
      bgLight: "bg-yellow-50"
    },
    {
      title: "Doanh thu ròng",
      value: formatCurrency(statistics.totalRevenue),
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50"
    },
  ];

  // Data for Pie Chart
  const pieData = [
    { name: 'Phí niêm yết', value: statistics.totalListingFee, color: '#10b981' },
    { name: 'Hoa hồng', value: statistics.commissionRevenue, color: '#a855f7' },
  ];

  // Data for Bar Chart
  const barData = [
    {
      name: 'GMV',
      value: statistics.totalGMV,
      fill: '#3b82f6'
    },
    {
      name: 'Phí niêm yết',
      value: statistics.totalListingFee,
      fill: '#10b981'
    },
    {
      name: 'Hoa hồng',
      value: statistics.commissionRevenue,
      fill: '#a855f7'
    },
    {
      name: 'Doanh thu ròng',
      value: statistics.totalRevenue,
      fill: '#f97316'
    },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-sm text-gray-600">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Lọc thống kê</h3>
          <div className="flex items-center gap-4 ml-auto">
            <select
              value={selectedMonth || ''}
              onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : undefined)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Tất cả các tháng</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {[...Array(5)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    Năm {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
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
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Revenue Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
            So sánh doanh thu
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={(value) => {
                  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                  return value;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Revenue Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
            Phân bổ doanh thu
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-sm text-gray-700">
                    {value}: {formatCurrency(entry.payload.value)}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Details Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
          Chi tiết doanh thu
        </h3>
        <div className="space-y-4">
          {/* Total GMV */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="font-medium text-gray-800">Tổng GMV (Gross Merchandise Value)</span>
            </div>
            <span className="text-xl font-bold text-blue-600">{formatCurrency(statistics.totalGMV)}</span>
          </div>

          {/* Listing Fee */}
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <div>
                <span className="font-medium text-gray-800">Phí niêm yết</span>
                <p className="text-xs text-gray-600">
                  {((statistics.totalListingFee / statistics.totalGMV) * 100).toFixed(2)}% của GMV
                </p>
              </div>
            </div>
            <span className="text-xl font-bold text-green-600">{formatCurrency(statistics.totalListingFee)}</span>
          </div>

          {/* Commission Revenue */}
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
              <div>
                <span className="font-medium text-gray-800">Doanh thu hoa hồng</span>
                <p className="text-xs text-gray-600">
                  {((statistics.commissionRevenue / statistics.totalGMV) * 100).toFixed(2)}% của GMV
                </p>
              </div>
            </div>
            <span className="text-xl font-bold text-purple-600">{formatCurrency(statistics.commissionRevenue)}</span>
          </div>

          {/* Net Revenue */}
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-orange-600"></div>
              <div>
                <span className="font-bold text-gray-800">Doanh thu ròng (Net Revenue)</span>
                <p className="text-xs text-gray-600">
                  {((statistics.totalRevenue / statistics.totalGMV) * 100).toFixed(2)}% của GMV
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-orange-600">{formatCurrency(statistics.totalRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
