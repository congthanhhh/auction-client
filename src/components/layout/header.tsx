import { Search, ShoppingCart, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl xl:text-2xl font-bold">
              DG
            </h1>
            
            {/* Category Dropdown */}
            <div className="flex items-center">
              <select className="bg-white text-black px-3 py-1 rounded-md text-sm border">
                <option>Danh mục</option>
                <option>Điện tử</option>
                <option>Thời trang</option>
                <option>Gia dụng</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 xl:mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 pr-10 text-black rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 xl:space-x-4">
            {/* Cart */}
            <button className="flex items-center space-x-1 px-2 xl:px-3 py-1 border border-white rounded-md hover:bg-white hover:text-black transition-colors">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm hidden xl:inline">Giỏ hàng</span>
            </button>
            
            {/* User */}
            <button className="flex items-center space-x-1 px-2 xl:px-3 py-1 border border-white rounded-md hover:bg-white hover:text-black transition-colors">
              <User className="w-4 h-4" />
              <span className="text-sm hidden xl:inline">Nguyên</span>
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">DG</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2">
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button className="p-2">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="flex space-x-2">
            <select className="bg-white text-black px-2 py-2 rounded-md text-sm border flex-shrink-0">
              <option>Danh mục</option>
              <option>Điện tử</option>
              <option>Thời trang</option>
              <option>Gia dụng</option>
            </select>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full px-3 py-2 pr-10 text-black rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;