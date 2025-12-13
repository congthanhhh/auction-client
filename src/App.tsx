import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/layout/home'
import SearchResults from './components/layout/search-results'
import AuctionDetail from './components/layout/auction-detail'
import { Toaster } from 'sonner'
import { useAuthStore } from './stores/useAuthStore'
import { useEffect } from 'react'
import { useNotificationStore } from './stores/useNotificationStore.js'
import AuctionDetailPage from './components/testUI/AuctionDetailPage.js'
import Authenticate from './components/pages/Authenticate.js'

function App() {

  const { accessToken, fetchCurrentUser } = useAuthStore();
  const { connectGlobalSocket, disconnectGlobalSocket, fetchNotifications } = useNotificationStore();

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
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/auction/:auctionId" element={<AuctionDetail />} />
        <Route path="/authenticate" element={<Authenticate />} />
      </Routes>
    </Router>
  )
}

export default App
