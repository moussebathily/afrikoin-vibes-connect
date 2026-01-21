import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Bike, 
  Car, 
  Truck, 
  MapPin, 
  Navigation, 
  Clock, 
  DollarSign,
  HardHat,
  Users,
  Snowflake,
  Package,
  Phone,
  MessageCircle,
  Star,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useRideRealtime } from "@/hooks/useRideRealtime";
import type { VehicleType, ServiceOption, LocationPoint } from "@/types/transport";
import RideMap from "./RideMap";

const serviceOptions: ServiceOption[] = [
  {
    type: 'moto',
    name: 'Moto-taxi',
    description: 'Rapide, économique, idéal en ville',
    icon: '🏍️',
    basePrice: 500,
    pricePerKm: 150,
    color: 'bg-orange-500'
  },
  {
    type: 'taxi',
    name: 'Taxi Voiture',
    description: 'Confort, climatisation, 1-4 personnes',
    icon: '🚕',
    basePrice: 1000,
    pricePerKm: 300,
    color: 'bg-yellow-500'
  },
  {
    type: 'utility',
    name: 'Utilitaire',
    description: 'Déménagement, colis lourds',
    icon: '🚐',
    basePrice: 5000,
    pricePerKm: 500,
    color: 'bg-blue-500'
  }
];

const paymentMethods = [
  { id: 'cash', name: 'Espèces', icon: '💵' },
  { id: 'orange_money', name: 'Orange Money', icon: '🟠' },
  { id: 'wave', name: 'Wave', icon: '🌊' },
  { id: 'mtn', name: 'MTN Mobile Money', icon: '🟡' },
  { id: 'card', name: 'Carte bancaire', icon: '💳' }
];

const RideBooking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedService, setSelectedService] = useState<VehicleType>('taxi');
  const [pickup, setPickup] = useState<LocationPoint>({ address: '', lat: 0, lng: 0 });
  const [dropoff, setDropoff] = useState<LocationPoint>({ address: '', lat: 0, lng: 0 });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [hasHelmet, setHasHelmet] = useState(true);
  const [needsLoadingHelp, setNeedsLoadingHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState(0);

  // Notifications temps réel pour les courses
  useRideRealtime();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPickup(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: prev.address || 'Ma position actuelle'
          }));
        },
        (error) => {
          console.log('Géolocalisation non disponible:', error);
        }
      );
    }
  }, []);

  // Calcul du prix estimé
  useEffect(() => {
    if (pickup.lat && pickup.lng && dropoff.lat && dropoff.lng) {
      // Calcul simple de distance (Haversine)
      const R = 6371;
      const dLat = (dropoff.lat - pickup.lat) * Math.PI / 180;
      const dLng = (dropoff.lng - pickup.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(pickup.lat * Math.PI / 180) * Math.cos(dropoff.lat * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      setEstimatedDistance(Math.round(distance * 10) / 10);
      setEstimatedDuration(Math.round(distance * 3)); // ~20km/h en ville
      
      const service = serviceOptions.find(s => s.type === selectedService);
      if (service) {
        const price = service.basePrice + (distance * service.pricePerKm);
        setEstimatedPrice(Math.round(price / 100) * 100); // Arrondi à 100 XOF
      }
    }
  }, [pickup, dropoff, selectedService]);

  const handleBookRide = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour commander un trajet",
        variant: "destructive"
      });
      return;
    }

    if (!pickup.address || !dropoff.address) {
      toast({
        title: "Adresses manquantes",
        description: "Veuillez entrer les adresses de départ et d'arrivée",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('rides')
        .insert({
          ride_number: '', // Auto-généré par trigger
          customer_id: user.id,
          service_type: selectedService,
          pickup_address: pickup.address,
          pickup_lat: pickup.lat || 5.3364,
          pickup_lng: pickup.lng || -4.0267,
          dropoff_address: dropoff.address,
          dropoff_lat: dropoff.lat || 5.3500,
          dropoff_lng: dropoff.lng || -4.0100,
          distance_km: estimatedDistance,
          estimated_duration_min: estimatedDuration,
          estimated_price: estimatedPrice,
          payment_method: paymentMethod,
          has_helmet: hasHelmet,
          needs_loading_help: needsLoadingHelp,
          notes: notes || null
        } as any)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "🚖 Course commandée !",
        description: "Nous recherchons un chauffeur pour vous...",
      });

      // Reset form
      setDropoff({ address: '', lat: 0, lng: 0 });
      setNotes('');
      
    } catch (error: any) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la course",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedServiceData = serviceOptions.find(s => s.type === selectedService);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Formulaire */}
      <div className="space-y-6">
        {/* Sélection du service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Type de service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {serviceOptions.map((service) => (
                <button
                  key={service.type}
                  onClick={() => setSelectedService(service.type)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    selectedService === service.type
                      ? 'border-primary bg-primary/10 shadow-lg scale-105'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-3xl block mb-2">{service.icon}</span>
                  <span className="font-medium text-sm">{service.name}</span>
                  <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                    {service.description}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Adresses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Trajet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-3 w-3 h-3 bg-green-500 rounded-full" />
              <Input
                placeholder="Adresse de départ"
                value={pickup.address}
                onChange={(e) => setPickup({ ...pickup, address: e.target.value })}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-3 w-3 h-3 bg-red-500 rounded-full" />
              <Input
                placeholder="Adresse d'arrivée"
                value={dropoff.address}
                onChange={(e) => setDropoff({ ...dropoff, address: e.target.value })}
                className="pl-10"
              />
            </div>

            {/* Options spéciales */}
            {selectedService === 'moto' && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <HardHat className="h-5 w-5 text-orange-500" />
                <Label className="flex-1">Casque inclus</Label>
                <input
                  type="checkbox"
                  checked={hasHelmet}
                  onChange={(e) => setHasHelmet(e.target.checked)}
                  className="h-5 w-5"
                />
              </div>
            )}

            {selectedService === 'utility' && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Package className="h-5 w-5 text-blue-500" />
                <Label className="flex-1">Aide au chargement</Label>
                <input
                  type="checkbox"
                  checked={needsLoadingHelp}
                  onChange={(e) => setNeedsLoadingHelp(e.target.checked)}
                  className="h-5 w-5"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paiement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Mode de paiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    paymentMethod === method.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-xl">{method.icon}</span>
                  <span className="text-xs block mt-1">{method.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <div>
          <Label>Notes pour le chauffeur (optionnel)</Label>
          <Textarea
            placeholder="Ex: Je suis devant le bâtiment bleu..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>

      {/* Carte et résumé */}
      <div className="space-y-6">
        {/* Carte */}
        <Card className="overflow-hidden">
          <RideMap pickup={pickup} dropoff={dropoff} />
        </Card>

        {/* Estimation */}
        <Card className={`${selectedServiceData?.color} text-white`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{selectedServiceData?.icon}</span>
              <div className="text-right">
                <p className="text-sm opacity-80">Prix estimé</p>
                <p className="text-3xl font-bold">
                  {estimatedPrice > 0 ? `${estimatedPrice.toLocaleString()} XOF` : '---'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                <span>{estimatedDistance > 0 ? `${estimatedDistance} km` : '-- km'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{estimatedDuration > 0 ? `~${estimatedDuration} min` : '-- min'}</span>
              </div>
            </div>

            <Button 
              onClick={handleBookRide}
              disabled={isLoading || !pickup.address || !dropoff.address}
              className="w-full mt-6 bg-white text-gray-900 hover:bg-gray-100"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Recherche en cours...
                </>
              ) : (
                <>
                  Commander maintenant
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Infos service */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">{selectedServiceData?.name}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {selectedService === 'moto' && (
                <>
                  <p>✓ Déplacements rapides en ville</p>
                  <p>✓ Idéal pour éviter les embouteillages</p>
                  <p>✓ Casque fourni</p>
                </>
              )}
              {selectedService === 'taxi' && (
                <>
                  <p>✓ Véhicule climatisé</p>
                  <p>✓ 1 à 4 passagers</p>
                  <p>✓ Coffre disponible</p>
                </>
              )}
              {selectedService === 'utility' && (
                <>
                  <p>✓ Idéal pour déménagements</p>
                  <p>✓ Transport de meubles & colis</p>
                  <p>✓ Option aide au chargement</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RideBooking;
