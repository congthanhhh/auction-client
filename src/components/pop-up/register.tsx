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

interface RegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

type RegisterStep = 'form' | 'otp';

export function RegisterDialog({ isOpen, onClose, onSwitchToLogin }: RegisterDialogProps) {
  const register = async (userData: { username: string; fullName: string; email: string; password: string }) => {
    // Register logic removed - UI only
    console.log('Register:', userData);
    return true;
  };
  const [step, setStep] = useState<RegisterStep>('form');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [errors, setErrors] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setStep('form');
    setUsername('');
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtp(['', '', '', '', '']);
    setErrors({
      username: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setShowToast(false);
    onClose();
  }, [onClose]);

  // Focus first input when dialog opens
  useEffect(() => {
    if (isOpen && firstInputRef.current && step === 'form') {
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, step]);

  // Auto hide toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const validateForm = () => {
    const newErrors = {
      username: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Vui lòng nhập tên người dùng';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Tên người dùng phải có ít nhất 3 ký tự';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới';
    }

    // Full name validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
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

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Move to OTP step
      setStep('otp');

      // Show success toast
      setToastMessage('Mã OTP đã được gửi đến email của bạn!');
      setToastType('success');
      setShowToast(true);

      console.log('OTP sent to:', email);
    } catch {
      setToastMessage('Có lỗi xảy ra khi gửi mã OTP');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 5) {
      setToastMessage('Vui lòng nhập đầy đủ mã OTP');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate OTP verification (in real app, verify OTP first)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // If OTP is correct, proceed with registration
      await register({
        username,
        fullName,
        email,
        password
      });

      // Success - show message and close
      setToastMessage('Chúc mừng bạn đã đăng ký thành công!');
      setToastType('success');
      setShowToast(true);

      setTimeout(() => {
        handleClose();
        if (onSwitchToLogin) {
          onSwitchToLogin();
        }
      }, 1500);

    } catch (error: unknown) {
      console.error('Lỗi xác thực OTP hoặc đăng ký:', error);
      const errorMessage = error instanceof Error ? error.message : 'Xác thực thất bại. Vui lòng thử lại.';

      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
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

  // Render form step
  const renderFormStep = () => (
    <form onSubmit={handleRegister} className="px-4 sm:px-5 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
      <div className="space-y-2.5 sm:space-y-3">
        {/* Username */}
        <div>
          <Input
            ref={firstInputRef}
            id="username"
            type="text"
            placeholder="Tên người dùng"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-label="Tên người dùng"
            className={`w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${errors.username
                ? 'border-red-300 focus:border-red-500 bg-red-50'
                : 'border-gray-200 focus:border-green-400 bg-white'
              }`}
            disabled={isLoading}
          />
          {errors.username && (
            <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">{errors.username}</p>
          )}
        </div>

        {/* Full Name */}
        <div>
          <Input
            id="fullName"
            type="text"
            placeholder="Họ và tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            aria-label="Họ và tên"
            className={`w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${errors.fullName
                ? 'border-red-300 focus:border-red-500 bg-red-50'
                : 'border-gray-200 focus:border-green-400 bg-white'
              }`}
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">{errors.fullName}</p>
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
            className={`w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${errors.email
                ? 'border-red-300 focus:border-red-500 bg-red-50'
                : 'border-gray-200 focus:border-green-400 bg-white'
              }`}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Input
            id="password"
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Mật khẩu"
            className={`w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${errors.password
                ? 'border-red-300 focus:border-red-500 bg-red-50'
                : 'border-gray-200 focus:border-green-400 bg-white'
              }`}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            aria-label="Xác nhận mật khẩu"
            className={`w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${errors.confirmPassword
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

      <div className="flex flex-col space-y-3 sm:space-y-4 pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base disabled:opacity-70"
        >
          {isLoading ? 'Đang gửi OTP...' : 'Tiếp tục'}
        </Button>

        <div className="text-center">
          <span className="text-xs sm:text-sm text-gray-600">
            Đã có tài khoản?{" "}
          </span>
          <button
            type="button"
            onClick={handleSwitchToLogin}
            className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium underline transition-colors"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </form>
  );

  // Render OTP step
  const renderOtpStep = () => (
    <div className="px-4 pt-0 pb-4 sm:px-6 sm:pt-0 sm:pb-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mb-2">Xác thực OTP</h2>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* OTP Input */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-bold bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200"
                autoFocus={index === 0}
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Message */}
          <div className="text-center text-sm text-green-600 space-y-1">
            <p>Mã xác thực đã được gửi đến {email}.</p>
            <p>Vui lòng kiểm tra!</p>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full font-semibold text-base transition-all duration-200"
          disabled={isLoading || otp.some(digit => !digit)}
        >
          {isLoading ? 'Đang xác thực...' : 'Xác thực và đăng ký'}
        </Button>
      </form>
    </div>
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
      modal={true}
    >
      <DialogContent
        className="w-[95vw] max-w-md mx-auto p-0 rounded-2xl sm:rounded-3xl animate-in fade-in-0 zoom-in-95 duration-200 overflow-hidden bg-gradient-to-br from-green-50 to-white border-0 shadow-2xl"
        onPointerDownOutside={() => handleClose()}
        onEscapeKeyDown={() => handleClose()}
      >
        <DialogHeader className="text-center py-4 sm:py-6 px-4 sm:px-5 flex-shrink-0">
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            {step === 'form' ? 'Đăng ký' : ''}
          </DialogTitle>
        </DialogHeader>

        {step === 'form' ? renderFormStep() : renderOtpStep()}
      </DialogContent>

      {/* Toast notification */}
      <Toast
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
        message={toastMessage}
      />
    </Dialog>
  );
}

export default RegisterDialog;