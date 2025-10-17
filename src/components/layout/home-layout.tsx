import type { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';

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
    </div>
  );
};

export default HomeLayout;