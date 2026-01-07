import { useState, useEffect } from 'react';
import { Settings, DollarSign, Mail, Bell, Save, RefreshCw, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';
import { systemParameterService } from '@/services/systemParameterService';
import type { SystemParameter } from '@/types/systemParameter';
import { SystemConfigKey } from '@/types/systemParameter';

const AdminSettings = () => {
  const [settings, setSettings] = useState<SystemParameter[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [editEnabled, setEditEnabled] = useState(false);

  // Editable values
  const [editValues, setEditValues] = useState<Record<string, string>>({});

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

  // Fetch all settings
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await systemParameterService.getAllSettings();
      setSettings(response.data);

      // Initialize edit values
      const initialValues: Record<string, string> = {};
      response.data.forEach((setting) => {
        initialValues[setting.paramKey] = setting.paramValue;
      });
      setEditValues(initialValues);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể tải cài đặt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update a setting
  const handleUpdateSetting = async (key: string) => {
    const value = editValues[key];
    if (!value) {
      toast.error('Vui lòng nhập giá trị');
      return;
    }

    setUpdating(key);
    try {
      await systemParameterService.updateSetting(key, value);
      toast.success('Đã cập nhật cài đặt thành công');
      fetchSettings(); // Refresh to get updated values
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật cài đặt');
    } finally {
      setUpdating(null);
    }
  };

  const handleSavePayment = () => {
    toast.success('Đã lưu cài đặt thanh toán!');
  };

  const handleSaveNotification = () => {
    toast.success('Đã lưu cài đặt thông báo!');
  };

  // Get setting value by key
  const getSettingValue = (key: string): string => {
    return editValues[key] || '';
  };

  // Get setting description by key
  const getSettingDescription = (key: string): string => {
    const setting = settings.find((s) => s.paramKey === key);
    return setting?.description || '';
  };

  // Get setting display info
  const getSettingInfo = (key: string): { label: string; unit: string; description: string } => {
    switch (key) {
      case SystemConfigKey.LISTING_FEE_PERCENT:
        return {
          label: 'Phí đăng sản phẩm',
          unit: '%',
          description: 'Phần trăm phí thu khi đăng sản phẩm lên hệ thống',
        };
      case SystemConfigKey.INVOICE_PAYMENT_DUE_DAYS:
        return {
          label: 'Thời hạn thanh toán hóa đơn',
          unit: 'ngày',
          description: 'Số ngày người mua phải thanh toán sau khi thắng đấu giá',
        };
      case SystemConfigKey.INVOICE_AUTO_COMPLETED_DAYS:
        return {
          label: 'Tự động hoàn thành đơn hàng',
          unit: 'ngày',
          description: 'Số ngày tự động chuyển trạng thái đơn hàng sang hoàn thành sau khi giao',
        };
      default:
        return { label: key, unit: '', description: getSettingDescription(key) };
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Đang tải cài đặt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
        <p className="text-gray-600 mt-1">Tùy chỉnh các thông số hoạt động của nền tảng</p>
      </div>

      {/* System Parameters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Settings size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Cài đặt hệ thống</h2>
              <p className="text-sm text-gray-600">Các thông số cấu hình chính của hệ thống</p>
            </div>
          </div>
          <button
            onClick={() => setEditEnabled(!editEnabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${editEnabled
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {editEnabled ? (
              <>
                <Unlock size={18} />
                Đang mở khóa
              </>
            ) : (
              <>
                <Lock size={18} />
                Đã khóa
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {Object.values(SystemConfigKey).map((key) => {
            const info = getSettingInfo(key);
            const value = getSettingValue(key);
            const isUpdating = updating === key;

            return (
              <div key={key} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {info.label}
                  {info.unit && <span className="text-gray-500 ml-1">({info.unit})</span>}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setEditValues({ ...editValues, [key]: e.target.value })}
                    disabled={!editEnabled || isUpdating}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Nhập giá trị..."
                  />
                  <button
                    onClick={() => handleUpdateSetting(key)}
                    disabled={!editEnabled || isUpdating || !value}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Cập nhật
                      </>
                    )}
                  </button>
                </div>
                {info.description && (
                  <p className="text-xs text-gray-500 mt-1">{info.description}</p>
                )}
              </div>
            );
          })}
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
