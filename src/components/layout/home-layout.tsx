import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import Header from './header';
import Footer from './footer';

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

interface HomeLayoutProps {
  children: ReactNode;
  banner?: ReactNode;
  className?: string;
}

const HomeLayout = ({
  children,
  banner,
  className = ""
}: HomeLayoutProps) => {
  return (
    <div className={`min-h-screen bg-gray-100 relative ${className}`}>
      <Header />

      {/* Hero Banner Section - Responsive */}
      {banner && (
        <section className="bg-gray-200 py-3 xs:py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 w-full"
          style={{ marginTop: '80px' }}>
          <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl">
            {banner}
          </div>
        </section>
      )}

      {/* Main content - Responsive padding and spacing */}
      <main className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-12 py-4 xs:py-6 sm:py-8 lg:py-10 xl:py-12 max-w-7xl">
        {children}
      </main>

      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default HomeLayout;