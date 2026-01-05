import React from 'react';
import { ShoppingCart, X, Trash2, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { CartItemCard } from './CartItem';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, totalItems, totalPrice, clearCart, isLoading } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border shadow-2xl z-50 animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground">Mon Panier</h2>
              <p className="text-sm text-muted-foreground">
                {totalItems} article{totalItems > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Chargement du panier...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Panier vide</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Ajoutez des articles pour commencer vos achats
                </p>
              </div>
              <Button onClick={onClose} className="mt-4">
                Continuer les achats
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4 space-y-4 bg-muted/30">
            {/* Summary */}
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Livraison</span>
                <Badge variant="success" className="text-xs">Gratuite</Badge>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-xl text-primary">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={clearCart}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vider
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                onClick={handleCheckout}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Commander
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
