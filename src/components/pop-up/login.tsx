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
}

export function LoginDialog({ isOpen, onClose, onSwitchToRegister }: LoginDialogProps) {
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
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full font-semibold text-base transition-all duration-200"
            >
              Đăng nhập
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
