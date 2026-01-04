import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from './header';
import Footer from './footer';
import { auctionService } from '@/services/auctionService';
import { invoiceService } from '@/services/invoiceService';
import { paymentService } from '@/services/paymentService';
import { addressService, type AddressResponse, type AddressRequest } from '@/services/addressService';
import { userService } from '@/services/userService';
import { feedbackService } from '@/services/feedbackService';
import { useAuthStore } from '@/stores/useAuthStore';
import type { InvoiceResponse, DisputeResponse } from '@/types/invoice';
import type { AuctionSessionResponse } from '@/types/auction';
import type { UserProfileResponse } from '@/types/user';
import type { FeedbackRequest, FeedbackRating } from '@/types/feedback';
import Pagination from '@/components/ui/pagination';
import {
  ShoppingCart,
  Package,
  Wallet,
  Settings,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Plus,
  X,
  FileText, ChevronRight, Loader2,
  DollarSign,
  Truck,
  Copy,
  ExternalLink
} from 'lucide-react';

// Types for Orders tab
type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED_NON_PAYMENT' | 'CANCELLED_BY_SELLER' | 'DISPUTE' | 'REFUNDED';



const UserDetail = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('active-bids');

  // User profile state
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [totalFeedback, setTotalFeedback] = useState<number>(0);

  // API State for joined auctions
  const [activeAuctions, setActiveAuctions] = useState<AuctionSessionResponse[]>([]);
  const [endedAuctions, setEndedAuctions] = useState<AuctionSessionResponse[]>([]);
  const [isLoadingActive, setIsLoadingActive] = useState(false);
  const [isLoadingEnded, setIsLoadingEnded] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [endedPage, setEndedPage] = useState(1);
  const [activeTotalPages, setActiveTotalPages] = useState(1);
  const [endedTotalPages, setEndedTotalPages] = useState(1);
  const [activeTotalElements, setActiveTotalElements] = useState(0);
  const [endedTotalElements, setEndedTotalElements] = useState(0);
  const pageSize = 5;

  // Invoices state with pagination
  const [pendingInvoices, setPendingInvoices] = useState<InvoiceResponse[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [invoicePage, setInvoicePage] = useState(1);
  const [invoiceTotalPages, setInvoiceTotalPages] = useState(1);
  const [invoiceTotalElements, setInvoiceTotalElements] = useState(0);
  const invoicePageSize = 5;

  // Selected address for payment
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<InvoiceResponse | null>(null);

  // Address management
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showCreateAddressModal, setShowCreateAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState<AddressRequest>({
    recipientName: '',
    phoneNumber: '',
    street: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false
  });

  // Orders state (real data from API)
  const [paidOrders, setPaidOrders] = useState<InvoiceResponse[]>([]);
  const [shippingOrders, setShippingOrders] = useState<InvoiceResponse[]>([]);
  const [completedOrders, setCompletedOrders] = useState<InvoiceResponse[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [ordersTotalElements, setOrdersTotalElements] = useState(0);
  const ordersPageSize = 5;
  const [orderStatusTab, setOrderStatusTab] = useState<OrderStatus>('SHIPPING');

  // Disputes state
  const [disputeInvoices, setDisputeInvoices] = useState<InvoiceResponse[]>([]);
  const [disputeDetailsMap, setDisputeDetailsMap] = useState<Map<number, DisputeResponse>>(new Map());
  const [isLoadingDisputes, setIsLoadingDisputes] = useState(false);
  const [disputesPage, setDisputesPage] = useState(1);
  const [disputesTotalPages, setDisputesTotalPages] = useState(1);
  const [disputesTotalElements, setDisputesTotalElements] = useState(0);
  const disputesPageSize = 2;

  // Feedback modal states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInvoiceForFeedback, setSelectedInvoiceForFeedback] = useState<InvoiceResponse | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<FeedbackRating>('POSITIVE');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Dispute modal states
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedInvoiceForDispute, setSelectedInvoiceForDispute] = useState<InvoiceResponse | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  // Dispute detail viewing state
  const [showDisputeDetailModal, setShowDisputeDetailModal] = useState(false);
  const [disputeDetail, setDisputeDetail] = useState<DisputeResponse | null>(null);
  const [isLoadingDispute, setIsLoadingDispute] = useState(false);

  // Confirm dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedInvoiceForConfirm, setSelectedInvoiceForConfirm] = useState<InvoiceResponse | null>(null);

  const [copiedCode, setCopiedCode] = useState('');

  // Fetch user profile and total feedback on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const [profileRes, feedbackRes] = await Promise.all([
          userService.getMyProfile(),
          feedbackService.getMyTotalFeedback()
        ]);
        setUser(profileRes.data);
        setTotalFeedback(feedbackRes.data);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        toast.error('Không thể tải thông tin người dùng');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch active auctions
  useEffect(() => {
    if (activeTab === 'buying' && activeSubTab === 'active-bids') {
      fetchActiveAuctions();
    }
  }, [activeTab, activeSubTab, activePage]);

  // Fetch ended auctions
  useEffect(() => {
    if (activeTab === 'buying' && activeSubTab === 'ended') {
      fetchEndedAuctions();
    }
  }, [activeTab, activeSubTab, endedPage]);

  // Fetch pending invoices
  useEffect(() => {
    if (activeTab === 'buying' && activeSubTab === 'pending-payment') {
      fetchPendingInvoices();
    }
  }, [activeTab, activeSubTab, invoicePage]);

  // Fetch addresses when address modal opens
  useEffect(() => {
    if (showAddressModal) {
      fetchAddresses();
    }
  }, [showAddressModal]);

  // Fetch addresses when viewing account info tab
  useEffect(() => {
    if (activeTab === 'account') {
      fetchAddresses();
    }
  }, [activeTab]);

  // Fetch orders when viewing 'buying' tab with 'orders' subtab
  useEffect(() => {
    if (activeTab === 'buying' && activeSubTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, activeSubTab, orderStatusTab, ordersPage]);

  // Fetch disputes when viewing 'disputes' subtab
  useEffect(() => {
    if (activeTab === 'buying' && activeSubTab === 'disputes') {
      fetchDisputes();
    }
  }, [activeTab, activeSubTab, disputesPage]);

  const fetchActiveAuctions = async () => {
    try {
      setIsLoadingActive(true);
      const response = await auctionService.getMyJoinedSessions({
        status: 'ACTIVE',
        page: activePage,
        size: pageSize
      });
      setActiveAuctions(response.data.data);
      setActiveTotalPages(response.data.totalPages);
      setActiveTotalElements(response.data.totalElements);
    } catch (error: any) {
      console.error('Error fetching active auctions:', error);
      toast.error('Không thể tải danh sách đấu giá đang diễn ra');
    } finally {
      setIsLoadingActive(false);
    }
  };

  const fetchEndedAuctions = async () => {
    try {
      setIsLoadingEnded(true);
      // Note: Backend should support status=ENDED,FAILED or multiple calls
      const response = await auctionService.getMyJoinedSessions({
        page: endedPage,
        size: pageSize
      });
      // Filter ENDED and FAILED on client side
      const filtered = response.data.data.filter(s => s.status === 'ENDED' || s.status === 'FAILED');
      setEndedAuctions(filtered);
      setEndedTotalPages(response.data.totalPages);
      setEndedTotalElements(response.data.totalElements);
    } catch (error: any) {
      console.error('Error fetching ended auctions:', error);
      toast.error('Không thể tải danh sách đấu giá đã kết thúc');
    } finally {
      setIsLoadingEnded(false);
    }
  };

  const fetchPendingInvoices = async () => {
    try {
      setIsLoadingInvoices(true);
      const response = await invoiceService.getMyInvoices({
        page: invoicePage,
        size: invoicePageSize,
        status: 'PENDING',
        type: 'AUCTION_SALE'
      });
      setPendingInvoices(response.data.data);
      setInvoiceTotalPages(response.data.totalPages);
      setInvoiceTotalElements(response.data.totalElements);
    } catch (error: any) {
      console.error('Error fetching pending invoices:', error);
      toast.error('Không thể tải danh sách hóa đơn chờ thanh toán');
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await invoiceService.getMyInvoices({
        page: ordersPage,
        size: ordersPageSize,
        status: orderStatusTab,
        type: 'AUCTION_SALE'
      });

      const orders = response.data.data;

      // Update state based on current tab
      if (orderStatusTab === 'PAID') {
        setPaidOrders(orders);
      } else if (orderStatusTab === 'SHIPPING') {
        setShippingOrders(orders);
      } else if (orderStatusTab === 'COMPLETED') {
        setCompletedOrders(orders);
      }

      setOrdersTotalPages(response.data.totalPages);
      setOrdersTotalElements(response.data.totalElements);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchDisputes = async () => {
    try {
      setIsLoadingDisputes(true);

      // Step 1: Fetch invoices with DISPUTE status
      const response = await invoiceService.getMyInvoices({
        page: disputesPage,
        size: disputesPageSize,
        status: 'DISPUTE',
        type: 'AUCTION_SALE'
      });

      const invoices = response.data.data;
      setDisputeInvoices(invoices);
      setDisputesTotalPages(response.data.totalPages);
      setDisputesTotalElements(response.data.totalElements);

      // Step 2: Fetch dispute details for each invoice
      const detailsMap = new Map<number, DisputeResponse>();
      await Promise.all(
        invoices.map(async (invoice) => {
          try {
            const disputeRes = await invoiceService.getDisputeByInvoice(invoice.id);
            detailsMap.set(invoice.id, disputeRes.data);
          } catch (error) {
            console.error(`Error fetching dispute for invoice ${invoice.id}:`, error);
          }
        })
      );
      setDisputeDetailsMap(detailsMap);
    } catch (error: any) {
      console.error('Error fetching disputes:', error);
      toast.error('Không thể tải danh sách khiếu nại');
    } finally {
      setIsLoadingDisputes(false);
    }
  };

  const handleCreateFeedback = async () => {
    if (!selectedInvoiceForFeedback) return;

    try {
      setIsSubmittingFeedback(true);
      const feedbackRequest: FeedbackRequest = {
        rating: feedbackRating,
        comment: feedbackComment || undefined
      };

      await feedbackService.createFeedback(selectedInvoiceForFeedback.id, feedbackRequest);
      toast.success('Đánh giá thành công!');
      setShowFeedbackModal(false);
      setFeedbackRating('POSITIVE');
      setFeedbackComment('');
      setSelectedInvoiceForFeedback(null);

      // Refresh orders to update feedback status
      fetchOrders();
    } catch (error: any) {
      console.error('Error creating feedback:', error);
      toast.error(error.response?.data?.message || 'Không thể gửi đánh giá');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleConfirmReceived = (invoice: InvoiceResponse) => {
    setSelectedInvoiceForConfirm(invoice);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedInvoiceForConfirm) return;

    try {
      await invoiceService.confirmInvoice(selectedInvoiceForConfirm.id);
      toast.success('Đã xác nhận nhận hàng thành công!');
      setShowConfirmDialog(false);
      setSelectedInvoiceForConfirm(null);
      // Refresh orders
      fetchOrders();
    } catch (error: any) {
      console.error('Error confirming invoice:', error);
      toast.error(error.response?.data?.message || 'Không thể xác nhận đơn hàng');
    }
  };

  const handleOpenDispute = (invoice: InvoiceResponse) => {
    setSelectedInvoiceForDispute(invoice);
    setDisputeReason('');
    setShowDisputeModal(true);
  };

  const handleSubmitDispute = async () => {
    if (!selectedInvoiceForDispute) return;

    if (!disputeReason.trim()) {
      toast.error('Vui lòng nhập lý do khiếu nại');
      return;
    }

    try {
      setIsSubmittingDispute(true);
      await invoiceService.reportDispute(selectedInvoiceForDispute.id, {
        reason: disputeReason
      });
      toast.success('Đã gửi khiếu nại thành công! Chúng tôi sẽ xem xét trong thời gian sớm nhất.');
      setShowDisputeModal(false);
      setDisputeReason('');
      setSelectedInvoiceForDispute(null);
      // Refresh orders
      fetchOrders();
    } catch (error: any) {
      console.error('Error submitting dispute:', error);
      toast.error(error.response?.data?.message || 'Không thể gửi khiếu nại');
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  const handleViewDispute = async (invoice: InvoiceResponse) => {
    try {
      setIsLoadingDispute(true);
      setShowDisputeDetailModal(true);
      const response = await invoiceService.getDisputeByInvoice(invoice.id);
      setDisputeDetail(response.data);
    } catch (error: any) {
      console.error('Error fetching dispute:', error);
      toast.error('Không thể tải thông tin khiếu nại');
      setShowDisputeDetailModal(false);
    } finally {
      setIsLoadingDispute(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getOrderStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'PENDING': 'text-yellow-600 bg-yellow-50',
      'PAID': 'text-blue-600 bg-blue-50',
      'SHIPPING': 'text-purple-600 bg-purple-50',
      'COMPLETED': 'text-green-600 bg-green-50',
      'CANCELLED_NON_PAYMENT': 'text-red-600 bg-red-50',
      'CANCELLED_BY_SELLER': 'text-red-600 bg-red-50',
      'DISPUTE': 'text-orange-600 bg-orange-50',
      'REFUNDED': 'text-gray-600 bg-gray-50'
    };
    return statusColors[status] || 'text-gray-600 bg-gray-50';
  };

  const getOrderStatusText = (status: string) => {
    const statusTexts: { [key: string]: string } = {
      'PENDING': '⏳ Chờ thanh toán',
      'PAID': '💰 Đã thanh toán',
      'SHIPPING': '🚚 Đang giao hàng',
      'COMPLETED': '✅ Đã hoàn thành',
      'CANCELLED_NON_PAYMENT': '❌ Đã hủy - Chưa thanh toán',
      'CANCELLED_BY_SELLER': '❌ Đã hủy bởi người bán',
      'DISPUTE': '⚠️ Tranh chấp',
      'REFUNDED': '💸 Đã hoàn tiền'
    };
    return statusTexts[status] || status;
  };

  const getTrackingUrl = (carrier?: string, trackingCode?: string) => {
    if (!carrier || !trackingCode) return null;

    const carrierUrls: { [key: string]: string } = {
      'GHTK': `https://i.ghtk.vn/${trackingCode}`,
      'GHN': `https://donhang.ghn.vn/?order_code=${trackingCode}`,
      'ViettelPost': `https://viettelpost.com.vn/tra-cuu-hanh-trinh-don/${trackingCode}`,
      'BEST': `https://best-inc.vn/vi/tracking?billcode=${trackingCode}`
    };

    return carrierUrls[carrier] || `https://www.google.com/search?q=${trackingCode}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (lastName) {
      return lastName.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getReputationColor = (score: number) => {
    if (score >= 50) return 'text-green-600';
    if (score >= 20) return 'text-blue-600';
    if (score >= 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStrikeColor = (count: number) => {
    if (count === 0) return 'text-green-600';
    if (count === 1) return 'text-yellow-600';
    if (count === 2) return 'text-orange-600';
    return 'text-red-600';
  };

  const handlePaymentClick = (invoice: InvoiceResponse) => {
    setSelectedInvoiceForPayment(invoice);
    setShowAddressModal(true);
  };

  const handleProceedPayment = async () => {
    if (!selectedInvoiceForPayment || !selectedAddressId) {
      toast.error('Vui lòng chọn địa chỉ nhận hàng');
      return;
    }

    try {
      const response = await paymentService.createVnPayPayment(
        selectedInvoiceForPayment.id,
        selectedAddressId
      );
      // Redirect to VNPay payment URL
      window.location.href = response.data;
    } catch (error: any) {
      console.error('Error creating payment:', error);
      toast.error('Không thể tạo thanh toán. Vui lòng thử lại.');
    }
  };

  const fetchAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const response = await addressService.getMyAddresses();
      setAddresses(response.data);
      // Auto-select default address
      const defaultAddr = response.data.find(addr => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    } catch (error: any) {
      console.error('Error fetching addresses:', error);
      toast.error('Không thể tải danh sách địa chỉ');
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleCreateAddress = async () => {
    // Validate
    if (!newAddress.recipientName || !newAddress.phoneNumber || !newAddress.street ||
      !newAddress.ward || !newAddress.district || !newAddress.city) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const response = await addressService.createAddress(newAddress);
      toast.success('Đã thêm địa chỉ mới');
      setShowCreateAddressModal(false);
      // Refresh addresses
      await fetchAddresses();
      // Auto-select newly created address
      setSelectedAddressId(response.data.id);
      // Reset form
      setNewAddress({
        recipientName: '',
        phoneNumber: '',
        street: '',
        ward: '',
        district: '',
        city: '',
        isDefault: false
      });
    } catch (error: any) {
      console.error('Error creating address:', error);
      toast.error('Không thể thêm địa chỉ');
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;

    try {
      await addressService.deleteAddress(addressId);
      toast.success('Đã xóa địa chỉ');
      await fetchAddresses();
    } catch (error: any) {
      console.error('Error deleting address:', error);
      toast.error('Không thể xóa địa chỉ');
    }
  };

  // Tabs Configuration
  const tabs = [
    { id: 'dashboard', label: 'Tổng quan', icon: TrendingUp },
    { id: 'buying', label: 'Hoạt động Mua', icon: ShoppingCart },
    { id: 'settings', label: 'Cài đặt', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {isLoadingProfile ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
        </div>
      ) : !user ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Không thể tải thông tin người dùng</p>
        </div>
      ) : (
        <main className="container mx-auto px-4 py-6 mt-20 max-w-7xl">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar with Initials */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-indigo-800 flex items-center justify-center text-4xl font-bold">
                  {getInitials(user.firstName, user.lastName)}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{`${user.firstName} ${user.lastName}`.trim() || user.username}</h1>
                <p className="text-indigo-100 mb-4">{user.email}</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Reputation Score */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="text-yellow-300" size={20} fill="currentColor" />
                      <span className="text-sm">Điểm uy tín</span>
                    </div>
                    <p className={`text-2xl font-bold ${getReputationColor(user.reputationScore)}`}>
                      {user.reputationScore}
                    </p>
                  </div>

                  {/* Total Feedback */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="text-blue-300" size={20} />
                      <span className="text-sm">Đánh giá</span>
                    </div>
                    <p className="text-2xl font-bold">{totalFeedback}</p>
                  </div>

                  {/* Strikes */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="text-red-300" size={20} />
                      <span className="text-sm">Cảnh báo</span>
                    </div>
                    <p className={`text-2xl font-bold ${getStrikeColor(user.strikeCount)}`}>
                      {user.strikeCount}/3
                    </p>
                    {user.strikeCount > 0 && (
                      <p className="text-xs text-red-200 mt-1">⚠️ Cẩn thận vi phạm!</p>
                    )}
                  </div>

                  {/* Account Status */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className={user.isActive ? 'text-green-300' : 'text-gray-300'} size={20} />
                      <span className="text-sm">Trạng thái</span>
                    </div>
                    <p className="text-lg font-bold">
                      {user.isActive ? 'Hoạt động' : 'Tạm khóa'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <div className="col-span-12 lg:col-span-3">
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                  <h2 className="font-bold text-gray-800">Điều hướng</h2>
                </div>
                <nav className="p-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          if (tab.id === 'buying') setActiveSubTab('active-bids');
                          if (tab.id === 'selling') setActiveSubTab('active-listings');
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 ${activeTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{tab.label}</span>
                        <ChevronRight size={16} className="ml-auto" />
                      </button>
                    );
                  })}

                  {/* Seller Dashboard Button */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => navigate('/seller/dashboard')}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl"
                    >
                      <Package size={20} />
                      <span className="font-medium">Seller Dashboard</span>
                      <ChevronRight size={16} className="ml-auto" />
                    </button>
                  </div>
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="col-span-12 lg:col-span-9">
              <div className="bg-white rounded-xl shadow-md p-6">
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <TrendingUp className="text-indigo-600" />
                      Tổng quan
                    </h2>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-red-500 text-white p-2 rounded-lg">
                            <AlertCircle size={24} />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-red-600">{invoiceTotalElements}</p>
                            <p className="text-sm text-gray-600">Chờ thanh toán</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('buying');
                            setActiveSubTab('pending-payment');
                          }}
                          className="text-red-600 text-sm font-medium hover:underline"
                        >
                          Xem ngay →
                        </button>
                      </div>

                      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-purple-500 text-white p-2 rounded-lg">
                            <Package size={24} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Quản lý bán hàng</p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate('/seller/dashboard')}
                          className="text-purple-600 text-sm font-medium hover:underline"
                        >
                          Mở Seller Dashboard →
                        </button>
                      </div>

                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-green-500 text-white p-2 rounded-lg">
                            <TrendingUp size={24} />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-green-600">
                              {activeAuctions.filter(a => a.highestBidder?.username === currentUser?.username).length}
                            </p>
                            <p className="text-sm text-gray-600">Đang dẫn đầu</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('buying');
                            setActiveSubTab('active-bids');
                          }}
                          className="text-green-600 text-sm font-medium hover:underline"
                        >
                          Xem ngay →
                        </button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Thống kê tháng này</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-gray-700 font-semibold">Tổng chi tiêu</h4>
                            <ShoppingCart className="text-blue-600" size={24} />
                          </div>
                          <p className="text-3xl font-bold text-blue-600">67.000.000 ₫</p>
                          <p className="text-sm text-gray-600 mt-2">+15% so với tháng trước</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-gray-700 font-semibold">Doanh thu</h4>
                            <DollarSign className="text-green-600" size={24} />
                          </div>
                          <p className="text-3xl font-bold text-green-600">89.000.000 ₫</p>
                          <p className="text-sm text-gray-600 mt-2">+23% so với tháng trước</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Buying Tab */}
                {activeTab === 'buying' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <ShoppingCart className="text-indigo-600" />
                      Hoạt động Mua
                    </h2>

                    {/* Sub-tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto">
                      <button
                        onClick={() => {
                          setActiveSubTab('active-bids');
                          setActivePage(1);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeSubTab === 'active-bids'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        Đang đấu giá ({activeTotalElements})
                      </button>
                      <button
                        onClick={() => {
                          setActiveSubTab('ended');
                          setEndedPage(1);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeSubTab === 'ended'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        Đã kết thúc ({endedTotalElements})
                      </button>
                      <button
                        onClick={() => setActiveSubTab('pending-payment')}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeSubTab === 'pending-payment'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        Chờ thanh toán ({invoiceTotalElements})
                      </button>
                      <button
                        onClick={() => {
                          setActiveSubTab('orders');
                          setOrdersPage(1);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeSubTab === 'orders'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        Đơn mua ({ordersTotalElements})
                      </button>
                      <button
                        onClick={() => {
                          setActiveSubTab('disputes');

                        }}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeSubTab === 'disputes'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        Khiếu nại
                      </button>
                    </div>

                    {/* Active Bids */}
                    {activeSubTab === 'active-bids' && (
                      <div>
                        {isLoadingActive ? (
                          <div className="text-center py-12">
                            <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
                            <p className="text-gray-600">Đang tải...</p>
                          </div>
                        ) : activeAuctions.length === 0 ? (
                          <div className="text-center py-12">
                            <Package size={64} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">Bạn chưa tham gia phiên đấu giá nào</p>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-4 mb-6">
                              {activeAuctions.map((auction) => {
                                const isWinning = auction.highestBidder?.username === currentUser?.username;
                                const productImage = auction.product.images?.[0]?.url || 'https://via.placeholder.com/300';

                                return (
                                  <div
                                    key={auction.id}
                                    className="boyrder-2 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/auction/${auction.id}`)}
                                  >
                                    <div className="flex gap-4">
                                      <img
                                        src={productImage}
                                        alt={auction.product.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                      />
                                      <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 mb-2">{auction.product.name}</h3>
                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                          <div>
                                            <p className="text-xs text-gray-500">Giá hiện tại</p>
                                            <p className="text-lg font-bold text-indigo-600">
                                              {formatCurrency(auction.currentPrice)}
                                            </p>
                                          </div>
                                          {auction.myMaxBid && (
                                            <div>
                                              <p className="text-xs text-gray-500">Giá tối đa của bạn</p>
                                              <p className="text-lg font-bold text-gray-700">
                                                {formatCurrency(auction.myMaxBid)}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-gray-500" />
                                            <span className="text-sm text-gray-600">
                                              Kết thúc: {new Date(auction.endTime).toLocaleString('vi-VN')}
                                            </span>
                                          </div>
                                          {isWinning ? (
                                            <span className="flex items-center gap-2 text-green-600 font-medium text-sm bg-green-50 px-3 py-1 rounded-full">
                                              <CheckCircle size={16} />
                                              Đang thắng
                                            </span>
                                          ) : (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/auction/${auction.id}`);
                                              }}
                                              className="flex items-center gap-2 text-white font-medium text-sm bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
                                            >
                                              <AlertCircle size={16} />
                                              Đấu lại
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Pagination */}
                            {activeTotalPages > 1 && (
                              <Pagination
                                currentPage={activePage}
                                totalPages={activeTotalPages}
                                onPageChange={setActivePage}
                                itemsPerPage={pageSize}
                                totalItems={activeTotalElements}
                              />
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* Ended Auctions Tab */}
                    {activeSubTab === 'ended' && (
                      <div>
                        {isLoadingEnded ? (
                          <div className="text-center py-12">
                            <Loader2 className="w-12 h-12 animate-spin text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-600">Đang tải...</p>
                          </div>
                        ) : endedAuctions.length === 0 ? (
                          <div className="text-center py-12">
                            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">Chưa có phiên đấu giá nào kết thúc</p>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-4 mb-6">
                              {endedAuctions.map((auction) => {
                                const isWinner = auction.highestBidder?.username === currentUser?.username;
                                const productImage = auction.product.images?.[0]?.url || 'https://via.placeholder.com/300';
                                const statusColors = {
                                  'ENDED': 'bg-blue-50 text-blue-700 border-blue-200',
                                  'FAILED': 'bg-red-50 text-red-700 border-red-200'
                                };

                                return (
                                  <div
                                    key={auction.id}
                                    className="border-2 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/auction/${auction.id}`)}
                                  >
                                    <div className="flex gap-4">
                                      <img
                                        src={productImage}
                                        alt={auction.product.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                      />
                                      <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                          <h3 className="font-bold text-gray-800">{auction.product.name}</h3>
                                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[auction.status as 'ENDED' | 'FAILED']}`}>
                                            {auction.status === 'ENDED' ? 'Đã kết thúc' : 'Thất bại'}
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                          <div>
                                            <p className="text-xs text-gray-500">Giá cuối cùng</p>
                                            <p className="text-lg font-bold text-gray-800">
                                              {formatCurrency(auction.currentPrice)}
                                            </p>
                                          </div>
                                          {auction.myMaxBid && (
                                            <div>
                                              <p className="text-xs text-gray-500">Giá của bạn</p>
                                              <p className="text-lg font-bold text-gray-600">
                                                {formatCurrency(auction.myMaxBid)}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <div className="text-sm text-gray-600">
                                            Kết thúc: {new Date(auction.endTime).toLocaleString('vi-VN')}
                                          </div>
                                          {isWinner && auction.status === 'ENDED' ? (
                                            <span className="flex items-center gap-2 text-green-600 font-medium text-sm bg-green-50 px-3 py-1 rounded-full">
                                              <CheckCircle size={16} />
                                              Bạn đã thắng
                                            </span>
                                          ) : (
                                            <span className="flex items-center gap-2 text-gray-600 font-medium text-sm bg-gray-50 px-3 py-1 rounded-full">
                                              <XCircle size={16} />
                                              Không thắng
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Pagination */}
                            {endedTotalPages > 1 && (
                              <Pagination
                                currentPage={endedPage}
                                totalPages={endedTotalPages}
                                onPageChange={setEndedPage}
                                itemsPerPage={pageSize}
                                totalItems={endedTotalElements}
                              />
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* Pending Payment */}
                    {activeSubTab === 'pending-payment' && (
                      <div>
                        {isLoadingInvoices ? (
                          <div className="text-center py-12">
                            <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
                            <p className="text-gray-600">Đang tải...</p>
                          </div>
                        ) : pendingInvoices.length === 0 ? (
                          <div className="text-center py-16 bg-gray-50 rounded-xl">
                            <Package size={64} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                              Không có hóa đơn chờ thanh toán
                            </h3>
                            <p className="text-gray-500 mb-6">
                              Bạn chưa có hóa đơn nào cần thanh toán
                            </p>
                            <button
                              onClick={() => navigate('/all-auctions')}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                            >
                              <Package size={20} />
                              Khám phá đấu giá
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-4 mb-6">
                              {pendingInvoices.map((invoice) => {
                                const productImage = invoice.product.images?.[0]?.url || 'https://via.placeholder.com/300';
                                const dueDate = new Date(invoice.dueDate);
                                const now = new Date();
                                const timeRemaining = Math.max(0, dueDate.getTime() - now.getTime());
                                const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
                                const isUrgent = hoursRemaining < 24;

                                return (
                                  <div
                                    key={invoice.id}
                                    className={`border-2 rounded-xl p-4 ${isUrgent ? 'border-red-300 bg-red-50' : 'border-orange-200 bg-orange-50'
                                      }`}
                                  >
                                    {isUrgent && timeRemaining > 0 && (
                                      <div className="flex items-center gap-2 mb-3 text-red-600 bg-red-100 px-3 py-2 rounded-lg">
                                        <AlertCircle size={18} />
                                        <span className="font-semibold text-sm">
                                          ⚠️ Còn {hoursRemaining} giờ để thanh toán! Sau đó đơn sẽ bị hủy.
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex gap-4">
                                      <img
                                        src={productImage}
                                        alt={invoice.product.name}
                                        className="w-24 h-24 object-cover rounded-lg border-2 border-white shadow-sm"
                                      />
                                      <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 mb-2">{invoice.product.name}</h3>
                                        <div className="flex items-baseline gap-2 mb-2">
                                          <p className="text-2xl font-bold text-orange-600">
                                            {formatCurrency(invoice.finalPrice)}
                                          </p>
                                          <span className="text-xs text-gray-500">
                                            (Giá khởi điểm: {formatCurrency(invoice.product.startPrice)})
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                          <div>
                                            <p className="text-xs text-gray-500">Ngày tạo:</p>
                                            <p className="font-medium">
                                              {new Date(invoice.createdAt).toLocaleDateString('vi-VN')}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-xs text-gray-500">Hạn thanh toán:</p>
                                            <p className={`font-medium ${isUrgent ? 'text-red-600' : ''}`}>
                                              {dueDate.toLocaleDateString('vi-VN')} {dueDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => handlePaymentClick(invoice)}
                                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                          >
                                            <Wallet size={18} />
                                            Thanh toán ngay
                                          </button>
                                          <button
                                            onClick={() => navigate(`/auction/${invoice.auctionSessionId}`)}
                                            className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                                          >
                                            Chi tiết
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Pagination */}
                            {invoiceTotalPages > 1 && (
                              <Pagination
                                currentPage={invoicePage}
                                totalPages={invoiceTotalPages}
                                onPageChange={setInvoicePage}
                                itemsPerPage={invoicePageSize}
                                totalItems={invoiceTotalElements}
                              />
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* My Orders */}
                    {activeSubTab === 'orders' && (
                      <div>
                        {/* Order Status Tabs */}
                        <div className="bg-gray-100 rounded-xl p-1 mb-6 flex gap-1">
                          <button
                            onClick={() => {
                              setOrderStatusTab('PAID');
                              setOrdersPage(1);
                            }}
                            className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${orderStatusTab === 'PAID'
                              ? 'bg-white text-blue-600 shadow-md'
                              : 'text-gray-600 hover:text-gray-800'
                              }`}
                          >
                            ⏳ Chờ lấy hàng
                          </button>
                          <button
                            onClick={() => {
                              setOrderStatusTab('SHIPPING');
                              setOrdersPage(1);
                            }}
                            className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${orderStatusTab === 'SHIPPING'
                              ? 'bg-white text-purple-600 shadow-md'
                              : 'text-gray-600 hover:text-gray-800'
                              }`}
                          >
                            🚚 Đang giao hàng
                          </button>
                          <button
                            onClick={() => {
                              setOrderStatusTab('COMPLETED');
                              setOrdersPage(1);
                            }}
                            className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${orderStatusTab === 'COMPLETED'
                              ? 'bg-white text-green-600 shadow-md'
                              : 'text-gray-600 hover:text-gray-800'
                              }`}
                          >
                            ✅ Đã hoàn thành
                          </button>
                        </div>

                        {/* Orders List */}
                        {isLoadingOrders ? (
                          <div className="text-center py-12">
                            <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
                            <p className="text-gray-600">Đang tải...</p>
                          </div>
                        ) : (() => {
                          const currentOrders = orderStatusTab === 'PAID' ? paidOrders : orderStatusTab === 'SHIPPING' ? shippingOrders : completedOrders;

                          if (currentOrders.length === 0) {
                            return (
                              <div className="text-center py-16 bg-gray-50 rounded-xl">
                                <Package size={64} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                  Chưa có đơn hàng nào
                                </h3>
                                <p className="text-gray-500 mb-6">
                                  {orderStatusTab === 'PAID' && 'Chưa có đơn hàng nào đang chờ lấy hàng'}
                                  {orderStatusTab === 'SHIPPING' && 'Chưa có đơn hàng nào đang được giao'}
                                  {orderStatusTab === 'COMPLETED' && 'Chưa có đơn hàng nào hoàn thành'}
                                </p>
                                <button
                                  onClick={() => navigate('/all-auctions')}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                                >
                                  <Package size={20} />
                                  Khám phá đấu giá
                                </button>
                              </div>
                            );
                          }

                          return (
                            <>
                              <div className="space-y-4 mb-6">
                                {currentOrders.map((invoice) => {
                                  const productImage = invoice.product.images?.[0]?.url || 'https://via.placeholder.com/300';
                                  return (
                                    <div
                                      key={invoice.id}
                                      className="bg-white border-2 border-gray-200 rounded-xl hover:shadow-lg transition-shadow overflow-hidden"
                                    >
                                      {/* Order Header */}
                                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 flex items-center justify-between border-b">
                                        <div className="flex items-center gap-2">
                                          <Package size={18} className="text-indigo-600" />
                                          <span className="font-semibold text-gray-800">Mã đơn: #{invoice.id}</span>
                                          <span className="text-gray-400">|</span>
                                          <span className="text-sm text-gray-600">Phiên: #{invoice.auctionSessionId}</span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(invoice.status)}`}>
                                          {getOrderStatusText(invoice.status)}
                                        </span>
                                      </div>

                                      {/* Order Body */}
                                      <div className="p-4">
                                        {/* Product Info */}
                                        <div className="flex gap-4 mb-4">
                                          <img
                                            src={productImage}
                                            alt={invoice.product.name}
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                          />
                                          <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-1">{invoice.product.name}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                              <span className="text-lg font-bold text-indigo-600">
                                                {formatCurrency(invoice.finalPrice)}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Shipping Info */}
                                        {invoice.status === 'SHIPPING' && invoice.carrier && invoice.trackingCode && (
                                          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3 mb-3">
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                <Truck className="text-blue-600" size={18} />
                                                <span className="font-semibold text-blue-800">Thông tin vận chuyển</span>
                                              </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                                              <div>
                                                <p className="text-blue-600">Đơn vị vận chuyển:</p>
                                                <p className="font-semibold text-blue-900">{invoice.carrier}</p>
                                              </div>
                                              <div>
                                                <p className="text-blue-600">Mã vận đơn:</p>
                                                <div className="flex items-center gap-2">
                                                  <p className="font-mono font-semibold text-blue-900">{invoice.trackingCode}</p>
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      copyToClipboard(invoice.trackingCode!);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                  >
                                                    {copiedCode === invoice.trackingCode ? (
                                                      <CheckCircle size={16} />
                                                    ) : (
                                                      <Copy size={16} />
                                                    )}
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                            {getTrackingUrl(invoice.carrier, invoice.trackingCode) && (
                                              <a
                                                href={getTrackingUrl(invoice.carrier, invoice.trackingCode)!}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                              >
                                                <ExternalLink size={16} />
                                                Tra cứu hành trình
                                              </a>
                                            )}
                                          </div>
                                        )}

                                        {/* Address */}
                                        {invoice.shippingAddress && (
                                          <div className="flex items-start gap-2 text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg">
                                            <MapPin size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                              <p className="font-medium text-gray-700">Địa chỉ nhận hàng:</p>
                                              <p>{invoice.recipientName} - {invoice.recipientPhone}</p>
                                              <p>{invoice.shippingAddress}</p>
                                            </div>
                                          </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-3 border-t">
                                          <button
                                            onClick={() => navigate(`/invoice/${invoice.id}`)}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                          >
                                            <FileText size={18} />
                                            Xem hóa đơn
                                          </button>

                                          {/* Confirm Received Button (only for SHIPPING status) */}
                                          {invoice.status === 'SHIPPING' && (
                                            <button
                                              onClick={() => handleConfirmReceived(invoice)}
                                              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                            >
                                              <CheckCircle size={18} />
                                              Đã nhận hàng
                                            </button>
                                          )}

                                          {/* Dispute Button (only for SHIPPING status) */}
                                          {invoice.status === 'SHIPPING' && (
                                            <button
                                              onClick={() => handleOpenDispute(invoice)}
                                              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                            >
                                              <AlertCircle size={18} />
                                              Khiếu nại
                                            </button>
                                          )}

                                          {/* View Dispute Button (only for DISPUTE status) */}
                                          {invoice.status === 'DISPUTE' && (
                                            <button
                                              onClick={() => handleViewDispute(invoice)}
                                              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                            >
                                              <AlertCircle size={18} />
                                              Xem chi tiết khiếu nại
                                            </button>
                                          )}

                                          {/* Feedback Button (only for COMPLETED status) */}
                                          {invoice.status === 'COMPLETED' && (
                                            invoice.hasFeedback ? (
                                              <div className="flex-1 bg-gray-100 text-gray-500 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                                                <CheckCircle size={18} />
                                                Đã đánh giá
                                              </div>
                                            ) : (
                                              <button
                                                onClick={() => {
                                                  setSelectedInvoiceForFeedback(invoice);
                                                  setShowFeedbackModal(true);
                                                }}
                                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                              >
                                                <Star size={18} />
                                                Đánh giá
                                              </button>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Pagination */}
                              {ordersTotalPages > 1 && (
                                <Pagination
                                  currentPage={ordersPage}
                                  totalPages={ordersTotalPages}
                                  onPageChange={setOrdersPage}
                                  itemsPerPage={ordersPageSize}
                                  totalItems={ordersTotalElements}
                                />
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {/* Disputes Tab */}
                {activeTab === 'buying' && activeSubTab === 'disputes' && (
                  <div>
                    {isLoadingDisputes ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
                        <p className="text-gray-600">Đang tải khiếu nại...</p>
                      </div>
                    ) : disputeInvoices.length === 0 ? (
                      <div className="text-center py-16 bg-gray-50 rounded-xl">
                        <AlertCircle size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                          Không có khiếu nại nào
                        </h3>
                        <p className="text-gray-500">
                          Bạn chưa có khiếu nại nào cho các đơn hàng
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 mb-6">
                          {disputeInvoices.map((invoice) => {
                            const dispute = disputeDetailsMap.get(invoice.id);
                            const productImage = invoice.product.images?.[0]?.url || 'https://via.placeholder.com/300';

                            return (
                              <div
                                key={invoice.id}
                                className="bg-white border-2 border-red-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                              >
                                {/* Header with status */}
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-red-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <AlertCircle className="text-red-600" size={28} />
                                      <div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                          Khiếu nại đơn hàng #{invoice.id}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                          Ngày tạo: {new Date(invoice.createdAt).toLocaleString('vi-VN')}
                                        </p>
                                      </div>
                                    </div>
                                    {dispute?.resolvedAt ? (
                                      <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full flex items-center gap-2">
                                        <CheckCircle size={18} />
                                        Đã xử lý
                                      </span>
                                    ) : (
                                      <span className="px-4 py-2 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full flex items-center gap-2">
                                        <Clock size={18} />
                                        Đang xử lý
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="p-6">
                                  {/* Product Information */}
                                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                      <Package size={18} />
                                      Thông tin sản phẩm
                                    </h4>
                                    <div className="flex gap-4">
                                      <img
                                        src={productImage}
                                        alt={invoice.product.name}
                                        className="w-24 h-24 object-cover rounded-lg border-2 border-white shadow-sm"
                                      />
                                      <div className="flex-1">
                                        <h5 className="font-bold text-gray-800 mb-2">{invoice.product.name}</h5>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                          <div>
                                            <p className="text-gray-600">Người bán</p>
                                            <p className="font-semibold text-gray-800">
                                              {invoice.product.seller.firstName} {invoice.product.seller.lastName}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-gray-600">Số điện thoại</p>
                                            <p className="font-semibold text-gray-800">
                                              {invoice.product.seller.phoneNumber}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-gray-600">Email người bán</p>
                                            <p className="font-semibold text-gray-800">{invoice.product.seller.email}</p>
                                          </div>
                                          <div>
                                            <p className="text-gray-600">Giá mua</p>
                                            <p className="font-bold text-indigo-600 text-lg">
                                              {formatCurrency(invoice.finalPrice)}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-gray-600">Trạng thái</p>
                                            <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                                              Khiếu nại
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Shipping Information */}
                                  {invoice.trackingCode && (
                                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Truck size={18} />
                                        Thông tin vận chuyển
                                      </h4>
                                      <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                          <p className="text-gray-600">Mã vận đơn</p>
                                          <p className="font-semibold text-gray-800">{invoice.trackingCode}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-600">Đơn vị vận chuyển</p>
                                          <p className="font-semibold text-gray-800">{invoice.carrier || 'Chưa cập nhật'}</p>
                                        </div>
                                        {invoice.shippedAt && (
                                          <div className="col-span-2">
                                            <p className="text-gray-600">Ngày giao hàng</p>
                                            <p className="font-semibold text-gray-800">
                                              {new Date(invoice.shippedAt).toLocaleString('vi-VN')}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Dispute Details */}
                                  {dispute ? (
                                    <>
                                      {/* Dispute Reason */}
                                      <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-4">
                                        <div className="flex items-start gap-3 mb-3">
                                          <FileText className="text-orange-600 mt-1" size={20} />
                                          <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-800 mb-1">
                                              Lý do khiếu nại của bạn
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                              Mã khiếu nại: #{dispute.id} | Ngày gửi: {new Date(dispute.createdAt).toLocaleString('vi-VN')}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-orange-200">
                                          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                            {dispute.reason}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Admin Response */}
                                      {dispute.adminNote ? (
                                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                                          <div className="flex items-start gap-3 mb-3">
                                            <CheckCircle className="text-green-600 mt-1" size={20} />
                                            <div className="flex-1">
                                              <h4 className="text-sm font-bold text-gray-800 mb-1">
                                                Phản hồi từ Admin
                                              </h4>
                                              {dispute.resolvedAt && (
                                                <p className="text-xs text-green-600">
                                                  Xử lý vào: {new Date(dispute.resolvedAt).toLocaleString('vi-VN')}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                          <div className="bg-white rounded-lg p-4 border border-green-200">
                                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                              {dispute.adminNote}
                                            </p>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-4">
                                          <div className="flex items-center gap-3">
                                            <Clock className="text-yellow-600" size={20} />
                                            <div>
                                              <p className="text-sm font-semibold text-yellow-800">
                                                Đang chờ Admin xử lý
                                              </p>
                                              <p className="text-xs text-yellow-700 mt-1">
                                                Chúng tôi sẽ xem xét và phản hồi khiếu nại của bạn sớm nhất có thể
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                                      <div className="flex items-center gap-3">
                                        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                                        <p className="text-sm text-gray-600">
                                          Đang tải thông tin khiếu nại...
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Action Buttons */}
                                  <div className="flex gap-3 pt-4 border-t">
                                    <button
                                      onClick={() => navigate(`/invoice/${invoice.id}`)}
                                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                    >
                                      <FileText size={18} />
                                      Xem hóa đơn chi tiết
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Pagination */}
                        {disputesTotalPages > 1 && (
                          <Pagination
                            currentPage={disputesPage}
                            totalPages={disputesTotalPages}
                            onPageChange={setDisputesPage}
                            itemsPerPage={disputesPageSize}
                            totalItems={disputesTotalElements}
                          />
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Settings className="text-indigo-600" />
                      Cài đặt
                    </h2>

                    <div className="space-y-6">
                      {/* Profile Info */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Thông tin cá nhân</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Họ và tên
                            </label>
                            <input
                              type="text"
                              value={`${user.firstName} ${user.lastName}`}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              disabled
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              value={user.email}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              disabled
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Số điện thoại
                            </label>
                            <input
                              type="text"
                              value={user.phoneNumber || ''}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                            Cập nhật thông tin
                          </button>
                        </div>
                      </div>

                      {/* Address Book */}
                      <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-800">Sổ địa chỉ</h3>
                          <button
                            onClick={() => setShowCreateAddressModal(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            <Plus size={18} />
                            Thêm địa chỉ
                          </button>
                        </div>

                        {isLoadingAddresses ? (
                          <div className="text-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-2" />
                            <p className="text-gray-600 text-sm">Đang tải địa chỉ...</p>
                          </div>
                        ) : addresses.length === 0 ? (
                          <div className="text-center py-8 bg-gray-50 rounded-xl">
                            <MapPin size={48} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-gray-600">Bạn chưa có địa chỉ nào</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {addresses.map((addr) => (
                              <div
                                key={addr.id}
                                className={`border-2 rounded-xl p-4 ${addr.isDefault ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                                  }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-bold text-gray-800">{addr.recipientName}</h4>
                                      {addr.isDefault && (
                                        <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                                          Mặc định
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{addr.phoneNumber}</p>
                                    <p className="text-sm text-gray-700 flex items-start gap-2">
                                      <MapPin size={16} className="mt-0.5 text-gray-500 flex-shrink-0" />
                                      {addr.fullAddress}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteAddress(addr.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X size={18} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Create/Change Password */}
                      <div className="border-t pt-6">
                        {user.noPassword ? (
                          // Form TẠO mật khẩu (cho tài khoản Google)
                          <>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                              <div className="flex items-start">
                                <AlertCircle className="text-blue-600 mt-0.5 mr-3" size={20} />
                                <div>
                                  <h4 className="text-blue-800 font-semibold mb-1">Tài khoản Google</h4>
                                  <p className="text-blue-700 text-sm">
                                    Bạn đăng nhập bằng Google. Hãy tạo mật khẩu để có thể đăng nhập bằng email/password.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Tạo mật khẩu</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Mật khẩu mới
                                </label>
                                <input
                                  type="password"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Xác nhận mật khẩu
                                </label>
                                <input
                                  type="password"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Nhập lại mật khẩu mới"
                                />
                              </div>
                              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                Tạo mật khẩu
                              </button>
                            </div>
                          </>
                        ) : (
                          // Form ĐỔI mật khẩu (cho tài khoản thường)
                          <>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Đổi mật khẩu</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Mật khẩu hiện tại
                                </label>
                                <input
                                  type="password"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Nhập mật khẩu hiện tại"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Mật khẩu mới
                                </label>
                                <input
                                  type="password"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Nhập mật khẩu mới"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Xác nhận mật khẩu mới
                                </label>
                                <input
                                  type="password"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Nhập lại mật khẩu mới"
                                />
                              </div>
                              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                Đổi mật khẩu
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>
      )}

      {/* Address Selection Modal */}
      {showAddressModal && selectedInvoiceForPayment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Chọn địa chỉ nhận hàng</h2>
              <button
                onClick={() => {
                  setShowAddressModal(false);
                  setSelectedInvoiceForPayment(null);
                  setSelectedAddressId(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Invoice Info */}
              <div className="bg-indigo-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Thông tin đơn hàng</h3>
                <div className="flex gap-3">
                  <img
                    src={selectedInvoiceForPayment.product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                    alt={selectedInvoiceForPayment.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{selectedInvoiceForPayment.product.name}</p>
                    <p className="text-lg font-bold text-indigo-600">
                      {formatCurrency(selectedInvoiceForPayment.finalPrice)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address List */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Chọn địa chỉ giao hàng</h3>
                  <button
                    onClick={() => setShowCreateAddressModal(true)}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                  >
                    <Plus size={16} />
                    Thêm mới
                  </button>
                </div>

                {isLoadingAddresses ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Đang tải địa chỉ...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <MapPin size={48} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-600 mb-4">Bạn chưa có địa chỉ nào</p>
                    <button
                      onClick={() => setShowCreateAddressModal(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Thêm địa chỉ mới
                    </button>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedAddressId === addr.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-gray-800">{addr.recipientName}</h4>
                            {addr.isDefault && (
                              <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{addr.phoneNumber}</p>
                          <p className="text-sm text-gray-700 flex items-start gap-2">
                            <MapPin size={16} className="mt-0.5 text-gray-500 flex-shrink-0" />
                            {addr.fullAddress}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowAddressModal(false);
                    setSelectedInvoiceForPayment(null);
                    setSelectedAddressId(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleProceedPayment}
                  disabled={!selectedAddressId}
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Wallet size={20} />
                  Thanh toán {formatCurrency(selectedInvoiceForPayment.finalPrice)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Address Modal */}
      {showCreateAddressModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">Thêm địa chỉ mới</h2>
              <button
                onClick={() => setShowCreateAddressModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Recipient Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và tên người nhận <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAddress.recipientName}
                  onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                  placeholder="Nhập họ tên người nhận"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={newAddress.phoneNumber}
                  onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa chỉ cụ thể <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  placeholder="Số nhà, tên đường"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Ward, District, City */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phường/Xã <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAddress.ward}
                    onChange={(e) => setNewAddress({ ...newAddress, ward: e.target.value })}
                    placeholder="Phường/Xã"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quận/Huyện <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAddress.district}
                    onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                    placeholder="Quận/Huyện"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    placeholder="Tỉnh/Thành phố"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Set as Default */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateAddressModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateAddress}
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Lưu địa chỉ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedInvoiceForFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Đánh giá đơn hàng #{selectedInvoiceForFeedback.id}
              </h2>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Sản phẩm: {selectedInvoiceForFeedback.product.name}</p>
              <p className="text-sm text-gray-600">Giá: {selectedInvoiceForFeedback.finalPrice.toLocaleString('vi-VN')} ₫</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đánh giá của bạn
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFeedbackRating('POSITIVE')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${feedbackRating === 'POSITIVE'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-green-400'
                    }`}
                >
                  <span className="text-2xl">👍</span>
                  <div className="text-xs mt-1">Hài lòng</div>
                </button>
                <button
                  onClick={() => setFeedbackRating('NEUTRAL')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${feedbackRating === 'NEUTRAL'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-300 hover:border-yellow-400'
                    }`}
                >
                  <span className="text-2xl">😐</span>
                  <div className="text-xs mt-1">Bình thường</div>
                </button>
                <button
                  onClick={() => setFeedbackRating('NEGATIVE')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${feedbackRating === 'NEGATIVE'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-red-400'
                    }`}
                >
                  <span className="text-2xl">👎</span>
                  <div className="text-xs mt-1">Không hài lòng</div>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhận xét (không bắt buộc)
              </label>
              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
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
                className="flex-1 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {isSubmittingFeedback ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && selectedInvoiceForConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={24} />
                Xác nhận nhận hàng
              </h2>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">Đơn hàng: #{selectedInvoiceForConfirm.id}</p>
              <p className="text-sm text-gray-600">Sản phẩm: {selectedInvoiceForConfirm.product.name}</p>
              <p className="text-sm font-bold text-gray-800 mt-1">
                Giá: {formatCurrency(selectedInvoiceForConfirm.finalPrice)}
              </p>
            </div>

            <p className="text-gray-700 mb-6">
              Xác nhận bạn đã nhận được hàng và sản phẩm không có vấn đề gì?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && selectedInvoiceForDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle className="text-red-600" size={24} />
                Khiếu nại đơn hàng
              </h2>
              <button
                onClick={() => setShowDisputeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ Lưu ý: Chỉ khiếu nại nếu bạn chưa nhận được hàng hoặc hàng không đúng mô tả.
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Đơn hàng: #{selectedInvoiceForDispute.id}</p>
              <p className="text-sm text-gray-600">Sản phẩm: {selectedInvoiceForDispute.product.name}</p>
              <p className="text-sm font-bold text-gray-800">
                Giá: {formatCurrency(selectedInvoiceForDispute.finalPrice)}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do khiếu nại <span className="text-red-500">*</span>
              </label>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Nhập lý do khiếu nại của bạn..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={5}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDisputeModal(false)}
                className="flex-1 px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitDispute}
                disabled={isSubmittingDispute || !disputeReason}
                className="flex-1 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {isSubmittingDispute ? 'Đang gửi...' : 'Gửi khiếu nại'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Detail Modal (Viewing existing dispute) */}
      {showDisputeDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle className="text-orange-600" size={24} />
                Chi tiết khiếu nại
              </h2>
              <button
                onClick={() => {
                  setShowDisputeDetailModal(false);
                  setDisputeDetail(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {isLoadingDispute ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              </div>
            ) : disputeDetail ? (
              <>
                <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Mã khiếu nại: #{disputeDetail.id}</p>
                  <p className="text-sm text-gray-600">Đơn hàng: #{disputeDetail.invoiceId}</p>
                  <p className="text-sm text-gray-600">Ngày tạo: {new Date(disputeDetail.createdAt).toLocaleString('vi-VN')}</p>
                  {disputeDetail.resolvedAt && (
                    <p className="text-sm text-green-600 font-semibold">
                      ✅ Đã xử lý: {new Date(disputeDetail.resolvedAt).toLocaleString('vi-VN')}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lý do khiếu nại của bạn:</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800 whitespace-pre-wrap">{disputeDetail.reason}</p>
                  </div>
                </div>

                {disputeDetail.adminNote && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📋 Phản hồi từ Admin:
                    </label>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-gray-800 whitespace-pre-wrap">{disputeDetail.adminNote}</p>
                    </div>
                  </div>
                )}

                {!disputeDetail.resolvedAt && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                      ⏳ Khiếu nại đang được xử lý. Vui lòng đợi phản hồi từ Admin.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowDisputeDetailModal(false);
                    setDisputeDetail(null);
                  }}
                  className="w-full px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Đóng
                </button>
              </>
            ) : (
              <p className="text-center text-gray-600 py-8">Không có thông tin khiếu nại</p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserDetail;