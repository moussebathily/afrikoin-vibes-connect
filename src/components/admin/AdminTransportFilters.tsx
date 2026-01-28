import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Car, Filter, X, Truck, Bike } from 'lucide-react';
import type { VehicleType, RideStatus, RentalStatus } from '@/types/transport';

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  vehicleType: VehicleType | 'all';
  rideStatus: RideStatus | 'all';
  rentalStatus: RentalStatus | 'all';
  paymentStatus: 'all' | 'pending' | 'paid' | 'partial' | 'refunded';
}

interface AdminTransportFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  showRideStatus?: boolean;
  showRentalStatus?: boolean;
  showPaymentStatus?: boolean;
}

const vehicleTypes: { value: VehicleType | 'all'; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'Tous les types', icon: <Car className="h-4 w-4" /> },
  { value: 'moto', label: 'Moto', icon: <Bike className="h-4 w-4" /> },
  { value: 'taxi', label: 'Taxi', icon: <Car className="h-4 w-4" /> },
  { value: 'utility', label: 'Utilitaire', icon: <Truck className="h-4 w-4" /> },
  { value: 'rental', label: 'Location', icon: <Car className="h-4 w-4" /> },
];

const rideStatuses: { value: RideStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'accepted', label: 'Acceptée' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'completed', label: 'Terminée' },
  { value: 'cancelled', label: 'Annulée' },
];

const rentalStatuses: { value: RentalStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'active', label: 'En cours' },
  { value: 'completed', label: 'Terminée' },
  { value: 'cancelled', label: 'Annulée' },
];

const paymentStatuses = [
  { value: 'all', label: 'Tous les paiements' },
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payé' },
  { value: 'partial', label: 'Partiel' },
  { value: 'refunded', label: 'Remboursé' },
];

export function AdminTransportFilters({
  filters,
  onFiltersChange,
  showRideStatus = true,
  showRentalStatus = false,
  showPaymentStatus = true,
}: AdminTransportFiltersProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      dateFrom: '',
      dateTo: '',
      vehicleType: 'all',
      rideStatus: 'all',
      rentalStatus: 'all',
      paymentStatus: 'all',
    });
  };

  const hasActiveFilters = 
    filters.dateFrom || 
    filters.dateTo || 
    filters.vehicleType !== 'all' || 
    filters.rideStatus !== 'all' || 
    filters.rentalStatus !== 'all' ||
    filters.paymentStatus !== 'all';

  const activeFiltersCount = [
    filters.dateFrom || filters.dateTo,
    filters.vehicleType !== 'all',
    filters.rideStatus !== 'all',
    filters.rentalStatus !== 'all',
    filters.paymentStatus !== 'all',
  ].filter(Boolean).length;

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Filtres avancés</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} actif{activeFiltersCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X className="h-4 w-4 mr-1" />
              Réinitialiser
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Date début
            </Label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Date fin
            </Label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
              min={filters.dateFrom}
              className="h-9"
            />
          </div>

          {/* Vehicle Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-xs text-muted-foreground">
              <Car className="h-3 w-3" />
              Type de véhicule
            </Label>
            <Select
              value={filters.vehicleType}
              onValueChange={(value) => updateFilter('vehicleType', value as VehicleType | 'all')}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.icon}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ride Status */}
          {showRideStatus && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Statut course
              </Label>
              <Select
                value={filters.rideStatus}
                onValueChange={(value) => updateFilter('rideStatus', value as RideStatus | 'all')}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rideStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Rental Status */}
          {showRentalStatus && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Statut location
              </Label>
              <Select
                value={filters.rentalStatus}
                onValueChange={(value) => updateFilter('rentalStatus', value as RentalStatus | 'all')}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rentalStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Payment Status */}
          {showPaymentStatus && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Paiement
              </Label>
              <Select
                value={filters.paymentStatus}
                onValueChange={(value) => updateFilter('paymentStatus', value as FilterState['paymentStatus'])}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          <span className="text-xs text-muted-foreground mr-2">Filtres rapides:</span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              updateFilter('dateFrom', today);
              updateFilter('dateTo', today);
            }}
          >
            Aujourd'hui
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              const today = new Date();
              const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
              updateFilter('dateFrom', weekAgo.toISOString().split('T')[0]);
              updateFilter('dateTo', today.toISOString().split('T')[0]);
            }}
          >
            7 derniers jours
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              const today = new Date();
              const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
              updateFilter('dateFrom', monthAgo.toISOString().split('T')[0]);
              updateFilter('dateTo', today.toISOString().split('T')[0]);
            }}
          >
            30 derniers jours
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              const today = new Date();
              const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
              updateFilter('dateFrom', firstDayOfMonth.toISOString().split('T')[0]);
              updateFilter('dateTo', today.toISOString().split('T')[0]);
            }}
          >
            Ce mois
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
