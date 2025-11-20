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

interface RegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterDialog({ isOpen, onClose, onSwitchToLogin }: RegisterDialogProps) {
  const { register, verifyOtp, isLoading, error } = useAuthStore();

  // State quản lý bước: 1 = Nhập thông tin, 2 = Nhập OTP
  const [step, setStep] = useState(1);

  // Lưu email để dùng cho bước xác thực OTP
  const [emailForOtp, setEmailForOtp] = useState('');

  // State cho Form đăng ký
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  // State cho OTP
  const [otp, setOtp] = useState('');

  const handleClose = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    });
    setStep(1);
    setOtp('');
    setEmailForOtp('');
    onClose();
  };

  // Xử lý thay đổi input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý Bước 1: Gửi thông tin đăng ký
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      // Nếu thành công -> Lưu email và chuyển sang bước 2
      setEmailForOtp(formData.email);
      setStep(2);
      toast.success('Gửi mã OTP thành công!', {
        description: `Vui lòng kiểm tra email ${formData.email}`,
      });
    } catch (err) {
      // Hiển thị toast lỗi
      toast.error('Đăng ký thất bại', {
        description: error || 'Vui lòng thử lại!',
      });
    }
  };

  // Xử lý Bước 2: Xác thực OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp({ email: emailForOtp, otp });
      // Thành công -> Hiển thị toast và đóng dialog
      toast.success('Đăng ký thành công!', {
        description: 'Tài khoản của bạn đã được kích hoạt',
      });
      handleClose();
      onSwitchToLogin?.();
    } catch (err) {
      // Hiển thị toast lỗi OTP
      toast.error('Xác thực thất bại', {
        description: error || 'Mã OTP không chính xác hoặc đã hết hạn',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={true}>
      <DialogContent className="w-[95vw] max-w-md sm:max-w-lg mx-auto p-0 rounded-2xl sm:rounded-3xl animate-in fade-in-0 zoom-in-95 duration-200 overflow-hidden bg-gradient-to-br from-purple-50 to-white border-0 shadow-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="text-center py-4 sm:py-6 px-4 sm:px-5 flex-shrink-0">
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            {step === 1 ? 'Đăng ký tài khoản' : 'Xác thực OTP'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mx-4 sm:mx-5 mb-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-xs sm:text-sm">{error}</p>
          </div>
        )}

        {step === 1 ? (
          // --- FORM BƯỚC 1: THÔNG TIN ĐĂNG KÝ ---
          <form onSubmit={handleRegisterSubmit} className="px-4 sm:px-5 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            <div className="space-y-2.5 sm:space-y-3">
              {/* Username */}
              <div>
                <Input
                  name="username"
                  type="text"
                  placeholder="Tên người dùng (Không dấu, không khoảng trắng)"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-purple-400 bg-white transition-all duration-200"
                />
              </div>

              {/* First Name */}
              <div>
                <Input
                  name="firstName"
                  type="text"
                  placeholder="Họ (First Name)"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-purple-400 bg-white transition-all duration-200"
                />
              </div>

              {/* Last Name */}
              <div>
                <Input
                  name="lastName"
                  type="text"
                  placeholder="Tên (Last Name)"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-purple-400 bg-white transition-all duration-200"
                />
              </div>

              {/* Email */}
              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-purple-400 bg-white transition-all duration-200"
                />
              </div>

              {/* Password */}
              <div>
                <Input
                  name="password"
                  type="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-purple-400 bg-white transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full font-semibold text-sm sm:text-base transition-all duration-200"
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
              </Button>

              <div className="text-center">
                <p className="text-gray-600 text-xs sm:text-sm">
                  Bạn đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      onSwitchToLogin?.();
                    }}
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors bg-transparent border-none p-0 cursor-pointer"
                  >
                    Đăng nhập ngay!
                  </button>
                </p>
              </div>
            </div>
          </form>
        ) : (
          // --- FORM BƯỚC 2: NHẬP OTP ---
          <form onSubmit={handleOtpSubmit} className="px-4 sm:px-5 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            <div className="space-y-2.5 sm:space-y-3">
              <p className="text-gray-600 text-xs sm:text-sm text-center">
                Mã OTP đã được gửi đến email: <strong className="text-purple-600">{emailForOtp}</strong>
              </p>

              <div>
                <Input
                  name="otp"
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-purple-400 bg-white transition-all duration-200 text-center tracking-widest"
                />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full font-semibold text-sm sm:text-base transition-all duration-200"
              >
                {isLoading ? 'Đang xác thực...' : 'Kích hoạt'}
              </Button>

              <Button
                type="button"
                onClick={() => setStep(1)}
                variant="outline"
                className="w-full h-10 sm:h-12 border-2 border-purple-300 text-purple-600 hover:bg-purple-50 rounded-full font-semibold text-sm sm:text-base transition-all duration-200"
              >
                Quay lại
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default RegisterDialog;