import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Cart, CartItem, Product, CartContextType } from '@/types/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Local storage key for guest cart
const GUEST_CART_KEY = 'afrikoin_guest_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cart, setCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from local storage for guests
  const loadGuestCart = useCallback(() => {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      if (stored) {
        const guestItems = JSON.parse(stored) as CartItem[];
        setItems(guestItems);
      }
    } catch (error) {
      console.error('Error loading guest cart:', error);
    }
    setIsLoading(false);
  }, []);

  // Save guest cart to local storage
  const saveGuestCart = useCallback((cartItems: CartItem[]) => {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  }, []);

  // Load user cart from Supabase
  const loadUserCart = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get or create active cart
      let { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (cartError && cartError.code === 'PGRST116') {
        // No active cart, create one
        const { data: newCart, error: createError } = await supabase
          .from('carts')
          .insert({ user_id: user.id, status: 'active' })
          .select()
          .single();

        if (createError) throw createError;
        cartData = newCart;
      } else if (cartError) {
        throw cartError;
      }

      setCart(cartData as Cart);

      // Load cart items with product details
      const { data: itemsData, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('cart_id', cartData?.id);

      if (itemsError) throw itemsError;

      const formattedItems = (itemsData || []).map(item => ({
        ...item,
        product: item.product as Product
      })) as CartItem[];

      setItems(formattedItems);

      // Merge guest cart if exists
      const guestCart = localStorage.getItem(GUEST_CART_KEY);
      if (guestCart) {
        const guestItems = JSON.parse(guestCart) as CartItem[];
        for (const guestItem of guestItems) {
          if (guestItem.product) {
            await addToCartInternal(guestItem.product, guestItem.quantity, cartData?.id);
          }
        }
        localStorage.removeItem(GUEST_CART_KEY);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le panier",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Internal add to cart (for merging)
  const addToCartInternal = async (product: Product, quantity: number, cartId?: string) => {
    if (!cartId) return;

    const existingItem = items.find(item => item.product_id === product.id);
    
    if (existingItem) {
      await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);
    } else {
      await supabase
        .from('cart_items')
        .insert({
          cart_id: cartId,
          product_id: product.id,
          quantity,
          price_snapshot: product.price,
          currency_snapshot: product.currency
        });
    }
  };

  useEffect(() => {
    if (user) {
      loadUserCart();
    } else {
      loadGuestCart();
    }
  }, [user, loadUserCart, loadGuestCart]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (user && cart) {
      // Logged in user - save to database
      try {
        const existingItem = items.find(item => item.product_id === product.id);
        
        if (existingItem) {
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id);

          if (error) throw error;

          setItems(prev => prev.map(item => 
            item.id === existingItem.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ));
        } else {
          const { data, error } = await supabase
            .from('cart_items')
            .insert({
              cart_id: cart.id,
              product_id: product.id,
              quantity,
              price_snapshot: product.price,
              currency_snapshot: product.currency
            })
            .select()
            .single();

          if (error) throw error;

          setItems(prev => [...prev, { ...data, product } as CartItem]);
        }

        toast({
          title: "Ajouté au panier",
          description: `${product.title} ajouté avec succès`
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter au panier",
          variant: "destructive"
        });
      }
    } else {
      // Guest user - save to local storage
      const existingItem = items.find(item => item.product_id === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = items.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `guest_${Date.now()}`,
          cart_id: 'guest',
          product_id: product.id,
          quantity,
          price_snapshot: product.price,
          currency_snapshot: product.currency,
          added_at: new Date().toISOString(),
          product
        };
        newItems = [...items, newItem];
      }
      
      setItems(newItems);
      saveGuestCart(newItems);
      
      toast({
        title: "Ajouté au panier",
        description: `${product.title} ajouté avec succès`
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    const item = items.find(i => i.product_id === productId);
    if (!item) return;

    if (user && cart) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', item.id);

        if (error) throw error;

        setItems(prev => prev.filter(i => i.product_id !== productId));
        
        toast({
          title: "Retiré du panier",
          description: "Article supprimé avec succès"
        });
      } catch (error) {
        console.error('Error removing from cart:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'article",
          variant: "destructive"
        });
      }
    } else {
      const newItems = items.filter(i => i.product_id !== productId);
      setItems(newItems);
      saveGuestCart(newItems);
      
      toast({
        title: "Retiré du panier",
        description: "Article supprimé avec succès"
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    const item = items.find(i => i.product_id === productId);
    if (!item) return;

    if (user && cart) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', item.id);

        if (error) throw error;

        setItems(prev => prev.map(i => 
          i.product_id === productId ? { ...i, quantity } : i
        ));
      } catch (error) {
        console.error('Error updating quantity:', error);
        toast({
          title: "Erreur",
          description: "Impossible de modifier la quantité",
          variant: "destructive"
        });
      }
    } else {
      const newItems = items.map(i => 
        i.product_id === productId ? { ...i, quantity } : i
      );
      setItems(newItems);
      saveGuestCart(newItems);
    }
  };

  const clearCart = async () => {
    if (user && cart) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cart.id);

        if (error) throw error;

        setItems([]);
        
        toast({
          title: "Panier vidé",
          description: "Tous les articles ont été supprimés"
        });
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast({
          title: "Erreur",
          description: "Impossible de vider le panier",
          variant: "destructive"
        });
      }
    } else {
      setItems([]);
      localStorage.removeItem(GUEST_CART_KEY);
      
      toast({
        title: "Panier vidé",
        description: "Tous les articles ont été supprimés"
      });
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price_snapshot * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      items,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
