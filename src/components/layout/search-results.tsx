import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import ProductCard from '../ui/product-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';
import type { Product } from '../../services/productService';
import { productService } from '../../services/productService';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await productService.searchProducts(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);



  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 lg:py-8">
        {/* Back button and search info */}
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-3 sm:mb-4 text-gray-600 hover:text-gray-800 p-0 text-sm sm:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Quay lại trang chủ
          </Button>
          
          {query && (
            <div className="mb-3 sm:mb-4">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
                Kết quả tìm kiếm cho: "{query}"
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${searchResults.length} sản phẩm`}
              </p>
            </div>
          )}
        </div>



        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Đang tìm kiếm sản phẩm...</p>
            </div>
          </div>
        )}

        {/* Search results */}
        {!loading && query && (
          <>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Không tìm thấy sản phẩm nào
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Không có sản phẩm nào phù hợp với từ khóa "{query}"
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Gợi ý tìm kiếm:</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Kiểm tra lại chính tả từ khóa</li>
                    <li>• Thử sử dụng từ khóa khác</li>
                    <li>• Sử dụng từ khóa ngắn gọn hơn</li>
                    <li>• Tìm kiếm theo thương hiệu hoặc loại sản phẩm</li>
                  </ul>
                </div>

                <div className="mt-8">
                  <Button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    Xem tất cả sản phẩm
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* No search query */}
        {!loading && !query && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Nhập từ khóa để tìm kiếm
            </h2>
            <p className="text-gray-600">
              Sử dụng thanh tìm kiếm ở trên để tìm sản phẩm bạn muốn
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;