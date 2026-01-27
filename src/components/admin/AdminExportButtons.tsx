import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useCSVExport } from '@/hooks/useCSVExport';
import type { Driver, Vehicle, Ride, Rental } from '@/types/transport';

interface AdminExportButtonsProps {
  rides: Ride[];
  drivers: Driver[];
  vehicles: Vehicle[];
  rentals?: Rental[];
}

export function AdminExportButtons({ rides, drivers, vehicles, rentals = [] }: AdminExportButtonsProps) {
  const { exportToCSV } = useCSVExport();

  const exportRides = () => {
    const data = rides.map(ride => ({
      ride_number: ride.ride_number,
      status: ride.status,
      service_type: ride.service_type,
      pickup_address: ride.pickup_address,
      dropoff_address: ride.dropoff_address,
      distance_km: ride.distance_km || 0,
      estimated_price: ride.estimated_price,
      final_price: ride.final_price || ride.estimated_price,
      currency: ride.currency,
      payment_method: ride.payment_method,
      payment_status: ride.payment_status,
      driver_name: ride.driver?.full_name || 'Non assigné',
      vehicle_plate: ride.vehicle?.plate_number || 'N/A',
      requested_at: ride.requested_at,
      completed_at: ride.completed_at || '',
      created_at: ride.created_at
    }));

    exportToCSV(data, 'courses', {
      ride_number: 'N° Course',
      status: 'Statut',
      service_type: 'Type',
      pickup_address: 'Départ',
      dropoff_address: 'Arrivée',
      distance_km: 'Distance (km)',
      estimated_price: 'Prix estimé',
      final_price: 'Prix final',
      currency: 'Devise',
      payment_method: 'Mode paiement',
      payment_status: 'Statut paiement',
      driver_name: 'Chauffeur',
      vehicle_plate: 'Immatriculation',
      requested_at: 'Date demande',
      completed_at: 'Date fin',
      created_at: 'Créé le'
    });
  };

  const exportDrivers = () => {
    const data = drivers.map(driver => ({
      full_name: driver.full_name,
      phone: driver.phone,
      email: driver.email || '',
      status: driver.status,
      is_verified: driver.is_verified ? 'Oui' : 'Non',
      is_active: driver.is_active ? 'Oui' : 'Non',
      total_rides: driver.total_rides,
      total_earnings: driver.total_earnings,
      average_rating: driver.average_rating,
      total_reviews: driver.total_reviews,
      created_at: driver.created_at
    }));

    exportToCSV(data, 'chauffeurs', {
      full_name: 'Nom complet',
      phone: 'Téléphone',
      email: 'Email',
      status: 'Statut',
      is_verified: 'Vérifié',
      is_active: 'Actif',
      total_rides: 'Total courses',
      total_earnings: 'Gains totaux',
      average_rating: 'Note moyenne',
      total_reviews: 'Nombre avis',
      created_at: 'Inscrit le'
    });
  };

  const exportVehicles = () => {
    const data = vehicles.map(vehicle => ({
      plate_number: vehicle.plate_number,
      vehicle_type: vehicle.vehicle_type,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year || '',
      color: vehicle.color || '',
      seats: vehicle.seats,
      has_ac: vehicle.has_ac ? 'Oui' : 'Non',
      is_verified: vehicle.is_verified ? 'Oui' : 'Non',
      is_active: vehicle.is_active ? 'Oui' : 'Non',
      driver_name: vehicle.driver?.full_name || 'Non assigné',
      created_at: vehicle.created_at
    }));

    exportToCSV(data, 'vehicules', {
      plate_number: 'Immatriculation',
      vehicle_type: 'Type',
      brand: 'Marque',
      model: 'Modèle',
      year: 'Année',
      color: 'Couleur',
      seats: 'Places',
      has_ac: 'Climatisation',
      is_verified: 'Vérifié',
      is_active: 'Actif',
      driver_name: 'Chauffeur',
      created_at: 'Créé le'
    });
  };

  const exportRentals = () => {
    const data = rentals.map(rental => ({
      rental_number: rental.rental_number,
      status: rental.status,
      start_date: rental.start_date,
      end_date: rental.end_date,
      actual_return_date: rental.actual_return_date || '',
      pickup_address: rental.pickup_address,
      return_address: rental.return_address || '',
      with_driver: rental.with_driver ? 'Oui' : 'Non',
      daily_rate: rental.daily_rate,
      driver_daily_rate: rental.driver_daily_rate,
      total_days: rental.total_days,
      subtotal: rental.subtotal,
      deposit: rental.deposit,
      total_amount: rental.total_amount,
      currency: rental.currency,
      payment_method: rental.payment_method,
      payment_status: rental.payment_status,
      vehicle_plate: rental.vehicle?.plate_number || 'N/A',
      driver_name: rental.driver?.full_name || 'Non assigné',
      created_at: rental.created_at
    }));

    exportToCSV(data, 'locations', {
      rental_number: 'N° Location',
      status: 'Statut',
      start_date: 'Date début',
      end_date: 'Date fin',
      actual_return_date: 'Retour réel',
      pickup_address: 'Adresse départ',
      return_address: 'Adresse retour',
      with_driver: 'Avec chauffeur',
      daily_rate: 'Tarif journalier',
      driver_daily_rate: 'Tarif chauffeur/jour',
      total_days: 'Nb jours',
      subtotal: 'Sous-total',
      deposit: 'Caution',
      total_amount: 'Montant total',
      currency: 'Devise',
      payment_method: 'Mode paiement',
      payment_status: 'Statut paiement',
      vehicle_plate: 'Véhicule',
      driver_name: 'Chauffeur',
      created_at: 'Créé le'
    });
  };

  const exportRevenue = () => {
    // Group rides by date for revenue report
    const revenueByDate: Record<string, { date: string; rides_count: number; completed: number; cancelled: number; revenue: number }> = {};
    
    rides.forEach(ride => {
      const date = new Date(ride.created_at).toISOString().split('T')[0];
      if (!revenueByDate[date]) {
        revenueByDate[date] = { date, rides_count: 0, completed: 0, cancelled: 0, revenue: 0 };
      }
      revenueByDate[date].rides_count++;
      if (ride.status === 'completed') {
        revenueByDate[date].completed++;
        if (ride.payment_status === 'paid') {
          revenueByDate[date].revenue += ride.final_price || ride.estimated_price || 0;
        }
      }
      if (ride.status === 'cancelled') {
        revenueByDate[date].cancelled++;
      }
    });

    // Add rental revenues
    rentals.forEach(rental => {
      const date = new Date(rental.created_at).toISOString().split('T')[0];
      if (!revenueByDate[date]) {
        revenueByDate[date] = { date, rides_count: 0, completed: 0, cancelled: 0, revenue: 0 };
      }
      if (rental.status === 'completed' && rental.payment_status === 'paid') {
        revenueByDate[date].revenue += rental.total_amount || 0;
      }
    });

    const data = Object.values(revenueByDate).sort((a, b) => b.date.localeCompare(a.date));

    exportToCSV(data, 'revenus', {
      date: 'Date',
      rides_count: 'Nb courses',
      completed: 'Terminées',
      cancelled: 'Annulées',
      revenue: 'Revenus (FCFA)'
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Exporter CSV
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={exportRides} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          Courses ({rides.length})
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportDrivers} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          Chauffeurs ({drivers.length})
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportVehicles} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          Véhicules ({vehicles.length})
        </DropdownMenuItem>
        {rentals.length > 0 && (
          <DropdownMenuItem onClick={exportRentals} className="gap-2 cursor-pointer">
            <FileSpreadsheet className="h-4 w-4" />
            Locations ({rentals.length})
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={exportRevenue} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          Rapport revenus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
