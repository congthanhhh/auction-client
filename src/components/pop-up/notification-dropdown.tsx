import { Bell, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import type { NotificationResponse } from "@/types/common";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useNotificationStore();

  // Lấy 10 thông báo gần nhất
  const recentNotifications = notifications.slice(0, 10);

  const handleNotificationClick = async (notif: NotificationResponse) => {
    // Đánh dấu đã đọc
    if (!notif.isRead) {
      await markAsRead(notif.id);
    }

    // Navigate nếu có link
    if (notif.link) {
      navigate(notif.link);
    }

    onClose();
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi,
      });
    } catch {
      return "Vừa xong";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay to close dropdown when clicking outside */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-white" />
            <h3 className="text-white font-semibold text-base">Thông báo</h3>
          </div>
          {unreadCount > 0 && (
            <span className="bg-white text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {unreadCount} mới
            </span>
          )}
        </div>

        {/* Notification List */}
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {recentNotifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`px-4 py-3 cursor-pointer transition-all hover:bg-blue-50 ${
                    !notif.isRead ? "bg-blue-50/50" : "bg-white"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon indicator */}
                    <div
                      className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                        !notif.isRead ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-relaxed ${
                          !notif.isRead
                            ? "text-gray-900 font-medium"
                            : "text-gray-600"
                        }`}
                      >
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimeAgo(notif.createdAt)}
                      </p>
                    </div>

                    {/* Read indicator */}
                    {notif.isRead && (
                      <Check className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Xem tất cả (luôn hiển thị) */}
        <div className="border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              navigate("/notifications");
              onClose();
            }}
            className="w-full py-3 text-center text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-gray-100 transition-colors"
          >
            Xem tất cả thông báo
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default NotificationDropdown;
