import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface RegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterDialog({ isOpen, onClose, onSwitchToLogin }: RegisterDialogProps) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setFullName('');
    setPhoneNumber('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({
      fullName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    onClose();
  }, [onClose]);

  // Focus first input when dialog opens
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  // Validation function
  const validateForm = () => {
    const newErrors = {
      fullName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    
    // Full name validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
    }
    
    // Phone number validation (Vietnam phone numbers)
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else {
      const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        newErrors.phoneNumber = 'Số điện thoại không đúng định dạng';
      }
    }
    
    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Email không đúng định dạng';
      }
    }
    
    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    // Confirm password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Xử lý đăng ký ở đây
    try {
      // TODO: Gọi API đăng ký
      console.log('Đăng ký với:', {
        fullName,
        phoneNumber,
        email,
        password
      });
      
      // Giả lập delay API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Đóng popup sau khi đăng ký thành công
      onClose();
      
      // Reset form
      setFullName('');
      setPhoneNumber('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrors({
        fullName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      setErrors({ 
        fullName: '',
        phoneNumber: '',
        email: 'Email đã được sử dụng',
        password: '',
        confirmPassword: ''
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    handleClose();
    if (onSwitchToLogin) {
      onSwitchToLogin();
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleClose}
      modal={true}
    >
      <DialogContent 
        className="w-[90vw] max-w-sm sm:max-w-md mx-auto p-0 rounded-xl sm:rounded-2xl animate-in fade-in-0 zoom-in-95 duration-200 overflow-hidden bg-gradient-to-br from-green-50 to-white border-0 shadow-2xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={() => handleClose()}
        onEscapeKeyDown={() => handleClose()}
      >
        <DialogHeader className="text-center py-4 sm:py-6 px-4 sm:px-5 flex-shrink-0">
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            Đăng ký
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleRegister} className="px-4 sm:px-5 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
          <div className="space-y-2.5 sm:space-y-3">
            {/* Họ và tên */}
            <div>
              <Input
                ref={firstInputRef}
                id="fullName"
                type="text"
                placeholder="Họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                aria-label="Họ và tên"
                className={`w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                  errors.fullName 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-green-400 bg-white'
                }`}
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">{errors.fullName}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Số điện thoại"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                aria-label="Số điện thoại"
                className={`w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                  errors.phoneNumber 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-green-400 bg-white'
                }`}
                disabled={isLoading}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
                className={`w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-green-400 bg-white'
                }`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            {/* Mật khẩu */}
            <div>
              <Input
                id="password"
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Mật khẩu"
                className={`w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                  errors.password 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-green-400 bg-white'
                }`}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">{errors.password}</p>
              )}
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                aria-label="Xác nhận mật khẩu"
                className={`w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                  errors.confirmPassword 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-green-400 bg-white'
                }`}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
            <Button 
              type="submit" 
              className="w-full h-10 sm:h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang đăng ký...</span>
                </div>
              ) : (
                'Đăng ký'
              )}
            </Button>
            
            <div className="text-center space-y-1 sm:space-y-2">
              <p className="text-gray-600 text-xs sm:text-sm">
                Bạn đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={handleSwitchToLogin}
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                  disabled={isLoading}
                >
                  Đăng nhập ngay!
                </button>
              </p>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RegisterDialog;
