import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, ShoppingCart, Clock, CheckCircle, AlertCircle, Star, Loader2, DollarSign, X, FileText } from 'lucide-react';
import PageLayout from './page-layout';
import ShippingTrackingModal from '../pop-up/shipping-tracking-modal';
import OrderDetailModal from '../pop-up/order-detail-modal';
import Pagination from '@/components/ui/pagination';
import { toast } from 'sonner';
import { auctionService } from '@/services/auctionService';
import { invoiceService, type SellerRevenueResponse } from '@/services/invoiceService';
import { feedbackService } from '@/services/feedbackService';
import { getProductStatusBadge } from '@/lib/productUtils';
import type { AuctionSessionResponse, AuctionStatus } from '@/types/auction';
import type { InvoiceResponse, InvoiceStatus, DisputeResponse } from '@/types/invoice';
import type { FeedbackRating } from '@/types/feedback';

type TabType = 'auctions' | 'orders' | 'stats';
type OrderSubTab = 'sales' | 'fees'; // Sub-tabs for Orders

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('auctions');
  const [orderSubTab, setOrderSubTab] = useState<OrderSubTab>('sales'); // Default: Đơn Bán Hàng
  const [selectedAuctionStatus, setSelectedAuctionStatus] = useState<AuctionStatus | undefined>(undefined);
  const [selectedSalesStatus, setSelectedSalesStatus] = useState<InvoiceStatus | undefined>(undefined);
  const [selectedFeesStatus, setSelectedFeesStatus] = useState<InvoiceStatus | undefined>(undefined);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<InvoiceResponse | null>(null);

  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInvoiceForFeedback, setSelectedInvoiceForFeedback] = useState<InvoiceResponse | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<FeedbackRating | ''>('');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Confirm Dialog State
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }>({ title: '', message: '', onConfirm: () => { } });

  // Dispute details map (invoiceId -> DisputeResponse)
  const [disputeDetailsMap, setDisputeDetailsMap] = useState<Map<number, DisputeResponse>>(new Map());

  // Helper function to show confirm dialog
  const showConfirm = (config: {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }) => {
    setConfirmConfig(config);
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = () => {
    confirmConfig.onConfirm();
    setShowConfirmDialog(false);
  };

  // API State - Auctions
  const [auctions, setAuctions] = useState<AuctionSessionResponse[]>([]);
  const [isLoadingAuctions, setIsLoadingAuctions] = useState(false);
  const [auctionPage, setAuctionPage] = useState(1);
  const [auctionTotalPages, setAuctionTotalPages] = useState(1);
  const [auctionTotalElements, setAuctionTotalElements] = useState(0);

  // API State - Sales (AUCTION_SALE invoices)
  const [sales, setSales] = useState<InvoiceResponse[]>([]);
  const [isLoadingSales, setIsLoadingSales] = useState(false);
  const [salesPage, setSalesPage] = useState(1);
  const [salesTotalPages, setSalesTotalPages] = useState(1);
  const [salesTotalElements, setSalesTotalElements] = useState(0);

  // API State - Listing Fees (LISTING_FEE invoices)
  const [fees, setFees] = useState<InvoiceResponse[]>([]);
  const [isLoadingFees, setIsLoadingFees] = useState(false);
  const [feesPage, setFeesPage] = useState(1);
  const [feesTotalPages, setFeesTotalPages] = useState(1);
  const [feesTotalElements, setFeesTotalElements] = useState(0);

  // API State - Seller Statistics
  const [sellerStats, setSellerStats] = useState<SellerRevenueResponse | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const pageSize = 5;

  // Fetch Seller Stats on mount
  useEffect(() => {
    fetchSellerStats();
  }, []);

  // Fetch Auctions
  useEffect(() => {
    if (activeTab === 'auctions') {
      fetchAuctions();
    }
  }, [selectedAuctionStatus, auctionPage, activeTab]);

  // Fetch Sales
  useEffect(() => {
    if (activeTab === 'orders' && orderSubTab === 'sales') {
      fetchSales();
    }
  }, [selectedSalesStatus, salesPage, activeTab, orderSubTab]);

  // Fetch Fees
  useEffect(() => {
    if (activeTab === 'orders' && orderSubTab === 'fees') {
      fetchFees();
    }
  }, [selectedFeesStatus, feesPage, activeTab, orderSubTab]);

  const fetchSellerStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await invoiceService.getSellerStats();
      setSellerStats(response.data);
    } catch (error: any) {
      console.error('Error fetching seller stats:', error);
      toast.error('Không thể tải thống kê');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchAuctions = async () => {
    try {
      setIsLoadingAuctions(true);
      const response = await auctionService.getMyAuctionSessions({
        status: selectedAuctionStatus,
        page: auctionPage,
        size: pageSize
      });
      setAuctions(response.data.data);
      setAuctionTotalPages(response.data.totalPages);
      setAuctionTotalElements(response.data.totalElements);
    } catch (error: any) {
      console.error('Error fetching auctions:', error);
      toast.error('Không thể tải danh sách phiên đấu giá');
    } finally {
      setIsLoadingAuctions(false);
    }
  };

  const fetchSales = async () => {
    try {
      setIsLoadingSales(true);
      const response = await invoiceService.getMySales({
        status: selectedSalesStatus,
        page: salesPage,
        size: pageSize
      });
      setSales(response.data.data);
      setSalesTotalPages(response.data.totalPages);
      setSalesTotalElements(response.data.totalElements);

      // Fetch dispute details for DISPUTE invoices
      const disputeInvoices = response.data.data.filter(inv => inv.status === 'DISPUTE');
      if (disputeInvoices.length > 0) {
        const detailsMap = new Map<number, DisputeResponse>();
        await Promise.all(
          disputeInvoices.map(async (invoice) => {
            try {
              const disputeRes = await invoiceService.getDisputeByInvoice(invoice.id);
              detailsMap.set(invoice.id, disputeRes.data);
            } catch (error) {
              console.error(`Error fetching dispute for invoice ${invoice.id}:`, error);
            }
          })
        );
        setDisputeDetailsMap(detailsMap);
      }
    } catch (error: any) {
      console.error('Error fetching sales:', error);
      toast.error('Không thể tải danh sách đơn bán hàng');
    } finally {
      setIsLoadingSales(false);
    }
  };

  const fetchFees = async () => {
    try {
      setIsLoadingFees(true);
      const response = await invoiceService.getMyListingFees({
        status: selectedFeesStatus,
        page: feesPage,
        size: pageSize
      });
      setFees(response.data.data);
      setFeesTotalPages(response.data.totalPages);
      setFeesTotalElements(response.data.totalElements);
    } catch (error: any) {
      console.error('Error fetching listing fees:', error);
      toast.error('Không thể tải danh sách phí giá sàn');
    } finally {
      setIsLoadingFees(false);
    }
  };

  // Thống kê - Sử dụng dữ liệu từ API
  const stats = {
    totalAuctions: sellerStats?.totalAuctionSessions || 0,
    activeAuctions: auctions.filter(a => a.status === 'ACTIVE').length,
    soldItems: sales.filter(o => o.status === 'COMPLETED').length,
    totalRevenue: sellerStats?.totalRevenue || 0,
    pendingOrders: sales.filter(o => o.status === 'PAID').length,
    averageRating: 4.8, // Mock data - cần API riêng
    totalFeedbacks: 15  // Mock data - cần API riêng
  };

  // Format tiền
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format ngày
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Status badge colors for Auctions
  const getAuctionStatusColor = (status: AuctionStatus) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-yellow-100 text-yellow-700';
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'ENDED': return 'bg-blue-100 text-blue-700';
      case 'WAITING_PAYMENT': return 'bg-orange-100 text-orange-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Status badge colors for Orders
  const getOrderStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'PAID': return 'bg-blue-100 text-blue-700';
      case 'SHIPPING': return 'bg-purple-100 text-purple-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'DISPUTE': return 'bg-red-100 text-red-700';
      case 'CANCELLED_NON_PAYMENT': return 'bg-gray-100 text-gray-700';
      case 'CANCELLED_BY_SELLER': return 'bg-gray-100 text-gray-700';
      case 'REFUNDED': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Dịch status
  const translateAuctionStatus = (status: AuctionStatus) => {
    const translations: { [key in AuctionStatus]: string } = {
      'SCHEDULED': 'Đã lên lịch',
      'ACTIVE': 'Đang đấu giá',
      'ENDED': 'Đã kết thúc',
      'WAITING_PAYMENT': 'Chờ thanh toán',
      'CANCELLED': 'Đã hủy',
      'FAILED': 'Thất bại'
    };
    return translations[status];
  };

  const translateOrderStatus = (status: InvoiceStatus) => {
    const translations: { [key in InvoiceStatus]: string } = {
      'PENDING': 'Chờ thanh toán',
      'PAID': 'Đã thanh toán',
      'SHIPPING': 'Đang giao hàng',
      'COMPLETED': 'Hoàn thành',
      'DISPUTE': 'Tranh chấp',
      'CANCELLED_NON_PAYMENT': 'Hủy do không thanh toán',
      'CANCELLED_BY_SELLER': 'Hủy bởi người bán',
      'REFUNDED': 'Đã hoàn tiền'
    };
    return translations[status];
  };

  // Handle shipping modal
  const handleOpenShippingModal = (order: InvoiceResponse) => {
    setSelectedOrder(order);
    setShowShippingModal(true);
  };

  // Handle cancel auction session
  const handleCancelSession = async (auction: AuctionSessionResponse) => {
    showConfirm({
      title: 'Hủy phiên đấu giá',
      message: `Bạn có chắc muốn hủy phiên đấu giá "${auction.product.name}"?`,
      type: 'danger',
      confirmText: 'Hủy phiên',
      cancelText: 'Quay lại',
      onConfirm: async () => {
        try {
          const response = await auctionService.cancelSession(auction.id);
          toast.success('Hủy phiên đấu giá thành công!');

          // Update the auction in the list
          setAuctions(prevAuctions =>
            prevAuctions.map(a => a.id === auction.id ? response.data : a)
          );
        } catch (error: any) {
          console.error('Error cancelling session:', error);
          toast.error(error.response?.data?.message || 'Không thể hủy phiên đấu giá. Phiên có thể đã có người đặt giá.');
        }
      }
    });
  };

  // Handle reactivate auction session
  const handleReactivateSession = async (auction: AuctionSessionResponse) => {
    showConfirm({
      title: 'Kích hoạt lại phiên đấu giá',
      message: `Bạn có chắc muốn kích hoạt lại phiên đấu giá "${auction.product.name}"?`,
      type: 'info',
      confirmText: 'Kích hoạt',
      cancelText: 'Hủy',
      onConfirm: async () => {
        try {
          const response = await auctionService.reactivateSession(auction.id);
          toast.success('Kích hoạt lại phiên đấu giá thành công!');

          // Update the auction in the list
          setAuctions(prevAuctions =>
            prevAuctions.map(a => a.id === auction.id ? response.data : a)
          );
        } catch (error: any) {
          console.error('Error reactivating session:', error);
          toast.error(error.response?.data?.message || 'Không thể kích hoạt lại phiên đấu giá.');
        }
      }
    });
  };

  const handleSubmitTracking = async (trackingCode: string, carrier: string) => {
    if (!selectedOrder) return;

    try {
      await invoiceService.shipInvoice(selectedOrder.id, {
        trackingCode,
        carrier
      });
      toast.success('Đã cập nhật mã vận đơn!', {
        description: `Mã vận đơn: ${trackingCode} - ${carrier}`
      });
      setShowShippingModal(false);
      // Reload based on current sub-tab
      if (orderSubTab === 'sales') {
        fetchSales();
      }
    } catch (error: any) {
      console.error('Error shipping invoice:', error);
      toast.error(error.response?.data?.message || 'Không thể cập nhật mã vận đơn');
    }
  };

  // Handle order detail modal
  const handleOpenOrderDetail = (order: InvoiceResponse) => {
    setSelectedOrder(order);
    setShowOrderDetailModal(true);
  };

  // Check if invoice is overdue (past dueDate)
  const isOverdue = (invoice: InvoiceResponse) => {
    if (!invoice.dueDate) return false;
    return new Date(invoice.dueDate) < new Date();
  };

  // Handle feedback for buyer
  const handleOpenFeedback = (invoice: InvoiceResponse) => {
    setSelectedInvoiceForFeedback(invoice);
    setFeedbackRating('');
    setFeedbackComment('');
    setShowFeedbackModal(true);
  };

  const handleCreateFeedback = async () => {
    if (!selectedInvoiceForFeedback || !feedbackRating) {
      toast.error('Vui lòng chọn đánh giá');
      return;
    }

    try {
      setIsSubmittingFeedback(true);
      await feedbackService.createFeedback(selectedInvoiceForFeedback.id, {
        rating: feedbackRating as FeedbackRating,
        comment: feedbackComment || undefined
      });
      toast.success('Đã gửi đánh giá thành công!', {
        description: 'Cảm ơn bạn đã đánh giá người mua.'
      });
      setShowFeedbackModal(false);
      setSelectedInvoiceForFeedback(null);
      setFeedbackRating('');
      setFeedbackComment('');
      // Refresh sales list
      fetchSales();
    } catch (error: any) {
      console.error('Error creating feedback:', error);
      toast.error(error.response?.data?.message || 'Không thể gửi đánh giá');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Fetch dispute details for all DISPUTE invoices
  const fetchDisputeDetails = async (invoices: InvoiceResponse[]) => {
    const disputeInvoices = invoices.filter(inv => inv.status === 'DISPUTE');
    const detailsMap = new Map<number, DisputeResponse>();

    await Promise.all(
      disputeInvoices.map(async (invoice) => {
        try {
          const response = await invoiceService.getDisputeByInvoice(invoice.id);
          detailsMap.set(invoice.id, response.data);
        } catch (error) {
          console.error(`Error fetching dispute for invoice ${invoice.id}:`, error);
        }
      })
    );

    setDisputeDetailsMap(detailsMap);
  };

  const handleReportNonPayment = async (invoice: InvoiceResponse) => {
    showConfirm({
      title: 'Báo cáo bùng hàng',
      message: `Báo cáo người mua bùng hàng cho đơn #${invoice.id}?\n\nNgười mua sẽ nhận strike và đơn hàng sẽ bị hủy.`,
      type: 'warning',
      confirmText: 'Báo cáo',
      cancelText: 'Hủy',
      onConfirm: async () => {
        try {
          await invoiceService.reportNonPayment(invoice.id);
          toast.success('Đã báo cáo bùng hàng thành công!');
          fetchSales();
        } catch (error: any) {
          console.error('Error reporting non-payment:', error);
          toast.error(error.response?.data?.message || 'Không thể báo cáo');
        }
      }
    });
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🏪 Quản Lý Cửa Hàng
            </h1>
            <p className="text-gray-600">
              Quản lý phiên đấu giá, đơn hàng và theo dõi doanh thu của bạn
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Tổng phiên đấu giá</p>
                  {isLoadingStats ? (
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500 my-2" />
                  ) : (
                    <p className="text-3xl font-bold text-gray-800">{stats.totalAuctions}</p>
                  )}
                  <p className="text-green-600 text-sm mt-1">
                    {stats.activeAuctions} đang hoạt động
                  </p>
                </div>
                <Package className="w-12 h-12 text-purple-500 opacity-80" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Tổng doanh thu</p>
                  {isLoadingStats ? (
                    <Loader2 className="w-8 h-8 animate-spin text-green-500 my-2" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(stats.totalRevenue)}
                    </p>
                  )}
                  <p className="text-green-600 text-sm mt-1">
                    {stats.soldItems} sản phẩm đã bán
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-500 opacity-80" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Đơn hàng chờ xử lý</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.pendingOrders}</p>
                  <p className="text-orange-600 text-sm mt-1">
                    Cần giao hàng
                  </p>
                </div>
                <ShoppingCart className="w-12 h-12 text-blue-500 opacity-80" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Đánh giá</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.averageRating} <span className="text-xl">⭐</span>
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {stats.totalFeedbacks} lượt đánh giá
                  </p>
                </div>
                <Star className="w-12 h-12 text-yellow-500 opacity-80" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('auctions')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${activeTab === 'auctions'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  📦 Phiên Đấu Giá của tôi
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${activeTab === 'orders'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  🚚 Đơn Hàng
                  {stats.pendingOrders > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {stats.pendingOrders}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${activeTab === 'stats'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  📊 Thống Kê
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Tab: Phiên Đấu Giá */}
              {activeTab === 'auctions' && (
                <div>
                  {/* Filter */}
                  <div className="flex gap-2 mb-6 flex-wrap">
                    <button
                      onClick={() => {
                        setSelectedAuctionStatus(undefined);
                        setAuctionPage(1);
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${!selectedAuctionStatus
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Tất cả
                    </button>
                    {(['SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED'] as AuctionStatus[]).map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedAuctionStatus(status);
                          setAuctionPage(1);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedAuctionStatus === status
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {translateAuctionStatus(status)}
                      </button>
                    ))}
                  </div>

                  {/* Loading State */}
                  {isLoadingAuctions ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
                      <p className="text-gray-600">Đang tải phiên đấu giá...</p>
                    </div>
                  ) : auctions.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Không có phiên đấu giá nào</p>
                    </div>
                  ) : (
                    <>
                      {/* Auctions List */}
                      <div className="space-y-4 mb-6">
                        {auctions.map((auction) => (
                          <div
                            key={auction.id}
                            className="bg-gradient-to-r from-white to-purple-50 border border-purple-100 rounded-xl p-6 hover:shadow-lg transition-shadow"
                          >
                            <div className="flex gap-6">
                              {/* Image */}
                              {auction.product.images && auction.product.images[0] && (
                                <img
                                  src={auction.product.images[0].url}
                                  alt={auction.product.name}
                                  className="w-32 h-32 object-cover rounded-lg"
                                />
                              )}

                              {/* Content */}
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                                      {auction.product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getAuctionStatusColor(auction.status)}`}>
                                        {translateAuctionStatus(auction.status)}
                                      </span>
                                      {auction.product.status && (() => {
                                        const statusBadge = getProductStatusBadge(auction.product.status);
                                        return (
                                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bgColor} ${statusBadge.textColor} ${statusBadge.borderColor}`}>
                                            {statusBadge.icon} {statusBadge.label}
                                          </span>
                                        );
                                      })()}
                                      {!auction.reservePriceMet && auction.status === 'ENDED' && (
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                                          Chưa đạt giá sàn
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => navigate(`/auction/${auction.id}`)}
                                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                    >
                                      Chi tiết
                                    </button>
                                    {/* Cancel button - only show for SCHEDULED or ACTIVE auctions without bids */}
                                    {(auction.status === 'SCHEDULED' || auction.status === 'ACTIVE') && !auction.highestBidder && (
                                      <button
                                        onClick={() => handleCancelSession(auction)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                                      >
                                        <X className="w-4 h-4" />
                                        Hủy
                                      </button>
                                    )}
                                    {/* Reactivate button - only show for CANCELLED auctions */}
                                    {auction.status === 'CANCELLED' && (
                                      <button
                                        onClick={() => handleReactivateSession(auction)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        Kích hoạt lại
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                  <div>
                                    <p className="text-gray-500 text-sm">Giá khởi điểm</p>
                                    <p className="text-gray-800 font-semibold">
                                      {formatCurrency(auction.startPrice)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 text-sm">Giá hiện tại</p>
                                    <p className="text-purple-600 font-bold text-lg">
                                      {formatCurrency(auction.currentPrice)}
                                    </p>
                                  </div>
                                  {auction.buyNowPrice && (
                                    <div>
                                      <p className="text-gray-500 text-sm">Giá mua ngay</p>
                                      <p className="text-green-600 font-semibold">
                                        {formatCurrency(auction.buyNowPrice)}
                                      </p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-gray-500 text-sm">Danh mục</p>
                                    <p className="text-gray-800 font-semibold">
                                      {auction.product.category.name}
                                    </p>
                                  </div>
                                </div>

                                {/* Timeline */}
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>Bắt đầu: {formatDate(auction.startTime)}</span>
                                  </div>
                                  <span>→</span>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>Kết thúc: {formatDate(auction.endTime)}</span>
                                  </div>
                                </div>

                                {/* Highest Bidder */}
                                {auction.highestBidder && (
                                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-700 font-semibold">
                                      🏆 Người đang dẫn đầu: {auction.highestBidder.firstName} {auction.highestBidder.lastName}
                                    </p>
                                    <p className="text-green-600 text-sm">{auction.highestBidder.email}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {auctionTotalPages > 1 && (
                        <Pagination
                          currentPage={auctionPage}
                          totalPages={auctionTotalPages}
                          onPageChange={setAuctionPage}
                          itemsPerPage={pageSize}
                          totalItems={auctionTotalElements}
                        />
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Tab: Đơn Hàng */}
              {activeTab === 'orders' && (
                <div>
                  {/* Sub-tabs: Đơn Bán Hàng vs Phí Giá Sàn */}
                  <div className="flex gap-4 mb-6 border-b border-gray-200">
                    <button
                      onClick={() => {
                        setOrderSubTab('sales');
                        setSalesPage(1);
                      }}
                      className={`px-6 py-3 font-semibold transition-colors border-b-2 ${orderSubTab === 'sales'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                      📦 Đơn Bán Hàng
                    </button>
                    <button
                      onClick={() => {
                        setOrderSubTab('fees');
                        setFeesPage(1);
                      }}
                      className={`px-6 py-3 font-semibold transition-colors border-b-2 ${orderSubTab === 'fees'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                      💰 Phí Giá Sàn
                    </button>
                  </div>

                  {/* Sub-tab: Đơn Bán Hàng (AUCTION_SALE) */}
                  {orderSubTab === 'sales' && (
                    <div>
                      {/* Filter */}
                      <div className="flex gap-2 mb-6 flex-wrap">
                        <button
                          onClick={() => {
                            setSelectedSalesStatus(undefined);
                            setSalesPage(1);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${!selectedSalesStatus
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          Tất cả
                        </button>
                        {(['PENDING', 'PAID', 'SHIPPING', 'COMPLETED', 'DISPUTE'] as InvoiceStatus[]).map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setSelectedSalesStatus(status);
                              setSalesPage(1);
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedSalesStatus === status
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {translateOrderStatus(status)}
                          </button>
                        ))}
                      </div>

                      {/* Loading State */}
                      {isLoadingSales ? (
                        <div className="text-center py-12">
                          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                          <p className="text-gray-600">Đang tải đơn bán hàng...</p>
                        </div>
                      ) : sales.length === 0 ? (
                        <div className="text-center py-12">
                          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-600">Không có đơn bán hàng nào</p>
                        </div>
                      ) : (
                        <>
                          {/* Sales List */}
                          <div className="space-y-4 mb-6">
                            {sales.map((sale) => (
                              <div
                                key={sale.id}
                                className="bg-gradient-to-r from-white to-blue-50 border border-blue-100 rounded-xl p-6 hover:shadow-lg transition-shadow"
                              >
                                <div className="flex gap-6">
                                  {/* Image */}
                                  {sale.product.images && sale.product.images[0] && (
                                    <img
                                      src={sale.product.images[0].url}
                                      alt={sale.product.name}
                                      className="w-32 h-32 object-cover rounded-lg"
                                    />
                                  )}

                                  {/* Content */}
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                          Mã đơn: <span className="font-semibold text-gray-700">INV-{sale.id}</span>
                                        </p>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                          {sale.product.name}
                                        </h3>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(sale.status)}`}>
                                          {translateOrderStatus(sale.status)}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm text-gray-500">Tổng tiền</p>
                                        <p className="text-2xl font-bold text-purple-600">
                                          {formatCurrency(sale.finalPrice)}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Buyer Info */}
                                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                      <h4 className="font-semibold text-gray-700 mb-2">👤 Thông tin người mua</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                        <p><span className="text-gray-600">Tên:</span> <span className="font-semibold">{sale.user.firstName} {sale.user.lastName}</span></p>
                                        <p><span className="text-gray-600">Số điện thoại:</span> <span className="font-semibold">{sale.user.phoneNumber}</span></p>
                                        <p><span className="text-gray-600">Email:</span> <span className="font-semibold">{sale.user.email}</span></p>
                                      </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="flex items-center gap-3 text-sm mb-3">
                                      <div className="flex items-center gap-1 text-green-600">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Tạo đơn: {formatDate(sale.createdAt)}</span>
                                      </div>
                                      {sale.dueDate && (
                                        <>
                                          <span className="text-gray-400">→</span>
                                          <div className="flex items-center gap-1 text-orange-600">
                                            <Clock className="w-4 h-4" />
                                            <span>Hạn: {formatDate(sale.dueDate)}</span>
                                          </div>
                                        </>
                                      )}
                                    </div>

                                    {/* Dispute Details Section */}
                                    {sale.status === 'DISPUTE' && disputeDetailsMap.get(sale.id) && (
                                      <div className="mt-4 border-t-2 border-red-200 pt-4">
                                        {(() => {
                                          const dispute = disputeDetailsMap.get(sale.id);
                                          if (!dispute) return null;

                                          return (
                                            <div className="space-y-3">
                                              {/* Header */}
                                              <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-lg font-bold text-red-700 flex items-center gap-2">
                                                  <AlertCircle size={20} />
                                                  Thông tin khiếu nại từ Buyer
                                                </h4>
                                                {dispute.resolvedAt ? (
                                                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                                    ✅ Đã xử lý
                                                  </span>
                                                ) : (
                                                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                                                    ⏳ Đang xử lý
                                                  </span>
                                                )}
                                              </div>

                                              {/* Dispute Info */}
                                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                                <p className="text-xs text-gray-600 mb-1">
                                                  Mã khiếu nại: #{dispute.id} | Ngày tạo: {new Date(dispute.createdAt).toLocaleString('vi-VN')}
                                                </p>
                                              </div>

                                              {/* Buyer's Complaint */}
                                              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                                                <div className="flex items-start gap-2 mb-2">
                                                  <FileText className="text-red-600 mt-1" size={18} />
                                                  <h5 className="text-sm font-bold text-gray-800">Lời khai của Buyer:</h5>
                                                </div>
                                                <div className="bg-white rounded-lg p-3 border border-red-200">
                                                  <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                                                    {dispute.reason}
                                                  </p>
                                                </div>
                                              </div>

                                              {/* Admin Response */}
                                              {dispute.adminNote ? (
                                                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                                                  <div className="flex items-start gap-2 mb-2">
                                                    <CheckCircle className="text-blue-600 mt-1" size={18} />
                                                    <div className="flex-1">
                                                      <h5 className="text-sm font-bold text-gray-800">Kết luận từ Admin:</h5>
                                                      {dispute.resolvedAt && (
                                                        <p className="text-xs text-green-600">
                                                          Xử lý vào: {new Date(dispute.resolvedAt).toLocaleString('vi-VN')}
                                                        </p>
                                                      )}
                                                    </div>
                                                  </div>
                                                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                                                    <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                                                      {dispute.adminNote}
                                                    </p>
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                                  <div className="flex items-center gap-2">
                                                    <Clock className="text-yellow-600" size={18} />
                                                    <p className="text-sm text-yellow-800">
                                                      ⏳ Khiếu nại đang được Admin xem xét. Vui lòng chờ kết quả xử lý.
                                                    </p>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })()}
                                      </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-3 flex-wrap mt-4">
                                      {sale.status === 'PAID' && (
                                        <button
                                          onClick={() => handleOpenShippingModal(sale)}
                                          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                                        >
                                          ✍️ Nhập mã vận đơn
                                        </button>
                                      )}
                                      {sale.status === 'PENDING' && isOverdue(sale) && (
                                        <button
                                          onClick={() => handleReportNonPayment(sale)}
                                          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
                                        >
                                          <AlertCircle className="w-5 h-5" />
                                          Báo cáo bùng hàng
                                        </button>
                                      )}
                                      {sale.status === 'COMPLETED' && (
                                        <div className="flex items-center gap-2 text-green-600">
                                          <CheckCircle className="w-5 h-5" />
                                          <span className="font-semibold">Đã hoàn thành</span>
                                        </div>
                                      )}
                                      {sale.status === 'COMPLETED' && (
                                        sale.hasFeedback ? (
                                          <div className="px-6 py-2 bg-gray-100 text-gray-500 rounded-lg font-semibold flex items-center gap-2 cursor-not-allowed">
                                            <CheckCircle className="w-5 h-5" />
                                            Đã đánh giá
                                          </div>
                                        ) : (
                                          <button
                                            onClick={() => handleOpenFeedback(sale)}
                                            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold flex items-center gap-2"
                                          >
                                            <Star className="w-4 h-4" />
                                            Đánh giá người mua
                                          </button>
                                        )
                                      )}
                                      <button
                                        onClick={() => handleOpenOrderDetail(sale)}
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                      >
                                        📄 Chi tiết đơn hàng
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Pagination */}
                          {salesTotalPages > 1 && (
                            <Pagination
                              currentPage={salesPage}
                              totalPages={salesTotalPages}
                              onPageChange={setSalesPage}
                              itemsPerPage={pageSize}
                              totalItems={salesTotalElements}
                            />
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Sub-tab: Phí Giá Sàn (LISTING_FEE) */}
                  {orderSubTab === 'fees' && (
                    <div>
                      {/* Filter */}
                      <div className="flex gap-2 mb-6 flex-wrap">
                        <button
                          onClick={() => {
                            setSelectedFeesStatus(undefined);
                            setFeesPage(1);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${!selectedFeesStatus
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          Tất cả
                        </button>
                        {(['PENDING', 'PAID'] as InvoiceStatus[]).map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setSelectedFeesStatus(status);
                              setFeesPage(1);
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedFeesStatus === status
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {translateOrderStatus(status)}
                          </button>
                        ))}
                      </div>

                      {/* Loading State */}
                      {isLoadingFees ? (
                        <div className="text-center py-12">
                          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
                          <p className="text-gray-600">Đang tải phí giá sàn...</p>
                        </div>
                      ) : fees.length === 0 ? (
                        <div className="text-center py-12">
                          <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-600">Không có phí giá sàn nào</p>
                        </div>
                      ) : (
                        <>
                          {/* Fees List */}
                          <div className="space-y-4 mb-6">
                            {fees.map((fee) => (
                              <div
                                key={fee.id}
                                className="bg-gradient-to-r from-white to-orange-50 border border-orange-100 rounded-xl p-6 hover:shadow-lg transition-shadow"
                              >
                                <div className="flex gap-6">
                                  {/* Image */}
                                  {fee.product.images && fee.product.images[0] && (
                                    <img
                                      src={fee.product.images[0].url}
                                      alt={fee.product.name}
                                      className="w-32 h-32 object-cover rounded-lg"
                                    />
                                  )}

                                  {/* Content */}
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                          Mã hóa đơn: <span className="font-semibold text-gray-700">FEE-{fee.id}</span>
                                        </p>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                          {fee.product.name}
                                        </h3>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(fee.status)}`}>
                                          {translateOrderStatus(fee.status)}
                                        </span>
                                        <span className="ml-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                                          💰 Phí Giá Sàn (5%)
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm text-gray-500">Số tiền</p>
                                        <p className="text-2xl font-bold text-orange-600">
                                          {formatCurrency(fee.finalPrice)}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="flex items-center gap-3 text-sm mb-3">
                                      <div className="flex items-center gap-1 text-green-600">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Tạo: {formatDate(fee.createdAt)}</span>
                                      </div>
                                      {fee.dueDate && fee.status === 'PENDING' && (
                                        <>
                                          <span className="text-gray-400">→</span>
                                          <div className="flex items-center gap-1 text-orange-600">
                                            <Clock className="w-4 h-4" />
                                            <span>Hạn thanh toán: {formatDate(fee.dueDate)}</span>
                                          </div>
                                        </>
                                      )}
                                      {fee.paymentTime && fee.status === 'PAID' && (
                                        <>
                                          <span className="text-gray-400">→</span>
                                          <div className="flex items-center gap-1 text-blue-600">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Đã thanh toán: {formatDate(fee.paymentTime)}</span>
                                          </div>
                                        </>
                                      )}
                                    </div>

                                    {/* Status Actions */}
                                    <div className="flex gap-3 flex-wrap">
                                      {fee.status === 'PENDING' && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                                          <Clock className="w-5 h-5 text-yellow-600" />
                                          <span className="text-yellow-700 font-semibold">Chờ thanh toán - Vui lòng thanh toán để kích hoạt phiên đấu giá</span>
                                        </div>
                                      )}
                                      {fee.status === 'PAID' && (
                                        <div className="flex items-center gap-2 text-green-600">
                                          <CheckCircle className="w-5 h-5" />
                                          <span className="font-semibold">Đã hoàn tất thanh toán</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Pagination */}
                          {feesTotalPages > 1 && (
                            <Pagination
                              currentPage={feesPage}
                              totalPages={feesTotalPages}
                              onPageChange={setFeesPage}
                              itemsPerPage={pageSize}
                              totalItems={feesTotalElements}
                            />
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Thống Kê */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  {isLoadingStats ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
                      <p className="text-gray-600">Đang tải thống kê...</p>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-block p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
                        <TrendingUp className="w-16 h-16 text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Thống Kê Cửa Hàng
                      </h2>
                      <p className="text-gray-600 mb-8">
                        Tổng quan về hoạt động kinh doanh của bạn
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-8 shadow-lg">
                          <Package className="w-12 h-12 mx-auto mb-4 opacity-90" />
                          <p className="text-5xl font-bold mb-3">{stats.totalAuctions}</p>
                          <p className="text-lg opacity-90">Tổng phiên đấu giá đã tạo</p>
                          <p className="text-sm opacity-75 mt-2">Từ khi bắt đầu hoạt động</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-xl p-8 shadow-lg">
                          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-90" />
                          <p className="text-4xl font-bold mb-3">{formatCurrency(stats.totalRevenue)}</p>
                          <p className="text-lg opacity-90">Tổng doanh thu</p>
                          <p className="text-sm opacity-75 mt-2">Từ các đơn hàng hoàn thành</p>
                        </div>
                      </div>
                      {/* Additional Info */}
                      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl max-w-4xl mx-auto">
                        <p className="text-blue-800 font-semibold mb-2">📊 Thông tin bổ sung</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="bg-white rounded-lg p-4">
                            <p className="text-gray-600">Đang hoạt động</p>
                            <p className="text-2xl font-bold text-green-600">{stats.activeAuctions}</p>
                            <p className="text-xs text-gray-500 mt-1">Phiên đấu giá</p>
                          </div>
                          <div className="bg-white rounded-lg p-4">
                            <p className="text-gray-600">Đã bán thành công</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.soldItems}</p>
                            <p className="text-xs text-gray-500 mt-1">Sản phẩm</p>
                          </div>
                          <div className="bg-white rounded-lg p-4">
                            <p className="text-gray-600">Chờ giao hàng</p>
                            <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
                            <p className="text-xs text-gray-500 mt-1">Đơn hàng</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedOrder && (
        <>
          <ShippingTrackingModal
            isOpen={showShippingModal}
            onClose={() => setShowShippingModal(false)}
            onSubmit={handleSubmitTracking}
            orderId={`INV-${selectedOrder.id}`}
            productName={selectedOrder.product.name}
          />

          <OrderDetailModal
            isOpen={showOrderDetailModal}
            onClose={() => setShowOrderDetailModal(false)}
            order={selectedOrder}
          />
        </>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedInvoiceForFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Star className="text-yellow-500" size={24} />
                Đánh giá người mua
              </h2>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">Đơn hàng: #{selectedInvoiceForFeedback.id}</p>
              <p className="text-sm text-gray-600">Sản phẩm: {selectedInvoiceForFeedback.product.name}</p>
              <p className="text-sm font-bold text-gray-800 mt-1">
                Người mua: {selectedInvoiceForFeedback.user.firstName} {selectedInvoiceForFeedback.user.lastName}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Đánh giá <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFeedbackRating('POSITIVE')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${feedbackRating === 'POSITIVE'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300'
                    }`}
                >
                  <div className="text-2xl mb-1">👍</div>
                  <div className="text-sm font-semibold">Tích cực</div>
                </button>
                <button
                  onClick={() => setFeedbackRating('NEUTRAL')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${feedbackRating === 'NEUTRAL'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 hover:border-yellow-300'
                    }`}
                >
                  <div className="text-2xl mb-1">😐</div>
                  <div className="text-sm font-semibold">Trung lập</div>
                </button>
                <button
                  onClick={() => setFeedbackRating('NEGATIVE')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${feedbackRating === 'NEGATIVE'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-red-300'
                    }`}
                >
                  <div className="text-2xl mb-1">👎</div>
                  <div className="text-sm font-semibold">Tiêu cực</div>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhận xét (không bắt buộc)
              </label>
              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn với người mua..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateFeedback}
                disabled={isSubmittingFeedback || !feedbackRating}
                className="flex-1 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {isSubmittingFeedback ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </div>
          </div>
        </div>
      )}      {/* Custom Confirm Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-4">
              {confirmConfig.type === 'danger' && (
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              )}
              {confirmConfig.type === 'warning' && (
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
              )}
              {confirmConfig.type === 'info' && (
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {confirmConfig.title}
                </h3>
                <p className="text-gray-600 text-sm whitespace-pre-line">
                  {confirmConfig.message}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                {confirmConfig.cancelText || 'Hủy'}
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 px-6 py-2.5 text-white rounded-lg font-medium transition-colors ${confirmConfig.type === 'danger'
                  ? 'bg-red-600 hover:bg-red-700'
                  : confirmConfig.type === 'warning'
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {confirmConfig.confirmText || 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default SellerDashboard;
