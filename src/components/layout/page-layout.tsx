import type { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

const PageLayout = ({ 
  children, 
  className = "",
  containerClassName = "",
  showHeader = true,
  showFooter = true 
}: PageLayoutProps) => {
  return (
    <div className={`min-h-screen bg-gray-100 relative ${className}`}>
      {showHeader && <Header />}
      
      <main className={`container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-12 py-4 xs:py-6 sm:py-8 lg:py-10 xl:py-12 max-w-7xl ${containerClassName}`} 
            style={showHeader ? { marginTop: '80px' } : {}}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default PageLayout;