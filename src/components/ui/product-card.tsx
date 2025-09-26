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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 group">
      {/* Product Image */}
      <div className="aspect-square bg-white flex items-center justify-center p-2 sm:p-4">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA4VjE2TTggMTJIMTYiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
          }}
        />
      </div>
      
      {/* Product Info */}
      <div className="p-2 sm:p-3 lg:p-4">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 text-xs sm:text-sm lg:text-base leading-tight">
          {name}
        </h3>
        <p className="text-red-600 font-semibold mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">
          {currentPrice}
        </p>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-blue-600 border-blue-600 hover:bg-blue-50 hover:border-blue-700 text-xs sm:text-sm py-1.5 sm:py-2 transition-colors duration-200"
        >
          Quan tâm
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;