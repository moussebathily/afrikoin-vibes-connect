import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Car,
  User,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  RefreshCw,
  Edit,
  UserPlus,
  DollarSign,
  MapPin,
} from 'lucide-react';
import type { Rental, Driver, Vehicle, RentalStatus } from '@/types/transport';

interface RentalWithDetails extends Rental {
  vehicle?: Vehicle & { driver?: Driver };
  assigned_driver?: Driver;
}

export function AdminRentalManagement() {
  const { toast } = useToast();
  const [rentals, setRentals] = useState<RentalWithDetails[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal states
  const [selectedRental, setSelectedRental] = useState<RentalWithDetails | null>(null);
  const [isAssignDriverOpen, setIsAssignDriverOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isUpdatePaymentOpen, setIsUpdatePaymentOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [newStatus, setNewStatus] = useState<RentalStatus>('pending');
  const [newPaymentStatus, setNewPaymentStatus] = useState<string>('pending');

  const fetchRentals = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch rentals with vehicle info
      const { data: rentalsData, error: rentalsError } = await supabase
        .from('rentals')
        .select(`
          *,
          vehicle:vehicles(*, driver:drivers(*))
        `)
        .order('created_at', { ascending: false });

      if (rentalsError) throw rentalsError;

      // Fetch available drivers
      const { data: driversData, error: driversError } = await supabase
        .from('drivers')
        .select('*')
        .eq('is_verified', true)
        .eq('is_active', true);

      if (driversError) throw driversError;

      setRentals((rentalsData as RentalWithDetails[]) || []);
      setDrivers((driversData as Driver[]) || []);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      toast({ title: 'Erreur', description: 'Impossible de charger les locations', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRentals();

    // Real-time subscription
    const channel = supabase
      .channel('admin-rentals-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rentals' }, () => {
        fetchRentals();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRentals]);

  const getStatusBadge = (status: RentalStatus) => {
    const config: Record<RentalStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
      pending: { label: 'En attente', variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
      confirmed: { label: 'Confirmée', variant: 'default', icon: <CheckCircle className="h-3 w-3" /> },
      active: { label: 'En cours', variant: 'default', icon: <Car className="h-3 w-3" /> },
      completed: { label: 'Terminée', variant: 'outline', icon: <CheckCircle className="h-3 w-3" /> },
      cancelled: { label: 'Annulée', variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
    };
    const { label, variant, icon } = config[status] || { label: status, variant: 'secondary', icon: null };
    return (
      <Badge variant={variant} className="gap-1">
        {icon}
        {label}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      pending: { label: 'En attente', className: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' },
      partial: { label: 'Partiel', className: 'bg-orange-500/20 text-orange-700 dark:text-orange-400' },
      paid: { label: 'Payé', className: 'bg-green-500/20 text-green-700 dark:text-green-400' },
      refunded: { label: 'Remboursé', className: 'bg-blue-500/20 text-blue-700 dark:text-blue-400' },
    };
    const { label, className } = config[status] || { label: status, className: '' };
    return <Badge className={className}>{label}</Badge>;
  };

  const sendRentalNotification = async (
    rentalId: string, 
    type: 'new_rental' | 'status_change' | 'driver_assigned' | 'payment_update',
    options?: { new_status?: string; driver_name?: string }
  ) => {
    try {
      const { error } = await supabase.functions.invoke('send-rental-notification', {
        body: { rental_id: rentalId, notification_type: type, ...options }
      });
      if (error) console.error('Notification error:', error);
    } catch (err) {
      console.error('Failed to send notification:', err);
    }
  };

  const handleAssignDriver = async () => {
    if (!selectedRental || !selectedDriverId) return;

    try {
      const { error } = await supabase
        .from('rentals')
        .update({ driver_id: selectedDriverId })
        .eq('id', selectedRental.id);

      if (error) throw error;

      const driver = drivers.find(d => d.id === selectedDriverId);
      await sendRentalNotification(selectedRental.id, 'driver_assigned', { 
        driver_name: driver?.full_name 
      });

      toast({ title: 'Succès', description: 'Chauffeur assigné à la location' });
      setIsAssignDriverOpen(false);
      setSelectedDriverId('');
      fetchRentals();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible d\'assigner le chauffeur', variant: 'destructive' });
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedRental) return;

    try {
      const updateData: Record<string, unknown> = { status: newStatus };
      
      if (newStatus === 'completed') {
        updateData.actual_return_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('rentals')
        .update(updateData)
        .eq('id', selectedRental.id);

      if (error) throw error;

      await sendRentalNotification(selectedRental.id, 'status_change', { 
        new_status: newStatus 
      });

      toast({ title: 'Succès', description: 'Statut de la location mis à jour' });
      setIsUpdateStatusOpen(false);
      fetchRentals();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le statut', variant: 'destructive' });
    }
  };

  const handleUpdatePayment = async () => {
    if (!selectedRental) return;

    try {
      const { error } = await supabase
        .from('rentals')
        .update({ payment_status: newPaymentStatus })
        .eq('id', selectedRental.id);

      if (error) throw error;

      await sendRentalNotification(selectedRental.id, 'payment_update');

      toast({ title: 'Succès', description: 'Statut de paiement mis à jour' });
      setIsUpdatePaymentOpen(false);
      fetchRentals();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le paiement', variant: 'destructive' });
    }
  };

  const filteredRentals = rentals.filter(rental => {
    const matchesSearch = 
      rental.rental_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.pickup_address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Stats
  const stats = {
    total: rentals.length,
    pending: rentals.filter(r => r.status === 'pending').length,
    active: rentals.filter(r => r.status === 'active').length,
    completed: rentals.filter(r => r.status === 'completed').length,
    totalRevenue: rentals
      .filter(r => r.payment_status === 'paid')
      .reduce((sum, r) => sum + (r.total_amount || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="py-3 text-center">
            <Calendar className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10">
          <CardContent className="py-3 text-center">
            <Clock className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-lg font-bold">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">En attente</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10">
          <CardContent className="py-3 text-center">
            <Car className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold">{stats.active}</p>
            <p className="text-xs text-muted-foreground">En cours</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10">
          <CardContent className="py-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold">{stats.completed}</p>
            <p className="text-xs text-muted-foreground">Terminées</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/10">
          <CardContent className="py-3 text-center">
            <DollarSign className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">FCFA</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro ou adresse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmée</SelectItem>
            <SelectItem value="active">En cours</SelectItem>
            <SelectItem value="completed">Terminée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={fetchRentals} variant="outline" size="icon" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Rentals List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg animate-pulse" />
          </div>
        ) : filteredRentals.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Aucune location trouvée</p>
            </CardContent>
          </Card>
        ) : (
          filteredRentals.map((rental) => (
            <Card key={rental.id}>
              <CardContent className="pt-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Rental Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold">{rental.rental_number}</span>
                      {getStatusBadge(rental.status)}
                      {getPaymentBadge(rental.payment_status)}
                    </div>
                    
                    {/* Vehicle */}
                    {rental.vehicle && (
                      <div className="flex items-center gap-2 text-sm">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span>{rental.vehicle.brand} {rental.vehicle.model}</span>
                        <Badge variant="outline" className="text-xs">
                          {rental.vehicle.plate_number}
                        </Badge>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(rental.start_date)} → {formatDate(rental.end_date)}</span>
                      <span className="text-primary font-medium">({rental.total_days} jours)</span>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{rental.pickup_address}</span>
                    </div>

                    {/* Driver */}
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {rental.with_driver ? (
                        rental.driver_id ? (
                          <span className="text-green-600">Chauffeur assigné</span>
                        ) : (
                          <span className="text-orange-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Chauffeur requis
                          </span>
                        )
                      ) : (
                        <span className="text-muted-foreground">Sans chauffeur</span>
                      )}
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-xl font-bold">{rental.total_amount.toLocaleString()} FCFA</p>
                      <p className="text-xs text-muted-foreground">
                        {rental.daily_rate.toLocaleString()}/jour
                        {rental.with_driver && ` + ${rental.driver_daily_rate.toLocaleString()} chauffeur`}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {/* Assign Driver Button */}
                      {rental.with_driver && !rental.driver_id && rental.status !== 'cancelled' && rental.status !== 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRental(rental);
                            setIsAssignDriverOpen(true);
                          }}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Assigner
                        </Button>
                      )}

                      {/* Update Status */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRental(rental);
                          setNewStatus(rental.status);
                          setIsUpdateStatusOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Statut
                      </Button>

                      {/* Update Payment */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRental(rental);
                          setNewPaymentStatus(rental.payment_status);
                          setIsUpdatePaymentOpen(true);
                        }}
                      >
                        <CreditCard className="h-4 w-4 mr-1" />
                        Paiement
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Assign Driver Dialog */}
      <Dialog open={isAssignDriverOpen} onOpenChange={setIsAssignDriverOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Assigner un chauffeur
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <p className="text-sm text-muted-foreground">
                {selectedRental?.rental_number} - {selectedRental?.vehicle?.brand} {selectedRental?.vehicle?.model}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Chauffeur disponible</Label>
              <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un chauffeur" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{driver.full_name}</span>
                        <span className="text-muted-foreground">- {driver.phone}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDriverOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAssignDriver} disabled={!selectedDriverId}>
              Assigner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Modifier le statut
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <p className="text-sm text-muted-foreground">{selectedRental?.rental_number}</p>
            </div>
            <div className="space-y-2">
              <Label>Nouveau statut</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as RentalStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmée</SelectItem>
                  <SelectItem value="active">En cours</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateStatus}>Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Payment Dialog */}
      <Dialog open={isUpdatePaymentOpen} onOpenChange={setIsUpdatePaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Modifier le paiement
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <p className="text-sm text-muted-foreground">
                {selectedRental?.rental_number} - {selectedRental?.total_amount.toLocaleString()} FCFA
              </p>
            </div>
            <div className="space-y-2">
              <Label>Statut de paiement</Label>
              <Select value={newPaymentStatus} onValueChange={setNewPaymentStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="partial">Partiel</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="refunded">Remboursé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdatePaymentOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdatePayment}>Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
