import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Truck, 
  Key,
  Calendar,
  MapPin,
  User,
  Star,
  Snowflake,
  Users,
  Briefcase,
  Check,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Vehicle } from "@/types/transport";

interface RentalVehicle extends Vehicle {
  daily_rate: number;
  driver_daily_rate: number;
}

// Données mock pour les véhicules disponibles
const mockVehicles: RentalVehicle[] = [
  {
    id: '1',
    driver_id: 'd1',
    vehicle_type: 'rental',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    color: 'Blanc',
    plate_number: 'AB-1234-CI',
    photo_url: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=400',
    seats: 5,
    luggage_capacity: 3,
    has_ac: true,
    is_verified: true,
    is_active: true,
    created_at: '',
    updated_at: '',
    daily_rate: 25000,
    driver_daily_rate: 15000
  },
  {
    id: '2',
    driver_id: 'd2',
    vehicle_type: 'rental',
    brand: 'Mercedes',
    model: 'Sprinter',
    year: 2021,
    color: 'Gris',
    plate_number: 'CD-5678-CI',
    photo_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    seats: 3,
    luggage_capacity: 10,
    has_ac: true,
    cargo_volume_m3: 12,
    max_weight_kg: 1500,
    is_verified: true,
    is_active: true,
    created_at: '',
    updated_at: '',
    daily_rate: 45000,
    driver_daily_rate: 20000
  },
  {
    id: '3',
    driver_id: 'd3',
    vehicle_type: 'rental',
    brand: 'Hyundai',
    model: 'Santa Fe',
    year: 2023,
    color: 'Noir',
    plate_number: 'EF-9012-CI',
    photo_url: 'https://images.unsplash.com/photo-1606611013016-969c19ba16d4?w=400',
    seats: 7,
    luggage_capacity: 4,
    has_ac: true,
    is_verified: true,
    is_active: true,
    created_at: '',
    updated_at: '',
    daily_rate: 35000,
    driver_daily_rate: 18000
  },
  {
    id: '4',
    driver_id: 'd4',
    vehicle_type: 'utility',
    brand: 'Isuzu',
    model: 'NPR',
    year: 2020,
    color: 'Blanc',
    plate_number: 'GH-3456-CI',
    photo_url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400',
    seats: 3,
    luggage_capacity: 20,
    has_ac: false,
    cargo_volume_m3: 25,
    max_weight_kg: 3000,
    is_verified: true,
    is_active: true,
    created_at: '',
    updated_at: '',
    daily_rate: 60000,
    driver_daily_rate: 25000
  }
];

const VehicleRental = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [vehicles] = useState<RentalVehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<RentalVehicle | null>(null);
  const [withDriver, setWithDriver] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'rental' | 'utility'>('all');

  const filteredVehicles = vehicles.filter(v => 
    filterType === 'all' || v.vehicle_type === filterType
  );

  const calculateTotal = () => {
    if (!selectedVehicle || !startDate || !endDate) return { days: 0, total: 0 };
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return { days: 0, total: 0 };
    
    const vehicleTotal = selectedVehicle.daily_rate * days;
    const driverTotal = withDriver ? selectedVehicle.driver_daily_rate * days : 0;
    
    return { days, total: vehicleTotal + driverTotal };
  };

  const { days, total } = calculateTotal();

  const handleRental = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour louer un véhicule",
        variant: "destructive"
      });
      return;
    }

    if (!selectedVehicle || !startDate || !endDate || !pickupAddress) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('rentals')
        .insert({
          rental_number: '',
          customer_id: user.id,
          vehicle_id: selectedVehicle.id,
          with_driver: withDriver,
          start_date: startDate,
          end_date: endDate,
          pickup_address: pickupAddress,
          daily_rate: selectedVehicle.daily_rate,
          driver_daily_rate: withDriver ? selectedVehicle.driver_daily_rate : 0,
          total_days: days,
          subtotal: selectedVehicle.daily_rate * days,
          total_amount: total
        } as any)
        .select()
        .single();

      if (error) throw error;

      // Envoyer la notification email automatiquement
      try {
        await supabase.functions.invoke('send-rental-notification', {
          body: {
            rental_id: data.id,
            notification_type: 'new_rental'
          }
        });
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError);
        // Ne pas bloquer la réservation si l'email échoue
      }

      toast({
        title: "🚗 Réservation confirmée !",
        description: `${selectedVehicle.brand} ${selectedVehicle.model} réservé pour ${days} jour(s). Un email de confirmation vous a été envoyé.`,
      });

      // Reset form
      setSelectedVehicle(null);
      setStartDate('');
      setEndDate('');
      setPickupAddress('');
      setWithDriver(false);
      
    } catch (error: any) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la réservation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('all')}
        >
          Tous
        </Button>
        <Button
          variant={filterType === 'rental' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('rental')}
        >
          <Car className="h-4 w-4 mr-2" />
          Voitures
        </Button>
        <Button
          variant={filterType === 'utility' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('utility')}
        >
          <Truck className="h-4 w-4 mr-2" />
          Utilitaires
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Liste des véhicules */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {filteredVehicles.map((vehicle) => (
            <Card 
              key={vehicle.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedVehicle?.id === vehicle.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : ''
              }`}
              onClick={() => setSelectedVehicle(vehicle)}
            >
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={vehicle.photo_url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400'}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                {vehicle.is_verified && (
                  <Badge className="absolute top-2 right-2 bg-green-500">
                    <Check className="h-3 w-3 mr-1" />
                    Vérifié
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{vehicle.brand} {vehicle.model}</h3>
                    <p className="text-sm text-muted-foreground">{vehicle.year} • {vehicle.color}</p>
                  </div>
                  <Badge variant="outline">
                    {vehicle.vehicle_type === 'utility' ? 'Utilitaire' : 'Voiture'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {vehicle.seats} places
                  </span>
                  {vehicle.has_ac && (
                    <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full flex items-center gap-1">
                      <Snowflake className="h-3 w-3" />
                      Clim
                    </span>
                  )}
                  <span className="text-xs bg-muted px-2 py-1 rounded-full flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {vehicle.luggage_capacity} bagages
                  </span>
                </div>

                {vehicle.cargo_volume_m3 && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Volume: {vehicle.cargo_volume_m3}m³ • Max: {vehicle.max_weight_kg}kg
                  </p>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <div>
                    <p className="text-lg font-bold text-primary">
                      {vehicle.daily_rate.toLocaleString()} XOF
                    </p>
                    <p className="text-xs text-muted-foreground">/jour</p>
                  </div>
                  {selectedVehicle?.id === vehicle.id && (
                    <Badge className="bg-primary">Sélectionné</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Formulaire de réservation */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Réservation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedVehicle ? (
                <>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">{selectedVehicle.brand} {selectedVehicle.model}</p>
                    <p className="text-sm text-muted-foreground">{selectedVehicle.daily_rate.toLocaleString()} XOF/jour</p>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                    <Label className="flex-1">Avec chauffeur</Label>
                    <input
                      type="checkbox"
                      checked={withDriver}
                      onChange={(e) => setWithDriver(e.target.checked)}
                      className="h-5 w-5"
                    />
                  </div>
                  {withDriver && (
                    <p className="text-sm text-muted-foreground ml-2">
                      +{selectedVehicle.driver_daily_rate.toLocaleString()} XOF/jour
                    </p>
                  )}

                  <div>
                    <Label>Date de début</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Date de fin</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Adresse de récupération</Label>
                    <Input
                      placeholder="Ex: Aéroport FHB, Abidjan"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {days > 0 && (
                    <div className="p-4 bg-primary text-primary-foreground rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span>Véhicule ({days} jours)</span>
                        <span>{(selectedVehicle.daily_rate * days).toLocaleString()} XOF</span>
                      </div>
                      {withDriver && (
                        <div className="flex justify-between mb-2">
                          <span>Chauffeur ({days} jours)</span>
                          <span>{(selectedVehicle.driver_daily_rate * days).toLocaleString()} XOF</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-primary-foreground/20 font-bold text-lg">
                        <span>Total</span>
                        <span>{total.toLocaleString()} XOF</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleRental}
                    disabled={isLoading || days <= 0 || !pickupAddress}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Réservation en cours...
                      </>
                    ) : (
                      'Confirmer la réservation'
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez un véhicule pour commencer</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Avantages */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Nos garanties</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Véhicules vérifiés et assurés
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Assistance 24h/24
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Chauffeurs professionnels
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Annulation gratuite 24h avant
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VehicleRental;
