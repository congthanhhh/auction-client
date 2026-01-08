import { Search, ShoppingCart, User, Menu, ChevronDown, LogOut, Bell, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginDialog from "../pop-up/login";
import RegisterDialog from "../pop-up/register";
import ForgotPassword from "../pop-up/forgot-password";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { toast } from "sonner";
import NotificationDropdown from "../pop-up/notification-dropdown";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMobileCategoryDropdown, setShowMobileCategoryDropdown] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const navigate = useNavigate();

  const { currentUser, logout } = useAuthStore();
  const { unreadCount, fetchUnreadCount } = useNotificationStore();

  // Mock data cho giao diện tĩnh
  const cartItemsCount = 5;

  // Fetch unread count khi component mount và khi user đăng nhập
  useEffect(() => {
    if (currentUser) {
      fetchUnreadCount();

      // Poll unread count mỗi 30 giây
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [currentUser, fetchUnreadCount]);
  const handleLogout = async () => {
    await logout();
    toast.success('Đăng xuất thành công', {
      description: 'Hẹn gặp lại bạn!',
    });
    navigate('/');
  };


  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleDesktopKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  const handleMobileKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(mobileSearchQuery);
    }
  };

  return (
    <header className="bg-black text-white fixed top-0 left-0 right-0 z-[100] shadow-md w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-7xl">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <h1
              className="text-2xl font-bold cursor-pointer hover:text-gray-300 transition-colors"
              onClick={() => navigate("/")}
            >
              DG
            </h1>

            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="bg-white text-black px-4 py-2 rounded-xl text-sm w-32 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <span className="truncate">Danh mục</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </button>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[110] w-40">
                  <button className="w-full text-left px-4 py-2.5 text-sm text-black hover:bg-gray-100 transition-colors rounded-t-lg">
                    Điện thoại
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-black hover:bg-gray-100 transition-colors">
                    Laptop
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-black hover:bg-gray-100 transition-colors">
                    Tablet
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-black hover:bg-gray-100 transition-colors rounded-b-lg">
                    Phụ kiện
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleDesktopKeyPress}
                className="w-full px-4 py-2.5 pr-12 rounded-lg bg-white text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                onClick={() => handleSearch(searchQuery)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={() => navigate('/create-auction')}
              className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 transition-colors px-4 py-2.5 rounded-lg whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">
                Tạo phiên đấu giá
              </span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className="flex items-center space-x-2 hover:text-gray-300 transition-colors px-2 py-1 rounded"
              >
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium">
                  Thông báo
                </span>
              </button>
              <NotificationDropdown
                isOpen={showNotificationDropdown}
                onClose={() => setShowNotificationDropdown(false)}
              />
            </div>

            {currentUser ? (
              <div className="relative">
                <button
                  className="bg-green-600 hover:bg-green-700 px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center space-x-2 font-medium whitespace-nowrap"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <User className="w-4 h-4" />
                  <span>{currentUser.username}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-48 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                        <div className="font-medium text-gray-900">{currentUser.firstName} {currentUser.lastName}</div>
                        <div className="text-xs">{currentUser.email}</div>
                      </div>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                        onClick={() => {
                          navigate('/user/profile');
                          setShowUserDropdown(false);
                        }}
                      >
                        <User className="w-4 h-4" />
                        <span>Trang cá nhân</span>
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                        onClick={() => {
                          navigate('/seller/dashboard');
                          setShowUserDropdown(false);
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Quản lý bán hàng</span>
                      </button>
                      {currentUser.roles?.some(role => role.name === 'ADMIN') && (
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 transition-colors flex items-center space-x-2 border-t border-gray-100"
                          onClick={() => {
                            navigate('/admin');
                            setShowUserDropdown(false);
                          }}
                        >
                          <User className="w-4 h-4" />
                          <span>Quản trị hệ thống</span>
                        </button>
                      )}
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                        onClick={() => {
                          handleLogout();
                          setShowUserDropdown(false);
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center space-x-2 font-medium whitespace-nowrap"
                onClick={() => setShowLoginDialog(true)}
              >
                <User className="w-4 h-4" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-3">
            <h1
              className="text-xl font-bold cursor-pointer hover:text-gray-300 transition-colors"
              onClick={() => navigate("/")}
            >
              DG
            </h1>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                  className="text-white hover:text-gray-300 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown
                  isOpen={showNotificationDropdown}
                  onClose={() => setShowNotificationDropdown(false)}
                />
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors"
                onClick={() => setShowLoginDialog(true)}
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                className="text-white hover:text-gray-300 transition-colors md:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="flex space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowMobileCategoryDropdown(!showMobileCategoryDropdown)}
                className="bg-white text-black px-1.5 sm:px-2 py-1.5 sm:py-2 rounded text-xs sm:text-sm flex-shrink-0 w-20 sm:w-24 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <span>Danh mục</span>
                <ChevronDown className="w-2 h-2 sm:w-3 sm:h-3" />
              </button>

              {showMobileCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[110] w-28 sm:w-32">
                  <button className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-black hover:bg-gray-100 transition-colors rounded-t-lg">
                    Điện thoại
                  </button>
                  <button className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-black hover:bg-gray-100 transition-colors">
                    Laptop
                  </button>
                  <button className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-black hover:bg-gray-100 transition-colors">
                    Tablet
                  </button>
                  <button className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-black hover:bg-gray-100 transition-colors rounded-b-lg">
                    Phụ kiện
                  </button>
                </div>
              )}
            </div>
            {/* Mobile Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                onKeyDown={handleMobileKeyPress}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-8 sm:pr-10 rounded bg-white text-black placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSearch(mobileSearchQuery)}
                className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Search className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="md:hidden mt-3 py-2 bg-gray-800 rounded-lg">
              <div className="flex flex-col space-y-2 px-3">
                <button className="text-left text-sm text-white hover:text-gray-300 py-1">
                  Trang chủ
                </button>
                <button className="text-left text-sm text-white hover:text-gray-300 py-1">
                  Sản phẩm
                </button>
                <button className="text-left text-sm text-white hover:text-gray-300 py-1">
                  Liên hệ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onSwitchToRegister={() => {
          console.log('Header: Switching from Login to Register'); // Debug log
          setShowLoginDialog(false);
          setShowRegisterDialog(true);
        }}
        onSwitchToForgotPassword={() => {
          console.log('Header: Switching from Login to Forgot Password'); // Debug log
          setShowLoginDialog(false);
          setShowForgotPasswordDialog(true);
        }}
      />

      {/* Register Dialog */}
      <RegisterDialog
        isOpen={showRegisterDialog}
        onClose={() => setShowRegisterDialog(false)}
        onSwitchToLogin={() => {
          console.log('Header: Switching from Register to Login'); // Debug log
          setShowRegisterDialog(false);
          setShowLoginDialog(true);
        }}
      />

      {/* Forgot Password Dialog */}
      <ForgotPassword
        isOpen={showForgotPasswordDialog}
        onClose={() => setShowForgotPasswordDialog(false)}
      />
    </header>
  );
};

export default Header;
