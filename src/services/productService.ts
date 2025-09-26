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

class ProductService {
  private baseUrl = 'http://localhost:3001'; // JSON Server URL

  async getActiveAuctionProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/activeProducts`);
      if (!response.ok) {
        throw new Error('Failed to fetch active auction products');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching active auction products:', error);
      return [];
    }
  }

  async getUpcomingAuctionProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/upcomingProducts`);
      if (!response.ok) {
        throw new Error('Failed to fetch upcoming auction products');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching upcoming auction products:', error);
      return [];
    }
  }

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/featuredProducts`);
      if (!response.ok) {
        throw new Error('Failed to fetch featured products');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  // Lấy sản phẩm theo ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const [activeProducts, upcomingProducts, featuredProducts] = await Promise.all([
        this.getActiveAuctionProducts(),
        this.getUpcomingAuctionProducts(), 
        this.getFeaturedProducts()
      ]);
      
      const allProducts = [...activeProducts, ...upcomingProducts, ...featuredProducts];
      return allProducts.find(product => product.id === id) || null;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  }

  // Tìm kiếm sản phẩm
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const [activeProducts, upcomingProducts, featuredProducts] = await Promise.all([
        this.getActiveAuctionProducts(),
        this.getUpcomingAuctionProducts(),
        this.getFeaturedProducts()
      ]);
      
      const allProducts = [...activeProducts, ...upcomingProducts, ...featuredProducts];
      return allProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  async getSuggestions(query: string): Promise<Product[]> {
    if (!query.trim() || query.length < 1) {
      return [];
    }

    try {
      // Fetch tất cả sản phẩm để tìm suggestions
      const [activeProducts, upcomingProducts, featuredProducts] = await Promise.all([
        this.getActiveAuctionProducts(),
        this.getUpcomingAuctionProducts(),
        this.getFeaturedProducts()
      ]);

      const allProducts = [...activeProducts, ...upcomingProducts, ...featuredProducts];
      
      // Tìm sản phẩm có tên chứa từ khóa (không phân biệt hoa thường)
      const suggestions = allProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
      );

      // Giới hạn chỉ 5 suggestions để không quá dài
      return suggestions.slice(0, 5);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }
}

export const productService = new ProductService();