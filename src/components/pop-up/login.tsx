import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircleIcon } from 'lucide-react';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToForgotPassword?: () => void;
}

export function LoginDialog({ isOpen, onClose, onSwitchToRegister, onSwitchToForgotPassword }: LoginDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login, error } = useAuthStore();

  const handleClose = () => {
    setUsername('');
    setPassword('');
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ username, password });
    toast.success('Đăng nhập thành công!', {
      description: 'Chào mừng bạn quay trở lại',
    });
    handleClose();
  };

  const handleGoogleLogin = () => {
    const targetUrl = import.meta.env.VITE_GOOGLE_AUTH_URL;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;

    const authUrl = `${targetUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile`;
    window.location.href = authUrl;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
      modal={true}
    >
      <DialogContent
        className="w-[95vw] max-w-md sm:max-w-lg mx-auto p-0 rounded-2xl sm:rounded-3xl animate-in fade-in-0 zoom-in-95 duration-200 overflow-hidden bg-gradient-to-br from-blue-50 to-white border-0 shadow-2xl max-h-[95vh] overflow-y-auto"
      >
        <DialogHeader className="text-center py-6 sm:py-8 px-4 sm:px-6 flex-shrink-0">
          <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            Đăng nhập
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleLogin} className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 space-y-6 sm:space-y-8">
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>{error}</AlertTitle>
              <AlertDescription>
                <p>Vui lòng kiểm tra lại thông tin đăng nhập và thử lại.</p>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 sm:space-y-6">
            <div>
              <Input
                id="username"
                type="text"
                placeholder="Tên người dùng hoặc Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full h-12 sm:h-14 px-4 sm:px-6 text-base sm:text-lg rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-400 bg-white transition-all duration-200"
              />
            </div>

            <div>
              <Input
                id="password"
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 px-4 bg-gray-100 border-0 rounded-full text-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onSwitchToForgotPassword?.();
                }}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full font-semibold text-base transition-all duration-200"
            >
              Đăng nhập
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            {/* Google Login Button */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-full font-semibold text-base transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng nhập với Google
            </Button>

            <div className="text-center space-y-2">
              <p className="text-gray-600 text-sm">
                Bạn chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    onSwitchToRegister?.();
                  }}
                  className="text-green-500 hover:text-green-600 font-medium transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  Đăng ký ngay!
                </button>
              </p>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default LoginDialog;
