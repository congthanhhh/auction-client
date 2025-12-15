import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  name: string;
  currentPrice: string;
  image: string;
  status: 'active' | 'upcoming' | 'featured';
  onBuyNow?: () => void;
  onAutoBid?: () => void;
}

const ProductCard = ({ id, name, currentPrice, image, onBuyNow, onAutoBid }: ProductCardProps) => {
  const navigate = useNavigate();
  
  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow();
    } else {
      navigate(`/product/${id}`);
    }
  };

  const handleAutoBid = () => {
    if (onAutoBid) {
      onAutoBid();
    } else {
      navigate(`/auction/${id}`);
    }
  };
  
  return (
    <div className="bg-white rounded-lg lg:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100 hover:border-gray-200 flex flex-col h-full">
      {/* Product Image */}
      <div className="aspect-square bg-gray-50 flex items-center justify-center p-2 xs:p-3 sm:p-4 lg:p-5 rounded-t-lg lg:rounded-t-xl overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA4VjE2TTggMTJIMTYiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
          }}
        />
      </div>
      
      {/* Product Info */}
      <div className="p-2 xs:p-3 sm:p-4 lg:p-5 flex flex-col flex-1">
        <h3 className="font-medium text-gray-800 mb-2 xs:mb-2.5 sm:mb-3 line-clamp-2 text-xs xs:text-sm sm:text-base lg:text-lg leading-tight hover:text-blue-600 transition-colors cursor-pointer flex-1">
          {name}
        </h3>
        
        <div className="mt-auto">
          <p className="text-red-600 font-bold mb-2 xs:mb-3 sm:mb-4 text-sm xs:text-base sm:text-lg lg:text-xl">
            {currentPrice}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleBuyNow}
              variant="outline" 
              size="sm" 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-none shadow-md hover:shadow-lg text-xs sm:text-sm py-2 sm:py-2.5 px-3 transition-all duration-300 font-semibold rounded-lg flex items-center justify-center gap-1.5 transform hover:scale-[1.02]"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Mua ngay</span>
            </Button>
            
            <Button 
              onClick={handleAutoBid}
              variant="outline" 
              size="sm" 
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black border-none shadow-md hover:shadow-lg text-xs sm:text-sm py-2 sm:py-2.5 px-3 transition-all duration-300 font-semibold rounded-lg flex items-center justify-center transform hover:scale-[1.02]"
            >
              Đặt giá
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;