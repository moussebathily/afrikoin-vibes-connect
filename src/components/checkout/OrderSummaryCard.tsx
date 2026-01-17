import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Package } from 'lucide-react';
import type { CartItem } from '@/types/cart';

interface OrderSummaryCardProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  currency?: string;
}

const formatPrice = (price: number, currency: string = 'XOF') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  items,
  subtotal,
  shippingFee,
  currency = 'XOF'
}) => {
  const total = subtotal + shippingFee;

  return (
    <Card className="border-border/50 sticky top-4">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Récapitulatif ({items.length} article{items.length > 1 ? 's' : ''})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                {item.product?.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product?.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {item.product?.title || 'Produit'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Qté: {item.quantity}
                </p>
                <p className="text-sm font-semibold text-primary">
                  {formatPrice(item.price_snapshot * item.quantity, item.currency_snapshot)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sous-total</span>
            <span>{formatPrice(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Livraison</span>
            <span>{shippingFee > 0 ? formatPrice(shippingFee, currency) : 'Gratuit'}</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-xl text-primary">
            {formatPrice(total, currency)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
