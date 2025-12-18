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
import { useAuthStore } from './stores/useAuthStore'
import { useEffect } from 'react'
import { useNotificationStore } from './stores/useNotificationStore.js'
import { useCartStore } from './stores/useCartStore'
import Authenticate from './components/pages/Authenticate.js'

function App() {

  const { accessToken, fetchCurrentUser } = useAuthStore();
  const { connectGlobalSocket, disconnectGlobalSocket, fetchNotifications } = useNotificationStore();
  const { fetchCart } = useCartStore();

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
  useEffect(() => {
    if (accessToken) {
      connectGlobalSocket();
      fetchNotifications();
      fetchCart(); // Fetch giỏ hàng khi đăng nhập
    } else {
      disconnectGlobalSocket();
    }
    // Cleanup khi unmount
    return () => {
      disconnectGlobalSocket();
    };
  }, [accessToken]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/auction/:auctionId" element={<AuctionDetail />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/user/profile" element={<UserDetail />} />
        <Route path="/create-auction" element={<CreateAuction />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/authenticate" element={<Authenticate />} />
      </Routes>
    </Router>
  )
}

export default App
