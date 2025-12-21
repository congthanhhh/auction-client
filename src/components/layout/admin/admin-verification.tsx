import { useState } from 'react';
import { Shield, CheckCircle, XCircle, Image as ImageIcon, FileText, User } from 'lucide-react';
import { toast } from 'sonner';

interface VerificationRequest {
  id: number;
  userId: number;
  userName: string;
  email: string;
  type: 'identity' | 'business' | 'seller';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  documents: {
    idFront: string;
    idBack: string;
    selfie?: string;
    businessLicense?: string;
  };
  personalInfo: {
    fullName: string;
    idNumber: string;
    dateOfBirth: string;
    address: string;
  };
}

const MOCK_VERIFICATIONS: VerificationRequest[] = [
  {
    id: 1,
    userId: 101,
    userName: 'nguyenvana',
    email: 'nguyenvana@email.com',
    type: 'identity',
    status: 'pending',
    submittedAt: '2024-12-20T10:30:00Z',
    documents: {
      idFront: 'https://via.placeholder.com/400x250',
      idBack: 'https://via.placeholder.com/400x250',
      selfie: 'https://via.placeholder.com/400x250',
    },
    personalInfo: {
      fullName: 'Nguyễn Văn A',
      idNumber: '001234567890',
      dateOfBirth: '01/01/1990',
      address: '123 Đường ABC, Quận 1, TP.HCM',
    },
  },
  {
    id: 2,
    userId: 102,
    userName: 'tranthib',
    email: 'tranthib@email.com',
    type: 'seller',
    status: 'pending',
    submittedAt: '2024-12-19T14:20:00Z',
    documents: {
      idFront: 'https://via.placeholder.com/400x250',
      idBack: 'https://via.placeholder.com/400x250',
    },
    personalInfo: {
      fullName: 'Trần Thị B',
      idNumber: '009876543210',
      dateOfBirth: '15/05/1988',
      address: '456 Đường XYZ, Quận 7, TP.HCM',
    },
  },
  {
    id: 3,
    userId: 103,
    userName: 'levanc',
    email: 'levanc@email.com',
    type: 'business',
    status: 'approved',
    submittedAt: '2024-12-18T09:15:00Z',
    documents: {
      idFront: 'https://via.placeholder.com/400x250',
      idBack: 'https://via.placeholder.com/400x250',
      businessLicense: 'https://via.placeholder.com/400x250',
    },
    personalInfo: {
      fullName: 'Lê Văn C',
      idNumber: '001122334455',
      dateOfBirth: '20/08/1985',
      address: '789 Đường DEF, Quận 3, TP.HCM',
    },
  },
];

const AdminVerification = () => {
  const [verifications] = useState<VerificationRequest[]>(MOCK_VERIFICATIONS);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);

  const filteredVerifications = selectedStatus === 'all'
    ? verifications
    : verifications.filter(v => v.status === selectedStatus);

  const handleApprove = (verificationId: number) => {
    toast.success('Đã phê duyệt yêu cầu xác minh!');
    setSelectedVerification(null);
  };

  const handleReject = (verificationId: number) => {
    toast.error('Đã từ chối yêu cầu xác minh!');
    setSelectedVerification(null);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'identity':
        return 'Xác minh danh tính';
      case 'seller':
        return 'Xác minh người bán';
      case 'business':
        return 'Xác minh doanh nghiệp';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
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
        <h1 className="text-3xl font-bold text-gray-900">Xác minh người dùng</h1>
        <p className="text-gray-600 mt-1">Phê duyệt yêu cầu xác minh danh tính và tài liệu</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700">Chờ xử lý</p>
              <p className="text-2xl font-bold text-yellow-900">
                {verifications.filter(v => v.status === 'pending').length}
              </p>
            </div>
            <Shield className="text-yellow-500" size={32} />
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Đã phê duyệt</p>
              <p className="text-2xl font-bold text-green-900">
                {verifications.filter(v => v.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700">Đã từ chối</p>
              <p className="text-2xl font-bold text-red-900">
                {verifications.filter(v => v.status === 'rejected').length}
              </p>
            </div>
            <XCircle className="text-red-500" size={32} />
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Tổng yêu cầu</p>
              <p className="text-2xl font-bold text-blue-900">{verifications.length}</p>
            </div>
            <FileText className="text-blue-500" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
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
             status === 'approved' ? 'Đã duyệt' :
             'Đã từ chối'}
          </button>
        ))}
      </div>

      {/* Verifications List */}
      <div className="space-y-4">
        {filteredVerifications.map((verification) => (
          <div key={verification.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{verification.personalInfo.fullName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(verification.status)}`}>
                    {verification.status === 'pending' ? 'Chờ xử lý' :
                     verification.status === 'approved' ? 'Đã phê duyệt' :
                     'Đã từ chối'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    @{verification.userName}
                  </span>
                  <span>•</span>
                  <span>{verification.email}</span>
                  <span>•</span>
                  <span className="font-semibold text-blue-600">{getTypeLabel(verification.type)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Gửi lúc: {formatDate(verification.submittedAt)}</p>
              </div>
              <button
                onClick={() => setSelectedVerification(verification)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xem chi tiết
              </button>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">CMND/CCCD</p>
                  <p className="font-semibold">{verification.personalInfo.idNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Ngày sinh</p>
                  <p className="font-semibold">{verification.personalInfo.dateOfBirth}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Địa chỉ</p>
                  <p className="font-semibold">{verification.personalInfo.address}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedVerification && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          onClick={() => setSelectedVerification(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Chi tiết xác minh</h2>
                  <p className="text-blue-100 text-sm mt-1">{selectedVerification.personalInfo.fullName}</p>
                </div>
                <button
                  onClick={() => setSelectedVerification(null)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-3">Thông tin cá nhân</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Họ tên</p>
                    <p className="font-semibold">{selectedVerification.personalInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CMND/CCCD</p>
                    <p className="font-semibold">{selectedVerification.personalInfo.idNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày sinh</p>
                    <p className="font-semibold">{selectedVerification.personalInfo.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Loại xác minh</p>
                    <p className="font-semibold text-blue-600">{getTypeLabel(selectedVerification.type)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Địa chỉ</p>
                    <p className="font-semibold">{selectedVerification.personalInfo.address}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <ImageIcon size={20} className="text-blue-600" />
                  Tài liệu đính kèm
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">CMND/CCCD mặt trước</p>
                    <img
                      src={selectedVerification.documents.idFront}
                      alt="ID Front"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">CMND/CCCD mặt sau</p>
                    <img
                      src={selectedVerification.documents.idBack}
                      alt="ID Back"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                  {selectedVerification.documents.selfie && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Ảnh chân dung</p>
                      <img
                        src={selectedVerification.documents.selfie}
                        alt="Selfie"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                  {selectedVerification.documents.businessLicense && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Giấy phép kinh doanh</p>
                      <img
                        src={selectedVerification.documents.businessLicense}
                        alt="Business License"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {selectedVerification.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(selectedVerification.id)}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Phê duyệt
                  </button>
                  <button
                    onClick={() => handleReject(selectedVerification.id)}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} />
                    Từ chối
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

export default AdminVerification;
