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
import productImage from '../../assets/productex.webp';

const Home = () => {
  // Mock data for products
  const mockProducts = Array.from({ length: 10 }, (_, i) => ({
    id: `${i + 1}`,
    name: `iPhone 17 Pro Max 256GB | Chính hãng`,
    currentPrice: '37.999.000đ',
    image: productImage,
    status: 'active' as const
  }));

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

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      {/* Hero Banner */}
      <section className="bg-gray-200 py-6 sm:py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <Carousel 
            className="w-full max-w-6xl mx-auto"
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
                      className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 sm:left-4 hidden sm:flex" />
            <CarouselNext className="right-2 sm:right-4 hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      {/* Main content */}
      <main className="container mx-auto px-4 py-4 sm:py-8">
        {/* Auction Products Section */}
        <section className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
              SẢN PHẨM ĐANG ĐẤU GIÁ
            </h2>
            <button className="text-blue-600 hover:underline text-sm sm:text-base self-start sm:self-auto">
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Upcoming Auctions Section */}
        <section className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
              SẢN PHẨM SẮP ĐẤU GIÁ
            </h2>
            <button className="text-blue-600 hover:underline text-sm sm:text-base self-start sm:self-auto">
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {mockProducts.map((product) => (
              <ProductCard key={`upcoming-${product.id}`} {...product} />
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
              SẢN PHẨM NỔI BẬT
            </h2>
            <button className="text-blue-600 hover:underline text-sm sm:text-base self-start sm:self-auto">
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {mockProducts.slice(0, 10).map((product) => (
              <ProductCard key={`featured-${product.id}`} {...product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;