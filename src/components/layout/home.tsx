import { useEffect, useState } from 'react';
import Header from './header';
import Footer from './footer';
import ProductCard from '../ui/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import imgBanner1 from '../../assets/imgbaner1.jpg';
import imgBanner2 from '../../assets/imgbaner2.webp';
import imgBanner3 from '../../assets/imgbaner3.webp';
import type { Product } from '../../services/productService';
import { productService } from '../../services/productService';

const Home = () => {
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);
  const [upcomingProducts, setUpcomingProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const [activeData, upcomingData, featuredData] = await Promise.all([
          productService.getActiveAuctionProducts(),
          productService.getUpcomingAuctionProducts(),
          productService.getFeaturedProducts()
        ]);

        setActiveProducts(activeData);
        setUpcomingProducts(upcomingData);
        setFeaturedProducts(featuredData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Banner data
  const bannerData = [
    {
      id: 1,
      image: imgBanner1,
      title: "🎧 AirPods Pro 3",
      subtitle: "Ngày vừa Cảm Biến Nhịp Tim.",
      price: "Tại Cellphones chỉ 6.79 Triệu",
      time: "Trả thẳng 8:00 | 27:09"
    },
    {
      id: 2,
      image: imgBanner2,
      title: "📱 iPhone 15 Pro Max",
      subtitle: "Titan mạnh mẽ. Rất Pro.",
      price: "Giá từ 29.99 Triệu",
      time: "Khuyến mãi có hạn"
    },
    {
      id: 3,
      image: imgBanner3,
      title: "💻 MacBook Air M3",
      subtitle: "Siêu mỏng. Siêu nhanh.",
      price: "Giá từ 27.99 Triệu",
      time: "Trả góp 0%"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <Header />
        <div className="flex items-center justify-center h-48 sm:h-64 lg:h-80 bg-gray-100" style={{ marginTop: '80px' }}>
          <div className="text-center px-4 sm:px-6 lg:px-8">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-14 sm:w-14 lg:h-16 lg:w-16 border-b-2 border-blue-600 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-medium">Đang tải sản phẩm...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Header />
      
      {/* Hero Banner */}
      <section className="bg-gray-200 py-3 xs:py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 w-full" style={{ marginTop: '80px' }}>
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl">
          <Carousel 
            className="w-full max-w-7xl mx-auto"
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
          >
            <CarouselContent>
              {bannerData.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className="relative bg-white rounded-lg lg:rounded-xl overflow-hidden shadow-sm">
                    <img 
                      src={banner.image} 
                      alt={banner.title}
                      className="w-full h-36 xs:h-44 sm:h-56 md:h-72 lg:h-80 xl:h-96 object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 sm:left-4 lg:left-6 hidden sm:flex w-10 h-10 lg:w-12 lg:h-12" />
            <CarouselNext className="right-2 sm:right-4 lg:right-6 hidden sm:flex w-10 h-10 lg:w-12 lg:h-12" />
          </Carousel>
        </div>
      </section>

      {/* Main content */}
      <main className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-12 py-4 xs:py-6 sm:py-8 lg:py-10 xl:py-12 max-w-7xl">
        {/* Auction Products Section */}
        <section className="mb-8 sm:mb-10 lg:mb-16">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 mb-3 sm:mb-0">
              SẢN PHẨM ĐANG ĐẤU GIÁ ({activeProducts.length})
            </h2>
            <button className="text-blue-600 hover:text-blue-700 hover:underline text-sm sm:text-base lg:text-lg self-start sm:self-auto transition-colors font-medium">
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {activeProducts.slice(0, 12).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Upcoming Auctions Section */}
        <section className="mb-8 sm:mb-10 lg:mb-16">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 mb-3 sm:mb-0">
              SẢN PHẨM SẮP ĐẤU GIÁ ({upcomingProducts.length})
            </h2>
            <button className="text-blue-600 hover:text-blue-700 hover:underline text-sm sm:text-base lg:text-lg self-start sm:self-auto transition-colors font-medium">
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {upcomingProducts.slice(0, 12).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="mb-8 sm:mb-10 lg:mb-16">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 mb-3 sm:mb-0">
              SẢN PHẨM NỔI BẬT ({featuredProducts.length})
            </h2>
            <button className="text-blue-600 hover:text-blue-700 hover:underline text-sm sm:text-base lg:text-lg self-start sm:self-auto transition-colors font-medium">
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {featuredProducts.slice(0, 12).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;