// src/components/layout/invoice.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Loader2
} from 'lucide-react';
import { invoiceService } from '@/services/invoiceService';
import type { InvoiceResponse } from '@/types/invoice';
import Header from './header';
import Footer from './footer';

interface InvoiceProps {
  invoiceId?: string | number;
}

const Invoice = ({ invoiceId: propInvoiceId }: InvoiceProps) => {
  const { orderId } = useParams<{ orderId: string }>();
  const invoiceId = propInvoiceId || orderId;

  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await invoiceService.getInvoiceById(Number(invoiceId));
        setInvoice(response.data);
      } catch (err: any) {
        console.error('Error fetching invoice:', err);
        setError(err.response?.data?.message || 'Không thể tải thông tin hóa đơn');
      } finally {
        setIsLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: { label: 'Chờ thanh toán', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: Clock },
      PAID: { label: 'Đã thanh toán', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: CreditCard },
      SHIPPING: { label: 'Đang giao hàng', color: 'text-purple-600 bg-purple-50 border-purple-200', icon: Truck },
      COMPLETED: { label: 'Hoàn thành', color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle },
      CANCELLED_NON_PAYMENT: { label: 'Đã hủy - Chưa thanh toán', color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle },
      CANCELLED_BY_SELLER: { label: 'Đã hủy bởi người bán', color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle },
      DISPUTE: { label: 'Tranh chấp', color: 'text-orange-600 bg-orange-50 border-orange-200', icon: AlertCircle },
      REFUNDED: { label: 'Đã hoàn tiền', color: 'text-gray-600 bg-gray-50 border-gray-200', icon: FileText },
    };
    return configs[status as keyof typeof configs] || configs.PENDING;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-gray-600">{error || 'Không tìm thấy hóa đơn'}</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(invoice.status);
  const StatusIcon = statusConfig.icon;
  const mainImage = invoice.product.images[0]?.url || 'https://via.placeholder.com/400';
  const fullName = `${invoice.user.firstName} ${invoice.user.lastName}`.trim();

  // Nếu component được dùng như page (có orderId từ URL), wrap với Header/Footer
  const isStandalonePage = !!orderId;

  const invoiceContent = (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Hóa đơn #{invoice.id}</h2>
            <p className="text-indigo-100 flex items-center gap-2">
              <FileText size={16} />
              {invoice.type === 'AUCTION_SALE' ? 'Đơn hàng đấu giá' : 'Phí đăng bán'}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${statusConfig.color}`}>
            <StatusIcon size={20} />
            <span className="font-semibold">{statusConfig.label}</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Row 1: Product Info + Shipping Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-b pb-6">
          {/* Product Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package size={20} className="text-indigo-600" />
              Thông tin sản phẩm
            </h3>
            <div className="flex gap-3">
              <img
                src={mainImage}
                alt={invoice.product.name}
                className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{invoice.product.name}</h4>
                <p className="text-xs text-gray-600 mb-1">Mã phiên: #{invoice.auctionSessionId}</p>
                <p className="text-lg font-bold text-indigo-600">{formatCurrency(invoice.finalPrice)}</p>
              </div>
            </div>
          </div>

          {/* Shipping Tracking */}
          {invoice.trackingCode ? (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Truck size={20} className="text-indigo-600" />
                Thông tin vận chuyển
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-blue-600" />
                    <p className="text-sm font-semibold text-blue-800">Đơn vị vận chuyển</p>
                  </div>
                  <p className="text-sm text-gray-700 pl-6">
                    <span className="font-medium">{invoice.carrier}</span>
                  </p>
                  <p className="text-sm text-gray-700 pl-6">
                    <span className="font-medium">Mã vận đơn:</span> {invoice.trackingCode}
                  </p>
                  {invoice.shippedAt && (
                    <p className="text-xs text-gray-600 pl-6">
                      <span className="font-medium">Ngày gửi:</span> {formatDate(invoice.shippedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Truck size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Chưa có thông tin vận chuyển</p>
              </div>
            </div>
          )}
        </div>

        {/* Row 2: Buyer Info + Delivery Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-b pb-6">
          {/* Buyer Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-indigo-600" />
              Thông tin người mua
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User size={16} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-600">Tên người mua</p>
                  <p className="font-semibold text-gray-900 text-sm">{fullName || invoice.user.username}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900 text-sm">{invoice.user.email}</p>
                </div>
              </div>
              {invoice.user.phoneNumber && (
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600">Số điện thoại</p>
                    <p className="font-semibold text-gray-900 text-sm">{invoice.user.phoneNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          {invoice.type === 'AUCTION_SALE' && invoice.shippingAddress ? (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-indigo-600" />
                Thông tin giao hàng
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User size={16} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600">Người nhận</p>
                    <p className="font-semibold text-gray-900 text-sm">{invoice.recipientName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600">Số điện thoại</p>
                    <p className="font-semibold text-gray-900 text-sm">{invoice.recipientPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600">Địa chỉ giao hàng</p>
                    <p className="font-semibold text-gray-900 text-sm">{invoice.shippingAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MapPin size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Không có thông tin giao hàng</p>
              </div>
            </div>
          )}
        </div>
        {/* Payment Timeline */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-indigo-600" />
            Lịch sử thanh toán
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-gray-400 mt-1" />
              <div>
                <p className="text-xs text-gray-600">Ngày tạo hóa đơn</p>
                <p className="font-semibold text-gray-900 text-sm">{formatDate(invoice.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-gray-400 mt-1" />
              <div>
                <p className="text-xs text-gray-600">Hạn thanh toán</p>
                <p className="font-semibold text-gray-900 text-sm">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
            {invoice.paymentTime && (
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-600">Đã thanh toán</p>
                  <p className="font-semibold text-green-600 text-sm">{formatDate(invoice.paymentTime)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Total Amount */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-700">Tổng thanh toán</span>
            <span className="text-3xl font-bold text-indigo-600">{formatCurrency(invoice.finalPrice)}</span>
          </div>
        </div>
      </div>
    </div >
  );

  if (isStandalonePage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 mt-20 max-w-5xl">
          {invoiceContent}
        </main>
        <Footer />
      </div>
    );
  }

  return invoiceContent;
};

export default Invoice;
