// src/components/layout/cart.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/useCartStore';
import { 
  ShoppingCart, 
  Trash2, 
  Package, 
  CreditCard, 
  CheckCircle2,
  Clock,
  ArrowLeft,
  Truck,
  PackageCheck
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PageLayout from './page-layout';

type DeliveryFilter = 'ALL' | 'PENDING_PAYMENT' | 'PAID' | 'SHIPPING' | 'DELIVERED';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    selectedItems,
    isLoading,
    fetchCart,
    removeFromCart,
    removeMultiple,
    toggleSelectItem,
    toggleSelectAll,
    getTotalAmount,
    getSelectedItemsCount,
  } = useCartStore();

  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryFilter>('ALL');

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Filter cart items based on delivery status
  const filteredCartItems = cartItems.filter(item => {
    if (deliveryFilter === 'ALL') return true;
    return item.deliveryStatus === deliveryFilter;
  });

  // Only allow selecting items that are PENDING_PAYMENT
  const selectableItems = filteredCartItems.filter(item => item.deliveryStatus === 'PENDING_PAYMENT');

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
      return 'Vừa xong';
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING_PAYMENT: { icon: Clock, text: 'Chờ thanh toán', className: 'bg-yellow-100 text-yellow-700 border border-yellow-300' },
      PAID: { icon: CheckCircle2, text: 'Đã thanh toán', className: 'bg-green-100 text-green-700 border border-green-300' },
      SHIPPING: { icon: Truck, text: 'Đang vận chuyển', className: 'bg-blue-100 text-blue-700 border border-blue-300' },
      DELIVERED: { icon: PackageCheck, text: 'Đã giao', className: 'bg-purple-100 text-purple-700 border border-purple-300' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING_PAYMENT;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${config.className}`}>
        <Icon className="w-4 h-4" />
        <span>{config.text}</span>
      </span>
    );
  };

  const handleCheckout = () => {
    if (getSelectedItemsCount() === 0) {
      toast.warning('Vui lòng chọn sản phẩm để thanh toán');
      return;
    }
    setShowCheckoutDialog(true);
  };

  const handleRemoveSelected = async () => {
    if (getSelectedItemsCount() === 0) {
      toast.warning('Vui lòng chọn sản phẩm để xóa');
      return;
    }

    if (confirm(`Bạn có chắc muốn xóa ${getSelectedItemsCount()} sản phẩm?`)) {
      await removeMultiple(selectedItems);
    }
  };

  const getFilterLabel = (filter: DeliveryFilter) => {
    const labels = {
      ALL: 'Tất cả',
      PENDING_PAYMENT: 'Chờ thanh toán',
      PAID: 'Đã thanh toán',
      SHIPPING: 'Đang vận chuyển',
      DELIVERED: 'Đã giao',
    };
    return labels[filter];
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Back Button - Giống Auction Detail */}
      <div className="mb-8 pt-4 px-4 lg:px-0 max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 bg-white hover:bg-yellow-50 text-gray-800 font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
        >
          <ArrowLeft size={20} className="text-yellow-600" />
          <span>Trở về trang chủ</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-8 px-4 lg:px-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 flex items-center space-x-3">
              <ShoppingCart className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" />
              <span>Giỏ hàng của tôi</span>
            </h1>
            <p className="text-gray-600 mt-2">
              {filteredCartItems.length} sản phẩm {deliveryFilter !== 'ALL' && `- ${getFilterLabel(deliveryFilter)}`}
            </p>
          </div>
        </div>

          {/* Filter Tabs */}
          <div className="mt-6 bg-white rounded-xl shadow-md p-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDeliveryFilter('ALL')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  deliveryFilter === 'ALL'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả ({cartItems.length})
              </button>
              <button
                onClick={() => setDeliveryFilter('PENDING_PAYMENT')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  deliveryFilter === 'PENDING_PAYMENT'
                    ? 'bg-yellow-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Chờ thanh toán ({cartItems.filter(i => i.deliveryStatus === 'PENDING_PAYMENT').length})</span>
              </button>
              <button
                onClick={() => setDeliveryFilter('PAID')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  deliveryFilter === 'PAID'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã thanh toán ({cartItems.filter(i => i.deliveryStatus === 'PAID').length})</span>
              </button>
              <button
                onClick={() => setDeliveryFilter('SHIPPING')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  deliveryFilter === 'SHIPPING'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Đang vận chuyển ({cartItems.filter(i => i.deliveryStatus === 'SHIPPING').length})</span>
              </button>
              <button
                onClick={() => setDeliveryFilter('DELIVERED')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  deliveryFilter === 'DELIVERED'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <PackageCheck className="w-4 h-4" />
                <span>Đã giao ({cartItems.filter(i => i.deliveryStatus === 'DELIVERED').length})</span>
              </button>
            </div>
          </div>
        </div>

        {filteredCartItems.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {deliveryFilter === 'ALL' ? 'Giỏ hàng trống' : `Không có sản phẩm ${getFilterLabel(deliveryFilter).toLowerCase()}`}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {deliveryFilter === 'ALL' 
                ? 'Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy tham gia đấu giá để thêm sản phẩm!'
                : 'Thử chọn bộ lọc khác để xem sản phẩm.'}
            </p>
            {deliveryFilter === 'ALL' && (
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Khám phá đấu giá</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Select All */}
              <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === selectableItems.length && selectableItems.length > 0}
                    onChange={toggleSelectAll}
                    disabled={selectableItems.length === 0}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <span className="font-medium text-gray-900">
                    Chọn tất cả ({selectableItems.length} có thể thanh toán)
                  </span>
                </label>

                {selectedItems.length > 0 && (
                  <button
                    onClick={handleRemoveSelected}
                    className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa ({selectedItems.length})</span>
                  </button>
                )}
              </div>

              {/* Cart Item Cards */}
              {filteredCartItems.map((item) => {
                const isSelectable = item.deliveryStatus === 'PENDING_PAYMENT';
                
                return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start space-x-4">
                      {/* Checkbox - Chỉ hiển thị cho PENDING_PAYMENT */}
                      {isSelectable ? (
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                        />
                      ) : (
                        <div className="w-5 h-5 mt-1 flex-shrink-0" />
                      )}

                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images[0] ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-10 h-10 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors">
                          {item.product.name}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          {getDeliveryStatusBadge(item.deliveryStatus)}
                          <span className="text-sm text-gray-500">
                            Thắng {formatTimeAgo(item.wonAt)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Giá thắng</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {formatPrice(item.winningPrice)}
                            </p>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            title="Xóa khỏi giỏ hàng"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <span>Tóm tắt đơn hàng</span>
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Sản phẩm đã chọn:</span>
                    <span className="font-semibold text-gray-900">
                      {getSelectedItemsCount()}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(getTotalAmount())}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-600 font-semibold">Miễn phí</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(getTotalAmount())}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={getSelectedItemsCount() === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Thanh toán ngay</span>
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Bằng việc thanh toán, bạn đồng ý với{' '}
                  <span className="text-blue-600 cursor-pointer hover:underline">
                    điều khoản sử dụng
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Checkout Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg mx-auto p-0 rounded-2xl sm:rounded-3xl animate-in fade-in-0 zoom-in-95 duration-200 overflow-hidden bg-gradient-to-br from-blue-50 to-white border-0 shadow-2xl">
          <DialogHeader className="text-center py-6 sm:py-8 px-4 sm:px-6">
            <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Chọn phương thức thanh toán
            </DialogTitle>
          </DialogHeader>

          <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 space-y-4">
            {/* Tóm tắt đơn hàng */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Số lượng sản phẩm:</span>
                <span className="font-semibold text-gray-900">{getSelectedItemsCount()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tổng thanh toán:</span>
                <span className="text-xl font-bold text-blue-600">{formatPrice(getTotalAmount())}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <button className="w-full border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 rounded-xl p-4 text-left transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Thẻ tín dụng/Ghi nợ</p>
                    <p className="text-sm text-gray-500">Visa, Mastercard, JCB</p>
                  </div>
                </div>
              </button>

              <button className="w-full border-2 border-gray-200 hover:border-green-600 hover:bg-green-50 rounded-xl p-4 text-left transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Chuyển khoản ngân hàng</p>
                    <p className="text-sm text-gray-500">Miễn phí giao dịch</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCheckoutDialog(false)}
                className="flex-1 h-12 text-base font-semibold rounded-xl"
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={() => {
                  toast.success('Đang xử lý thanh toán...', {
                    description: `${getSelectedItemsCount()} sản phẩm - ${formatPrice(getTotalAmount())}`
                  });
                  setShowCheckoutDialog(false);
                }}
                className="flex-1 h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Xác nhận thanh toán
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Cart;
