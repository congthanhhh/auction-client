import { useState, useEffect } from 'react';
import { Activity, Search, Shield, User, Package, XCircle, CheckCircle, Settings, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { auditLogService } from '@/services/auditLogService';
import type { AuditLog, LogActionType } from '@/types/auditLog';
import { LogAction } from '@/types/auditLog';
import Pagination from '@/components/ui/pagination';

const AdminLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);

  // Fetch logs
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await auditLogService.getLogs(currentPage, pageSize);
      setLogs(response.data.data);
      setFilteredLogs(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể tải danh sách logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, pageSize]);

  // Search filter
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLogs(logs);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = logs.filter(
        (log) =>
          log.adminUsername.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.targetId?.toLowerCase().includes(query) ||
          log.content?.toLowerCase().includes(query)
      );
      setFilteredLogs(filtered);
    }
  }, [searchQuery, logs]);

  // Get action label in Vietnamese
  const getActionLabel = (action: LogActionType): string => {
    const labels: Record<LogActionType, string> = {
      [LogAction.UPDATE_SYSTEM_CONFIG]: 'Cập nhật cấu hình hệ thống',
      [LogAction.RESOLVE_DISPUTE]: 'Giải quyết khiếu nại',
      [LogAction.LOCK_USER]: 'Khóa người dùng',
      [LogAction.UNLOCK_USER]: 'Mở khóa người dùng',
      [LogAction.VERIFY_PRODUCT]: 'Duyệt sản phẩm',
      [LogAction.REJECT_PRODUCT]: 'Từ chối sản phẩm',
      [LogAction.DISABLE_PRODUCT]: 'Vô hiệu hóa sản phẩm',
      [LogAction.ENABLE_PRODUCT]: 'Kích hoạt sản phẩm',
    };
    return labels[action] || action;
  };

  // Get icon and color for action
  const getActionStyle = (action: LogActionType): { icon: any; color: string; bgColor: string } => {
    switch (action) {
      case LogAction.UPDATE_SYSTEM_CONFIG:
        return { icon: Settings, color: 'text-blue-600', bgColor: 'bg-blue-50' };
      case LogAction.RESOLVE_DISPUTE:
        return { icon: Shield, color: 'text-purple-600', bgColor: 'bg-purple-50' };
      case LogAction.LOCK_USER:
        return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' };
      case LogAction.UNLOCK_USER:
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' };
      case LogAction.VERIFY_PRODUCT:
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' };
      case LogAction.REJECT_PRODUCT:
        return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' };
      case LogAction.DISABLE_PRODUCT:
        return { icon: AlertTriangle, color: 'text-orange-600', bgColor: 'bg-orange-50' };
      case LogAction.ENABLE_PRODUCT:
        return { icon: Package, color: 'text-green-600', bgColor: 'bg-green-50' };
      default:
        return { icon: Activity, color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nhật ký Admin</h1>
        <p className="text-gray-600 mt-1">Theo dõi hoạt động của quản trị viên trong hệ thống</p>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-700">Tổng số logs</p>
            <p className="text-2xl font-bold text-blue-900">{totalElements}</p>
          </div>
          <Activity className="text-blue-500" size={32} />
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo admin, hành động, hoặc nội dung..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Logs List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <Activity className="mx-auto text-gray-400" size={48} />
          <p className="text-gray-500 mt-4">Không tìm thấy logs nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const actionStyle = getActionStyle(log.action);
            const Icon = actionStyle.icon;

            return (
              <div
                key={log.id}
                className={`bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${actionStyle.bgColor} flex items-center justify-center`}>
                    <Icon className={actionStyle.color} size={24} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${actionStyle.bgColor} ${actionStyle.color}`}>
                          {getActionLabel(log.action)}
                        </span>
                        <div className="flex items-center gap-2 text-sm">
                          <User size={14} className="text-gray-400" />
                          <span className="font-semibold text-gray-900">{log.adminUsername}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{formatDate(log.createdAt)}</span>
                    </div>

                    {/* Target ID */}
                    {log.targetId && (
                      <div className="mb-2">
                        <span className="text-xs text-gray-600">
                          Target ID: <span className="font-mono font-semibold text-gray-900">#{log.targetId}</span>
                        </span>
                      </div>
                    )}

                    {/* Content/Description */}
                    {log.content && (
                      <p className="text-sm text-gray-700 leading-relaxed">{log.content}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredLogs.length > 0 && totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Hiển thị {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalElements)} / {totalElements} logs
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={pageSize}
              totalItems={totalElements}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogs;
