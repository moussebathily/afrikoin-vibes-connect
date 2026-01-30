import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Car, 
  Calendar, 
  MapPin, 
  Clock, 
  CreditCard,
  User,
  Phone,
  ChevronRight,
  Loader2,
  CarFront,
  History
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { RentalStatus } from '@/types/transport';

interface RentalWithDetails {
  id: string;
  rental_number: string;
  start_date: string;
  end_date: string;
  actual_return_date?: string;
  pickup_address: string;
  return_address?: string;
  daily_rate: number;
  driver_daily_rate: number;
  total_days: number;
  subtotal: number;
  deposit: number;
  total_amount: number;
  currency: string;
  status: RentalStatus;
  payment_method: string;
  payment_status: string;
  with_driver: boolean;
  notes?: string;
  created_at: string;
  vehicle?: {
    id: string;
    brand: string;
    model: string;
    color?: string;
    plate_number: string;
    photo_url?: string;
    vehicle_type: string;
  };
  driver?: {
    id: string;
    full_name: string;
    phone: string;
    photo_url?: string;
    average_rating: number;
  };
}

const statusConfig: Record<RentalStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'En attente', variant: 'secondary' },
  confirmed: { label: 'Confirmée', variant: 'default' },
  active: { label: 'En cours', variant: 'default' },
  completed: { label: 'Terminée', variant: 'outline' },
  cancelled: { label: 'Annulée', variant: 'destructive' },
};

export function MyRentalsPage() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState<RentalWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    if (user) {
      fetchRentals();
    }
  }, [user]);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rentals')
        .select(`
          *,
          vehicle:vehicles(id, brand, model, color, plate_number, photo_url, vehicle_type),
          driver:drivers(id, full_name, phone, photo_url, average_rating)
        `)
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRentals((data as RentalWithDetails[]) || []);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeRentals = rentals.filter(r => ['pending', 'confirmed', 'active'].includes(r.status));
  const historyRentals = rentals.filter(r => ['completed', 'cancelled'].includes(r.status));

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-xl">
          <CarFront className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Mes Locations</h1>
          <p className="text-sm text-muted-foreground">
            {rentals.length} location{rentals.length > 1 ? 's' : ''} au total
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'history')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="gap-2">
            <Car className="h-4 w-4" />
            En cours ({activeRentals.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Historique ({historyRentals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3 mt-4">
          {activeRentals.length === 0 ? (
            <EmptyState 
              title="Aucune location en cours"
              description="Vous n'avez pas de location active pour le moment."
              actionLabel="Louer un véhicule"
              actionHref="/transport"
            />
          ) : (
            activeRentals.map((rental) => (
              <RentalCard key={rental.id} rental={rental} />
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-3 mt-4">
          {historyRentals.length === 0 ? (
            <EmptyState 
              title="Aucun historique"
              description="Vos locations terminées apparaîtront ici."
            />
          ) : (
            historyRentals.map((rental) => (
              <RentalCard key={rental.id} rental={rental} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RentalCard({ rental }: { rental: RentalWithDetails }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[rental.status];

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">
              #{rental.rental_number}
            </span>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(rental.created_at)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Vehicle Info */}
        {rental.vehicle && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            {rental.vehicle.photo_url ? (
              <img 
                src={rental.vehicle.photo_url} 
                alt={`${rental.vehicle.brand} ${rental.vehicle.model}`}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-muted flex items-center justify-center rounded-lg">
                <Car className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold">
                {rental.vehicle.brand} {rental.vehicle.model}
              </p>
              <p className="text-sm text-muted-foreground">
                {rental.vehicle.color} • {rental.vehicle.plate_number}
              </p>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Début</p>
              <p className="text-sm font-medium">{formatDate(rental.start_date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Fin</p>
              <p className="text-sm font-medium">{formatDate(rental.end_date)}</p>
            </div>
          </div>
        </div>

        {/* Pickup Address */}
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground">Adresse de prise en charge</p>
            <p className="text-sm">{rental.pickup_address}</p>
          </div>
        </div>

        {/* Price Summary */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{rental.total_days} jour{rental.total_days > 1 ? 's' : ''}</span>
            {rental.with_driver && (
              <Badge variant="outline" className="text-xs">
                <User className="h-3 w-3 mr-1" />
                Avec chauffeur
              </Badge>
            )}
          </div>
          <p className="font-bold text-lg">
            {formatCurrency(rental.total_amount, rental.currency)}
          </p>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="pt-3 border-t space-y-3 animate-in slide-in-from-top-2">
            {/* Driver Info */}
            {rental.with_driver && rental.driver && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                {rental.driver.photo_url ? (
                  <img 
                    src={rental.driver.photo_url} 
                    alt={rental.driver.full_name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-muted flex items-center justify-center rounded-full">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">{rental.driver.full_name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {rental.driver.phone}
                  </div>
                </div>
                {rental.driver.average_rating > 0 && (
                  <Badge variant="secondary">
                    ⭐ {rental.driver.average_rating.toFixed(1)}
                  </Badge>
                )}
              </div>
            )}

            {/* Payment Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tarif journalier</span>
                <span>{formatCurrency(rental.daily_rate, rental.currency)}/jour</span>
              </div>
              {rental.with_driver && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tarif chauffeur</span>
                  <span>{formatCurrency(rental.driver_daily_rate, rental.currency)}/jour</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{formatCurrency(rental.subtotal, rental.currency)}</span>
              </div>
              {rental.deposit > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Caution</span>
                  <span>{formatCurrency(rental.deposit, rental.currency)}</span>
                </div>
              )}
              <div className="flex items-center justify-between font-medium pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(rental.total_amount, rental.currency)}</span>
              </div>
            </div>

            {/* Payment Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm capitalize">{rental.payment_method}</span>
              </div>
              <Badge variant={rental.payment_status === 'paid' ? 'default' : 'secondary'}>
                {rental.payment_status === 'paid' ? 'Payé' : 
                 rental.payment_status === 'pending' ? 'En attente' : rental.payment_status}
              </Badge>
            </div>

            {/* Notes */}
            {rental.notes && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{rental.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Toggle Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Voir moins' : 'Voir plus'}
          <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  actionHref 
}: { 
  title: string; 
  description: string; 
  actionLabel?: string; 
  actionHref?: string;
}) {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="p-4 bg-muted rounded-full">
          <CarFront className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        {actionLabel && actionHref && (
          <Button asChild className="mt-2">
            <a href={actionHref}>{actionLabel}</a>
          </Button>
        )}
      </div>
    </Card>
  );
}

export default MyRentalsPage;
