import { useState } from 'react';
import { Tag, Plus, Edit, Trash2, Package, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: number;
  name: string;
  icon: string;
  productCount: number;
  isActive: boolean;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: number;
  name: string;
  productCount: number;
}

const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Điện thoại & Phụ kiện',
    icon: '📱',
    productCount: 234,
    isActive: true,
    subCategories: [
      { id: 11, name: 'iPhone', productCount: 89 },
      { id: 12, name: 'Samsung', productCount: 67 },
      { id: 13, name: 'Xiaomi', productCount: 45 },
      { id: 14, name: 'Phụ kiện điện thoại', productCount: 33 },
    ],
  },
  {
    id: 2,
    name: 'Laptop & Máy tính',
    icon: '💻',
    productCount: 189,
    isActive: true,
    subCategories: [
      { id: 21, name: 'MacBook', productCount: 56 },
      { id: 22, name: 'Dell', productCount: 43 },
      { id: 23, name: 'Asus', productCount: 38 },
      { id: 24, name: 'HP', productCount: 52 },
    ],
  },
  {
    id: 3,
    name: 'Camera & Máy ảnh',
    icon: '📷',
    productCount: 145,
    isActive: true,
    subCategories: [
      { id: 31, name: 'Canon', productCount: 45 },
      { id: 32, name: 'Sony', productCount: 52 },
      { id: 33, name: 'Nikon', productCount: 34 },
      { id: 34, name: 'Phụ kiện camera', productCount: 14 },
    ],
  },
  {
    id: 4,
    name: 'Đồ gia dụng',
    icon: '🏠',
    productCount: 98,
    isActive: true,
    subCategories: [
      { id: 41, name: 'Tủ lạnh', productCount: 23 },
      { id: 42, name: 'Máy giặt', productCount: 31 },
      { id: 43, name: 'Điều hòa', productCount: 28 },
      { id: 44, name: 'Khác', productCount: 16 },
    ],
  },
  {
    id: 5,
    name: 'Xe cộ & Phương tiện',
    icon: '🚗',
    productCount: 67,
    isActive: false,
    subCategories: [
      { id: 51, name: 'Xe máy', productCount: 34 },
      { id: 52, name: 'Ô tô', productCount: 23 },
      { id: 53, name: 'Phụ tùng', productCount: 10 },
    ],
  },
];

const AdminCategories = () => {
  const [categories] = useState<Category[]>(MOCK_CATEGORIES);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const handleToggleExpand = (categoryId: number) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleAddCategory = () => {
    toast.success('Mở form thêm danh mục mới');
  };

  const handleEditCategory = (categoryId: number) => {
    toast.info(`Chỉnh sửa danh mục #${categoryId}`);
  };

  const handleDeleteCategory = (categoryId: number) => {
    toast.error(`Đã xóa danh mục #${categoryId}`);
  };

  const handleToggleActive = (categoryId: number) => {
    toast.success('Đã cập nhật trạng thái danh mục');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-gray-600 mt-1">Tổ chức và phân loại sản phẩm theo danh mục</p>
        </div>
        <button
          onClick={handleAddCategory}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <Plus size={20} />
          Thêm danh mục
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Tổng danh mục</p>
              <p className="text-2xl font-bold text-blue-900">{categories.length}</p>
            </div>
            <Tag className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Đang hoạt động</p>
              <p className="text-2xl font-bold text-green-900">
                {categories.filter(c => c.isActive).length}
              </p>
            </div>
            <Eye className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">Danh mục con</p>
              <p className="text-2xl font-bold text-orange-900">
                {categories.reduce((sum, cat) => sum + cat.subCategories.length, 0)}
              </p>
            </div>
            <Tag className="text-orange-500" size={32} />
          </div>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-purple-900">
                {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
              </p>
            </div>
            <Package className="text-purple-500" size={32} />
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Category Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-4xl">{category.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                      {category.isActive ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                          <Eye size={12} />
                          Đang hiển thị
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full flex items-center gap-1">
                          <EyeOff size={12} />
                          Đã ẩn
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Package size={14} />
                        {category.productCount} sản phẩm
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag size={14} />
                        {category.subCategories.length} danh mục con
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(category.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      category.isActive
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={category.isActive ? 'Ẩn danh mục' : 'Hiển thị danh mục'}
                  >
                    {category.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                  <button
                    onClick={() => handleToggleExpand(category.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Xem danh mục con"
                  >
                    <Tag size={20} />
                  </button>
                  <button
                    onClick={() => handleEditCategory(category.id)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-categories */}
            {expandedCategory === category.id && (
              <div className="p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Danh mục con</h4>
                  <button
                    onClick={() => toast.success('Mở form thêm danh mục con')}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    Thêm con
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {category.subCategories.map((subCat) => (
                    <div
                      key={subCat.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">{subCat.name}</span>
                        <span className="text-sm text-gray-500">({subCat.productCount})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toast.info(`Chỉnh sửa ${subCat.name}`)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => toast.error(`Đã xóa ${subCat.name}`)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Category Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          💡 <span className="font-semibold">Mẹo:</span> Tổ chức danh mục rõ ràng giúp người dùng dễ dàng tìm kiếm sản phẩm. 
          Nên có 2-3 cấp danh mục (Cha → Con → Cháu) để tối ưu trải nghiệm.
        </p>
      </div>
    </div>
  );
};

export default AdminCategories;
