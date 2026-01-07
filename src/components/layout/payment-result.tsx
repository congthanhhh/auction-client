// src/components/layout/payment-result.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowLeft, Home, FileText } from 'lucide-react';
import PageLayout from './page-layout';
import Invoice from './invoice';
import { Button } from '@/components/ui/button';
import { paymentService } from '@/services/paymentService';
import type { PaymentResponse } from '@/types/auction';

const PaymentResult = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                setIsLoading(true);

                // Send all query params to backend
                const response = await paymentService.handleVnPayCallback(searchParams);
                setPaymentResult(response.data);
            } catch (error: any) {
                console.error('Error handling payment callback:', error);
                setPaymentResult({
                    code: 'ERROR',
                    message: error.response?.data?.message || 'Có lỗi xảy ra khi xử lý thanh toán',
                });
            } finally {
                setIsLoading(false);
            }
        };

        handleCallback();
    }, [searchParams]);

    const isSuccess = paymentResult?.code === '00';

    if (isLoading) {
        return (
            <PageLayout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
                        <p className="text-lg text-gray-600">Đang xử lý kết quả thanh toán...</p>
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        {/* Icon and Status */}
                        <div className="text-center mb-8">
                            {isSuccess ? (
                                <>
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-12 h-12 text-green-600" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
                                    <p className="text-lg text-gray-600">
                                        Phiên đấu giá của bạn đã được tạo và thanh toán thành công
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <XCircle className="w-12 h-12 text-red-600" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h1>
                                    <p className="text-lg text-gray-600">{paymentResult?.message || 'Có lỗi xảy ra trong quá trình thanh toán'}</p>
                                </>
                            )}
                        </div>

                        {/* Payment Details */}
                        {paymentResult && (
                            <div className="bg-gray-50 rounded-xl p-6 space-y-3 mb-8">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Mã giao dịch:</span>
                                    <span className="font-semibold text-gray-900">{paymentResult.transactionId || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Mã hóa đơn:</span>
                                    <span className="font-semibold text-gray-900">#{paymentResult.invoiceId || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Trạng thái:</span>
                                    <span className={`font-semibold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                                        {isSuccess ? 'Thành công' : 'Thất bại'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Invoice Details - Only show on success */}
                        {isSuccess && paymentResult?.invoiceId && (
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    <h3 className="text-xl font-bold text-gray-900">Chi tiết hóa đơn</h3>
                                </div>
                                <Invoice invoiceId={paymentResult.invoiceId} />
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {isSuccess ? (
                                <>
                                    <Button
                                        onClick={() => navigate('/seller/dashboard')}
                                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Xem đơn hàng của tôi
                                    </Button>
                                    <Button
                                        onClick={() => navigate('/')}
                                        variant="outline"
                                        className="flex-1 font-semibold py-3"
                                    >
                                        <Home className="w-4 h-4 mr-2" />
                                        Về trang chủ
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => navigate('/user')}
                                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Quay lại trang hóa đơn
                                    </Button>
                                    <Button
                                        onClick={() => navigate('/')}
                                        variant="outline"
                                        className="flex-1 font-semibold py-3"
                                    >
                                        <Home className="w-4 h-4 mr-2" />
                                        Về trang chủ
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default PaymentResult;
