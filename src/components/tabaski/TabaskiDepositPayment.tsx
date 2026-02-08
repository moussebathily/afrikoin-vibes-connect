import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Loader2, CheckCircle, AlertCircle, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentProvider {
  id: string;
  name: string;
  icon: string;
  prefix: string;
  placeholder: string;
}

const paymentProviders: PaymentProvider[] = [
  { id: 'orange_money', name: 'Orange Money', icon: '🟠', prefix: '+225', placeholder: '07 XX XX XX XX' },
  { id: 'wave', name: 'Wave', icon: '🌊', prefix: '+221', placeholder: '77 XXX XX XX' },
  { id: 'mtn', name: 'MTN Mobile Money', icon: '🟡', prefix: '+225', placeholder: '05 XX XX XX XX' },
];

interface TabaskiDepositPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: string;
  reservationNumber: string;
  depositAmount: number;
  totalAmount: number;
  currency?: string;
  onPaymentSuccess: () => void;
}

type PaymentStatus = 'idle' | 'processing' | 'pending_confirmation' | 'success' | 'failed';

export default function TabaskiDepositPayment({
  isOpen,
  onClose,
  reservationId,
  reservationNumber,
  depositAmount,
  totalAmount,
  currency = 'XOF',
  onPaymentSuccess,
}: TabaskiDepositPaymentProps) {
  const { toast } = useToast();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [transactionRef, setTransactionRef] = useState<string | null>(null);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const formatted = digits.match(/.{1,2}/g)?.join(' ') || digits;
    return formatted.substring(0, 14);
  };

  const resetState = () => {
    setSelectedProvider(null);
    setPhoneNumber('');
    setPaymentStatus('idle');
    setTransactionRef(null);
  };

  const handleClose = () => {
    if (paymentStatus !== 'processing' && paymentStatus !== 'pending_confirmation') {
      resetState();
      onClose();
    }
  };

  const initiatePayment = async () => {
    if (!selectedProvider || !phoneNumber) return;

    const provider = paymentProviders.find(p => p.id === selectedProvider);
    if (!provider) return;

    setPaymentStatus('processing');

    try {
      const txRef = `TAB-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setTransactionRef(txRef);

      // Simulate mobile money API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setPaymentStatus('pending_confirmation');

      toast({
        title: `📱 ${provider.name}`,
        description: `Confirmez le paiement de ${depositAmount.toLocaleString()} ${currency} sur votre téléphone`,
      });

      // Simulate user confirmation on phone
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update reservation payment status
      const { error } = await supabase
        .from('tabaski_reservations')
        .update({
          payment_status: 'deposit_paid',
          status: 'confirmed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', reservationId);

      if (error) throw error;

      setPaymentStatus('success');

      toast({
        title: "✅ Acompte payé !",
        description: `Transaction ${txRef} confirmée — ${depositAmount.toLocaleString()} ${currency}`,
      });

      setTimeout(() => {
        onPaymentSuccess();
        resetState();
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      toast({
        title: "Échec du paiement",
        description: "Veuillez réessayer ou utiliser un autre mode de paiement",
        variant: "destructive",
      });
    }
  };

  const renderStatus = () => {
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
              <p className="text-sm text-muted-foreground mt-1">Entrez votre code PIN sur l'écran de votre téléphone</p>
            </div>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <div className="text-center">
              <p className="font-medium text-green-600">Acompte payé avec succès !</p>
              {transactionRef && <p className="text-sm text-muted-foreground mt-1">Réf: {transactionRef}</p>}
              <p className="text-sm text-muted-foreground mt-1">Votre réservation est maintenant confirmée 🎉</p>
            </div>
          </div>
        );
      case 'failed':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <AlertCircle className="h-16 w-16 text-destructive" />
            <div className="text-center">
              <p className="font-medium text-destructive">Échec du paiement</p>
              <Button variant="outline" className="mt-4" onClick={() => setPaymentStatus('idle')}>Réessayer</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (paymentStatus !== 'idle') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Paiement de l'acompte</DialogTitle>
          </DialogHeader>
          {renderStatus()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">🐑 Payer l'acompte Tabaski</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Amount summary */}
          <div className="text-center p-4 bg-muted rounded-lg space-y-1">
            <p className="text-sm text-muted-foreground">Acompte (30%)</p>
            <p className="text-3xl font-bold">{depositAmount.toLocaleString()} {currency}</p>
            <Badge variant="outline" className="mt-2">{reservationNumber}</Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Total de la commande : {totalAmount.toLocaleString()} {currency}
            </p>
          </div>

          {/* Provider selection */}
          <div className="space-y-3">
            <Label>Mode de paiement</Label>
            <div className="grid gap-2">
              {paymentProviders.map((provider) => (
                <Card
                  key={provider.id}
                  className={`cursor-pointer transition-all ${
                    selectedProvider === provider.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => { setSelectedProvider(provider.id); setPaymentStatus('idle'); }}
                >
                  <CardContent className="flex items-center gap-3 p-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <span className="font-medium flex-1">{provider.name}</span>
                    {selectedProvider === provider.id && <CheckCircle className="h-5 w-5 text-primary" />}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Phone number */}
          {selectedProvider && (
            <div className="space-y-2">
              <Label htmlFor="deposit-phone">Numéro de téléphone</Label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 bg-muted rounded-l-md border border-r-0">
                  <Phone className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm">{paymentProviders.find(p => p.id === selectedProvider)?.prefix}</span>
                </div>
                <Input
                  id="deposit-phone"
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

          {/* Submit */}
          <Button
            className="w-full"
            disabled={!selectedProvider || phoneNumber.replace(/\s/g, '').length < 8}
            onClick={initiatePayment}
          >
            📱 Payer {depositAmount.toLocaleString()} {currency}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
