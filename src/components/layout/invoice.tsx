import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Printer,
  CheckCircle,
  Calendar,
  CreditCard,
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  Building,
  Truck,
  PackageCheck,
  Copy,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from './page-layout';
import { invoiceService } from '@/services/invoiceService';
import type { InvoiceResponse } from '@/types/invoice';

// Tracking timeline steps (4 steps as per requirement)
interface TrackingStep {
  id: number;
  label: string;
  date?: string;
  completed: boolean;
}

const Invoice = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams<{ invoiceId: string }>();

  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceId) {
        toast.error('Không tìm thấy ID hóa đơn');
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        const response = await invoiceService.getInvoiceById(Number(invoiceId));
        setInvoice(response.data);
      } catch (error: any) {
        console.error('Error fetching invoice:', error);
        toast.error(error.response?.data?.message || 'Không thể tải thông tin hóa đơn');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
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

  const handlePrint = () => {
    window.print();
    toast.success('Đang chuẩn bị in hóa đơn...');
  };

  const handleDownload = () => {
    toast.success('Đang tải hóa đơn PDF...');
    // In real app, generate and download PDF
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Đã thanh toán';
      case 'PENDING':
        return 'Chờ thanh toán';
      case 'OVERDUE':
        return 'Quá hạn';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Đang tải hóa đơn...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!invoice) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-600">Không tìm thấy hóa đơn</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Actions - Hide on print */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 md:mb-8 print:hidden">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm md:text-base">Quay lại</span>
          </button>

          <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm md:text-base"
            >
              <Download size={16} className="md:w-5 md:h-5" />
              <span>Tải PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors text-sm md:text-base"
            >
              <Printer size={16} className="md:w-5 md:h-5" />
              <span>In hóa đơn</span>
            </button>
          </div>
        </div>

        {/* Invoice Container */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden print:shadow-none">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 md:px-8 py-4 md:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">HÓA ĐƠN</h1>
                <p className="text-blue-100 text-xs md:text-sm">Hóa đơn thanh toán đấu giá</p>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto">
                <div className={`px-3 md:px-4 py-2 rounded-lg inline-flex items-center gap-2 mb-2 ${getStatusColor(invoice.status)}`}>
                  <CheckCircle size={18} className="md:w-5 md:h-5" />
                  <span className="font-semibold text-sm md:text-base">{getStatusText(invoice.status)}</span>
                </div>
                <p className="text-blue-100 text-xs md:text-sm">Mã: INV-{invoice.id}</p>
              </div>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4 sm:px-6 md:px-8 py-4 md:py-6 border-b">
            {/* Invoice Details */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm md:text-base">
                <Package size={16} className="text-blue-600 md:w-5 md:h-5" />
                Chi tiết hóa đơn
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã hóa đơn:</span>
                  <span className="font-semibold text-gray-900">INV-{invoice.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã phiên đấu giá:</span>
                  <span className="font-semibold text-gray-900">AUC-{invoice.auctionSessionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="text-gray-900">{formatDate(invoice.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hạn thanh toán:</span>
                  <span className="text-gray-900">{formatDate(invoice.dueDate)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                    <CheckCircle size={14} />
                    {getStatusText(invoice.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm md:text-base">
                <User size={16} className="text-blue-600 md:w-5 md:h-5" />
                Thông tin người mua
              </h3>
              <div className="space-y-2 text-xs md:text-sm text-gray-700">
                <p className="font-semibold text-gray-900">
                  {invoice.user.firstName} {invoice.user.lastName}
                </p>
                <p className="flex items-center gap-2">
                  <User size={14} className="text-gray-500" />
                  @{invoice.user.username}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-500" />
                  {invoice.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="px-8 py-6">
            <h3 className="font-semibold text-gray-900 mb-4">Chi tiết sản phẩm</h3>

            <div className="border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-100 grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold text-gray-700">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Đơn giá</div>
                <div className="col-span-2 text-right">Thành tiền</div>
              </div>

              {/* Product Row */}
              <div className="grid grid-cols-12 gap-4 px-4 py-4 items-center border-t">
                <div className="col-span-6 flex items-center gap-3">
                  <img
                    src={invoice.product.imageUrl}
                    alt={invoice.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{invoice.product.name}</p>
                    <p className="text-sm text-gray-500">{invoice.product.description}</p>
                  </div>
                </div>
                <div className="col-span-2 text-center text-gray-900">
                  {invoice.product.quantity}
                </div>
                <div className="col-span-2 text-right text-gray-900">
                  {formatPrice(invoice.product.price)}
                </div>
                <div className="col-span-2 text-right font-semibold text-gray-900">
                  {formatPrice(invoice.product.price * invoice.product.quantity)}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="px-8 py-6 bg-gray-50">
            <div className="max-w-md ml-auto space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Tạm tính:</span>
                <span className="font-semibold">{formatPrice(invoice.payment.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold">{formatPrice(invoice.payment.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Phí dịch vụ:</span>
                <span className="font-semibold">{formatPrice(invoice.payment.serviceFee)}</span>
              </div>
              <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(invoice.payment.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="px-8 py-6 border-t">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-blue-600" />
              Phương thức thanh toán
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{invoice.payment.method}</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
                  <CheckCircle size={14} />
                  Thành công
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Mã giao dịch: <span className="font-mono font-semibold">{invoice.payment.transactionId}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Thanh toán đã được xác nhận vào {formatDate(invoice.paymentDate)}
              </p>
            </div>
          </div>

          {/* Shipping Tracking Section */}
          {invoice.trackingCode && (
            <div className="px-8 py-6 border-t bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck size={20} className="text-blue-600" />
                Thông tin vận chuyển
              </h3>

              {/* Tracking Code */}
              <div className="bg-white border-2 border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mã vận đơn</p>
                    <p className="text-lg font-bold text-gray-900 font-mono">
                      {invoice.trackingCode}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      Đơn vị vận chuyển: <span className="font-semibold">{invoice.shippingCarrier}</span>
                    </p>
                  </div>
                  <button
                    onClick={copyTrackingCode}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    title="Sao chép mã vận đơn"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>

              {/* Tracking Timeline - 4 Steps */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-6">Tiến trình giao hàng</h4>

                {/* Progress Bar */}
                <div className="relative mb-8">
                  {/* Connection Line */}
                  <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{
                        width: `${((invoice.trackingTimeline.filter(s => s.completed).length - 1) / (invoice.trackingTimeline.length - 1)) * 100}%`
                      }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {invoice.trackingTimeline.map((step) => (
                      <div key={step.id} className="flex flex-col items-center" style={{ flex: 1 }}>
                        {/* Circle */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${step.completed
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                            } shadow-lg transition-all duration-300`}
                        >
                          {step.completed ? (
                            <CheckCircle size={20} />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                          )}
                        </div>

                        {/* Label */}
                        <div className="mt-3 text-center">
                          <p className={`text-sm font-semibold whitespace-nowrap ${step.completed ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                            {step.label}
                          </p>
                          {step.date && (
                            <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">
                              {step.date}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <PackageCheck className="text-green-600" size={20} />
                  <span className="text-sm font-semibold text-green-700">
                    {invoice.shippingStatus === 'delivered' ? 'Đã giao hàng thành công' :
                      invoice.shippingStatus === 'out_for_delivery' ? 'Đang giao hàng' :
                        invoice.shippingStatus === 'in_transit' ? 'Đang vận chuyển' :
                          'Đã tiếp nhận'}
                  </span>
                </div>
              </div>

              {/* Shipping Note */}
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">📦 Lưu ý:</span> Người bán đã gửi hàng cho đơn vị vận chuyển.
                  Mọi thắc mắc về giao hàng vui lòng liên hệ trực tiếp với đơn vị vận chuyển.
                  Phí ship được thỏa thuận giữa người mua và người bán.
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-100 border-t">
            <div className="text-center text-sm text-gray-600 space-y-2">
              <p className="font-semibold text-gray-900">Cảm ơn bạn đã sử dụng dịch vụ!</p>
              <p>
                Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ:{' '}
                <a href={`mailto:${invoice.company.email}`} className="text-blue-600 hover:underline">
                  {invoice.company.email}
                </a>
                {' '}hoặc{' '}
                <a href={`tel:${invoice.company.phone}`} className="text-blue-600 hover:underline">
                  {invoice.company.phone}
                </a>
              </p>
              <p className="text-xs text-gray-500 pt-2">
                Hóa đơn này được tạo tự động bởi hệ thống và có giá trị pháp lý
              </p>
            </div>
          </div>
        </div>

        {/* Help Text - Hide on print */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl print:hidden">
          <p className="text-sm text-blue-800">
            💡 <span className="font-semibold">Lưu ý:</span> Bạn có thể tải hóa đơn dưới dạng PDF
            hoặc in trực tiếp từ trình duyệt. Hóa đơn này có giá trị thanh toán và giải quyết tranh chấp.
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </PageLayout>
  );
};

export default Invoice;
