import React from 'react';
import { Minus, Plus, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
}

export const CartItemCard: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const product = item.product;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'XOF' ? 'XOF' : currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="p-4 animate-fade-in hover:shadow-lg transition-all duration-300">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden flex-shrink-0">
          {product?.images?.[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="w-8 h-8 text-primary/60" />
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {product?.title || 'Produit'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {formatPrice(item.price_snapshot, item.currency_snapshot)} / unité
          </p>
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <span className="w-8 text-center font-medium text-foreground">
              {item.quantity}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full ml-auto text-destructive hover:bg-destructive/10"
              onClick={() => removeFromCart(item.product_id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Total Price */}
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-lg text-primary">
            {formatPrice(item.price_snapshot * item.quantity, item.currency_snapshot)}
          </p>
        </div>
      </div>
    </Card>
  );
};
