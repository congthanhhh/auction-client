
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Package,
  Star,
  TrendingUp,
  ShoppingBag,
  Clock,
  MessageSquare,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Header from './header';
import Footer from './footer';
import Pagination from '@/components/ui/pagination';
import { userService } from '@/services/userService';
import { auctionService } from '@/services/auctionService';
import type { PublicUserProfileResponse } from '@/types/user';
import type { AuctionSessionResponse } from '@/types/auction';
import type { FeedbackDto, FeedbackRating } from '@/types/feedback';

type TabType = 'items' | 'feedback';
type FeedbackFilter = 'ALL' | 'SELLER' | 'BUYER';

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState<TabType>('items');
  const [feedbackFilter, setFeedbackFilter] = useState<FeedbackFilter>('ALL');
  const [user, setUser] = useState<PublicUserProfileResponse | null>(null);
  const [items, setItems] = useState<AuctionSessionResponse[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackDto[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [itemsPage, setItemsPage] = useState(1);
  const [itemsTotalPages, setItemsTotalPages] = useState(0);
  const [feedbacksPage, setFeedbacksPage] = useState(1); // Start from 1
  const [feedbacksTotalPages, setFeedbacksTotalPages] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  useEffect(() => {
    if (userId && activeTab === 'items') {
      fetchActiveItems();
    }
  }, [userId, activeTab, itemsPage]);

  useEffect(() => {
    if (userId && activeTab === 'feedback') {
      setFeedbacksPage(1); // Reset to page 1 when filter changes
      fetchFeedbacks();
    }
  }, [userId, activeTab, feedbackFilter]);

  useEffect(() => {
    if (userId && activeTab === 'feedback' && feedbacksPage > 1) {
      fetchFeedbacks();
    }
  }, [feedbacksPage]);

  const fetchUserProfile = async () => {
    try {
      setIsLoadingUser(true);
      setError(null);
      const response = await userService.getPublicProfile(userId!);
      setUser(response.data);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      setError('Không thể tải thông tin người dùng');
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fetchActiveItems = async () => {
    try {
      setIsLoadingItems(true);
      const response = await auctionService.getSellerActiveSessions(userId!, itemsPage, 10);
      setItems(response.data.data || []);
      setItemsTotalPages(response.data.totalPages || 0);
    } catch (error: any) {
      console.error('Error fetching active items:', error);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setIsLoadingFeedbacks(true);
      const response = await userService.getPublicFeedbacks(userId!, feedbacksPage, 10);
      // Filter by feedbackFilter if needed (API returns all, client-side filtering)
      const allFeedbacks = response.data.data || [];
      const filtered = feedbackFilter === 'ALL'
        ? allFeedbacks
        : allFeedbacks.filter((f: FeedbackDto) => f.reviewAs === feedbackFilter);
      setFeedbacks(filtered);
      setFeedbacksTotalPages(response.data.totalPages || 0);
    } catch (error: any) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setIsLoadingFeedbacks(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTimeRemaining = (endTime: string) => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const distance = end - now;

    if (distance < 0) return 'Đã kết thúc';

    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (hours < 24) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return formatDate(endTime);
  };

  const getReputationColor = (score: number) => {
    if (score > 10) return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' };
    if (score >= 0) return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-500' };
    return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-500' };
  };

  const getRatingConfig = (rating: FeedbackRating) => {
    const configs = {
      POSITIVE: { icon: '😊', color: 'text-green-600', bg: 'bg-green-50', label: 'Tích cực' },
      NEUTRAL: { icon: '😐', color: 'text-gray-600', bg: 'bg-gray-50', label: 'Trung lập' },
      NEGATIVE: { icon: '😡', color: 'text-red-600', bg: 'bg-red-50', label: 'Tiêu cực' }
    };
    return configs[rating];
  };

  const getRoleBadge = (role: 'SELLER' | 'BUYER') => {
    if (role === 'SELLER') {
      return { icon: '🏪', label: 'Bán hàng', color: 'bg-orange-100 text-orange-700', tooltip: 'Đánh giá này nhận được khi người dùng đóng vai trò là Người bán' };
    }
    return { icon: '🛒', label: 'Mua hàng', color: 'bg-blue-100 text-blue-700', tooltip: 'Đánh giá này nhận được khi người dùng đóng vai trò là Người mua' };
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date().getTime();
    const past = new Date(dateString).getTime();
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} tháng trước`;
    return `${Math.floor(diffInSeconds / 31536000)} năm trước`;
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 mt-20">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 mt-20">
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-xl text-gray-600">{error || 'Không tìm thấy người dùng'}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const reputationColors = getReputationColor(user.reputationScore);
  const fullName = `${user.firstName} ${user.lastName}`.trim() || user.username;
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 mt-20 max-w-7xl">
        {/* PHẦN 1: HEADER PROFILE */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6 -mt-16">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">{initials}</span>
                </div>
              </div>

              {/* Thông tin chính */}
              <div className="flex-1 pt-16 md:pt-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{fullName}</h1>
                <p className="text-gray-600 mb-3">@{user.username}</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} />
                  <span>Tham gia: {formatDate(user.createdAt)}</span>
                </div>
              </div>

              {/* Chỉ số uy tín */}
              <div className={`flex-shrink-0 ${reputationColors.bg} ${reputationColors.border} border-2 rounded-xl p-6 mt-4 md:mt-16 text-center`}>
                <p className="text-sm text-gray-600 mb-2">Điểm tín nhiệm</p>
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className={`w-8 h-8 ${reputationColors.text}`} />
                  <span className={`text-5xl font-bold ${reputationColors.text}`}>
                    {user.reputationScore}
                  </span>
                </div>
                <p className={`text-sm mt-2 font-semibold ${reputationColors.text}`}>
                  {user.reputationScore > 10 ? 'Uy tín cao' : user.reputationScore >= 0 ? 'Trung bình' : 'Cảnh báo ⚠️'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PHẦN 2: TABS */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('items')}
                className={`flex-1 py-4 px-6 font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'items'
                  ? 'border-b-4 border-indigo-600 text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <ShoppingBag size={20} />
                Sản phẩm đang bán
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`flex-1 py-4 px-6 font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'feedback'
                  ? 'border-b-4 border-indigo-600 text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <MessageSquare size={20} />
                Đánh giá từ cộng đồng
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* TAB: SẢN PHẨM ĐANG BÁN */}
            {activeTab === 'items' && (
              <div>
                {isLoadingItems ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-20">
                    <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">
                      Người dùng này hiện không có phiên đấu giá nào.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => {
                      const mainImage = item.product.images[0]?.url || 'https://via.placeholder.com/300';
                      const timeRemaining = getTimeRemaining(item.endTime);
                      const isEndingSoon = new Date(item.endTime).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200 cursor-pointer"
                          onClick={() => navigate(`/auction/${item.id}`)}
                        >
                          <div className="relative">
                            <img
                              src={mainImage}
                              alt={item.product.name}
                              className="w-full h-48 object-cover"
                            />
                            {isEndingSoon && (
                              <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                🔥 Sắp kết thúc
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
                              {item.product.name}
                            </h3>
                            <div className="mb-3">
                              <p className="text-sm text-gray-600 mb-1">Giá hiện tại</p>
                              <p className="text-2xl font-bold text-orange-600">
                                {formatCurrency(item.currentPrice)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                              <Clock size={16} />
                              <span className={isEndingSoon ? 'text-red-600 font-semibold' : ''}>
                                {isEndingSoon ? `Còn ${timeRemaining}` : `Kết thúc: ${timeRemaining}`}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/auction/${item.id}`);
                              }}
                              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors"
                            >
                              Đặt giá ngay
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination */}
                {!isLoadingItems && items.length > 0 && itemsTotalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={itemsPage}
                      totalPages={itemsTotalPages}
                      onPageChange={(page) => setItemsPage(page)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB: ĐÁNH GIÁ */}
            {activeTab === 'feedback' && (
              <div>
                {/* Filter Buttons */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => setFeedbackFilter('ALL')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${feedbackFilter === 'ALL'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setFeedbackFilter('SELLER')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${feedbackFilter === 'SELLER'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    🏪 Là Người bán
                  </button>
                  <button
                    onClick={() => setFeedbackFilter('BUYER')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${feedbackFilter === 'BUYER'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    🛒 Là Người mua
                  </button>
                </div>

                {/* Feedback List */}
                {isLoadingFeedbacks ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  </div>
                ) : feedbacks.length === 0 ? (
                  <div className="text-center py-20">
                    <Star className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">Chưa có đánh giá nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedbacks.map((feedback) => {
                      const ratingConfig = getRatingConfig(feedback.rating);
                      const roleBadge = getRoleBadge(feedback.reviewAs);
                      // Mask username: display first and last char, mask middle with *
                      const maskUsername = (username: string) => {
                        if (username.length <= 2) return username;
                        return username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
                      };

                      return (
                        <div
                          key={feedback.id}
                          className={`${ratingConfig.bg} rounded-xl p-5 border-2 border-gray-200 hover:shadow-md transition-shadow`}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            {/* Cột 1: Rating & Role */}
                            <div className="md:col-span-2 flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-4xl">{ratingConfig.icon}</span>
                                <span className={`font-semibold ${ratingConfig.color}`}>
                                  {ratingConfig.label}
                                </span>
                              </div>
                              <div
                                className={`${roleBadge.color} px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1 w-fit`}
                                title={roleBadge.tooltip}
                              >
                                <span>{roleBadge.icon}</span>
                                <span>{roleBadge.label}</span>
                              </div>
                            </div>

                            {/* Cột 2: Content */}
                            <div className="md:col-span-7">
                              <p className="text-gray-800 mb-2 leading-relaxed">{feedback.comment}</p>
                            </div>

                            {/* Cột 3: Meta */}
                            <div className="md:col-span-3 flex flex-col items-end text-sm text-gray-600">
                              <div className="text-indigo-600 font-semibold flex items-center gap-1 mb-1">
                                <User size={14} />
                                bởi {maskUsername(feedback.fromUsername)}
                              </div>
                              <span className="text-xs">{getRelativeTime(feedback.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination */}
                {!isLoadingFeedbacks && feedbacks.length > 0 && feedbacksTotalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={feedbacksPage}
                      totalPages={feedbacksTotalPages}
                      onPageChange={(page) => setFeedbacksPage(page)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PublicProfile;