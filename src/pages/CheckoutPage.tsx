import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShippingAddressForm } from '@/components/checkout/ShippingAddressForm';
import { PaymentMethodSelector } from '@/components/checkout/PaymentMethodSelector';
import { OrderSummaryCard } from '@/components/checkout/OrderSummaryCard';
import { ArrowLeft, Loader2, CheckCircle, FileText } from 'lucide-react';
import type { PaymentMethod, MobileMoneyProvider, ShippingAddress } from '@/types/checkout';

const SHIPPING_FEE = 2000; // 2000 XOF flat rate

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, isLoading: cartLoading } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirm'>('shipping');
  const [shippingAddress, setShippingAddress] = useState<Partial<ShippingAddress> | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState<MobileMoneyProvider | null>(null);
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState<string | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && items.length === 0 && !orderCreated) {
      navigate('/marketplace');
    }
  }, [items, cartLoading, navigate, orderCreated]);

  // Load saved address
  useEffect(() => {
    const loadSavedAddress = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('shipping_addresses')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single();

      if (data) {
        setShippingAddress(data as ShippingAddress);
      }
    };

    loadSavedAddress();
  }, [user]);

  const handleAddressSubmit = async (addressData: Partial<ShippingAddress>) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour continuer",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    try {
      // Check if address exists
      const { data: existingAddress } = await supabase
        .from('shipping_addresses')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single();

      let data;
      let error;

      if (existingAddress) {
        // Update existing address
        const result = await supabase
          .from('shipping_addresses')
          .update({
            ...addressData,
            is_default: true,
          })
          .eq('id', existingAddress.id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else {
        // Insert new address
        const result = await supabase
          .from('shipping_addresses')
          .insert([{
            full_name: addressData.full_name || '',
            phone: addressData.phone || '',
            address_line1: addressData.address_line1 || '',
            address_line2: addressData.address_line2,
            city: addressData.city || '',
            state: addressData.state,
            postal_code: addressData.postal_code,
            country: addressData.country || 'CI',
            user_id: user.id,
            is_default: true,
          }])
          .select()
          .single();
        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      setShippingAddress(data as ShippingAddress);
      setStep('payment');
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'adresse",
        variant: "destructive"
      });
    }
  };

  const handlePaymentContinue = () => {
    if (!paymentMethod) {
      toast({
        title: "Mode de paiement requis",
        description: "Veuillez sélectionner un mode de paiement",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === 'mobile_money' && !mobileMoneyProvider) {
      toast({
        title: "Opérateur requis",
        description: "Veuillez sélectionner un opérateur Mobile Money",
        variant: "destructive"
      });
      return;
    }

    setStep('confirm');
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `AFK-${timestamp}-${random}`;
  };

  const handleConfirmOrder = async () => {
    if (!user || !shippingAddress) return;

    setIsProcessing(true);

    try {
      // Group items by seller
      const itemsBySeller = items.reduce((acc, item) => {
        const sellerId = item.product?.seller_id || 'unknown';
        if (!acc[sellerId]) {
          acc[sellerId] = [];
        }
        acc[sellerId].push(item);
        return acc;
      }, {} as Record<string, typeof items>);

      const orderNumbers: string[] = [];

      // Create orders for each seller
      for (const [sellerId, sellerItems] of Object.entries(itemsBySeller)) {
        const orderNumber = generateOrderNumber();
        const orderSubtotal = sellerItems.reduce(
          (sum, item) => sum + item.price_snapshot * item.quantity,
          0
        );

        // Create order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert([{
            order_number: orderNumber,
            buyer_id: user.id,
            seller_id: sellerId,
            subtotal: orderSubtotal,
            shipping_fee: SHIPPING_FEE,
            total_amount: orderSubtotal + SHIPPING_FEE,
            currency: sellerItems[0]?.currency_snapshot || 'XOF',
            status: 'pending',
            payment_status: paymentMethod === 'cash_on_delivery' ? 'pending' : 'awaiting_payment',
            payment_method: paymentMethod,
            mobile_money_provider: mobileMoneyProvider,
            shipping_address: JSON.parse(JSON.stringify(shippingAddress)),
            notes: notes || null,
          }])
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = sellerItems.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          product_title: item.product?.title || 'Produit',
          product_image: item.product?.images?.[0] || null,
          quantity: item.quantity,
          unit_price: item.price_snapshot,
          total_price: item.price_snapshot * item.quantity,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        orderNumbers.push(orderNumber);
      }

      // Clear the cart
      await clearCart();

      setOrderCreated(orderNumbers.join(', '));

      toast({
        title: "Commande créée !",
        description: `Commande${orderNumbers.length > 1 ? 's' : ''} ${orderNumbers.join(', ')} enregistrée`,
      });

    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Success screen
  if (orderCreated) {
    return (
      <div className="container max-w-lg mx-auto px-4 py-12">
        <Card className="text-center">
          <CardContent className="py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Commande confirmée !</h1>
            <p className="text-muted-foreground mb-6">
              Votre commande <span className="font-semibold text-foreground">{orderCreated}</span> a été enregistrée avec succès.
            </p>
            
            {paymentMethod === 'mobile_money' && (
              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <p className="font-medium mb-2">Instructions de paiement :</p>
                <p className="text-sm text-muted-foreground">
                  Vous recevrez une notification pour finaliser le paiement via {mobileMoneyProvider?.replace('_', ' ').toUpperCase()}.
                </p>
              </div>
            )}

            {paymentMethod === 'cash_on_delivery' && (
              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <p className="font-medium mb-2">Paiement à la livraison</p>
                <p className="text-sm text-muted-foreground">
                  Préparez le montant exact. Notre livreur vous contactera bientôt.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate('/tracking')} variant="outline">
                Suivre ma commande
              </Button>
              <Button onClick={() => navigate('/marketplace')}>
                Continuer mes achats
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (step === 'payment') setStep('shipping');
            else if (step === 'confirm') setStep('payment');
            else navigate(-1);
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Finaliser la commande</h1>
          <p className="text-muted-foreground">
            Étape {step === 'shipping' ? '1/3' : step === 'payment' ? '2/3' : '3/3'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {step === 'shipping' && (
            <ShippingAddressForm
              onSubmit={handleAddressSubmit}
              defaultValues={shippingAddress || undefined}
            />
          )}

          {step === 'payment' && (
            <>
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                selectedProvider={mobileMoneyProvider}
                onMethodChange={setPaymentMethod}
                onProviderChange={setMobileMoneyProvider}
                showStripe={false}
              />
              <Button
                onClick={handlePaymentContinue}
                className="w-full"
                disabled={!paymentMethod}
              >
                Continuer
              </Button>
            </>
          )}

          {step === 'confirm' && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Confirmer la commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Address Summary */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-1">Livraison à :</p>
                  <p className="text-sm text-muted-foreground">
                    {shippingAddress?.full_name}<br />
                    {shippingAddress?.address_line1}<br />
                    {shippingAddress?.city}, {shippingAddress?.country}<br />
                    Tél: {shippingAddress?.phone}
                  </p>
                </div>

                {/* Payment Summary */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-1">Mode de paiement :</p>
                  <p className="text-sm text-muted-foreground">
                    {paymentMethod === 'mobile_money' && `Mobile Money - ${mobileMoneyProvider?.replace('_', ' ')}`}
                    {paymentMethod === 'cash_on_delivery' && 'Paiement à la livraison'}
                    {paymentMethod === 'stripe' && 'Carte bancaire'}
                  </p>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Instructions spéciales (optionnel)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Instructions pour la livraison..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleConfirmOrder}
                  className="w-full"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    'Confirmer la commande'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <OrderSummaryCard
            items={items}
            subtotal={totalPrice}
            shippingFee={SHIPPING_FEE}
            currency="XOF"
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
