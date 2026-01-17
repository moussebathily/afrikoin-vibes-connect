import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  Loader2,
  MapPin,
  Phone,
  CreditCard,
  Bell,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OrderItem {
  id: string;
  product_title: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  subtotal: number;
  shipping_fee: number;
  currency: string;
  payment_status: string;
  payment_method: string;
  mobile_money_provider: string | null;
  shipping_address: {
    full_name: string;
    phone: string;
    address_line1: string;
    city: string;
    country: string;
  };
  notes: string | null;
  created_at: string;
  buyer_id: string;
}

interface SellerOrdersManagerProps {
  sellerId: string;
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  pending: { label: 'En attente', icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  confirmed: { label: 'Confirmée', icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500/10' },
  processing: { label: 'En préparation', icon: Package, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  shipped: { label: 'Expédiée', icon: Truck, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  delivered: { label: 'Livrée', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-600/10' },
  cancelled: { label: 'Annulée', icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-500/10' }
};

const STATUS_FLOW = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const formatPrice = (price: number, currency: string = 'XOF') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const getPaymentMethodLabel = (method: string, provider?: string | null) => {
  if (method === 'mobile_money' && provider) {
    const providers: Record<string, string> = {
      orange_money: 'Orange Money',
      mtn_momo: 'MTN Mobile Money',
      wave: 'Wave'
    };
    return providers[provider] || 'Mobile Money';
  }
  const methods: Record<string, string> = {
    mobile_money: 'Mobile Money',
    cash_on_delivery: 'Paiement à la livraison',
    stripe: 'Carte bancaire'
  };
  return methods[method] || method;
};

export const SellerOrdersManager: React.FC<SellerOrdersManagerProps> = ({ sellerId }) => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Cast shipping_address from Json to expected type
      const typedOrders = (data || []).map(order => ({
        ...order,
        shipping_address: order.shipping_address as Order['shipping_address']
      }));
      setOrders(typedOrders as Order[]);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les commandes',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrderItems = async (orderId: string) => {
    if (orderItems[orderId]) return;

    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw error;
      setOrderItems(prev => ({ ...prev, [orderId]: data as OrderItem[] }));
    } catch (error) {
      console.error('Error loading order items:', error);
    }
  };

  useEffect(() => {
    if (sellerId) {
      loadOrders();
    }
  }, [sellerId]);

  useEffect(() => {
    if (selectedOrder) {
      loadOrderItems(selectedOrder.id);
      setNewStatus(selectedOrder.status);
    }
  }, [selectedOrder]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus || newStatus === selectedOrder.status) return;

    setIsUpdating(true);
    try {
      // Update order status
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          payment_status: newStatus === 'delivered' ? 'completed' : selectedOrder.payment_status
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      // Send notification
      supabase.functions.invoke('send-order-notification', {
        body: {
          order_id: selectedOrder.id,
          notification_type: 'status_changed',
          new_status: newStatus
        }
      }).catch(err => console.error('Notification error:', err));

      // Update local state
      setOrders(prev => prev.map(o => 
        o.id === selectedOrder.id 
          ? { ...o, status: newStatus, payment_status: newStatus === 'delivered' ? 'completed' : o.payment_status }
          : o
      ));
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);

      toast({
        title: 'Statut mis à jour',
        description: `Commande ${selectedOrder.order_number} → ${statusConfig[newStatus]?.label}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex >= STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[currentIndex + 1];
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Toutes ({orderCounts.all})
        </Button>
        {Object.entries(statusConfig).filter(([key]) => key !== 'cancelled').map(([key, config]) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(key)}
            className="gap-1"
          >
            <config.icon className="h-3 w-3" />
            {config.label} ({orderCounts[key as keyof typeof orderCounts] || 0})
          </Button>
        ))}
        <Button variant="ghost" size="sm" onClick={loadOrders} className="ml-auto">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Gestion des commandes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune commande</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                const nextStatus = getNextStatus(order.status);

                return (
                  <div 
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg ${status.bgColor}`}>
                        <StatusIcon className={`h-4 w-4 ${status.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{order.order_number}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(order.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {order.shipping_address?.full_name} • {order.shipping_address?.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="font-semibold text-primary">
                          {formatPrice(order.total_amount, order.currency)}
                        </p>
                        <Badge 
                          variant={order.payment_status === 'completed' ? 'default' : 'secondary'} 
                          className="text-xs"
                        >
                          {order.payment_status === 'completed' ? 'Payé' : 
                           order.payment_status === 'pending' ? 'En attente' : 'À confirmer'}
                        </Badge>
                      </div>

                      {nextStatus && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="hidden md:flex gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                            setNewStatus(nextStatus);
                          }}
                        >
                          <Bell className="h-3 w-3" />
                          {statusConfig[nextStatus]?.label}
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Commande {selectedOrder.order_number}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status & Actions */}
                <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Statut actuel</p>
                    <div className="flex items-center gap-2">
                      {React.createElement(statusConfig[selectedOrder.status]?.icon || Clock, {
                        className: `h-5 w-5 ${statusConfig[selectedOrder.status]?.color}`
                      })}
                      <span className="font-semibold">
                        {statusConfig[selectedOrder.status]?.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Nouveau statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <config.icon className={`h-4 w-4 ${config.color}`} />
                              {config.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={handleStatusUpdate}
                      disabled={isUpdating || newStatus === selectedOrder.status}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Bell className="h-4 w-4 mr-2" />
                          Mettre à jour
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Shipping Address */}
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      Adresse de livraison
                    </h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="font-medium text-foreground">
                        {selectedOrder.shipping_address?.full_name}
                      </p>
                      <p>{selectedOrder.shipping_address?.address_line1}</p>
                      <p>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.country}</p>
                      <p className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedOrder.shipping_address?.phone}
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <CreditCard className="h-4 w-4 text-primary" />
                      Paiement
                    </h3>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Méthode</span>
                        <span>{getPaymentMethodLabel(selectedOrder.payment_method, selectedOrder.mobile_money_provider)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Statut</span>
                        <Badge variant={selectedOrder.payment_status === 'completed' ? 'default' : 'secondary'}>
                          {selectedOrder.payment_status === 'completed' ? 'Payé' : 'En attente'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 border border-border/50 rounded-lg">
                  <h3 className="font-medium mb-3">Articles commandés</h3>
                  <div className="space-y-3">
                    {orderItems[selectedOrder.id]?.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product_title}</p>
                          <p className="text-xs text-muted-foreground">
                            Qté: {item.quantity} × {formatPrice(item.unit_price, selectedOrder.currency)}
                          </p>
                        </div>
                        <p className="font-semibold text-sm">
                          {formatPrice(item.total_price, selectedOrder.currency)}
                        </p>
                      </div>
                    )) || (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{formatPrice(selectedOrder.subtotal, selectedOrder.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Livraison</span>
                      <span>{formatPrice(selectedOrder.shipping_fee, selectedOrder.currency)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(selectedOrder.total_amount, selectedOrder.currency)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium mb-2">Notes du client</h3>
                    <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  Fermer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
