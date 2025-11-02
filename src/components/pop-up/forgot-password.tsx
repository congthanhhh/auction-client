import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';

interface ForgotPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

type ForgotPasswordStep = 'email' | 'otp' | 'newPassword';

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<ForgotPasswordStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Chuyển sang bước nhập OTP
      setStep('otp');
      console.log('Gửi OTP đến email:', email);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Chỉ cho phép số và 1 ký tự
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
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

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 5) {
      console.log('OTP nhập:', otpCode);
      // Chuyển sang bước đặt mật khẩu mới
      setStep('newPassword');
    }
  };

  const handleNewPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      console.log('Mật khẩu mới đã đặt');
      // Xử lý đặt mật khẩu mới ở đây
      handleClose();
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setOtp(['', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    onClose();
  };

  // Render step 1: Email input
  const renderEmailStep = () => (
    <div className="p-6 sm:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quên mật khẩu</h2>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Nhập địa chỉ Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              required
              autoFocus
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full font-semibold text-base transition-all duration-200"
          disabled={!email}
        >
          Gửi mã OTP
        </Button>
      </form>
    </div>
  );

  // Render step 2: OTP input
  const renderOtpStep = () => (
    <div className="p-6 sm:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quên mật khẩu</h2>
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
                className="w-12 h-12 text-center text-lg font-bold bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Message */}
          <p className="text-center text-sm text-red-500">
            Mã xác thực đã được gửi đến {email}. Vui lòng kiểm tra!
          </p>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full font-semibold text-base transition-all duration-200"
          disabled={otp.some(digit => !digit)}
        >
          Nhập mã xác thực
        </Button>
      </form>
    </div>
  );

  // Render step 3: New Password
  const renderNewPasswordStep = () => (
    <div className="p-6 sm:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quên mật khẩu</h2>
      </div>

      <form onSubmit={handleNewPasswordSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* New Password Input */}
          <div className="relative">
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              required
              autoFocus
            />
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 pr-12"
              required
            />
            {/* Show/Hide Password Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {showPassword ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full font-semibold text-base transition-all duration-200"
          disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
        >
          Xác nhận
        </Button>
      </form>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 'email':
        return renderEmailStep();
      case 'otp':
        return renderOtpStep();
      case 'newPassword':
        return renderNewPasswordStep();
      default:
        return renderEmailStep();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto p-0 rounded-2xl sm:rounded-3xl animate-in fade-in-0 zoom-in-95 duration-200 overflow-hidden bg-gradient-to-br from-blue-50 to-white border-0 shadow-2xl">
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPassword;
