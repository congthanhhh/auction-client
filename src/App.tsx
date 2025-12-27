import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/layout/home'
import SearchResults from './components/layout/search-results'
import AuctionDetail from './components/layout/auction-detail'
import UserDetail from './components/layout/user-detail'
import ProductDetail from './components/layout/product-detail'
import CreateAuction from './components/layout/create-auction'
import NotificationsPage from './components/layout/notifications'
import Cart from './components/layout/cart'
import Payment from './components/layout/payment'
import Shipping from './components/layout/shipping'
import Invoice from './components/layout/invoice'
import AllAuctionsPage from './components/layout/all-auctions'
import AdminLayout from './components/layout/admin/admin-layout'
import AdminDashboard from './components/layout/admin/admin-dashboard'
import AdminUsers from './components/layout/admin/admin-users'
import AdminProducts from './components/layout/admin/admin-products'
import AdminAuctions from './components/layout/admin/admin-auctions'
import AdminOrders from './components/layout/admin/admin-orders'
import AdminReports from './components/layout/admin/admin-reports'
import AdminDisputes from './components/layout/admin/admin-disputes'
import AdminCategories from './components/layout/admin/admin-categories'
import AdminVerification from './components/layout/admin/admin-verification'
import AdminSettings from './components/layout/admin/admin-settings'
import AdminLogs from './components/layout/admin/admin-logs'
import SellerDashboard from './components/layout/seller-dashboard'
import PaymentResult from './components/layout/payment-result'
import { useAuthStore } from './stores/useAuthStore'
import { useEffect } from 'react'
import Authenticate from './components/pages/Authenticate.js'
import CreateProduct from './components/layout/create-product.js'

function App() {

  const { accessToken, fetchCurrentUser } = useAuthStore();

  // --- LOGIC TỰ ĐỘNG (Thay thế nút bấm thủ công) ---
  useEffect(() => {
    // Chỉ chạy nếu đã có accessToken trong LocalStorage (tức là user từng đăng nhập)
    if (accessToken) {
      console.log("App mounted -> Đang kiểm tra phiên đăng nhập...");

      // Gọi API lấy thông tin user
      // 1. Nếu token còn hạn -> Trả về thông tin user -> OK
      // 2. Nếu token hết hạn -> API lỗi 401 -> Interceptor tự nhảy vào -> Refresh Token -> Gọi lại API -> OK
      // 3. Nếu Refresh Token cũng hết hạn -> Interceptor logout -> Về trang login
      fetchCurrentUser();
    }
  }, [fetchCurrentUser, accessToken]);
  // ------------------------------------------------

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/all-auctions" element={<AllAuctionsPage />} />
        <Route path="/auction/:auctionId" element={<AuctionDetail />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/user/profile" element={<UserDetail />} />
        <Route path="/create-auction" element={<CreateAuction />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/shipping/:trackingCode" element={<Shipping />} />
        <Route path="/invoice/:orderId" element={<Invoice />} />
        <Route path="/authenticate" element={<Authenticate />} />

        {/* Seller Routes */}
        <Route path="/seller/dashboard" element={<SellerDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="auctions" element={<AdminAuctions />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="disputes" element={<AdminDisputes />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="verification" element={<AdminVerification />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="logs" element={<AdminLogs />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
