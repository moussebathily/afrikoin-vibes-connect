import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Truck } from 'lucide-react';
import type { PaymentMethod, MobileMoneyProvider } from '@/types/checkout';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  selectedProvider: MobileMoneyProvider | null;
  onMethodChange: (method: PaymentMethod) => void;
  onProviderChange: (provider: MobileMoneyProvider) => void;
  showStripe?: boolean;
}

const MOBILE_MONEY_PROVIDERS = [
  { 
    id: 'orange_money' as MobileMoneyProvider, 
    name: 'Orange Money', 
    color: 'bg-orange-500',
    countries: ['CI', 'SN', 'ML', 'BF', 'CM']
  },
  { 
    id: 'mtn_momo' as MobileMoneyProvider, 
    name: 'MTN Mobile Money', 
    color: 'bg-yellow-500',
    countries: ['CI', 'GH', 'NG', 'CM', 'UG']
  },
  { 
    id: 'wave' as MobileMoneyProvider, 
    name: 'Wave', 
    color: 'bg-blue-500',
    countries: ['CI', 'SN', 'ML', 'BF']
  },
];

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  selectedProvider,
  onMethodChange,
  onProviderChange,
  showStripe = false
}) => {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="h-5 w-5 text-primary" />
          Mode de paiement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedMethod || ''}
          onValueChange={(value) => onMethodChange(value as PaymentMethod)}
          className="space-y-3"
        >
          {/* Mobile Money */}
          <div className="flex items-start space-x-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
            <RadioGroupItem value="mobile_money" id="mobile_money" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="mobile_money" className="flex items-center gap-2 cursor-pointer font-medium">
                <Smartphone className="h-4 w-4 text-primary" />
                Mobile Money
                <Badge variant="secondary" className="text-xs">Populaire</Badge>
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Paiement rapide via votre téléphone mobile
              </p>
              
              {selectedMethod === 'mobile_money' && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {MOBILE_MONEY_PROVIDERS.map((provider) => (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => onProviderChange(provider.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedProvider === provider.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${provider.color}`} />
                        <span className="text-sm font-medium">{provider.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cash on Delivery */}
          <div className="flex items-start space-x-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
            <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="cash_on_delivery" className="flex items-center gap-2 cursor-pointer font-medium">
                <Truck className="h-4 w-4 text-primary" />
                Paiement à la livraison
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Payez en espèces ou par mobile à la réception de votre commande
              </p>
            </div>
          </div>

          {/* Stripe (if available) */}
          {showStripe && (
            <div className="flex items-start space-x-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
              <RadioGroupItem value="stripe" id="stripe" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer font-medium">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Carte bancaire
                  <Badge variant="outline" className="text-xs">Visa, Mastercard</Badge>
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Paiement sécurisé par carte de crédit ou débit
                </p>
              </div>
            </div>
          )}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
