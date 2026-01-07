import { useState, useEffect } from 'react';
import { X, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { AdminAuctionSessionResponse, AdminUpdateSessionRequest, AuctionStatus } from '@/types/auction';
import { auctionService } from '@/services/auctionService';

interface UpdateAuctionModalProps {
    auction: AdminAuctionSessionResponse;
    onClose: () => void;
    onSuccess: () => void;
}

const UpdateAuctionModal = ({ auction, onClose, onSuccess }: UpdateAuctionModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<AdminUpdateSessionRequest>({
        startTime: '',
        endTime: '',
        startPrice: 0,
        reservePrice: 0,
        buyNowPrice: 0,
        status: auction.status,
    });

    useEffect(() => {
        // Initialize form with current auction data
        setFormData({
            startTime: auction.startTime,
            endTime: auction.endTime,
            startPrice: auction.startPrice,
            reservePrice: auction.reservePrice,
            buyNowPrice: auction.buyNowPrice || 0,
            status: auction.status,
        });
    }, [auction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await auctionService.updateSessionForAdmin(auction.id, formData);
            toast.success('Đã cập nhật phiên đấu giá thành công');
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Không thể cập nhật phiên đấu giá');
        } finally {
            setLoading(false);
        }
    };

    const formatDateTimeLocal = (isoString: string) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
    };

    const statusOptions: { value: AuctionStatus; label: string }[] = [
        { value: 'SCHEDULED', label: 'Đã lên lịch' },
        { value: 'ACTIVE', label: 'Đang diễn ra' },
        { value: 'ENDED', label: 'Đã kết thúc' },
        { value: 'CANCELLED', label: 'Đã hủy' },
        { value: 'FAILED', label: 'Thất bại' },
        { value: 'WAITING_PAYMENT', label: 'Chờ thanh toán' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Cập nhật phiên đấu giá</h2>
                        <p className="text-sm text-gray-600 mt-1">ID: {auction.id} - {auction.product.name}</p>
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
                    {/* Time Range */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Thời gian bắt đầu
                            </label>
                            <input
                                type="datetime-local"
                                value={formatDateTimeLocal(formData.startTime || '')}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Thời gian kết thúc
                            </label>
                            <input
                                type="datetime-local"
                                value={formatDateTimeLocal(formData.endTime || '')}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Prices */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Giá khởi điểm (VNĐ)
                            </label>
                            <input
                                type="number"
                                value={formData.startPrice}
                                onChange={(e) => setFormData({ ...formData, startPrice: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Giá sàn (VNĐ) không thể update
                            </label>
                            <input
                                type="number"
                                value={formData.reservePrice}
                                onChange={(e) => setFormData({ ...formData, reservePrice: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                                disabled
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Giá mua ngay (VNĐ)
                        </label>
                        <input
                            type="number"
                            value={formData.buyNowPrice}
                            onChange={(e) => setFormData({ ...formData, buyNowPrice: Number(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">Để 0 nếu không có giá mua ngay</p>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as AuctionStatus })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Current Info */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="text-sm font-semibold text-gray-700">Thông tin hiện tại:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-gray-600">Giá hiện tại:</span>
                                <span className="font-semibold text-gray-900 ml-2">
                                    {auction.currentPrice.toLocaleString()} VNĐ
                                </span>
                            </div>
                            {auction.highestMaxBid && (
                                <div>
                                    <span className="text-gray-600">Giá cao nhất:</span>
                                    <span className="font-semibold text-green-600 ml-2">
                                        {auction.highestMaxBid.toLocaleString()} VNĐ
                                    </span>
                                </div>
                            )}
                            {auction.highestBidder && (
                                <div className="col-span-2">
                                    <span className="text-gray-600">Người đặt giá cao nhất:</span>
                                    <span className="font-semibold text-blue-600 ml-2">
                                        {auction.highestBidder.firstName} {auction.highestBidder.lastName} ({auction.highestBidder.username})
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

export default UpdateAuctionModal;
