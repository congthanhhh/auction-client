import { X, User, Mail, Phone, Package, Image as ImageIcon } from 'lucide-react';
import type { SimpleProductResponse, SimpleUserResponse } from '@/types/auction';

interface DetailModalProps {
    type: 'product' | 'user';
    data: SimpleProductResponse | SimpleUserResponse | null;
    onClose: () => void;
}

const DetailModal = ({ type, data, onClose }: DetailModalProps) => {
    if (!data) return null;

    const renderProductDetail = (product: SimpleProductResponse) => (
        <div className="space-y-6">
            {/* Product Images */}
            {product.images && product.images.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <ImageIcon size={16} className="text-blue-600" />
                        Hình ảnh sản phẩm
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {product.images.map((image) => (
                            <img
                                key={image.id}
                                src={image.url}
                                alt={product.name}
                                className="w-full h-40 object-cover rounded-lg border border-gray-200"
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Product Info */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Package size={16} className="text-blue-600" />
                    Thông tin sản phẩm
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                        <p className="text-xs text-gray-600">Tên sản phẩm</p>
                        <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-600">ID sản phẩm</p>
                        <p className="text-sm font-semibold text-gray-900">#{product.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-600">Giá khởi điểm</p>
                        <p className="text-sm font-semibold text-green-600">
                            {product.startPrice.toLocaleString()} VNĐ
                        </p>
                    </div>
                    {product.description && (
                        <div>
                            <p className="text-xs text-gray-600">Mô tả</p>
                            <p className="text-sm text-gray-700">{product.description}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Seller Info */}
            {product.seller && (
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User size={16} className="text-blue-600" />
                        Thông tin người bán
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div>
                            <p className="text-xs text-gray-600">Tên người bán</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {product.seller.firstName} {product.seller.lastName}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Username</p>
                            <p className="text-sm font-semibold text-gray-900">@{product.seller.username}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600">Email</p>
                            <p className="text-sm text-gray-700">{product.seller.email}</p>
                        </div>
                        {product.seller.phoneNumber && (
                            <div>
                                <p className="text-xs text-gray-600">Số điện thoại</p>
                                <p className="text-sm text-gray-700">{product.seller.phoneNumber}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    const renderUserDetail = (user: SimpleUserResponse) => (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User size={16} className="text-blue-600" />
                Thông tin người dùng
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={32} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-gray-900">
                            {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                    </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-gray-200">
                    <div className="flex items-start gap-3">
                        <Mail size={16} className="text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-600">Email</p>
                            <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                        </div>
                    </div>
                    {user.phoneNumber && (
                        <div className="flex items-start gap-3">
                            <Phone size={16} className="text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-600">Số điện thoại</p>
                                <p className="text-sm font-semibold text-gray-900">{user.phoneNumber}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {type === 'product' ? 'Chi tiết sản phẩm' : 'Chi tiết người dùng'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {type === 'product'
                        ? renderProductDetail(data as SimpleProductResponse)
                        : renderUserDetail(data as SimpleUserResponse)
                    }
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;
