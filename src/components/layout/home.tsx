import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import Header from './header';
import Footer from './footer';
import HowToBidModal from '../pop-up/how-to-bid-modal';
import TermsAndRulesModal from '../pop-up/terms-and-rules-modal';
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
import { useAuctionListStore } from '@/stores/useAuctionListStore';

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
      className="fixed bottom-6 right-28 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110"
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
  const [showHowToBid, setShowHowToBid] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Sử dụng store để fetch auctions
  const {
    activeAuctions,
    activeLoading,
    scheduledAuctions,
    scheduledLoading,
    fetchActiveAuctions,
    fetchScheduledAuctions,

    popularAuctions,
    popularLoading,
    bidCounts,
    fetchPopularAuctions,
  } = useAuctionListStore();

  // Fetch auctions khi component mount
  useEffect(() => {
    fetchActiveAuctions(1, 6);
    fetchScheduledAuctions(1, 6);
    fetchPopularAuctions();
  }, [fetchActiveAuctions, fetchScheduledAuctions, fetchPopularAuctions]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

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

  const loading = activeLoading || scheduledLoading;

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
    <div className="pt-6">
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

      {/* Featured Auction Section - Popular Products Carousel */}
      <section className="bg-gray-50 py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 lg:mb-12">
            SẢN PHẨM <span className="text-orange-600">PHỔ BIẾN</span>
          </h2>

          {popularLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
            </div>
          ) : popularAuctions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Chưa có sản phẩm phổ biến</p>
            </div>
          ) : (
            <Carousel
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                }),
              ]}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {popularAuctions.map((auction) => {
                  const bidCount = bidCounts[auction.product.id] || 0;
                  const endTime = new Date(auction.endTime);

                  return (
                    <CarouselItem key={auction.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                      <div
                        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group h-full"
                        onClick={() => navigate(`/auction/${auction.id}`)}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={auction.product.images[0]?.url || 'https://picsum.photos/200/300'}
                            alt={auction.product.name}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            🔥 HOT
                          </div>
                          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-lg text-xs">
                            {bidCount} lượt đấu giá
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-base group-hover:text-purple-600 transition-colors">
                            {auction.product.name}
                          </h3>
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Giá hiện tại</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {formatCurrency(auction.currentPrice)}
                            </p>
                          </div>
                          <div className="mb-3 pb-3 border-b">
                            <p className="text-xs text-gray-500">Thời gian còn lại</p>
                            <CountdownTimer endTime={endTime} />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/auction/${auction.id}`);
                            }}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all text-sm"
                          >
                            Đặt giá ngay
                          </button>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 lg:-left-12" />
              <CarouselNext className="hidden md:flex -right-4 lg:-right-12" />
            </Carousel>
          )}
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
            <button
              onClick={() => navigate('/all-auctions')}
              className="text-blue-600 hover:text-blue-700 hover:underline text-sm sm:text-base lg:text-lg self-start sm:self-auto transition-colors font-medium"
            >
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {activeAuctions.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Chưa có phiên đấu giá nào đang diễn ra</p>
              </div>
            ) : (
              activeAuctions.map((auction) => {
                const endTime = new Date(auction.endTime);
                const bidCount = bidCounts[auction.product.id] || 0;

                return (
                  <div
                    key={auction.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-200"
                    onClick={() => navigate(`/auction/${auction.id}`)}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={auction.product.images[0]?.url || 'https://picsum.photos/200/300'}
                        alt={auction.product.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                        ⏰ ĐANG DIỄN RA
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
                        {bidCount} lượt đấu giá
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-sm group-hover:text-purple-600 transition-colors">
                        {auction.product.name}
                      </h3>

                      <div className="mb-2">
                        <p className="text-xs text-gray-500 mb-1">Giá hiện tại</p>
                        <p className="text-lg font-bold text-purple-600">
                          {formatCurrency(auction.currentPrice)}
                        </p>
                      </div>

                      <div className="mb-2 pb-2 border-b">
                        <p className="text-xs text-gray-500">Thời gian còn lại</p>
                        <CountdownTimer endTime={endTime} />
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/auction/${auction.id}`);
                        }}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all text-xs"
                      >
                        Đặt giá ngay
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Upcoming Auctions Section */}
        <section className="mb-8 sm:mb-10 lg:mb-16">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-3 sm:mb-0 text-gray-800">
              SẢN PHẨM <span className="text-amber-600">SẮP ĐẤU GIÁ</span>
            </h2>
            <button
              onClick={() => navigate('/all-auctions')}
              className="text-blue-600 hover:text-blue-700 hover:underline text-sm sm:text-base lg:text-lg self-start sm:self-auto transition-colors font-medium"
            >
              Xem tất cả
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {scheduledAuctions.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Chưa có phiên đấu giá nào sắp diễn ra</p>
              </div>
            ) : (
              scheduledAuctions.map((auction) => {
                const startTime = new Date(auction.startTime);
                const formattedStartTime = startTime.toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={auction.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-200"
                    onClick={() => navigate(`/auction/${auction.id}`)}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={auction.product.images[0]?.url || 'https://picsum.photos/200/300'}
                        alt={auction.product.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                        🕒 SẮP DIỄN RA
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
                        Chưa có lượt đấu giá
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-sm group-hover:text-purple-600 transition-colors">
                        {auction.product.name}
                      </h3>

                      <div className="mb-2">
                        <p className="text-xs text-gray-500 mb-1">Giá khởi điểm</p>
                        <p className="text-lg font-bold text-purple-600">
                          {formatCurrency(auction.startPrice)}
                        </p>
                      </div>

                      <div className="mb-2 pb-2 border-b">
                        <p className="text-xs text-gray-500 mb-1">Thời gian bắt đầu</p>
                        <p className="text-xs font-semibold text-blue-600">
                          {formattedStartTime}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/auction/${auction.id}`);
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all text-xs"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Floating Action Buttons - Vertical Stack */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* Terms and Rules Button - Top */}
        <button
          onClick={() => setShowTerms(true)}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white flex items-center justify-center w-12 h-12"
          aria-label="Điều khoản & Quy định"
          title="Điều khoản & Quy định"
        >
          <span className="text-2xl font-bold">!</span>
        </button>

        {/* How to Bid Button - Bottom */}
        <button
          onClick={() => setShowHowToBid(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white flex items-center justify-center w-12 h-12"
          aria-label="Hướng dẫn đấu giá"
          title="Hướng dẫn đấu giá"
        >
          <span className="text-2xl font-bold">?</span>
        </button>
      </div>

      {/* Modals */}
      <HowToBidModal isOpen={showHowToBid} onClose={() => setShowHowToBid(false)} />
      <TermsAndRulesModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
};

export default Home;