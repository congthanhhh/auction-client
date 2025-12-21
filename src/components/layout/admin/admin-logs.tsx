import { useState } from 'react';
import { Activity, LogIn, Gavel, CreditCard, Settings, User, Search, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface LogEntry {
  id: number;
  timestamp: string;
  userId: number;
  userName: string;
  action: 'login' | 'bid' | 'payment' | 'admin' | 'product' | 'user_update';
  description: string;
  ipAddress: string;
  deviceInfo: string;
  severity: 'info' | 'warning' | 'error';
}

const MOCK_LOGS: LogEntry[] = [
  {
    id: 1,
    timestamp: '2024-12-20T14:35:22Z',
    userId: 101,
    userName: 'nguyenvana',
    action: 'login',
    description: 'Đăng nhập thành công từ Chrome',
    ipAddress: '192.168.1.100',
    deviceInfo: 'Chrome 120.0 on Windows 11',
    severity: 'info',
  },
  {
    id: 2,
    timestamp: '2024-12-20T14:30:15Z',
    userId: 102,
    userName: 'tranthib',
    action: 'bid',
    description: 'Đặt giá 15,500,000₫ cho sản phẩm iPhone 15 Pro Max',
    ipAddress: '192.168.1.105',
    deviceInfo: 'Safari 17.1 on iPhone 14',
    severity: 'info',
  },
  {
    id: 3,
    timestamp: '2024-12-20T14:25:08Z',
    userId: 103,
    userName: 'levanc',
    action: 'payment',
    description: 'Thanh toán thất bại - Tài khoản không đủ số dư',
    ipAddress: '192.168.1.110',
    deviceInfo: 'Firefox 121.0 on Ubuntu 22.04',
    severity: 'error',
  },
  {
    id: 4,
    timestamp: '2024-12-20T14:20:45Z',
    userId: 1,
    userName: 'admin',
    action: 'admin',
    description: 'Phê duyệt yêu cầu xác minh cho người dùng @nguyenvana',
    ipAddress: '192.168.1.1',
    deviceInfo: 'Chrome 120.0 on macOS Sonoma',
    severity: 'info',
  },
  {
    id: 5,
    timestamp: '2024-12-20T14:15:30Z',
    userId: 104,
    userName: 'phamthid',
    action: 'product',
    description: 'Tạo đấu giá mới: MacBook Pro M3 - Giá khởi điểm 25,000,000₫',
    ipAddress: '192.168.1.115',
    deviceInfo: 'Edge 120.0 on Windows 10',
    severity: 'info',
  },
  {
    id: 6,
    timestamp: '2024-12-20T14:10:12Z',
    userId: 102,
    userName: 'tranthib',
    action: 'user_update',
    description: 'Cập nhật thông tin hồ sơ và ảnh đại diện',
    ipAddress: '192.168.1.105',
    deviceInfo: 'Safari 17.1 on iPhone 14',
    severity: 'info',
  },
  {
    id: 7,
    timestamp: '2024-12-20T14:05:50Z',
    userId: 105,
    userName: 'vothie',
    action: 'login',
    description: 'Đăng nhập thất bại - Sai mật khẩu (lần thử 3/5)',
    ipAddress: '192.168.1.120',
    deviceInfo: 'Chrome 120.0 on Android 14',
    severity: 'warning',
  },
  {
    id: 8,
    timestamp: '2024-12-20T14:00:35Z',
    userId: 106,
    userName: 'hoangvanf',
    action: 'bid',
    description: 'Thắng đấu giá Canon EOS R5 với giá 45,000,000₫',
    ipAddress: '192.168.1.125',
    deviceInfo: 'Chrome 120.0 on macOS Ventura',
    severity: 'info',
  },
  {
    id: 9,
    timestamp: '2024-12-20T13:55:20Z',
    userId: 1,
    userName: 'admin',
    action: 'admin',
    description: 'Xóa sản phẩm vi phạm chính sách (ID: 12345)',
    ipAddress: '192.168.1.1',
    deviceInfo: 'Chrome 120.0 on macOS Sonoma',
    severity: 'warning',
  },
  {
    id: 10,
    timestamp: '2024-12-20T13:50:08Z',
    userId: 107,
    userName: 'dangthig',
    action: 'payment',
    description: 'Thanh toán thành công 32,500,000₫ qua VNPay',
    ipAddress: '192.168.1.130',
    deviceInfo: 'Chrome 120.0 on Windows 11',
    severity: 'info',
  },
];

const AdminLogs = () => {
  const [logs] = useState<LogEntry[]>(MOCK_LOGS);
  const [selectedAction, setSelectedAction] = useState<'all' | 'login' | 'bid' | 'payment' | 'admin' | 'product' | 'user_update'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    const matchesSearch = searchQuery === '' || 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);
    return matchesAction && matchesSearch;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
        return <LogIn size={18} />;
      case 'bid':
        return <Gavel size={18} />;
      case 'payment':
        return <CreditCard size={18} />;
      case 'admin':
        return <Settings size={18} />;
      case 'product':
        return <Activity size={18} />;
      case 'user_update':
        return <User size={18} />;
      default:
        return <Activity size={18} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login':
        return 'bg-blue-100 text-blue-700';
      case 'bid':
        return 'bg-purple-100 text-purple-700';
      case 'payment':
        return 'bg-green-100 text-green-700';
      case 'admin':
        return 'bg-orange-100 text-orange-700';
      case 'product':
        return 'bg-cyan-100 text-cyan-700';
      case 'user_update':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info':
        return <Info size={16} className="text-blue-500" />;
      case 'warning':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <CheckCircle size={16} className="text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'border-blue-200 bg-blue-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'login':
        return 'Đăng nhập';
      case 'bid':
        return 'Đấu giá';
      case 'payment':
        return 'Thanh toán';
      case 'admin':
        return 'Quản trị';
      case 'product':
        return 'Sản phẩm';
      case 'user_update':
        return 'Cập nhật';
      default:
        return action;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nhật ký hoạt động</h1>
        <p className="text-gray-600 mt-1">Theo dõi tất cả hoạt động trong hệ thống</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Đăng nhập</p>
              <p className="text-2xl font-bold text-blue-900">
                {logs.filter(l => l.action === 'login').length}
              </p>
            </div>
            <LogIn className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Đấu giá</p>
              <p className="text-2xl font-bold text-purple-900">
                {logs.filter(l => l.action === 'bid').length}
              </p>
            </div>
            <Gavel className="text-purple-500" size={32} />
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Thanh toán</p>
              <p className="text-2xl font-bold text-green-900">
                {logs.filter(l => l.action === 'payment').length}
              </p>
            </div>
            <CreditCard className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">Quản trị</p>
              <p className="text-2xl font-bold text-orange-900">
                {logs.filter(l => l.action === 'admin').length}
              </p>
            </div>
            <Settings className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên người dùng, mô tả, IP..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Filters */}
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'login', 'bid', 'payment', 'admin', 'product', 'user_update'].map((action) => (
              <button
                key={action}
                onClick={() => setSelectedAction(action as any)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedAction === action
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                {action === 'all' ? 'Tất cả' : getActionLabel(action)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <div
              key={log.id}
              className={`border-l-4 rounded-lg p-4 ${getSeverityColor(log.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </span>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(log.severity)}
                      <span className="font-bold text-gray-900">@{log.userName}</span>
                      <span className="text-gray-500">•</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}>
                        {getActionLabel(log.action)}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-800 mb-2">{log.description}</p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      ID: {log.userId}
                    </span>
                    <span>IP: {log.ipAddress}</span>
                    <span>Thiết bị: {log.deviceInfo}</span>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-sm text-gray-500 text-right ml-4">
                  {formatTimestamp(log.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Activity size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">Không tìm thấy nhật ký nào</p>
            <p className="text-gray-500 text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="font-bold text-gray-900 mb-3">Chú thích mức độ</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-blue-500" />
            <span className="text-gray-700">Thông tin</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-yellow-500" />
            <span className="text-gray-700">Cảnh báo</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-gray-700">Lỗi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
