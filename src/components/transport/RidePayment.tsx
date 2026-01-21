import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  prefix: string;
  placeholder: string;
}

const paymentProviders: PaymentProvider[] = [
  {
    id: 'orange_money',
    name: 'Orange Money',
    icon: '🟠',
    color: 'bg-orange-500',
    prefix: '+225',
    placeholder: '07 XX XX XX XX'
  },
  {
    id: 'wave',
    name: 'Wave',
    icon: '🌊',
    color: 'bg-blue-500',
    prefix: '+225',
    placeholder: '01 XX XX XX XX'
  },
  {
    id: 'mtn',
    name: 'MTN Mobile Money',
    icon: '🟡',
    color: 'bg-yellow-500',
    prefix: '+225',
    placeholder: '05 XX XX XX XX'
  }
];

interface RidePaymentProps {
  isOpen: boolean;
  onClose: () => void;
  rideId: string;
  rideNumber: string;
  amount: number;
  currency?: string;
  onPaymentSuccess?: () => void;
}

type PaymentStatus = 'idle' | 'processing' | 'pending_confirmation' | 'success' | 'failed';

const RidePayment = ({ 
  isOpen, 
  onClose, 
  rideId, 
  rideNumber, 
  amount, 
  currency = 'XOF',
  onPaymentSuccess 
}: RidePaymentProps) => {
  const { toast } = useToast();
  
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [transactionRef, setTransactionRef] = useState<string | null>(null);

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    setPaymentStatus('idle');
  };

  const formatPhoneNumber = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Format as XX XX XX XX XX
    const formatted = digits.match(/.{1,2}/g)?.join(' ') || digits;
    return formatted.substring(0, 14); // Max 10 digits with spaces
  };

  const initiatePayment = async () => {
    if (!selectedProvider || !phoneNumber) return;

    const provider = paymentProviders.find(p => p.id === selectedProvider);
    if (!provider) return;

    setPaymentStatus('processing');

    try {
      // Generate transaction reference
      const txRef = `TX-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
      setTransactionRef(txRef);

      // Simulate API call to mobile money provider
      // In production, this would call the actual Orange/Wave/MTN API
      await new Promise(resolve => setTimeout(resolve, 2000));

      setPaymentStatus('pending_confirmation');

      // Show USSD simulation
      toast({
        title: `📱 ${provider.name}`,
        description: `Confirmez le paiement de ${amount.toLocaleString()} ${currency} sur votre téléphone`,
      });

      // Simulate waiting for user confirmation on their phone
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update ride payment status in database
      const { error } = await supabase
        .from('rides')
        .update({
          payment_status: 'paid',
          payment_method: selectedProvider,
          updated_at: new Date().toISOString()
        })
        .eq('id', rideId);

      if (error) throw error;

      setPaymentStatus('success');
      
      toast({
        title: "✅ Paiement réussi !",
        description: `Transaction ${txRef} confirmée`,
      });

      setTimeout(() => {
        onPaymentSuccess?.();
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      toast({
        title: "Échec du paiement",
        description: "Veuillez réessayer ou utiliser un autre mode de paiement",
        variant: "destructive"
      });
    }
  };

  const handleCashPayment = async () => {
    try {
      setPaymentStatus('processing');

      const { error } = await supabase
        .from('rides')
        .update({
          payment_status: 'paid',
          payment_method: 'cash',
          updated_at: new Date().toISOString()
        })
        .eq('id', rideId);

      if (error) throw error;

      setPaymentStatus('success');
      toast({
        title: "💵 Paiement en espèces",
        description: "Le paiement sera effectué au chauffeur",
      });

      setTimeout(() => {
        onPaymentSuccess?.();
        onClose();
      }, 1500);

    } catch (error: any) {
      console.error('Cash payment error:', error);
      setPaymentStatus('failed');
    }
  };

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-center font-medium">Traitement en cours...</p>
          </div>
        );
      case 'pending_confirmation':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative">
              <Smartphone className="h-16 w-16 text-primary" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
            </div>
            <div className="text-center">
              <p className="font-medium">Confirmez sur votre téléphone</p>
              <p className="text-sm text-muted-foreground mt-1">
                Entrez votre code PIN sur l'écran de votre téléphone
              </p>
            </div>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <div className="text-center">
              <p className="font-medium text-green-600">Paiement confirmé !</p>
              {transactionRef && (
                <p className="text-sm text-muted-foreground mt-1">
                  Réf: {transactionRef}
                </p>
              )}
            </div>
          </div>
        );
      case 'failed':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <AlertCircle className="h-16 w-16 text-destructive" />
            <div className="text-center">
              <p className="font-medium text-destructive">Échec du paiement</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setPaymentStatus('idle')}
              >
                Réessayer
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (paymentStatus !== 'idle') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Paiement</DialogTitle>
          </DialogHeader>
          {renderPaymentStatus()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Payer votre course</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount display */}
          <div className="text-center p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Montant à payer</p>
            <p className="text-3xl font-bold">{amount.toLocaleString()} {currency}</p>
            <Badge variant="outline" className="mt-2">{rideNumber}</Badge>
          </div>

          {/* Payment providers */}
          <div className="space-y-3">
            <Label>Choisir un mode de paiement</Label>
            <div className="grid gap-2">
              {paymentProviders.map((provider) => (
                <Card 
                  key={provider.id}
                  className={`cursor-pointer transition-all ${
                    selectedProvider === provider.id 
                      ? 'ring-2 ring-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleProviderSelect(provider.id)}
                >
                  <CardContent className="flex items-center gap-3 p-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <span className="font-medium flex-1">{provider.name}</span>
                    {selectedProvider === provider.id && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Cash option */}
              <Card 
                className={`cursor-pointer transition-all ${
                  selectedProvider === 'cash' 
                    ? 'ring-2 ring-primary' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleProviderSelect('cash')}
              >
                <CardContent className="flex items-center gap-3 p-3">
                  <span className="text-2xl">💵</span>
                  <span className="font-medium flex-1">Espèces</span>
                  {selectedProvider === 'cash' && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Phone number input for mobile money */}
          {selectedProvider && selectedProvider !== 'cash' && (
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 bg-muted rounded-l-md border border-r-0">
                  <Phone className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm">+225</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={paymentProviders.find(p => p.id === selectedProvider)?.placeholder}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                  className="rounded-l-none"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Vous recevrez une notification pour confirmer le paiement
              </p>
            </div>
          )}

          {/* Submit button */}
          <Button 
            className="w-full"
            disabled={!selectedProvider || (selectedProvider !== 'cash' && phoneNumber.replace(/\s/g, '').length < 10)}
            onClick={selectedProvider === 'cash' ? handleCashPayment : initiatePayment}
          >
            {selectedProvider === 'cash' ? (
              <>💵 Payer en espèces</>
            ) : (
              <>📱 Payer {amount.toLocaleString()} {currency}</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RidePayment;
