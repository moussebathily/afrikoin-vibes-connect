// Cart and Product type definitions
export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  country?: string;
  images: string[];
  seller_id?: string;
  stock: number;
  category?: string;
  is_active: boolean;
  is_featured: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  price_snapshot: number;
  currency_snapshot: string;
  added_at: string;
  product?: Product;
}

export interface Cart {
  id: string;
  user_id: string;
  status: 'active' | 'validated' | 'abandoned';
  created_at: string;
  updated_at: string;
  items?: CartItem[];
}

export interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

export interface ProductRecommendation {
  id: string;
  product_id: string;
  recommended_product_id: string;
  score: number;
  recommendation_type: string;
  recommended_product?: Product;
}
