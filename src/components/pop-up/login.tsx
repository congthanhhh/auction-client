import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Toast } from '../ui/toast';
import { useAuth } from '../../contexts/AuthContext';
import ForgotPassword from './forgot-password';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginDialog({ isOpen, onClose, onSwitchToRegister }: LoginDialogProps) {
  const { login } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [errors, setErrors] = useState({ emailOrUsername: '', password: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  // Focus first input when dialog opens
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setEmailOrUsername('');
    setPassword('');
    setErrors({ emailOrUsername: '', password: '' });
    setShowForgotPassword(false);
    onClose();
  }, [onClose]);

  // Validation function
  const validateForm = () => {
    const newErrors = { emailOrUsername: '', password: '' };
    
    if (!emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'Vui lòng nhập Tên người dùng hoặc Email';
    } else if (emailOrUsername.includes('@')) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailOrUsername)) {
        newErrors.emailOrUsername = 'Email không đúng định dạng';
      }
    } else {
      // Username validation - simple alphanumeric and underscore
      if (!/^[a-zA-Z0-9_]+$/.test(emailOrUsername)) {
        newErrors.emailOrUsername = 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới';
      }
    }
    
    if (!password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    setErrors(newErrors);
    return !newErrors.emailOrUsername && !newErrors.password;
  };

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, handleClose]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Xử lý đăng nhập ở đây
    try {
      await login(emailOrUsername, password);
      
      // Hiển thị toast thành công
      setToastMessage('Đăng nhập thành công!');
      setToastType('success');
      setShowToast(true);

      // Reset form
      setEmailOrUsername('');
      setPassword('');
      setErrors({ emailOrUsername: '', password: '' });

      // Đóng popup sau khi đăng nhập thành công
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error: unknown) {
      console.error('Lỗi đăng nhập:', error);
      const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    console.log('Switching to register dialog...'); // Debug log
    handleClose();
    if (onSwitchToRegister) {
      console.log('Calling onSwitchToRegister...'); // Debug log
      onSwitchToRegister();
    } else {
      console.log('onSwitchToRegister is not provided'); // Debug log
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleClose}
      modal={true}
    >
      <DialogContent 
        className="w-[95vw] max-w-md sm:max-w-lg mx-auto p-0 rounded-2xl sm:rounded-3xl animate-in fade-in-0 zoom-in-95 duration-200 overflow-hidden bg-gradient-to-br from-blue-50 to-white border-0 shadow-2xl max-h-[95vh] overflow-y-auto"
        onPointerDownOutside={() => handleClose()}
        onEscapeKeyDown={() => handleClose()}
      >
        <DialogHeader className="text-center py-6 sm:py-8 px-4 sm:px-6 flex-shrink-0">
          <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            Đăng nhập
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleLogin} className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <Input
                ref={firstInputRef}
                id="emailOrUsername"
                type="text"
                placeholder="Tên người dùng hoặc Email"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                aria-label="Tên người dùng hoặc Email"
                className={`w-full h-12 sm:h-14 px-4 sm:px-6 text-base sm:text-lg rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${
                  errors.emailOrUsername 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-blue-400 bg-white'
                }`}
                disabled={isLoading}
              />
              {errors.emailOrUsername && (
                <p className="text-red-500 text-sm sm:text-base mt-2 ml-2">{errors.emailOrUsername}</p>
              )}
            </div>
            
            <div>
              <Input
                id="password"
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Mật khẩu"
                className={`w-full h-12 px-4 bg-gray-100 border-0 rounded-full text-gray-700 placeholder:text-gray-500 focus:ring-2 transition-all ${
                  errors.password ? 'focus:ring-red-500 bg-red-50' : 'focus:ring-blue-500'
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 ml-4">{errors.password}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full font-semibold text-base transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
            
            <div className="text-center space-y-2">
              <p className="text-gray-600 text-sm">
                Bạn chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={handleSwitchToRegister}
                  className="text-green-500 hover:text-green-600 font-medium transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  Đăng ký ngay!
                </button>
              </p>
              
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-red-500 hover:text-red-600 font-medium text-sm transition-colors bg-transparent border-none p-0 cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
      
      {/* Toast notification */}
      <Toast 
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />

      {/* Forgot Password Dialog */}
      <ForgotPassword
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </Dialog>
  );
}

export default LoginDialog;
