import { useNavigate, useLocation } from 'react-router-dom';
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
} from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from './page-layout';

// Mock invoice data
const MOCK_INVOICE = {
  invoiceNumber: 'INV-2024-001234',
  orderNumber: 'ORD-2024-5678',
  issueDate: '2024-12-20T10:30:00Z',
  paymentDate: '2024-12-20T10:35:00Z',
  status: 'PAID',
  
  company: {
    name: 'Auction Website',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    phone: '(028) 1234 5678',
    email: 'support@auction.vn',
    taxCode: '0123456789',
  },
  
  buyer: {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0912345678',
    address: '456 Đường XYZ, Quận 7, TP.HCM',
  },
  
  seller: {
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    phone: '0901234567',
    address: '123 Đường ABC, Quận 1, TP.HCM',
  },
  
  product: {
    id: 1,
    name: 'iPad Air M2 11 inch',
    imageUrl: 'https://via.placeholder.com/120',
    description: 'Chip M2, 128GB, WiFi',
    quantity: 1,
    price: 15000000,
  },
  
  payment: {
    method: 'PayPal',
    transactionId: 'TXN-2024-ABC123XYZ',
    shippingFee: 30000,
    serviceFee: 250000,
    subtotal: 15000000,
    total: 15280000,
  },
};

const Invoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // In real app, get from location.state or API
  const invoice = location.state?.invoice || MOCK_INVOICE;

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

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Actions - Hide on print */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download size={18} />
              Tải PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors"
            >
              <Printer size={18} />
              In hóa đơn
            </button>
          </div>
        </div>

        {/* Invoice Container */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden print:shadow-none">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">HÓA ĐƠN</h1>
                <p className="text-blue-100 text-sm">Hóa đơn thanh toán đấu giá</p>
              </div>
              <div className="text-right">
                <div className="bg-white/20 px-4 py-2 rounded-lg inline-flex items-center gap-2 mb-2">
                  <CheckCircle size={20} />
                  <span className="font-semibold">Đã thanh toán</span>
                </div>
                <p className="text-blue-100 text-sm">Mã: {invoice.invoiceNumber}</p>
              </div>
            </div>
          </div>

          {/* Company & Order Info */}
          <div className="grid md:grid-cols-2 gap-6 px-8 py-6 border-b">
            {/* Company Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Building size={18} className="text-blue-600" />
                Thông tin công ty
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-bold text-lg text-gray-900">{invoice.company.name}</p>
                <p className="flex items-start gap-2">
                  <MapPin size={14} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  {invoice.company.address}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-500" />
                  {invoice.company.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-500" />
                  {invoice.company.email}
                </p>
                <p className="text-gray-600">Mã số thuế: {invoice.company.taxCode}</p>
              </div>
            </div>

            {/* Order Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package size={18} className="text-blue-600" />
                Chi tiết đơn hàng
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-semibold text-gray-900">{invoice.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="text-gray-900">{formatDate(invoice.issueDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày thanh toán:</span>
                  <span className="text-gray-900">{formatDate(invoice.paymentDate)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    <CheckCircle size={14} />
                    Đã thanh toán
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Buyer & Seller Info */}
          <div className="grid md:grid-cols-2 gap-6 px-8 py-6 bg-gray-50">
            {/* Buyer */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                Người mua
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">{invoice.buyer.name}</p>
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-500" />
                  {invoice.buyer.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-500" />
                  {invoice.buyer.phone}
                </p>
                <p className="flex items-start gap-2">
                  <MapPin size={14} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  {invoice.buyer.address}
                </p>
              </div>
            </div>

            {/* Seller */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                Người bán
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">{invoice.seller.name}</p>
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-500" />
                  {invoice.seller.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-500" />
                  {invoice.seller.phone}
                </p>
                <p className="flex items-start gap-2">
                  <MapPin size={14} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  {invoice.seller.address}
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
