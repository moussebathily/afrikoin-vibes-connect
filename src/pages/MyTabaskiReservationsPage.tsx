import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Truck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Package,
  ArrowLeft,
  RefreshCw,
  Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface TabaskiReservation {
  id: string;
  reservation_number: string;
  livestock_name: string;
  livestock_type: string;
  livestock_breed: string;
  livestock_weight: string | null;
  livestock_price: number;
  seller_name: string;
  seller_location: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  delivery_date: string;
  notes: string | null;
  status: string;
  payment_status: string;
  currency: string;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  pending: { label: 'En attente', icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  confirmed: { label: 'Confirmé', icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
  preparing: { label: 'En préparation', icon: Package, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  in_transit: { label: 'En livraison', icon: Truck, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  delivered: { label: 'Livré', icon: CheckCircle2, color: 'text-green-700', bgColor: 'bg-green-200' },
  cancelled: { label: 'Annulé', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
};

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'text-amber-600' },
  deposit_paid: { label: 'Acompte payé', color: 'text-blue-600' },
  paid: { label: 'Payé', color: 'text-green-600' },
  failed: { label: 'Échoué', color: 'text-red-600' },
  refunded: { label: 'Remboursé', color: 'text-purple-600' },
};

const LIVESTOCK_ICONS: Record<string, string> = {
  mouton: '🐑',
  chevre: '🐐',
  vache: '🐄',
};

const CANCELLABLE_STATUSES = ['pending', 'confirmed'];

export default function MyTabaskiReservationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellingReservation, setCancellingReservation] = useState<TabaskiReservation | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const { data: reservations, isLoading, error, refetch } = useQuery({
    queryKey: ['tabaski-reservations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tabaski_reservations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as TabaskiReservation[];
    },
    enabled: !!user,
  });

  const cancelMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { error } = await supabase
        .from('tabaski_reservations')
        .update({ 
          status: 'cancelled', 
          notes: reason ? `Annulé: ${reason}` : 'Annulé par le client'
        })
        .eq('id', id)
        .eq('user_id', user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tabaski-reservations'] });
      toast({ title: 'Réservation annulée', description: 'Votre réservation a été annulée avec succès.' });
      setCancelDialogOpen(false);
      setCancellingReservation(null);
      setCancelReason('');
    },
    onError: (err: any) => {
      toast({ title: 'Erreur', description: err.message || "Impossible d'annuler la réservation", variant: 'destructive' });
    },
  });

  const handleCancelClick = (reservation: TabaskiReservation) => {
    setCancellingReservation(reservation);
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    if (!cancellingReservation) return;
    cancelMutation.mutate({ id: cancellingReservation.id, reason: cancelReason });
  };

  if (!user) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-semibold">Connexion requise</h2>
            <p className="text-muted-foreground">Veuillez vous connecter pour voir vos réservations Tabaski.</p>
            <Button onClick={() => navigate('/auth')} className="w-full">Se connecter</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 mb-4 -ml-2" onClick={() => navigate('/tabaski')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au catalogue
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">🐑 Mes Réservations Tabaski</h1>
              <p className="text-white/80 mt-1">Suivez l'état de vos commandes</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Erreur de chargement</h3>
              <p className="text-muted-foreground mb-4">Impossible de charger vos réservations.</p>
              <Button onClick={() => refetch()}>Réessayer</Button>
            </CardContent>
          </Card>
        ) : !reservations?.length ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🐑</div>
              <h3 className="font-semibold text-xl mb-2">Aucune réservation</h3>
              <p className="text-muted-foreground mb-6">Vous n'avez pas encore réservé de bétail pour la Tabaski.</p>
              <Button onClick={() => navigate('/tabaski')} className="gap-2">
                <Calendar className="h-4 w-4" />
                Voir le catalogue
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => {
              const statusConfig = STATUS_CONFIG[reservation.status] || STATUS_CONFIG.pending;
              const paymentConfig = PAYMENT_STATUS_CONFIG[reservation.payment_status] || PAYMENT_STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;
              const livestockIcon = LIVESTOCK_ICONS[reservation.livestock_type] || '🐑';
              const canCancel = CANCELLABLE_STATUSES.includes(reservation.status);
              const depositAmount = Math.round(reservation.livestock_price * 0.3);
              const isDepositPaid = reservation.payment_status === 'deposit_paid' || reservation.payment_status === 'paid';

              return (
                <Card key={reservation.id} className="overflow-hidden">
                  {/* Status Banner */}
                  <div className={cn("px-4 py-2 flex items-center justify-between", statusConfig.bgColor)}>
                    <div className="flex items-center gap-2">
                      <StatusIcon className={cn("h-4 w-4", statusConfig.color)} />
                      <span className={cn("font-medium text-sm", statusConfig.color)}>{statusConfig.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{reservation.reservation_number}</span>
                  </div>

                  <CardContent className="p-4 space-y-4">
                    {/* Livestock Info */}
                    <div className="flex gap-4">
                      <div className="text-4xl">{livestockIcon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{reservation.livestock_name}</h3>
                        <p className="text-sm text-muted-foreground">{reservation.livestock_breed} • {reservation.livestock_weight || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Vendeur: {reservation.seller_name}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-primary">{reservation.livestock_price.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground ml-1">{reservation.currency}</span>
                        <div className={cn("text-xs mt-1", paymentConfig.color)}>
                          Paiement: {paymentConfig.label}
                        </div>
                      </div>
                    </div>

                    {/* Deposit Info */}
                    {reservation.status !== 'cancelled' && (
                      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Acompte (30%)</p>
                            <p className="text-xs text-muted-foreground">
                              {isDepositPaid ? 'Acompte versé ✅' : 'À verser pour sécuriser votre réservation'}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-primary">{depositAmount.toLocaleString()} {reservation.currency}</span>
                            {!isDepositPaid && reservation.status !== 'delivered' && (
                              <Badge variant="outline" className="ml-2 text-amber-600 border-amber-300">
                                À payer
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Delivery Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Date de livraison:</span>
                        </div>
                        <p className="text-sm pl-6">{format(new Date(reservation.delivery_date), 'EEEE d MMMM yyyy', { locale: fr })}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Adresse:</span>
                        </div>
                        <p className="text-sm pl-6 text-muted-foreground">{reservation.delivery_address}</p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.customer_name}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{reservation.customer_phone}</span>
                      </div>
                      {reservation.notes && (
                        <p className="text-sm text-muted-foreground pl-6">Note: {reservation.notes}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Commandé le {format(new Date(reservation.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </div>
                      {canCancel && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-1"
                          onClick={() => handleCancelClick(reservation)}
                        >
                          <Ban className="h-3.5 w-3.5" />
                          Annuler
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={(open) => { setCancelDialogOpen(open); if (!open) { setCancellingReservation(null); setCancelReason(''); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Ban className="h-5 w-5" />
              Annuler la réservation
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler la réservation <strong>{cancellingReservation?.reservation_number}</strong> pour <strong>{cancellingReservation?.livestock_name}</strong> ?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cancelReason">Raison de l'annulation (optionnel)</Label>
              <Textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Indiquez la raison de votre annulation..."
                className="min-h-[80px]"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setCancelDialogOpen(false)}>
                Non, garder
              </Button>
              <Button
                variant="destructive"
                className="flex-1 gap-1"
                onClick={confirmCancel}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? 'Annulation...' : 'Oui, annuler'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
