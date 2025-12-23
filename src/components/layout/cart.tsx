import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  CreditCard, 
  CheckCircle2,
  Clock,
  ArrowLeft,
  Truck,
  PackageCheck,
  AlertTriangle,
  Star,
  Copy,
  MessageSquare,
  Package
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import PageLayout from './page-layout';
import FeedbackModal from '../pop-up/feedback-modal';
import ViewFeedbackModal from '../pop-up/view-feedback-modal';
import type { Feedback } from '@/types/feedback';

interface CartItem {
  id: number;
  productName: string;
  price: number;
  orderStatus: 'UNPAID' | 'PAID' | 'SHIPPING' | 'COMPLETED' | 'DISPUTE';
  wonAt: string;
  seller: string;
  sellerId: number;
  trackingCode?: string;
  shippedAt?: string;
  autoCompleteDate?: string;
  feedbackGiven?: boolean;
  feedbackReceived?: boolean;
}

const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    productName: 'iPhone 15 Pro Max 256GB',
    price: 25000000,
    orderStatus: 'COMPLETED',
    wonAt: '2024-12-15T20:00:00Z',
    seller: 'Nguyễn Văn A',
    sellerId: 123,
    trackingCode: 'VN123456789',
    shippedAt: '2024-12-16T14:30:00Z',
    feedbackGiven: false,
    feedbackReceived: false,
  },
  {
    id: 2,
    productName: 'MacBook Pro M3 16 inch',
    price: 35000000,
    orderStatus: 'SHIPPING',
    wonAt: '2024-12-16T18:00:00Z',
    seller: 'Trần Thị B',
    sellerId: 124,
    trackingCode: 'VN987654321',
    shippedAt: '2024-12-18T10:00:00Z',
    autoCompleteDate: '2025-01-02T10:00:00Z',
  },
  {
    id: 3,
    productName: 'AirPods Pro Gen 2',
    price: 5500000,
    orderStatus: 'PAID',
    wonAt: '2024-12-17T12:00:00Z',
    seller: 'Lê Văn C',
    sellerId: 125,
  },
  {
    id: 4,
    productName: 'iPad Air M2 11 inch',
    price: 15000000,
    orderStatus: 'UNPAID',
    wonAt: '2024-12-18T15:00:00Z',
    seller: 'Phạm Thị D',
    sellerId: 126,
  },
  {
    id: 5,
    productName: 'Samsung Galaxy S24 Ultra',
    price: 22000000,
    orderStatus: 'DISPUTE',
    wonAt: '2024-12-10T14:00:00Z',
    seller: 'Hoàng Văn E',
    sellerId: 127,
    trackingCode: 'VN555666777',
    shippedAt: '2024-12-11T09:00:00Z',
  },
  {
    id: 6,
    productName: 'Apple Watch Ultra 2',
    price: 15000000,
    orderStatus: 'COMPLETED',
    wonAt: '2024-12-08T16:00:00Z',
    seller: 'Vũ Thị F',
    sellerId: 128,
    trackingCode: 'VN111222333',
    shippedAt: '2024-12-09T15:00:00Z',
    feedbackGiven: true,
    feedbackReceived: true,
  },
];

// Mock feedbacks data - Updated to new rating system (+1/0/-1)
const MOCK_FEEDBACKS: Record<number, { given?: Feedback; received?: Feedback }> = {
  6: {
    given: {
      id: 1,
      orderId: 6,
      fromUserId: 1,
      toUserId: 128,
      rating: 1, // Tốt (+1)
      comment: 'Người bán rất tốt, hàng chính hãng, đóng gói cẩn thận. Giao hàng nhanh chóng. Rất hài lòng!',
      createdAt: '2024-12-15T12:00:00Z',
      fromUser: { id: 1, name: 'Tôi', role: 'buyer' },
      toUser: { id: 128, name: 'Vũ Thị F', role: 'seller' },
    },
    received: {
      id: 2,
      orderId: 6,
      fromUserId: 128,
      toUserId: 1,
      rating: 1, // Tốt (+1)
      comment: 'Người mua rất nhiệt tình, thanh toán nhanh, nhận hàng đúng hẹn. Sẽ ưu tiên bán hàng lại cho khách này!',
      createdAt: '2024-12-15T14:30:00Z',
      fromUser: { id: 128, name: 'Vũ Thị F', role: 'seller' },
      toUser: { id: 1, name: 'Tôi', role: 'buyer' },
    },
  },
};

type StatusFilter = 'ALL' | 'UNPAID' | 'PAID' | 'SHIPPING' | 'COMPLETED' | 'DISPUTE';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(MOCK_CART_ITEMS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  
  // Feedback modals state
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [viewFeedbackModalOpen, setViewFeedbackModalOpen] = useState(false);
  const [selectedOrderForFeedback, setSelectedOrderForFeedback] = useState<CartItem | null>(null);

  const filteredItems = cartItems.filter(item => {
    if (statusFilter === 'ALL') return true;
    return item.orderStatus === statusFilter;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi,
      });
    } catch {
      return 'Không xác định';
    }
  };

  const handlePayment = (id: number) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      navigate('/payment', {
        state: {
          order: {
            id: item.id,
            productName: item.productName,
            productImage: 'https://via.placeholder.com/120',
            price: item.price,
            seller: item.seller,
            wonAt: item.wonAt,
            shippingFee: 30000,
            serviceFee: 250000,
          }
        }
      });
    }
  };

  const handleConfirmReceived = (id: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, orderStatus: 'COMPLETED' as const }
          : item
      )
    );
    toast.success('Đã xác nhận nhận hàng thành công!');
  };

  const handleDispute = (id: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, orderStatus: 'DISPUTE' as const }
          : item
      )
    );
    toast.info('Đã gửi yêu cầu khiếu nại. Admin sẽ xem xét trong 24h.');
  };

  const handleLeaveFeedback = (id: number, seller: string, sellerId: number) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      setSelectedOrderForFeedback(item);
      setFeedbackModalOpen(true);
    }
  };

  const handleViewFeedback = (id: number) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      setSelectedOrderForFeedback(item);
      setViewFeedbackModalOpen(true);
    }
  };

  const copyTrackingCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    toast.success('Đã sao chép mã vận đơn!');
  };

  const viewInvoice = (item: CartItem) => {
    // Determine shipping status and timeline based on order status
    let shippingStatus = 'accepted';
    let trackingTimeline = [
      { id: 1, label: 'Accepted', date: '', completed: false },
      { id: 2, label: 'In transit', date: '', completed: false },
      { id: 3, label: 'Out for delivery', date: '', completed: false },
      { id: 4, label: 'Delivered', date: '', completed: false },
    ];

    if (item.orderStatus === 'SHIPPING') {
      shippingStatus = 'in_transit';
      trackingTimeline = [
        { id: 1, label: 'Accepted', date: item.shippedAt ? new Date(item.shippedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + '\n' + new Date(item.shippedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '', completed: true },
        { id: 2, label: 'In transit', date: 'Đang vận chuyển...', completed: true },
        { id: 3, label: 'Out for delivery', date: '', completed: false },
        { id: 4, label: 'Delivered', date: '', completed: false },
      ];
    } else if (item.orderStatus === 'COMPLETED') {
      shippingStatus = 'delivered';
      trackingTimeline = [
        { id: 1, label: 'Accepted', date: item.shippedAt ? new Date(item.shippedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + '\n' + new Date(item.shippedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '', completed: true },
        { id: 2, label: 'In transit', date: 'Đã vận chuyển', completed: true },
        { id: 3, label: 'Out for delivery', date: 'Đã giao hàng', completed: true },
        { id: 4, label: 'Delivered', date: 'Hoàn thành', completed: true },
      ];
    }

    navigate(`/invoice/${item.id}`, {
      state: {
        invoice: {
          invoiceNumber: `INV-2024-${String(item.id).padStart(6, '0')}`,
          orderNumber: `ORD-2024-${item.id}`,
          issueDate: item.wonAt,
          paymentDate: item.wonAt,
          status: item.orderStatus,
          
          // Add tracking info
          trackingCode: item.trackingCode || null,
          shippingCarrier: 'Giao Hàng Nhanh',
          shippingStatus: shippingStatus,
          trackingTimeline: trackingTimeline,
          
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
            name: item.seller,
            email: 'seller@email.com',
            phone: '0901234567',
            address: '123 Đường ABC, Quận 1, TP.HCM',
          },
          product: {
            id: item.id,
            name: item.productName,
            imageUrl: 'https://via.placeholder.com/120',
            description: 'Sản phẩm đấu giá',
            quantity: 1,
            price: item.price,
          },
          payment: {
            method: 'PayPal',
            transactionId: `TXN-2024-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            shippingFee: 30000,
            serviceFee: 250000,
            subtotal: item.price,
            total: item.price + 30000 + 250000,
          },
        },
      },
    });
  };

  const viewShipping = (item: CartItem) => {
    navigate(`/shipping/${item.trackingCode}`, {
      state: {
        shipment: {
          orderId: item.id,
          productName: item.productName,
          productImage: item.imageUrl,
          trackingCode: item.trackingCode,
          carrier: 'Giao Hàng Nhanh',
          estimatedDelivery: item.autoCompleteDate,
          shippedAt: item.shippedAt,
          currentStatus: 'in_transit',
          sender: {
            name: item.seller,
            phone: '0901234567',
            address: '123 Đường ABC, Quận 1, TP.HCM',
          },
          receiver: {
            name: 'Nguyễn Văn A',
            phone: '0912345678',
            address: '456 Đường XYZ, Quận 7, TP.HCM',
          },
          shipper: {
            name: 'Lê Văn C',
            phone: '0923456789',
            vehicle: 'Xe máy',
          },
          timeline: [
            {
              status: 'Đơn hàng đã được tạo',
              description: 'Người bán đã xác nhận đơn hàng',
              timestamp: item.wonAt,
              location: 'Quận 1, TP.HCM',
              completed: true,
            },
            {
              status: 'Đã lấy hàng',
              description: 'Shipper đã nhận hàng từ người bán',
              timestamp: item.shippedAt || '',
              location: 'Quận 1, TP.HCM',
              completed: true,
            },
            {
              status: 'Đang vận chuyển',
              description: 'Hàng đang trên đường giao đến bạn',
              timestamp: item.shippedAt || '',
              location: 'Đang di chuyển',
              completed: true,
            },
            {
              status: 'Giao hàng',
              description: 'Shipper sẽ giao hàng cho bạn',
              timestamp: item.autoCompleteDate || '',
              location: 'Quận 7, TP.HCM',
              completed: false,
            },
            {
              status: 'Hoàn thành',
              description: 'Đơn hàng đã được giao thành công',
              timestamp: '',
              location: '',
              completed: false,
            },
          ],
        },
      },
    });
  };

  const getStatusConfig = (status: CartItem['orderStatus']) => {
    const configs = {
      UNPAID: { 
        icon: Clock, 
        color: 'text-yellow-600', 
        bgColor: 'bg-yellow-50',
        label: 'Chưa thanh toán'
      },
      PAID: { 
        icon: CheckCircle2, 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-50',
        label: 'Đã thanh toán'
      },
      SHIPPING: { 
        icon: Truck, 
        color: 'text-purple-600', 
        bgColor: 'bg-purple-50',
        label: 'Đang giao hàng'
      },
      COMPLETED: { 
        icon: PackageCheck, 
        color: 'text-green-600', 
        bgColor: 'bg-green-50',
        label: 'Hoàn thành'
      },
      DISPUTE: { 
        icon: AlertTriangle, 
        color: 'text-orange-600', 
        bgColor: 'bg-orange-50',
        label: 'Khiếu nại'
      }
    };
    return configs[status];
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl shadow-lg">
              <ShoppingCart className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
              <p className="text-gray-500 mt-1">Quản lý các sản phẩm bạn đã đấu giá thành công</p>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { value: 'ALL' as const, label: 'Tất cả', count: cartItems.length },
            { value: 'UNPAID' as const, label: 'Chưa thanh toán', count: cartItems.filter(i => i.orderStatus === 'UNPAID').length },
            { value: 'PAID' as const, label: 'Đã thanh toán', count: cartItems.filter(i => i.orderStatus === 'PAID').length },
            { value: 'SHIPPING' as const, label: 'Đang giao hàng', count: cartItems.filter(i => i.orderStatus === 'SHIPPING').length },
            { value: 'COMPLETED' as const, label: 'Hoàn thành', count: cartItems.filter(i => i.orderStatus === 'COMPLETED').length },
            { value: 'DISPUTE' as const, label: 'Khiếu nại', count: cartItems.filter(i => i.orderStatus === 'DISPUTE').length },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                statusFilter === filter.value
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label} {filter.count > 0 && `(${filter.count})`}
            </button>
          ))}
        </div>

        {/* Cart Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-md">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không có đơn hàng nào
            </h3>
            <p className="text-gray-500 mb-6">
              {statusFilter === 'ALL' 
                ? 'Bạn chưa có đơn hàng nào. Tham gia đấu giá ngay!' 
                : `Không có đơn hàng nào ở trạng thái này`}
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg"
            >
              <ArrowLeft size={18} />
              Về trang chủ
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const statusConfig = getStatusConfig(item.orderStatus);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 ${statusConfig.bgColor} rounded-full`}>
                        <StatusIcon size={18} className={statusConfig.color} />
                        <span className={`font-semibold ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Đấu giá thành công {formatTimeAgo(item.wonAt)}
                      </span>
                    </div>

                    {/* Product Info */}
                    <div className="flex gap-6 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {item.productName}
                        </h3>
                        <p className="text-gray-600 mb-1">
                          Người bán: <span className="font-semibold">{item.seller}</span>
                        </p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    {/* Tracking Code for SHIPPING/COMPLETED orders */}
                    {item.trackingCode && (item.orderStatus === 'SHIPPING' || item.orderStatus === 'COMPLETED') && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Mã vận đơn</p>
                            <p className="font-mono font-bold text-blue-600 text-lg">{item.trackingCode}</p>
                            {item.shippedAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                Đã gửi: {formatTimeAgo(item.shippedAt)}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={(e) => copyTrackingCode(item.trackingCode!, e)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Sao chép mã"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                        {item.autoCompleteDate && item.orderStatus === 'SHIPPING' && (
                          <div className="mt-3 pt-3 border-t border-blue-200">
                            <p className="text-sm text-blue-700">
                              ⏱️ Đơn hàng sẽ tự động hoàn thành vào: <span className="font-semibold">
                                {new Date(item.autoCompleteDate).toLocaleDateString('vi-VN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">                    {/* View Invoice Button - For PAID, SHIPPING, COMPLETED */}
                    {(item.orderStatus === 'PAID' || item.orderStatus === 'SHIPPING' || item.orderStatus === 'COMPLETED') && (
                      <button
                        onClick={() => viewInvoice(item)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        <CreditCard size={16} />
                        Xem đơn hàng & vận chuyển
                      </button>
                    )}
                      {item.orderStatus === 'UNPAID' && (
                        <button
                          onClick={() => handlePayment(item.id)}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg"
                        >
                          <CreditCard size={18} />
                          Thanh toán ngay
                        </button>
                      )}

                      {item.orderStatus === 'SHIPPING' && (
                        <>
                          <button
                            onClick={() => handleConfirmReceived(item.id)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
                          >
                            <CheckCircle2 size={18} />
                            Đã nhận hàng
                          </button>
                          <button
                            onClick={() => handleDispute(item.id)}
                            className="flex items-center gap-2 px-4 py-3 bg-orange-100 text-orange-700 font-semibold rounded-lg hover:bg-orange-200 transition-all"
                          >
                            <AlertTriangle size={18} />
                            Khiếu nại
                          </button>
                        </>
                      )}

                      {item.orderStatus === 'COMPLETED' && (
                        <>
                          {!item.feedbackGiven ? (
                            <button
                              onClick={() => handleLeaveFeedback(item.id, item.seller, item.sellerId)}
                              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg"
                            >
                              <Star size={18} />
                              Đánh giá người bán
                            </button>
                          ) : (
                            <button
                              onClick={() => handleViewFeedback(item.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
                            >
                              <Star size={18} />
                              Xem đánh giá của bạn
                            </button>
                          )}
                          {item.feedbackReceived && (
                            <button
                              onClick={() => handleViewFeedback(item.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-all"
                            >
                              <MessageSquare size={18} />
                              Xem đánh giá nhận được
                            </button>
                          )}
                        </>
                      )}

                      {item.orderStatus === 'DISPUTE' && (
                        <div className="w-full bg-orange-100 border border-orange-200 rounded-lg p-4">
                          <p className="text-orange-700 font-medium flex items-center gap-2">
                            <AlertTriangle size={18} />
                            Khiếu nại đang được xử lý. Admin sẽ liên hệ trong 24h.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feedback Modals */}
      {selectedOrderForFeedback && (
        <>
          <FeedbackModal
            isOpen={feedbackModalOpen}
            onClose={() => {
              setFeedbackModalOpen(false);
              setSelectedOrderForFeedback(null);
            }}
            targetUser={{
              id: selectedOrderForFeedback.sellerId,
              name: selectedOrderForFeedback.seller,
              role: 'seller',
            }}
            orderId={selectedOrderForFeedback.id}
            productName={selectedOrderForFeedback.productName}
          />

          <ViewFeedbackModal
            isOpen={viewFeedbackModalOpen}
            onClose={() => {
              setViewFeedbackModalOpen(false);
              setSelectedOrderForFeedback(null);
            }}
            feedbackGiven={MOCK_FEEDBACKS[selectedOrderForFeedback.id]?.given}
            feedbackReceived={MOCK_FEEDBACKS[selectedOrderForFeedback.id]?.received}
            orderId={selectedOrderForFeedback.id}
            productName={selectedOrderForFeedback.productName}
            hasGivenFeedback={selectedOrderForFeedback.feedbackGiven || false}
          />
        </>
      )}
    </PageLayout>
  );
};

export default Cart;
