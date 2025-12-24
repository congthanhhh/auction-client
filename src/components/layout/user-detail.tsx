import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Award, 
  TrendingUp, ShoppingBag, Heart, Star, Trophy,
  Clock, DollarSign, Package, CheckCircle, ArrowLeft, Loader2, Store
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import PageLayout from './page-layout';
import { toast } from 'sonner';

interface TabType {
  id: string;
  label: string;
  icon: any;
}

const UserDetail = () => {
  const { currentUser, isAuthenticated } = useAuthStore();
  const { profileUser, isLoadingProfile, error, fetchMyProfile, clearError } = useUserStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user profile khi component mount
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để xem hồ sơ');
      navigate('/');
      return;
    }
    
    fetchMyProfile();
  }, [isAuthenticated, navigate, fetchMyProfile]);

  // Handle error
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Use profileUser from store, fallback to currentUser from auth
  const displayUser = profileUser || currentUser;

  // Mock data - thay bằng API thực tế
  const userStats = {
    totalBids: 147,
    wonAuctions: 23,
    activeAuctions: 8,
    totalSpent: 45000000,
    successRate: 85,
    rating: 4.8
  };

  // Điểm uy tín kiểu eBay
  const feedbackScore = {
    positive: 234,  // Positive feedback
    neutral: 12,    // Neutral feedback
    negative: 3,    // Negative feedback
    totalFeedback: 249,
    positivePercentage: 94.0
  };

  const recentFeedbacks = [
    { id: 1, from: 'Nguyễn Văn A', rating: 'positive', comment: 'Người mua nhanh chóng, thanh toán đúng hạn!', date: '10/12/2025' },
    { id: 2, from: 'Trần Thị B', rating: 'positive', comment: 'Rất hài lòng, sẽ giao dịch lại!', date: '08/12/2025' },
    { id: 3, from: 'Lê Văn C', rating: 'neutral', comment: 'Bình thường', date: '05/12/2025' },
    { id: 4, from: 'Phạm Thị D', rating: 'positive', comment: 'Tin cậy, nhanh gọn!', date: '02/12/2025' },
  ];

  const auctionHistory = [
    { 
      id: 1, 
      productName: 'iPhone 15 Pro Max', 
      finalPrice: 25000000, 
      status: 'won',
      date: '2025-12-10'
    },
    { 
      id: 2, 
      productName: 'MacBook Pro M3', 
      finalPrice: 35000000, 
      status: 'lost',
      date: '2025-12-08'
    },
    { 
      id: 3, 
      productName: 'Samsung Galaxy S24', 
      finalPrice: 18000000, 
      status: 'won',
      date: '2025-12-05'
    },
  ];

  const tabs: TabType[] = [
    { id: 'overview', label: 'Tổng quan', icon: TrendingUp },
    { id: 'auctions', label: 'Lịch sử đấu giá', icon: Clock },
    { id: 'favorites', label: 'Yêu thích', icon: Heart },
    { id: 'achievements', label: 'Điểm uy tín', icon: Trophy },
  ];

  // Loading state
  if (isLoadingProfile) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải thông tin...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // No user data
  if (!displayUser) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 flex items-center justify-center">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Không tìm thấy thông tin người dùng</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Back to Home Button */}
          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-3 bg-white hover:bg-yellow-50 text-gray-800 font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
          >
            <ArrowLeft size={20} className="text-yellow-600" />
            <span>Trở về trang chủ</span>
          </button>
        
        {/* Header Card với Glassmorphism */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              
              {/* Avatar với Border Animation */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                <div className="relative">
                  <img
                    src={`https://ui-avatars.com/api/?name=${displayUser.firstName}+${displayUser.lastName}&background=random`}
                    alt="User Avatar"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  {displayUser.isActive && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {displayUser.firstName} {displayUser.lastName}
                  </h1>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-white fill-white" />
                    <span className="text-sm font-bold text-white">{userStats.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="font-medium">@{displayUser.username}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{displayUser.email}</span>
                  </div>
                  {displayUser.roles && displayUser.roles.length > 0 && (
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                      <Award className="w-4 h-4" />
                      <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {displayUser.roles.map(r => r.name).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                  <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                    <div className="text-2xl font-bold text-blue-600">{userStats.wonAuctions}</div>
                    <div className="text-xs text-gray-600">Thắng đấu giá</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                    <div className="text-2xl font-bold text-purple-600">{userStats.totalBids}</div>
                    <div className="text-xs text-gray-600">Lượt đấu giá</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                    <div className="text-2xl font-bold text-green-600">{userStats.successRate}%</div>
                    <div className="text-xs text-gray-600">Tỷ lệ thắng</div>
                  </div>
                </div>

                {/* Seller Dashboard Button */}
                <div className="mt-6 flex justify-center md:justify-start">
                  <button
                    onClick={() => navigate('/seller/dashboard')}
                    className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Store className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-lg">Quản lý đấu giá</span>
                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Modern Tab Navigation */}
        <div className="mb-6 bg-white/60 backdrop-blur-xl rounded-2xl p-2 border border-white/20 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid gap-6">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  icon={ShoppingBag}
                  title="Tổng đấu giá"
                  value={userStats.totalBids}
                  color="from-blue-500 to-blue-600"
                  trend="+12%"
                />
                <StatsCard
                  icon={Trophy}
                  title="Đã thắng"
                  value={userStats.wonAuctions}
                  color="from-green-500 to-green-600"
                  trend="+8%"
                />
                <StatsCard
                  icon={Clock}
                  title="Đang tham gia"
                  value={userStats.activeAuctions}
                  color="from-orange-500 to-orange-600"
                  trend="+3"
                />
                <StatsCard
                  icon={DollarSign}
                  title="Tổng chi tiêu"
                  value={`${(userStats.totalSpent / 1000000).toFixed(1)}M`}
                  color="from-purple-500 to-purple-600"
                  trend="+15%"
                />
              </div>

              {/* Recent Activity */}
              <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  Hoạt động gần đây
                </h2>
                <div className="space-y-4">
                  {auctionHistory.map((auction) => (
                    <div 
                      key={auction.id}
                      className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          auction.status === 'won' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {auction.status === 'won' ? <Trophy className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {auction.productName}
                          </h3>
                          <p className="text-sm text-gray-500">{auction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-gray-800">
                          {auction.finalPrice.toLocaleString('vi-VN')} ₫
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          auction.status === 'won' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {auction.status === 'won' ? 'Đã thắng' : 'Không thắng'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Feedback/Reputation Tab - eBay Style */}
          {activeTab === 'achievements' && (
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Điểm uy tín
              </h2>

              {/* Feedback Summary - eBay Style */}
              <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="text-4xl font-bold text-green-600">
                        {feedbackScore.positive}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {feedbackScore.positivePercentage}% đánh giá tích cực
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">
                      {feedbackScore.totalFeedback}
                    </div>
                    <p className="text-sm text-gray-600">Đánh giá</p>
                  </div>
                </div>

                {/* Feedback Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-sm text-gray-600">Tích cực</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(feedbackScore.positive / feedbackScore.totalFeedback) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-16 text-sm font-medium text-right">{feedbackScore.positive}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-sm text-gray-600">Trung lập</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(feedbackScore.neutral / feedbackScore.totalFeedback) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-16 text-sm font-medium text-right">{feedbackScore.neutral}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-sm text-gray-600">Tiêu cực</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(feedbackScore.negative / feedbackScore.totalFeedback) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-16 text-sm font-medium text-right">{feedbackScore.negative}</div>
                  </div>
                </div>
              </div>

              {/* Recent Feedback */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Đánh giá gần đây</h3>
                <div className="space-y-3">
                  {recentFeedbacks.map((feedback) => (
                    <div key={feedback.id} className="border-b border-gray-100 pb-3 last:border-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            feedback.rating === 'positive' ? 'bg-green-100' :
                            feedback.rating === 'neutral' ? 'bg-yellow-100' : 'bg-red-100'
                          }`}>
                            {feedback.rating === 'positive' ? (
                              <span className="text-green-600 font-bold text-sm">+</span>
                            ) : feedback.rating === 'neutral' ? (
                              <span className="text-yellow-600 font-bold text-sm">=</span>
                            ) : (
                              <span className="text-red-600 font-bold text-sm">-</span>
                            )}
                          </div>
                          <span className="font-medium text-sm">{feedback.from}</span>
                        </div>
                        <span className="text-xs text-gray-500">{feedback.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-8">{feedback.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Auction History Tab */}
          {activeTab === 'auctions' && (
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Lịch sử đấu giá</h2>
              <div className="space-y-3">
                {auctionHistory.map((auction) => (
                  <AuctionHistoryItem key={auction.id} auction={auction} />
                ))}
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Sản phẩm yêu thích
              </h2>
              <div className="text-center py-12 text-gray-500">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Chưa có sản phẩm yêu thích nào</p>
              </div>
            </div>
          )}

        </div>

        </div>
      </div>
    </PageLayout>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, color, trend }: any) => (
  <div className="group relative overflow-hidden bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500`}></div>
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  </div>
);

// Auction History Item Component
const AuctionHistoryItem = ({ auction }: any) => (
  <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-all group cursor-pointer">
    <div className="flex items-center gap-4 flex-1">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        auction.status === 'won' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
      }`}>
        <Trophy className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          {auction.productName}
        </h4>
        <p className="text-sm text-gray-500">{auction.date}</p>
      </div>
    </div>
    <div className="text-right">
      <div className="font-bold text-gray-800">
        {auction.finalPrice.toLocaleString('vi-VN')} ₫
      </div>
      <span className={`text-xs px-3 py-1 rounded-full ${
        auction.status === 'won' 
          ? 'bg-green-100 text-green-700' 
          : 'bg-red-100 text-red-700'
      }`}>
        {auction.status === 'won' ? '✓ Thắng' : '✗ Thua'}
      </span>
    </div>
  </div>
);

export default UserDetail;
