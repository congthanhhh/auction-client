import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
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

// Scroll to Top Component
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return isVisible ? (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110"
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  ) : null;
};

// Countdown Timer Component
const CountdownTimer = ({ endTime }: { endTime: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = endTime.getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="bg-gray-100 rounded-lg p-3">
      <p className="text-xs text-gray-600 mb-2 text-center">THỜI GIAN CÒN LẠI</p>
      <div className="flex gap-1 text-center">
        <div className="bg-white rounded px-2 py-1 min-w-[40px]">
          <div className="text-base font-bold text-gray-900">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500">hrs</div>
        </div>
        <div className="bg-white rounded px-2 py-1 min-w-[40px]">
          <div className="text-base font-bold text-gray-900">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500">min</div>
        </div>
        <div className="bg-white rounded px-2 py-1 min-w-[40px]">
          <div className="text-base font-bold text-gray-900">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500">sec</div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
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

      {/* Featured Auction Section */}
      <section className="bg-gray-50 py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 lg:mb-12">
            ĐẤU GIÁ <span className="text-orange-600">NỔI BẬT</span>
          </h2>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Product Image Section */}
              <div className="bg-black p-6 lg:p-12 flex items-center justify-center">
                <div className="flex gap-4 lg:gap-6">
                  {/* Gray iPhone */}
                  <div className="transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                    <div className="w-32 h-56 lg:w-40 lg:h-72 bg-gradient-to-b from-gray-300 to-gray-600 rounded-3xl relative shadow-2xl">
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-1">
                          <div className="w-3 h-3 bg-black rounded-full"></div>
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-400 rounded-full opacity-30"></div>
                    </div>
                  </div>
                  
                  {/* Orange iPhone */}
                  <div className="transform rotate-12 hover:rotate-0 transition-transform duration-300">
                    <div className="w-32 h-56 lg:w-40 lg:h-72 bg-gradient-to-b from-orange-400 to-orange-600 rounded-3xl relative shadow-2xl">
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-orange-900 rounded-2xl flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-1">
                          <div className="w-3 h-3 bg-black rounded-full"></div>
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                          <div className="w-1 h-1 bg-orange-700 rounded-full"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-orange-300 rounded-full opacity-30"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Info Section */}
              <div className="p-6 lg:p-12 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">NỔI BẬT</span>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  iPhone 17 series
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  iPhone 17 Pro và iPhone 17 Pro Max được thiết kế từ trong ra ngoài để trở thành những phiên bản iPhone mạnh mẽ nhất. Cốt lõi của thiết kế mới là vỏ máy nguyên khối nhôm rèn nhịt tăng tối đa độ bền bỉ, hiệu năng và dung lượng pin.
                </p>
                
                {/* Price and Timer in one container */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
                  {/* Price Section */}
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm mb-1">Giá đấu hiện tại</p>
                    <p className="text-3xl font-bold text-blue-600">19.999.999 VNĐ</p>
                  </div>
                  
                  {/* Countdown Timer */}
                  <div className="lg:flex-shrink-0">
                    <CountdownTimer endTime={new Date(Date.now() + 23 * 60 * 60 * 1000 + 12 * 60 * 1000 + 59 * 1000)} />
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/auction/iphone-17-series')}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  THAM GIA ĐẤU GIÁ
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-12 py-4 xs:py-6 sm:py-8 lg:py-10 xl:py-12 max-w-7xl">
        {/* Auction Products Section */}
        <section className="mb-8 sm:mb-10 lg:mb-16">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-3 sm:mb-0 text-gray-800">
              SẢN PHẨM <span className="text-yellow-600">ĐANG ĐẤU GIÁ</span>
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
            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-3 sm:mb-0 text-gray-800">
              SẢN PHẨM <span className="text-amber-600">SẮP ĐẤU GIÁ</span> ({upcomingProducts.length})
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
            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-3 sm:mb-0 text-gray-800">
              SẢN PHẨM <span className="text-orange-600">NỔI BẬT</span> ({featuredProducts.length})
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
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Home;