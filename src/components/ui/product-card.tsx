import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: string;
  name: string;
  currentPrice: string;
  image: string;
  status: 'active' | 'upcoming' | 'featured';
}

const ProductCard = ({ name, currentPrice, image }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg lg:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100 hover:border-gray-200">
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
      <div className="p-2 xs:p-3 sm:p-4 lg:p-5">
        <h3 className="font-medium text-gray-800 mb-2 xs:mb-2.5 sm:mb-3 line-clamp-2 text-xs xs:text-sm sm:text-base lg:text-lg leading-tight hover:text-blue-600 transition-colors cursor-pointer">
          {name}
        </h3>
        <p className="text-red-600 font-bold mb-2 xs:mb-3 sm:mb-4 text-sm xs:text-base sm:text-lg lg:text-xl">
          {currentPrice}
        </p>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-3 transition-all duration-200 font-medium rounded-md lg:rounded-lg flex items-center justify-center gap-2"
        >
          <span className="text-lg">♡</span>
          <span>Quan tâm</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;