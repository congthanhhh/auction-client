import { useState } from "react";
import { Bell, Check, CheckCheck, Filter } from "lucide-react";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import PageLayout from "./page-layout";
import { useNavigate } from "react-router-dom";
import { notificationService } from "@/services/notificationService";
import type { NotificationResponse } from "@/types/common";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useNotificationStore();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(false);

  // Filter notifications based on selected filter
  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

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

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const handleNotificationClick = async (notif: NotificationResponse) => {
    // Đánh dấu đã đọc
    if (!notif.isRead) {
      await markAsRead(notif.id);
    }

    // Navigate nếu có link
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await notificationService.markAllAsRead();
      // Reload notifications
      const res = await notificationService.getMyNotifications(1, 50);
      useNotificationStore.setState({
        notifications: res.data.data,
        unreadCount: 0,
      });
    } catch (error) {
      console.error("Lỗi đánh dấu tất cả đã đọc:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Thông báo
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {unreadCount > 0
                      ? `${unreadCount} thông báo chưa đọc`
                      : "Không có thông báo mới"}
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Đánh dấu tất cả đã đọc</span>
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2 mt-6 border-t border-gray-100 pt-4">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 font-medium">Lọc:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === "all"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Tất cả ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === "unread"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Chưa đọc ({unreadCount})
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {filter === "unread"
                    ? "Không có thông báo chưa đọc"
                    : "Chưa có thông báo nào"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {filter === "unread"
                    ? "Tất cả thông báo đã được đọc"
                    : "Bạn sẽ nhận được thông báo khi có hoạt động mới"}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif, index) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`bg-white rounded-xl shadow-sm border transition-all cursor-pointer group ${
                    !notif.isRead
                      ? "border-blue-200 bg-blue-50/30 hover:bg-blue-50/50"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                  style={{
                    animation: `fadeIn 0.3s ease-in ${index * 0.05}s both`,
                  }}
                >
                  <div className="p-5">
                    <div className="flex items-start space-x-4">
                      {/* Status Indicator */}
                      <div className="flex-shrink-0 mt-1">
                        {!notif.isRead ? (
                          <div className="w-3 h-3 bg-blue-600 rounded-full ring-4 ring-blue-100 animate-pulse" />
                        ) : (
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm sm:text-base leading-relaxed ${
                            !notif.isRead
                              ? "text-gray-900 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {notif.message}
                        </p>

                        <div className="flex items-center space-x-3 mt-2">
                          <span className="text-xs text-gray-500 font-medium">
                            {formatTimeAgo(notif.createdAt)}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">
                            {formatDateTime(notif.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Arrow indicator on hover */}
                      {notif.link && (
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More (if needed for pagination in future) */}
          {filteredNotifications.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Hiển thị {filteredNotifications.length} thông báo
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </PageLayout>
  );
};

export default NotificationsPage;
