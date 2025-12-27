// src/components/layout/payment-vnpay.tsx
// This is a simplified payment page for VNPay integration
// Note: For auction reserve price payment, the flow is:
// 1. User creates auction with reservePrice
// 2. Backend returns paymentUrl
// 3. User is redirected directly to VNPay (not this page)
// 4. After payment, VNPay redirects to /payment-result

import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import PageLayout from './page-layout';

const PaymentVNPay = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const paymentUrl = searchParams.get('url');

    useEffect(() => {
        if (paymentUrl) {
            // Redirect to VNPay
            window.location.href = paymentUrl;
        } else {
            // No payment URL, redirect back
            navigate('/');
        }
    }, [paymentUrl, navigate]);

    return (
        <PageLayout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Đang chuyển đến trang thanh toán VNPay...</p>
                </div>
            </div>
        </PageLayout>
    );
};

export default PaymentVNPay;
