// src/components/layout/invoice-simple.tsx
// Simplified invoice page using only API data

import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Download,
    Printer,
    CheckCircle,
    Package,
    User,
    CreditCard,
    Loader2,
    Mail,
    XCircle,
    Clock,
    Ban,
} from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from './page-layout';
import { invoiceService } from '@/services/invoiceService';
import type { InvoiceResponse } from '@/types/invoice';

const Invoice = () => {
    const navigate = useNavigate();
    const { invoiceId } = useParams<{ invoiceId: string }>();

    const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!invoiceId) {
                toast.error('Không tìm thấy ID hóa đơn');
                navigate('/');
                return;
            }

            try {
                setIsLoading(true);
                const response = await invoiceService.getInvoiceById(Number(invoiceId));
                setInvoice(response.data);
            } catch (error: any) {
                console.error('Error fetching invoice:', error);
                toast.error(error.response?.data?.message || 'Không thể tải thông tin hóa đơn');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvoice();
    }, [invoiceId, navigate]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handlePrint = () => {
        window.print();
        toast.success('Đang chuẩn bị in hóa đơn...');
    };

    const handleDownload = () => {
        toast.success('Đang tải hóa đơn PDF...');
        // In real app, call API to generate and download PDF
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PAID':
                return {
                    color: 'bg-green-100 text-green-800 border-green-300',
                    icon: <CheckCircle className="w-5 h-5" />,
                    text: 'Đã thanh toán'
                };
            case 'PENDING':
                return {
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                    icon: <Clock className="w-5 h-5" />,
                    text: 'Chờ thanh toán'
                };
            case 'OVERDUE':
                return {
                    color: 'bg-red-100 text-red-800 border-red-300',
                    icon: <XCircle className="w-5 h-5" />,
                    text: 'Quá hạn'
                };
            case 'CANCELLED':
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-300',
                    icon: <Ban className="w-5 h-5" />,
                    text: 'Đã hủy'
                };
            default:
                return {
                    color: 'bg-blue-100 text-blue-800 border-blue-300',
                    icon: <CheckCircle className="w-5 h-5" />,
                    text: status
                };
        }
    };

    if (isLoading) {
        return (
            <PageLayout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
                        <p className="text-lg text-gray-600">Đang tải hóa đơn...</p>
                    </div>
                </div>
            </PageLayout>
        );
    }

    if (!invoice) {
        return (
            <PageLayout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <p className="text-lg text-gray-600">Không tìm thấy hóa đơn</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Về trang chủ
                        </button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    const statusConfig = getStatusConfig(invoice.status);

    return (
        <PageLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Header Actions - Hide on print */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 md:mb-8 print:hidden">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm md:text-base">Quay lại</span>
                    </button>

                    <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleDownload}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm md:text-base"
                        >
                            <Download size={16} className="md:w-5 md:h-5" />
                            <span>Tải PDF</span>
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors text-sm md:text-base"
                        >
                            <Printer size={16} className="md:w-5 md:h-5" />
                            <span>In</span>
                        </button>
                    </div>
                </div>

                {/* Invoice Container */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden print:shadow-none">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 md:px-8 py-4 md:py-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold mb-2">HÓA ĐƠN ĐẤU GIÁ</h1>
                                <p className="text-blue-100 text-xs md:text-sm">Invoice #{invoice.id}</p>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto">
                                <div className={`px-3 md:px-4 py-2 rounded-lg inline-flex items-center gap-2 mb-2 border-2 ${statusConfig.color}`}>
                                    {statusConfig.icon}
                                    <span className="font-semibold text-sm md:text-base">{statusConfig.text}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Info & User Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4 sm:px-6 md:px-8 py-4 md:py-6 border-b">
                        {/* Invoice Details */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm md:text-base">
                                <Package size={16} className="text-blue-600 md:w-5 md:h-5" />
                                Chi tiết hóa đơn
                            </h3>
                            <div className="space-y-2 text-xs md:text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Mã hóa đơn:</span>
                                    <span className="font-semibold text-gray-900">INV-{invoice.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phiên đấu giá:</span>
                                    <span className="font-semibold text-gray-900">AUC-{invoice.auctionSessionId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ngày tạo:</span>
                                    <span className="text-gray-900">{formatDate(invoice.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Hạn thanh toán:</span>
                                    <span className="text-gray-900">{formatDate(invoice.dueDate)}</span>
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm md:text-base">
                                <User size={16} className="text-blue-600 md:w-5 md:h-5" />
                                Người mua
                            </h3>
                            <div className="space-y-2 text-xs md:text-sm text-gray-700">
                                <p className="font-semibold text-gray-900">
                                    {invoice.user.firstName} {invoice.user.lastName}
                                </p>
                                <p className="flex items-center gap-2">
                                    <User size={14} className="text-gray-500" />
                                    @{invoice.user.username}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail size={14} className="text-gray-500" />
                                    {invoice.user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm md:text-base">
                            <Package size={18} className="text-blue-600" />
                            Thông tin sản phẩm
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-4">
                                {invoice.product.images && invoice.product.images.length > 0 && (
                                    <img
                                        src={invoice.product.images[0].url}
                                        alt={invoice.product.name}
                                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                                    />
                                )}
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{invoice.product.name}</p>
                                    <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{invoice.product.description}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Giá khởi điểm: {formatPrice(invoice.product.startPrice)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6 bg-gray-50 border-t">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm md:text-base">
                            <CreditCard size={18} className="text-blue-600" />
                            Thông tin thanh toán
                        </h3>
                        <div className="max-w-md ml-auto space-y-3">
                            <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
                                <span className="text-base md:text-lg font-bold text-gray-900">Giá cuối cùng:</span>
                                <span className="text-xl md:text-2xl font-bold text-blue-600">
                                    {formatPrice(invoice.finalPrice)}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 text-right">
                                Giá trúng đấu giá đã bao gồm tất cả các khoản phí
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6 bg-gray-100 border-t">
                        <div className="text-center text-xs md:text-sm text-gray-600 space-y-2">
                            <p className="font-semibold text-gray-900">Cảm ơn bạn đã sử dụng dịch vụ đấu giá!</p>
                            <p className="text-xs text-gray-500 pt-2">
                                Hóa đơn này được tạo tự động bởi hệ thống và có giá trị pháp lý
                            </p>
                        </div>
                    </div>
                </div>

                {/* Help Text - Hide on print */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl print:hidden">
                    <p className="text-sm text-blue-800">
                        💡 <span className="font-semibold">Lưu ý:</span> Bạn có thể tải hóa đơn dưới dạng PDF
                        hoặc in trực tiếp từ trình duyệt. Hóa đơn này có giá trị thanh toán và giải quyết tranh chấp.
                    </p>
                </div>
            </div>

            <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
        </PageLayout>
    );
};

export default Invoice;
