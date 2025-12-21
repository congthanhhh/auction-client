import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Gavel,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  FileText,
  AlertTriangle,
  Tag,
  Shield,
  Settings,
  Activity,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "Người dùng" },
    { path: "/admin/products", icon: Package, label: "Sản phẩm" },
    { path: "/admin/auctions", icon: Gavel, label: "Phiên đấu giá" },
    { path: "/admin/orders", icon: ShoppingCart, label: "Đơn hàng" },
    { path: "/admin/reports", icon: FileText, label: "Báo cáo" },
    { path: "/admin/disputes", icon: AlertTriangle, label: "Khiếu nại" },
    { path: "/admin/categories", icon: Tag, label: "Danh mục" },
    { path: "/admin/verification", icon: Shield, label: "Xác minh" },
    { path: "/admin/settings", icon: Settings, label: "Cài đặt" },
    { path: "/admin/logs", icon: Activity, label: "Nhật ký" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 flex flex-col shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {sidebarOpen && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
                    : "hover:bg-gray-700 text-gray-300 hover:text-white"
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors w-full text-left text-gray-300 hover:text-white"
          >
            <ChevronLeft size={20} />
            {sidebarOpen && <span className="font-medium">Về trang chủ</span>}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors w-full text-left text-gray-300 hover:text-white"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {menuItems.find((item) => item.path === location.pathname)?.label ||
                "Dashboard"}
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Xin chào,</p>
                <p className="font-semibold text-gray-800">Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
