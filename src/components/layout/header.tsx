import { Search, ShoppingCart, User, Menu, ChevronDown, LogOut, Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { productService, type Product } from "../../services/productService";
import LoginDialog from "../pop-up/login";
import RegisterDialog from "../pop-up/register";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMobileCategoryDropdown, setShowMobileCategoryDropdown] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Autocomplete states
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileSuggestions, setMobileSuggestions] = useState<Product[]>([]);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [mobileActiveSuggestionIndex, setMobileActiveSuggestionIndex] = useState(-1);
  
  const navigate = useNavigate();
  
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns and suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setShowMobileCategoryDropdown(false);
      }
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowMobileSuggestions(false);
        setMobileActiveSuggestionIndex(-1);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch suggestions for desktop search
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length >= 1) {
        const results = await productService.getSuggestions(searchQuery);
        setSuggestions(results);
        setShowSuggestions(true);
        setActiveSuggestionIndex(-1);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce 300ms
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch suggestions for mobile search
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (mobileSearchQuery.length >= 1) {
        const results = await productService.getSuggestions(mobileSearchQuery);
        setMobileSuggestions(results);
        setShowMobileSuggestions(true);
        setMobileActiveSuggestionIndex(-1);
      } else {
        setMobileSuggestions([]);
        setShowMobileSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce 300ms
    return () => clearTimeout(timeoutId);
  }, [mobileSearchQuery]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      setShowMobileSuggestions(false);
    }
  };

  const handleSuggestionClick = (productName: string, isMobile: boolean = false) => {
    const query = productName;
    if (isMobile) {
      setMobileSearchQuery(query);
      setShowMobileSuggestions(false);
    } else {
      setSearchQuery(query);
      setShowSuggestions(false);
    }
    handleSearch(query);
  };

  const handleDesktopKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
        handleSuggestionClick(suggestions[activeSuggestionIndex].name);
      } else {
        handleSearch(searchQuery);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleMobileKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (mobileActiveSuggestionIndex >= 0 && mobileSuggestions[mobileActiveSuggestionIndex]) {
        handleSuggestionClick(mobileSuggestions[mobileActiveSuggestionIndex].name, true);
      } else {
        handleSearch(mobileSearchQuery);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setMobileActiveSuggestionIndex(prev => 
        prev < mobileSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setMobileActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === "Escape") {
      setShowMobileSuggestions(false);
      setMobileActiveSuggestionIndex(-1);
    }
  };

  return (
    <header className="bg-black text-white fixed top-0 left-0 right-0 z-[100] shadow-md w-full">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-2 xs:py-2.5 sm:py-3 lg:py-4 max-w-7xl">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between gap-4 xl:gap-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 xl:space-x-4 flex-shrink-0">
            <h1
              className="text-xl xl:text-2xl 2xl:text-3xl font-bold cursor-pointer hover:text-gray-300 transition-colors"
              onClick={() => navigate("/")}
            >
              DG
            </h1>

            {/* Category Dropdown */}
            <div className="relative" ref={desktopDropdownRef}>
              <button 
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="bg-white text-black px-3 py-2 xl:px-4 xl:py-2.5 rounded-xl text-sm xl:text-base w-28 xl:w-32 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <span className="truncate">Danh mục</span>
                <ChevronDown className="w-4 h-4 xl:w-5 xl:h-5 flex-shrink-0" />
              </button>
              
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[110] w-36 xl:w-40 2xl:w-44">
                  <button className="w-full text-left px-4 py-3 text-sm xl:text-base text-black hover:bg-gray-100 transition-colors rounded-t-lg">
                    Điện thoại
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm xl:text-base text-black hover:bg-gray-100 transition-colors">
                    Laptop  
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm xl:text-base text-black hover:bg-gray-100 transition-colors">
                    Tablet
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm xl:text-base text-black hover:bg-gray-100 transition-colors rounded-b-lg">
                    Phụ kiện
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar with Autocomplete */}
          <div className="flex-1 max-w-2xl mx-6 xl:mx-8 relative" ref={desktopSearchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleDesktopKeyPress}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                className="w-full px-4 py-2.5 xl:px-5 xl:py-3 pr-12 rounded-lg bg-white text-black placeholder-gray-500 text-sm xl:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                onClick={() => handleSearch(searchQuery)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
              >
                <Search className="w-5 h-5 xl:w-6 xl:h-6" />
              </button>
            </div>

            {/* Desktop Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[110] max-h-60 overflow-y-auto">
                {suggestions.map((product, index) => (
                  <div
                    key={product.id}
                    onClick={() => handleSuggestionClick(product.name)}
                    className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                      index === activeSuggestionIndex ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA4VjE2TTggMTJIMTYiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-red-600 font-semibold">
                          {product.currentPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3 xl:space-x-4 flex-shrink-0">
            <button className="flex items-center space-x-2 hover:text-gray-300 transition-colors px-2 py-1 rounded">
              <ShoppingCart className="w-5 h-5 xl:w-6 xl:h-6" />
              <span className="text-sm xl:text-base hidden xl:inline font-medium">
                Giỏ hàng
              </span>
            </button>

            <button className="flex items-center space-x-2 hover:text-gray-300 transition-colors px-2 py-1 rounded">
              <Bell className="w-5 h-5 xl:w-6 xl:h-6" />
              <span className="text-sm xl:text-base hidden xl:inline font-medium">
                Thông báo
              </span>
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button 
                  className="bg-green-600 hover:bg-green-700 px-4 xl:px-6 py-2 xl:py-2.5 rounded-lg text-sm xl:text-base transition-colors flex items-center space-x-2 font-medium"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <User className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span>{user?.fullName}</span>
                  <ChevronDown className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-48 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                        <div className="font-medium text-gray-900">{user?.fullName}</div>
                        <div className="text-xs">{user?.email}</div>
                      </div>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                        onClick={() => {
                          logout();
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
                className="bg-blue-600 hover:bg-blue-700 px-4 xl:px-6 py-2 xl:py-2.5 rounded-lg text-sm xl:text-base transition-colors flex items-center space-x-2 font-medium"
                onClick={() => setShowLoginDialog(true)}
              >
                <User className="w-4 h-4 xl:w-5 xl:h-5" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h1
              className="text-lg sm:text-xl font-bold cursor-pointer hover:text-gray-300 transition-colors"
              onClick={() => navigate("/")}
            >
              DG
            </h1>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <button className="text-white hover:text-gray-300 transition-colors">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button className="text-white hover:text-gray-300 transition-colors">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
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
            <div className="relative" ref={mobileDropdownRef}>
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
            {/* Mobile Search with Autocomplete */}
            <div className="flex-1 relative" ref={mobileSearchRef}>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                onKeyDown={handleMobileKeyPress}
                onFocus={() => {
                  if (mobileSuggestions.length > 0) {
                    setShowMobileSuggestions(true);
                  }
                }}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-8 sm:pr-10 rounded bg-white text-black placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSearch(mobileSearchQuery)}
                className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Search className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              {/* Mobile Suggestions Dropdown */}
              {showMobileSuggestions && mobileSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[110] max-h-48 overflow-y-auto">
                  {mobileSuggestions.map((product, index) => (
                    <div
                      key={product.id}
                      onClick={() => handleSuggestionClick(product.name, true)}
                      className={`px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                        index === mobileActiveSuggestionIndex ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-6 h-6 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA4VjE2TTggMTJIMTYiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-red-600 font-semibold">
                            {product.currentPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
    </header>
  );
};

export default Header;
