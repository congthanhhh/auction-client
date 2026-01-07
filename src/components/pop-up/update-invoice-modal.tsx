import { useState, useEffect } from 'react';
import { X, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { InvoiceResponse, AdminUpdateInvoiceRequest, InvoiceStatus } from '@/types/invoice';
import { invoiceService } from '@/services/invoiceService';

interface UpdateInvoiceModalProps {
    invoice: InvoiceResponse;
    onClose: () => void;
    onSuccess: () => void;
}

const UpdateInvoiceModal = ({ invoice, onClose, onSuccess }: UpdateInvoiceModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<AdminUpdateInvoiceRequest>({
        status: invoice.status,
        trackingCode: '',
        carrier: '',
        recipientName: '',
        recipientPhone: '',
        shippingAddress: '',
        note: '',
    });

    useEffect(() => {
        // Initialize form with current invoice data
        setFormData({
            status: invoice.status,
            trackingCode: invoice.trackingCode || '',
            carrier: invoice.carrier || '',
            recipientName: invoice.recipientName || '',
            recipientPhone: invoice.recipientPhone || '',
            shippingAddress: invoice.shippingAddress || '',
            note: '',
        });
    }, [invoice]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await invoiceService.updateInvoiceForAdmin(invoice.id, formData);
            toast.success('Đã cập nhật hóa đơn thành công');
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Không thể cập nhật hóa đơn');
        } finally {
            setLoading(false);
        }
    };

    const statusOptions: { value: InvoiceStatus; label: string; color: string }[] = [
        { value: 'PENDING', label: 'Chờ thanh toán', color: 'text-yellow-600' },
        { value: 'PAID', label: 'Đã thanh toán', color: 'text-blue-600' },
        { value: 'SHIPPING', label: 'Đang giao hàng', color: 'text-purple-600' },
        { value: 'COMPLETED', label: 'Hoàn thành', color: 'text-green-600' },
        { value: 'DISPUTE', label: 'Khiếu nại', color: 'text-orange-600' },
        { value: 'CANCELLED_NON_PAYMENT', label: 'Hủy - Không thanh toán', color: 'text-red-600' },
        { value: 'CANCELLED_BY_SELLER', label: 'Hủy - Người bán', color: 'text-red-600' },
        { value: 'REFUNDED', label: 'Đã hoàn tiền', color: 'text-gray-600' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Cập nhật hóa đơn</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            ID: #{invoice.id} - {invoice.product.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as InvoiceStatus })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Recipient Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">Thông tin người nhận</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên người nhận
                                </label>
                                <input
                                    type="text"
                                    value={formData.recipientName}
                                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập tên người nhận..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    value={formData.recipientPhone}
                                    onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập số điện thoại..."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Địa chỉ giao hàng
                            </label>
                            <textarea
                                value={formData.shippingAddress}
                                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập địa chỉ giao hàng..."
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">Thông tin vận chuyển</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mã vận đơn
                                </label>
                                <input
                                    type="text"
                                    value={formData.trackingCode}
                                    onChange={(e) => setFormData({ ...formData, trackingCode: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nhập mã vận đơn..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Đơn vị vận chuyển
                                </label>
                                <input
                                    type="text"
                                    value={formData.carrier}
                                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="VD: Giao hàng nhanh, Viettel Post..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ghi chú Admin
                        </label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Thêm ghi chú nếu cần..."
                            rows={3}
                        />
                    </div>

                    {/* Current Info */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="text-sm font-semibold text-gray-700">Thông tin hiện tại:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-gray-600">Người mua:</span>
                                <span className="font-semibold text-gray-900 ml-2">
                                    {invoice.user.firstName} {invoice.user.lastName}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Giá cuối:</span>
                                <span className="font-semibold text-green-600 ml-2">
                                    {invoice.finalPrice.toLocaleString()} đ
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Loại:</span>
                                <span className="font-semibold text-gray-900 ml-2">
                                    {invoice.type === 'AUCTION_SALE' ? 'Đơn bán hàng' : 'Phí đăng sản phẩm'}
                                </span>
                            </div>
                            {invoice.paymentTime && (
                                <div>
                                    <span className="text-gray-600">Thanh toán lúc:</span>
                                    <span className="font-semibold text-gray-900 ml-2">
                                        {new Date(invoice.paymentTime).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw size={18} className="animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Cập nhật
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateInvoiceModal;
