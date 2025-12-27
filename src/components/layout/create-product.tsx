import { ArrowLeft, Upload, X, Plus, Package, Tag, Info } from 'lucide-react';
import PageLayout from './page-layout';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { imageService, type Image } from '@/services/imageService';
import { categoryService, type CategoryResponse } from '@/services/categoryService';
import { productService } from '@/services/productService';
import { toast } from 'sonner';
import type { CreateProductRequest } from '@/types/product';

const CreateProduct = () => {
    const navigate = useNavigate();

    const [images, setImages] = useState<Image[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data for product
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startPrice: '',
        categoryId: '',
        attributes: [] as { key: string; value: string }[],
        newAttributeKey: '',
        newAttributeValue: '',
    });

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Không thể tải danh mục');
            }
        };
        fetchCategories();
    }, []);

    // Handle image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (images.length + files.length > 4) {
            toast.error('Tối đa 4 ảnh');
            return;
        }

        setIsUploading(true);
        try {
            const uploadPromises = Array.from(files).map((file) => imageService.uploadImage(file));
            const uploadedImages = await Promise.all(uploadPromises);

            setImages((prev) => [...prev, ...uploadedImages]);
            toast.success(`Đã tải lên ${uploadedImages.length} ảnh`);
        } catch (error: any) {
            console.error('Error uploading images:', error);
            toast.error(error.response?.data?.message || 'Upload ảnh thất bại');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    // Handle image delete
    const handleImageDelete = async (imageId: number) => {
        try {
            await imageService.deleteImage(imageId);
            setImages((prev) => prev.filter((img) => img.id !== imageId));
            toast.success('Đã xóa ảnh');
        } catch (error: any) {
            console.error('Error deleting image:', error);
            toast.error(error.response?.data?.message || 'Xóa ảnh thất bại');
        }
    };

    // Handle add attribute
    const handleAddAttribute = () => {
        const { newAttributeKey, newAttributeValue } = formData;
        if (!newAttributeKey.trim() || !newAttributeValue.trim()) {
            toast.error('Vui lòng điền đầy đủ tên và giá trị thuộc tính');
            return;
        }

        setFormData((prev) => ({
            ...prev,
            attributes: [...prev.attributes, { key: newAttributeKey, value: newAttributeValue }],
            newAttributeKey: '',
            newAttributeValue: '',
        }));
    };

    // Handle remove attribute
    const handleRemoveAttribute = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            attributes: prev.attributes.filter((_, i) => i !== index),
        }));
    };

    // Handle product submit
    const handleProductSubmit = async (createAuction: boolean) => {
        // Validation
        if (images.length === 0) {
            toast.error('Vui lòng thêm ít nhất 1 ảnh');
            return;
        }

        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tên sản phẩm');
            return;
        }

        if (!formData.categoryId) {
            toast.error('Vui lòng chọn danh mục');
            return;
        }

        if (!formData.startPrice || Number(formData.startPrice) <= 0) {
            toast.error('Giá khởi điểm phải lớn hơn 0');
            return;
        }

        setIsSubmitting(true);
        try {
            // Convert attributes to JSON object format
            const attributesObject = formData.attributes.reduce((acc, attr) => {
                acc[attr.key] = attr.value;
                return acc;
            }, {} as Record<string, string>);

            const attributesString = formData.attributes.length > 0 ? JSON.stringify(attributesObject) : null;

            const productRequest: CreateProductRequest = {
                name: formData.name,
                description: formData.description,
                startPrice: Number(formData.startPrice),
                categoryId: Number(formData.categoryId),
                attributes: attributesString || '',
                imageIds: images.map((img) => img.id),
            };

            const response = await productService.createProduct(productRequest);

            toast.success('Tạo sản phẩm thành công!');

            if (createAuction) {
                // Navigate to create auction with product data
                navigate('/create-auction', { state: { product: response.data } });
            } else {
                // Navigate to seller products
                navigate('/seller/dashboard');
            }
        } catch (error: any) {
            console.error('Error creating product:', error);
            toast.error(error.response?.data?.message || 'Tạo sản phẩm thất bại');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format number to VND
    const formatNumber = (value: string) => {
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setFormData({ ...formData, startPrice: value });
    };

    return (
        <PageLayout>
            <div className="bg-gray-50 min-h-screen py-6">
                <div className="max-w-5xl mx-auto px-4">

                    {/* Header */}
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 flex items-center gap-3 bg-white hover:bg-yellow-50 text-gray-800 font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                    >
                        <ArrowLeft size={20} className="text-yellow-600" />
                        <span>Quay lại</span>
                    </button>

                    {/* Create Product Form */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Tạo sản phẩm</h1>
                                <p className="text-sm text-gray-600">Điền thông tin về sản phẩm của bạn</p>
                            </div>
                        </div>

                        <div className="space-y-6">

                            {/* Hình ảnh sản phẩm */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Hình ảnh sản phẩm <span className="text-red-500">*</span>
                                    <span className="text-gray-500 font-normal ml-2">({images.length}/4)</span>
                                </label>
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                    {images.map((img, index) => (
                                        <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group">
                                            <img src={img.url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleImageDelete(img.id)}
                                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            {index === 0 && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-orange-500 text-white text-xs text-center py-1">
                                                    Ảnh bìa
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {images.length < 4 && (
                                        <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50 hover:bg-orange-50">
                                            {isUploading ? (
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 text-gray-400 mb-1" />
                                                    <span className="text-xs text-gray-600">Thêm ảnh</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={isUploading}
                                            />
                                        </label>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    <Info className="w-3 h-3 inline mr-1" />
                                    Ảnh đầu tiên sẽ là ảnh bìa. Tối đa 4 ảnh.
                                </p>
                            </div>

                            {/* Thông tin sản phẩm */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-orange-600" />
                                    Thông tin sản phẩm
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên sản phẩm <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Ví dụ: iPhone 15 Pro Max 256GB"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Danh mục <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mô tả chi tiết <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Mô tả chi tiết về sản phẩm, tình trạng, xuất xứ..."
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Giá khởi điểm <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formatNumber(formData.startPrice)}
                                            onChange={handlePriceChange}
                                            placeholder="0"
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            required
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₫</span>
                                    </div>
                                </div>

                                {/* Attributes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thuộc tính sản phẩm
                                    </label>

                                    {/* Display existing attributes */}
                                    {formData.attributes.length > 0 && (
                                        <div className="mb-3 space-y-2">
                                            {formData.attributes.map((attr, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                                                    <span className="flex-1 text-sm">
                                                        <strong>{attr.key}:</strong> {attr.value}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveAttribute(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add new attribute */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.newAttributeKey}
                                            onChange={(e) => setFormData({ ...formData, newAttributeKey: e.target.value })}
                                            placeholder="Tên thuộc tính (vd: Màu sắc)"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        />
                                        <input
                                            type="text"
                                            value={formData.newAttributeValue}
                                            onChange={(e) => setFormData({ ...formData, newAttributeValue: e.target.value })}
                                            placeholder="Giá trị (vd: Đen)"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="px-4"
                                            onClick={handleAddAttribute}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Ví dụ: Màu sắc - Đen, Dung lượng - 256GB
                                    </p>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => navigate(-1)}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="button"
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-lg py-6 font-bold shadow-lg"
                                    disabled={isSubmitting}
                                    onClick={() => handleProductSubmit(false)}
                                >
                                    {isSubmitting ? 'Đang tạo...' : 'Lưu sản phẩm'}
                                </Button>
                                <Button
                                    type="button"
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg py-6 font-bold shadow-lg"
                                    disabled={isSubmitting}
                                    onClick={() => handleProductSubmit(true)}
                                >
                                    {isSubmitting ? 'Đang tạo...' : 'Tạo & Đăng đấu giá →'}
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PageLayout>
    );
};

export default CreateProduct;
