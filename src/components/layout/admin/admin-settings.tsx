import { useState } from 'react';
import { Settings, Percent, Clock, DollarSign, Mail, Bell, Save } from 'lucide-react';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [auctionSettings, setAuctionSettings] = useState({
    bidIncrement: 5,
    autoExtendTime: 5,
    commissionRate: 10,
    paymentTimeout: 24,
    minBidAmount: 100000,
    maxAuctionDuration: 30,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    enablePayPal: true,
    enableCard: true,
    enableBankTransfer: true,
    enableVNPay: false,
    enableMomo: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    notifyNewBid: true,
    notifyWinning: true,
    notifyPayment: true,
    notifyShipping: true,
  });

  const handleSaveAuction = () => {
    toast.success('Đã lưu cài đặt đấu giá!');
  };

  const handleSavePayment = () => {
    toast.success('Đã lưu cài đặt thanh toán!');
  };

  const handleSaveNotification = () => {
    toast.success('Đã lưu cài đặt thông báo!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
        <p className="text-gray-600 mt-1">Tùy chỉnh các thông số hoạt động của nền tảng</p>
      </div>

      {/* Auction Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Settings size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Cài đặt đấu giá</h2>
            <p className="text-sm text-gray-600">Thiết lập quy tắc và thông số đấu giá</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bid Increment */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Percent size={16} className="text-blue-600" />
                Bước giá mặc định (%)
              </label>
              <input
                type="number"
                value={auctionSettings.bidIncrement}
                onChange={(e) => setAuctionSettings({ ...auctionSettings, bidIncrement: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Mỗi lượt bid tăng tối thiểu {auctionSettings.bidIncrement}% giá hiện tại</p>
            </div>

            {/* Auto Extend Time */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Clock size={16} className="text-blue-600" />
                Thời gian gia hạn tự động (phút)
              </label>
              <input
                type="number"
                value={auctionSettings.autoExtendTime}
                onChange={(e) => setAuctionSettings({ ...auctionSettings, autoExtendTime: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Gia hạn thêm {auctionSettings.autoExtendTime} phút nếu có bid trong {auctionSettings.autoExtendTime} phút cuối</p>
            </div>

            {/* Commission Rate */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <DollarSign size={16} className="text-blue-600" />
                Phí hoa hồng (%)
              </label>
              <input
                type="number"
                value={auctionSettings.commissionRate}
                onChange={(e) => setAuctionSettings({ ...auctionSettings, commissionRate: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Nền tảng thu {auctionSettings.commissionRate}% trên mỗi giao dịch thành công</p>
            </div>

            {/* Payment Timeout */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Clock size={16} className="text-blue-600" />
                Thời gian thanh toán tối đa (giờ)
              </label>
              <input
                type="number"
                value={auctionSettings.paymentTimeout}
                onChange={(e) => setAuctionSettings({ ...auctionSettings, paymentTimeout: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Hủy đơn nếu không thanh toán sau {auctionSettings.paymentTimeout}h</p>
            </div>

            {/* Min Bid Amount */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <DollarSign size={16} className="text-blue-600" />
                Giá khởi điểm tối thiểu (VNĐ)
              </label>
              <input
                type="number"
                value={auctionSettings.minBidAmount}
                onChange={(e) => setAuctionSettings({ ...auctionSettings, minBidAmount: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Giá khởi điểm tối thiểu: {auctionSettings.minBidAmount.toLocaleString()}đ</p>
            </div>

            {/* Max Auction Duration */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Clock size={16} className="text-blue-600" />
                Thời gian đấu giá tối đa (ngày)
              </label>
              <input
                type="number"
                value={auctionSettings.maxAuctionDuration}
                onChange={(e) => setAuctionSettings({ ...auctionSettings, maxAuctionDuration: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Phiên đấu giá tối đa {auctionSettings.maxAuctionDuration} ngày</p>
            </div>
          </div>

          <button
            onClick={handleSaveAuction}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={20} />
            Lưu cài đặt đấu giá
          </button>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign size={24} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Cài đặt thanh toán</h2>
            <p className="text-sm text-gray-600">Quản lý các phương thức thanh toán</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries({
            enablePayPal: 'PayPal',
            enableCard: 'Thẻ tín dụng/ghi nợ',
            enableBankTransfer: 'Chuyển khoản ngân hàng',
            enableVNPay: 'VNPay',
            enableMomo: 'Momo',
          }).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900">{label}</span>
                {!paymentSettings[key as keyof typeof paymentSettings] && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Tắt</span>
                )}
              </div>
              <input
                type="checkbox"
                checked={paymentSettings[key as keyof typeof paymentSettings]}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, [key]: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          ))}

          <button
            onClick={handleSavePayment}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save size={20} />
            Lưu cài đặt thanh toán
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Bell size={24} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Cài đặt thông báo</h2>
            <p className="text-sm text-gray-600">Quản lý các kênh và loại thông báo</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Notification Channels */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Kênh thông báo</h3>
            <div className="space-y-3">
              {Object.entries({
                emailEnabled: 'Email',
                smsEnabled: 'SMS',
                pushEnabled: 'Push Notification',
              }).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    {key === 'emailEnabled' && <Mail size={18} className="text-gray-600" />}
                    {key === 'smsEnabled' && <Bell size={18} className="text-gray-600" />}
                    {key === 'pushEnabled' && <Bell size={18} className="text-gray-600" />}
                    <span className="font-medium text-gray-900">{label}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings[key as keyof typeof notificationSettings]}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Notification Types */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Loại thông báo</h3>
            <div className="space-y-3">
              {Object.entries({
                notifyNewBid: 'Có người đặt giá mới',
                notifyWinning: 'Thắng đấu giá',
                notifyPayment: 'Thanh toán thành công',
                notifyShipping: 'Cập nhật vận chuyển',
              }).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-gray-900">{label}</span>
                  <input
                    type="checkbox"
                    checked={notificationSettings[key as keyof typeof notificationSettings]}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleSaveNotification}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Save size={20} />
            Lưu cài đặt thông báo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
