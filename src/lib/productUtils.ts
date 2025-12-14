import dbData from '../../db.json';

export interface Product {
  id: string;
  name: string;
  currentPrice: string;
  image: string;
  status: 'active' | 'upcoming' | 'featured';
  description?: string;
  endTime?: string;
  startingPrice?: string;
  startTime?: string;
}

export const getProductById = (id: string): Product | null => {
  // Tìm trong activeProducts
  const activeProduct = dbData.activeProducts.find((p: any) => p.id === id);
  if (activeProduct) return activeProduct;

  // Tìm trong upcomingProducts
  const upcomingProduct = dbData.upcomingProducts.find((p: any) => p.id === id);
  if (upcomingProduct) return upcomingProduct;

  // Tìm trong featuredProducts
  const featuredProduct = dbData.featuredProducts.find((p: any) => p.id === id);
  if (featuredProduct) return featuredProduct;

  return null;
};

export const getAllProducts = (): Product[] => {
  return [
    ...dbData.activeProducts,
    ...dbData.upcomingProducts,
    ...dbData.featuredProducts,
  ];
};
