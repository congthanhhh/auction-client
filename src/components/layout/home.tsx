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
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex items-center justify-center h-48 sm:h-64 lg:h-80">
          <div className="text-center px-4">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Đang tải sản phẩm...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      {/* Hero Banner */}
      <section className="bg-gray-200 py-3 sm:py-6 lg:py-8 xl:py-12">
        <div className="container mx-auto px-2 sm:px-4">
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
                  <div className="relative bg-white rounded-lg overflow-hidden">
                    <img 
                      src={banner.image} 
                      alt={banner.title}
                      className="w-full h-32 xs:h-40 sm:h-48 md:h-64 lg:h-80 xl:h-96 object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1 sm:left-2 lg:left-4 hidden sm:flex" />
            <CarouselNext className="right-1 sm:right-2 lg:right-4 hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      {/* Main content */}
      <main className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 lg:py-8">
        {/* Auction Products Section */}
        <section className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 lg:mb-6">
            <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
              SẢN PHẨM ĐANG ĐẤU GIÁ ({activeProducts.length})
            </h2>
            <button className="text-blue-600 hover:underline text-xs sm:text-sm lg:text-base self-start sm:self-auto transition-colors">
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            {activeProducts.slice(0, 10).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Upcoming Auctions Section */}
        <section className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 lg:mb-6">
            <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
              SẢN PHẨM SẮP ĐẤU GIÁ ({upcomingProducts.length})
            </h2>
            <button className="text-blue-600 hover:underline text-xs sm:text-sm lg:text-base self-start sm:self-auto transition-colors">
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            {upcomingProducts.slice(0, 10).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="mb-6 sm:mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 lg:mb-6">
            <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
              SẢN PHẨM NỔI BẬT ({featuredProducts.length})
            </h2>
            <button className="text-blue-600 hover:underline text-xs sm:text-sm lg:text-base self-start sm:self-auto transition-colors">
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            {featuredProducts.slice(0, 10).map((product) => (
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