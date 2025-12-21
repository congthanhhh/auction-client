import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CreditCard,
  Wallet,
  Building2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Lock,
  ShieldCheck,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from './page-layout';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  fee: number;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'paypal',
    name: 'PayPal',
    icon: Wallet,
    description: 'Thanh toán nhanh chóng và bảo mật',
    fee: 0,
  },
  {
    id: 'card',
    name: 'Thẻ tín dụng/Ghi nợ',
    icon: CreditCard,
    description: 'Visa, Mastercard, JCB',
    fee: 0,
  },
  {
    id: 'bank',
    name: 'Chuyển khoản ngân hàng',
    icon: Building2,
    description: 'Chuyển khoản trực tiếp',
    fee: 0,
  },
];

// Mock order data - In real app, get from route state or API
const MOCK_ORDER = {
  id: 1,
  productName: 'iPhone 15 Pro Max 256GB',
  productImage: 'https://via.placeholder.com/120',
  price: 25000000,
  seller: 'Nguyễn Văn A',
  wonAt: '2024-12-15T20:00:00Z',
  shippingFee: 30000,
  serviceFee: 250000,
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // In real app, get order from location.state
  const order = location.state?.order || MOCK_ORDER;

  const [selectedMethod, setSelectedMethod] = useState<string>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form states
  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  // Card info (for card payment)
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const calculateTotal = () => {
    const selectedPaymentMethod = PAYMENT_METHODS.find(m => m.id === selectedMethod);
    return order.price + order.shippingFee + order.serviceFee + (selectedPaymentMethod?.fee || 0);
  };

  const handlePayment = async () => {
    // Validation
    if (!billingInfo.fullName || !billingInfo.email || !billingInfo.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (selectedMethod === 'card') {
      if (!cardInfo.cardNumber || !cardInfo.cardName || !cardInfo.expiryDate || !cardInfo.cvv) {
        toast.error('Vui lòng điền đầy đủ thông tin thẻ!');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Thanh toán thành công!');
      
      // Redirect to success page or cart
      setTimeout(() => {
        navigate('/cart');
      }, 1500);
    }, 2000);
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
            <p className="text-gray-500 mt-1">Hoàn tất thanh toán để nhận sản phẩm</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Security Badge */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <ShieldCheck className="text-green-600" size={24} />
              <div>
                <p className="font-semibold text-green-900">Thanh toán an toàn & bảo mật</p>
                <p className="text-sm text-green-700">Thông tin của bạn được mã hóa SSL 256-bit</p>
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={24} className="text-yellow-600" />
                Thông tin thanh toán
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={billingInfo.fullName}
                    onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline mr-1" size={16} />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline mr-1" size={16} />
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={billingInfo.phone}
                    onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                    placeholder="0912345678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline mr-1" size={16} />
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={billingInfo.address}
                    onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                    placeholder="123 Đường ABC, Quận XYZ"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thành phố
                  </label>
                  <input
                    type="text"
                    value={billingInfo.city}
                    onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                    placeholder="TP. Hồ Chí Minh"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã bưu điện
                  </label>
                  <input
                    type="text"
                    value={billingInfo.zipCode}
                    onChange={(e) => setBillingInfo({ ...billingInfo, zipCode: e.target.value })}
                    placeholder="70000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Wallet size={24} className="text-yellow-600" />
                Phương thức thanh toán
              </h2>

              <div className="space-y-3 mb-6">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
                        selectedMethod === method.id
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          selectedMethod === method.id ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        {selectedMethod === method.id && (
                          <CheckCircle className="text-yellow-600" size={24} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Card Details (if card payment selected) */}
              {selectedMethod === 'card' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-4">Thông tin thẻ</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số thẻ
                    </label>
                    <input
                      type="text"
                      value={cardInfo.cardNumber}
                      onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên trên thẻ
                    </label>
                    <input
                      type="text"
                      value={cardInfo.cardName}
                      onChange={(e) => setCardInfo({ ...cardInfo, cardName: e.target.value })}
                      placeholder="NGUYEN VAN A"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline mr-1" size={16} />
                        Ngày hết hạn
                      </label>
                      <input
                        type="text"
                        value={cardInfo.expiryDate}
                        onChange={(e) => setCardInfo({ ...cardInfo, expiryDate: e.target.value })}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Lock className="inline mr-1" size={16} />
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Info (if bank transfer selected) */}
              {selectedMethod === 'bank' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h3 className="font-semibold text-blue-900 mb-3">Thông tin chuyển khoản</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Ngân hàng:</span> Vietcombank</p>
                    <p><span className="font-semibold">Số tài khoản:</span> 1234567890</p>
                    <p><span className="font-semibold">Tên tài khoản:</span> CÔNG TY AUCTION</p>
                    <p><span className="font-semibold">Nội dung:</span> THANHTOAN {order.id}</p>
                  </div>
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      ⚠️ Vui lòng chuyển khoản đúng nội dung để đơn hàng được xử lý tự động
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>

              {/* Product Info */}
              <div className="flex gap-4 pb-4 border-b border-gray-200">
                <img
                  src={order.productImage}
                  alt={order.productName}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{order.productName}</h3>
                  <p className="text-sm text-gray-600">Người bán: {order.seller}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="py-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Giá sản phẩm</span>
                  <span className="font-semibold">{formatPrice(order.price)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold">{formatPrice(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Phí dịch vụ</span>
                  <span className="font-semibold">{formatPrice(order.serviceFee)}</span>
                </div>
                {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.fee! > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Phí thanh toán</span>
                    <span className="font-semibold">
                      {formatPrice(PAYMENT_METHODS.find(m => m.id === selectedMethod)?.fee || 0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-yellow-600">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      Xác nhận thanh toán
                    </>
                  )}
                </button>

                {/* Security Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <p>
                      Bằng cách thanh toán, bạn đồng ý với <span className="text-yellow-600 font-semibold">Điều khoản dịch vụ</span> và <span className="text-yellow-600 font-semibold">Chính sách bảo mật</span> của chúng tôi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Payment;
