import { useState } from 'react';
import { AlertTriangle, MessageSquare, CheckCircle, XCircle, Eye, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Dispute {
  id: number;
  orderId: string;
  complainant: string;
  respondent: string;
  productName: string;
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  images: string[];
}

const MOCK_DISPUTES: Dispute[] = [
  {
    id: 1,
    orderId: 'ORD-2024-5678',
    complainant: 'Nguyễn Văn A',
    respondent: 'Trần Thị B',
    productName: 'iPhone 15 Pro Max 256GB',
    reason: 'Sản phẩm không đúng mô tả',
    description: 'Sản phẩm nhận được có vết xước lớn ở mặt sau, trong khi mô tả ghi là mới 100%. Yêu cầu hoàn tiền.',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-12-20T10:30:00Z',
    images: ['https://via.placeholder.com/400x300', 'https://via.placeholder.com/400x300'],
  },
  {
    id: 2,
    orderId: 'ORD-2024-5679',
    complainant: 'Lê Văn C',
    respondent: 'Phạm Thị D',
    productName: 'MacBook Pro M3',
    reason: 'Giao hàng chậm trễ',
    description: 'Đã quá 7 ngày kể từ khi thanh toán nhưng vẫn chưa nhận được hàng. Người bán không phản hồi.',
    status: 'investigating',
    priority: 'medium',
    createdAt: '2024-12-19T14:20:00Z',
    images: [],
  },
  {
    id: 3,
    orderId: 'ORD-2024-5680',
    complainant: 'Vũ Thị E',
    respondent: 'Hoàng Văn F',
    productName: 'Sony A7 IV Camera',
    reason: 'Sản phẩm bị lỗi',
    description: 'Máy ảnh không lấy nét được, có vẻ bị lỗi phần cứng. Yêu cầu đổi sản phẩm hoặc hoàn tiền.',
    status: 'resolved',
    priority: 'high',
    createdAt: '2024-12-18T09:15:00Z',
    images: ['https://via.placeholder.com/400x300'],
  },
];

const AdminDisputes = () => {
  const [disputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'investigating' | 'resolved'>('all');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  const filteredDisputes = selectedStatus === 'all'
    ? disputes
    : disputes.filter(d => d.status === selectedStatus);

  const handleResolve = (disputeId: number, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      toast.success('Đã chấp nhận khiếu nại và hoàn tiền cho người mua');
    } else {
      toast.success('Đã từ chối khiếu nại');
    }
    setSelectedDispute(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'investigating':
        return 'bg-blue-100 text-blue-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-orange-100 text-orange-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý khiếu nại</h1>
        <p className="text-gray-600 mt-1">Xử lý tranh chấp giữa người mua và người bán</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Chờ xử lý</p>
              <p className="text-2xl font-bold text-yellow-900">
                {disputes.filter(d => d.status === 'pending').length}
              </p>
            </div>
            <AlertTriangle className="text-yellow-500" size={32} />
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Đang điều tra</p>
              <p className="text-2xl font-bold text-blue-900">
                {disputes.filter(d => d.status === 'investigating').length}
              </p>
            </div>
            <MessageSquare className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Đã giải quyết</p>
              <p className="text-2xl font-bold text-green-900">
                {disputes.filter(d => d.status === 'resolved').length}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">Ưu tiên cao</p>
              <p className="text-2xl font-bold text-red-900">
                {disputes.filter(d => d.priority === 'high').length}
              </p>
            </div>
            <AlertTriangle className="text-red-500" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {['all', 'pending', 'investigating', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status as any)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status === 'all' ? 'Tất cả' :
             status === 'pending' ? 'Chờ xử lý' :
             status === 'investigating' ? 'Đang điều tra' :
             'Đã giải quyết'}
          </button>
        ))}
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {filteredDisputes.map((dispute) => (
          <div key={dispute.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">#{dispute.orderId}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(dispute.status)}`}>
                    {dispute.status === 'pending' ? 'Chờ xử lý' :
                     dispute.status === 'investigating' ? 'Đang điều tra' :
                     'Đã giải quyết'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(dispute.priority)}`}>
                    {dispute.priority === 'high' ? 'Ưu tiên cao' :
                     dispute.priority === 'medium' ? 'Trung bình' :
                     'Thấp'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Khiếu nại bởi <span className="font-semibold">{dispute.complainant}</span> về <span className="font-semibold">{dispute.respondent}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">{formatDate(dispute.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedDispute(dispute)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye size={18} />
                Xem chi tiết
              </button>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-600">Sản phẩm</p>
                  <p className="font-semibold">{dispute.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lý do</p>
                  <p className="font-semibold text-red-600">{dispute.reason}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Mô tả</p>
                <p className="text-gray-900">{dispute.description}</p>
              </div>
              {dispute.images.length > 0 && (
                <div className="mt-3 flex gap-2">
                  <ImageIcon size={16} className="text-gray-500 mt-1" />
                  <span className="text-sm text-gray-600">{dispute.images.length} ảnh đính kèm</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedDispute && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          onClick={() => setSelectedDispute(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Chi tiết khiếu nại</h2>
                  <p className="text-red-100 text-sm mt-1">#{selectedDispute.orderId}</p>
                </div>
                <button
                  onClick={() => setSelectedDispute(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Người khiếu nại</p>
                  <p className="font-bold text-gray-900">{selectedDispute.complainant}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Người bị khiếu nại</p>
                  <p className="font-bold text-gray-900">{selectedDispute.respondent}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Sản phẩm</p>
                  <p className="font-bold text-gray-900">{selectedDispute.productName}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Thời gian</p>
                  <p className="font-bold text-gray-900">{formatDate(selectedDispute.createdAt)}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-sm text-red-700 mb-1">Lý do khiếu nại</p>
                <p className="font-bold text-red-900">{selectedDispute.reason}</p>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Mô tả chi tiết</p>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedDispute.description}</p>
              </div>

              {/* Images */}
              {selectedDispute.images.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-3">Hình ảnh bằng chứng</p>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedDispute.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedDispute.status !== 'resolved' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleResolve(selectedDispute.id, 'approve')}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Chấp nhận khiếu nại
                  </button>
                  <button
                    onClick={() => handleResolve(selectedDispute.id, 'reject')}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} />
                    Từ chối khiếu nại
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDisputes;
