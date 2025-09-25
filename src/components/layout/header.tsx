import { Search } from 'lucide-react';

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
              <select className="bg-white text-black px-3 py-2 rounded text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Danh mục</option>
                <option>Điện thoại</option>
                <option>Laptop</option>
                <option>Tablet</option>
                <option>Phụ kiện</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 xl:mx-8">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              className="w-full px-4 py-2 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 xl:space-x-4">
            <button className="flex items-center space-x-1 hover:text-gray-300 transition-colors">
              <span className="text-sm xl:text-base">🛒</span>
              <span className="text-xs xl:text-sm">Giỏ hàng</span>
            </button>
            
            <button className="flex items-center space-x-1 hover:text-gray-300 transition-colors">
              <span className="text-sm xl:text-base">❤️</span>
              <span className="text-xs xl:text-sm">Quan tâm</span>
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-700 px-3 xl:px-4 py-2 rounded-md text-xs xl:text-sm transition-colors">
              Đăng nhập
            </button>
            
            {/* <button className="bg-green-600 hover:bg-green-700 px-3 xl:px-4 py-2 rounded-md text-xs xl:text-sm transition-colors">
              Đăng ký
            </button> */}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">DG</h1>
            
            <div className="flex items-center space-x-3">
              <button className="text-white hover:text-gray-300">
                <span className="text-lg">🛒</span>
              </button>
              <button className="text-white hover:text-gray-300">
                <span className="text-lg">❤️</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                👤
              </button>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="flex space-x-2">
            <select className="bg-white text-black px-2 py-2 rounded text-sm flex-shrink-0">
              <option>Danh mục</option>
              <option>Điện thoại</option>
              <option>Laptop</option>
            </select>
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="flex-1 px-3 py-2 rounded bg-white text-black placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;