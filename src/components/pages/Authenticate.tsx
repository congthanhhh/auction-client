import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

const Authenticate = () => {
    const navigate = useNavigate();
    const { loginWithGoogle } = useAuthStore();
    // Dùng useRef để đảm bảo chỉ gọi 1 lần (React.StrictMode hay gây gọi 2 lần)
    const calledRef = useRef(false);

    useEffect(() => {
        // 1. Lấy code từ URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (!code) {
            navigate('/login');
            return;
        }

        if (calledRef.current) return; // Ngăn gọi 2 lần
        calledRef.current = true;

        // 2. Gọi action login
        const handleLogin = async () => {
            try {
                await loginWithGoogle(code);
                // 3. Thành công -> Về trang chủ
                navigate('/');
            } catch (error) {
                // Thất bại -> Về login
                navigate('/login');
            }
        };

        handleLogin();
    }, [navigate, loginWithGoogle]);

    // Giao diện loading đơn giản trong lúc chờ Backend xử lý
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Đang xác thực với Google...</p>
        </div>
    );
};

export default Authenticate;