import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, MapPin, Package, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SmartImage } from '@/components/ui/smart-image';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/types/cart';

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onView }) => {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'XOF' ? 'XOF' : currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    await addToCart(product);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <Card 
      className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 animate-fade-in"
      onClick={() => onView?.(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {product.images?.[0] ? (
          <SmartImage
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_featured && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              <Star className="w-3 h-3 mr-1" />
              Vedette
            </Badge>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <Badge variant="destructive" className="text-xs">
              Plus que {product.stock}
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="secondary" className="text-xs">
              Rupture
            </Badge>
          )}
        </div>

        {/* Like Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm ${
            isLiked ? 'text-red-500' : 'text-muted-foreground'
          }`}
          onClick={handleLike}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </Button>

        {/* Quick Actions */}
        <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 bg-background/90 backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); onView?.(product); }}
          >
            <Eye className="w-4 h-4 mr-1" />
            Voir
          </Button>
          <Button
            size="sm"
            className={`flex-1 ${isAdding ? 'animate-pulse' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className={`w-4 h-4 mr-1 ${isAdding ? 'animate-bounce' : ''}`} />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>
        
        {product.country && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="w-3 h-3" />
            {product.country}
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <p className="font-bold text-lg text-primary">
            {formatPrice(product.price, product.currency)}
          </p>
          {product.views_count > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {product.views_count}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
