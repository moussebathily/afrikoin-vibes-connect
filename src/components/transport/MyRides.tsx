import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Car, 
  MapPin, 
  Clock, 
  DollarSign,
  Phone,
  MessageCircle,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Navigation
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Ride, Rental, RideStatus, RentalStatus } from "@/types/transport";
import RideMap from "./RideMap";
import RideChat from "./RideChat";

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  accepted: 'bg-blue-500',
  in_progress: 'bg-green-500',
  completed: 'bg-gray-500',
  cancelled: 'bg-red-500',
  confirmed: 'bg-blue-500',
  active: 'bg-green-500'
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  accepted: 'Acceptée',
  in_progress: 'En cours',
  completed: 'Terminée',
  cancelled: 'Annulée',
  confirmed: 'Confirmée',
  active: 'Active'
};

const serviceIcons: Record<string, string> = {
  moto: '🏍️',
  taxi: '🚕',
  utility: '🚐',
  rental: '🚗'
};

const MyRides = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [rides, setRides] = useState<Ride[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRides();
      fetchRentals();
    }
  }, [user]);

  const fetchRides = async () => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion for the data
      const typedRides = (data || []).map(ride => ({
        ...ride,
        service_type: ride.service_type as Ride['service_type'],
        status: ride.status as RideStatus
      })) as Ride[];
      
      setRides(typedRides);
      
      // Trouver une course active
      const active = typedRides.find(r => 
        r.status === 'accepted' || r.status === 'in_progress'
      );
      setActiveRide(active || null);
      
    } catch (error: any) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRentals = async () => {
    try {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion for the data
      const typedRentals = (data || []).map(rental => ({
        ...rental,
        status: rental.status as RentalStatus
      })) as Rental[];
      
      setRentals(typedRentals);
    } catch (error: any) {
      console.error('Erreur:', error);
    }
  };

  const handleCancelRide = async (rideId: string) => {
    try {
      const { error } = await supabase
        .from('rides')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: 'Annulée par le client'
        } as any)
        .eq('id', rideId);

      if (error) throw error;

      toast({
        title: "Course annulée",
        description: "Votre course a été annulée avec succès",
      });

      fetchRides();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Connexion requise</h3>
          <p className="text-muted-foreground">
            Connectez-vous pour voir vos trajets et réservations
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course active */}
      {activeRide && (
        <Card className="border-2 border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              Course en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <RideMap
                  pickup={{ 
                    address: activeRide.pickup_address, 
                    lat: Number(activeRide.pickup_lat), 
                    lng: Number(activeRide.pickup_lng) 
                  }}
                  dropoff={{ 
                    address: activeRide.dropoff_address, 
                    lat: Number(activeRide.dropoff_lat), 
                    lng: Number(activeRide.dropoff_lng) 
                  }}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{serviceIcons[activeRide.service_type]}</span>
                  <div>
                    <p className="font-semibold">{activeRide.ride_number}</p>
                    <Badge className={statusColors[activeRide.status]}>
                      {statusLabels[activeRide.status]}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1" />
                    <p>{activeRide.pickup_address}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-1" />
                    <p>{activeRide.dropoff_address}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                  <Button 
                    size="sm" 
                    variant={showChat ? "default" : "outline"} 
                    className="flex-1"
                    onClick={() => setShowChat(!showChat)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {showChat ? 'Fermer' : 'Message'}
                  </Button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Prix estimé</span>
                  <span className="font-bold text-lg">
                    {Number(activeRide.estimated_price).toLocaleString()} XOF
                  </span>
                </div>
              </div>
            </div>

            {/* Chat en temps réel */}
            {showChat && (
              <div className="mt-4 border-t pt-4">
                <RideChat
                  rideId={activeRide.id}
                  rideNumber={activeRide.ride_number}
                  userType="customer"
                  onClose={() => setShowChat(false)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Historique */}
      <Tabs defaultValue="rides">
        <TabsList>
          <TabsTrigger value="rides">
            Courses ({rides.length})
          </TabsTrigger>
          <TabsTrigger value="rentals">
            Locations ({rentals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rides" className="mt-4">
          {rides.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucune course pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {rides.filter(r => r.id !== activeRide?.id).map((ride) => (
                <Card key={ride.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{serviceIcons[ride.service_type]}</span>
                        <div>
                          <p className="font-medium">{ride.ride_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(ride.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge className={statusColors[ride.status]}>
                        {statusLabels[ride.status]}
                      </Badge>
                    </div>

                    <div className="mt-3 space-y-1 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                        <p className="text-muted-foreground line-clamp-1">{ride.pickup_address}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5" />
                        <p className="text-muted-foreground line-clamp-1">{ride.dropoff_address}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {ride.distance_km && (
                          <span className="flex items-center gap-1">
                            <Navigation className="h-3 w-3" />
                            {Number(ride.distance_km).toFixed(1)} km
                          </span>
                        )}
                        {ride.estimated_duration_min && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {ride.estimated_duration_min} min
                          </span>
                        )}
                      </div>
                      <span className="font-semibold">
                        {Number(ride.final_price || ride.estimated_price).toLocaleString()} XOF
                      </span>
                    </div>

                    {ride.status === 'pending' && (
                      <div className="mt-3 flex gap-2">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleCancelRide(ride.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Annuler
                        </Button>
                      </div>
                    )}

                    {ride.status === 'completed' && (
                      <div className="mt-3">
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4 mr-1" />
                          Noter le chauffeur
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rentals" className="mt-4">
          {rentals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucune location pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {rentals.map((rental) => (
                <Card key={rental.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{rental.rental_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(rental.start_date).toLocaleDateString('fr-FR')} - {new Date(rental.end_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Badge className={statusColors[rental.status]}>
                        {statusLabels[rental.status]}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <p>{rental.total_days} jour(s) • {rental.with_driver ? 'Avec chauffeur' : 'Sans chauffeur'}</p>
                        <p className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {rental.pickup_address}
                        </p>
                      </div>
                      <span className="font-semibold text-lg">
                        {Number(rental.total_amount).toLocaleString()} XOF
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyRides;
