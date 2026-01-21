import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Car, 
  User,
  Phone,
  Mail,
  FileText,
  Upload,
  Star,
  DollarSign,
  Navigation,
  CheckCircle,
  Clock,
  MapPin,
  Power,
  PowerOff,
  Loader2,
  TrendingUp,
  AlertCircle,
  MessageCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useDriverRideRealtime } from "@/hooks/useRideRealtime";
import type { Driver, Ride, RideStatus, DriverStatus } from "@/types/transport";
import RideChat from "./RideChat";
const DriverDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [driver, setDriver] = useState<Driver | null>(null);
  const [pendingRides, setPendingRides] = useState<Ride[]>([]);
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Formulaire d'inscription
  const [registerForm, setRegisterForm] = useState({
    full_name: '',
    phone: '',
    email: ''
  });

  // Callback pour rafraîchir les courses
  const handleNewRide = useCallback((ride: any) => {
    setPendingRides(prev => [ride, ...prev.filter(r => r.id !== ride.id)]);
  }, []);

  const handleRideUpdate = useCallback((ride: any) => {
    setMyRides(prev => prev.map(r => r.id === ride.id ? ride : r));
    setPendingRides(prev => prev.filter(r => r.id !== ride.id));
  }, []);

  // Notifications temps réel pour les chauffeurs
  useDriverRideRealtime(driver?.id || null, handleNewRide, handleRideUpdate);

  useEffect(() => {
    if (user) {
      fetchDriverProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchDriverProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        const typedDriver = {
          ...data,
          status: data.status as DriverStatus
        } as Driver;
        setDriver(typedDriver);
        fetchPendingRides();
        fetchMyRides();
      }
    } catch (error: any) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingRides = async () => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      const typedRides = (data || []).map(ride => ({
        ...ride,
        service_type: ride.service_type as Ride['service_type'],
        status: ride.status as RideStatus
      })) as Ride[];
      
      setPendingRides(typedRides);
    } catch (error: any) {
      console.error('Erreur:', error);
    }
  };

  const fetchMyRides = async () => {
    try {
      // First get driver id
      const { data: driverData } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!driverData) return;

      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('driver_id', driverData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedRides = (data || []).map(ride => ({
        ...ride,
        service_type: ride.service_type as Ride['service_type'],
        status: ride.status as RideStatus
      })) as Ride[];
      
      setMyRides(typedRides);
    } catch (error: any) {
      console.error('Erreur:', error);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour devenir chauffeur",
        variant: "destructive"
      });
      return;
    }

    if (!registerForm.full_name || !registerForm.phone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive"
      });
      return;
    }

    setIsRegistering(true);

    try {
      const { data, error } = await supabase
        .from('drivers')
        .insert({
          user_id: user.id,
          full_name: registerForm.full_name,
          phone: registerForm.phone,
          email: registerForm.email || user.email
        } as any)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "🎉 Inscription réussie !",
        description: "Bienvenue dans notre réseau de chauffeurs",
      });

      const typedDriver = {
        ...data,
        status: data.status as DriverStatus
      } as Driver;
      setDriver(typedDriver);
      
    } catch (error: any) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de s'inscrire",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const toggleStatus = async () => {
    if (!driver) return;

    const newStatus: DriverStatus = driver.status === 'available' ? 'offline' : 'available';

    try {
      const { error } = await supabase
        .from('drivers')
        .update({ status: newStatus } as any)
        .eq('id', driver.id);

      if (error) throw error;

      setDriver({ ...driver, status: newStatus });
      toast({
        title: newStatus === 'available' ? "🟢 En ligne" : "🔴 Hors ligne",
        description: newStatus === 'available' 
          ? "Vous recevrez des demandes de courses" 
          : "Vous ne recevrez plus de demandes",
      });

      if (newStatus === 'available') {
        fetchPendingRides();
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const acceptRide = async (ride: Ride) => {
    if (!driver) return;

    try {
      const { error } = await supabase
        .from('rides')
        .update({ 
          driver_id: driver.id,
          status: 'accepted',
          accepted_at: new Date().toISOString()
        } as any)
        .eq('id', ride.id)
        .eq('status', 'pending'); // S'assurer que la course est toujours en attente

      if (error) throw error;

      toast({
        title: "✅ Course acceptée !",
        description: `Rendez-vous à ${ride.pickup_address}`,
      });

      // Mettre à jour le statut du chauffeur
      await supabase
        .from('drivers')
        .update({ status: 'busy' } as any)
        .eq('id', driver.id);

      setDriver({ ...driver, status: 'busy' });
      fetchPendingRides();
      fetchMyRides();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Cette course a peut-être déjà été prise",
        variant: "destructive"
      });
      fetchPendingRides();
    }
  };

  const updateRideStatus = async (rideId: string, newStatus: RideStatus) => {
    try {
      const updates: any = { status: newStatus };
      
      if (newStatus === 'in_progress') {
        updates.started_at = new Date().toISOString();
      } else if (newStatus === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('rides')
        .update(updates)
        .eq('id', rideId);

      if (error) throw error;

      toast({
        title: newStatus === 'completed' ? "🎉 Course terminée !" : "🚗 Course démarrée",
      });

      if (newStatus === 'completed' && driver) {
        await supabase
          .from('drivers')
          .update({ 
            status: 'available',
            total_rides: (driver.total_rides || 0) + 1
          } as any)
          .eq('id', driver.id);
        setDriver({ ...driver, status: 'available', total_rides: (driver.total_rides || 0) + 1 });
      }

      fetchMyRides();
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
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Connexion requise</h3>
          <p className="text-muted-foreground">
            Connectez-vous pour accéder à l'espace chauffeur
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

  // Formulaire d'inscription chauffeur
  if (!driver) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-6 w-6" />
              Devenir chauffeur AfriKoin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Rejoignez notre réseau de chauffeurs et gagnez de l'argent en conduisant.
            </p>

            <div>
              <Label>Nom complet *</Label>
              <Input
                placeholder="Votre nom complet"
                value={registerForm.full_name}
                onChange={(e) => setRegisterForm({ ...registerForm, full_name: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Téléphone *</Label>
              <Input
                placeholder="+225 XX XX XX XX XX"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
              <p className="font-medium">Documents requis (à fournir plus tard) :</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Carte d'identité ou passeport</li>
                <li>• Permis de conduire valide</li>
                <li>• Carte grise du véhicule</li>
                <li>• Attestation d'assurance</li>
              </ul>
            </div>

            <Button 
              onClick={handleRegister}
              disabled={isRegistering}
              className="w-full"
              size="lg"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire comme chauffeur"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard chauffeur
  const activeRide = myRides.find(r => r.status === 'accepted' || r.status === 'in_progress');

  return (
    <div className="space-y-6">
      {/* Header avec statut */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{driver.full_name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{Number(driver.average_rating).toFixed(1)} ({driver.total_reviews} avis)</span>
              {driver.is_verified && (
                <Badge className="bg-green-500 text-xs">Vérifié</Badge>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={toggleStatus}
          variant={driver.status === 'available' ? 'default' : 'outline'}
          size="lg"
          className={driver.status === 'available' ? 'bg-green-500 hover:bg-green-600' : ''}
        >
          {driver.status === 'available' ? (
            <>
              <Power className="h-5 w-5 mr-2" />
              En ligne
            </>
          ) : driver.status === 'busy' ? (
            <>
              <Clock className="h-5 w-5 mr-2" />
              Occupé
            </>
          ) : (
            <>
              <PowerOff className="h-5 w-5 mr-2" />
              Hors ligne
            </>
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Navigation className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{driver.total_rides}</p>
            <p className="text-xs text-muted-foreground">Courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{Number(driver.total_earnings).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">XOF gagnés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{Number(driver.average_rating).toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Note moyenne</p>
          </CardContent>
        </Card>
      </div>

      {/* Course active */}
      {activeRide && (
        <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              Course en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge>{activeRide.ride_number}</Badge>
                <span className="text-lg font-semibold">
                  {Number(activeRide.estimated_price).toLocaleString()} XOF
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5" />
                  <div>
                    <p className="font-medium">Départ</p>
                    <p className="text-sm text-muted-foreground">{activeRide.pickup_address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5" />
                  <div>
                    <p className="font-medium">Arrivée</p>
                    <p className="text-sm text-muted-foreground">{activeRide.dropoff_address}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {activeRide.status === 'accepted' && (
                  <Button 
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                    onClick={() => updateRideStatus(activeRide.id, 'in_progress')}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Démarrer la course
                  </Button>
                )}
                {activeRide.status === 'in_progress' && (
                  <Button 
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    onClick={() => updateRideStatus(activeRide.id, 'completed')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Terminer la course
                  </Button>
                )}
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
                <Button 
                  variant={showChat ? "default" : "outline"}
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {showChat ? 'Fermer' : 'Message'}
                </Button>
              </div>

              {/* Chat en temps réel pour chauffeur */}
              {showChat && (
                <div className="mt-4 border-t pt-4">
                  <RideChat
                    rideId={activeRide.id}
                    rideNumber={activeRide.ride_number}
                    userType="driver"
                    driverId={driver.id}
                    onClose={() => setShowChat(false)}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Courses en attente */}
      {driver.status === 'available' && !activeRide && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Courses disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRides.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune course disponible pour le moment</p>
                <p className="text-sm">Restez en ligne pour recevoir des demandes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRides.map((ride) => (
                  <div 
                    key={ride.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {ride.service_type === 'moto' ? '🏍️' : ride.service_type === 'taxi' ? '🚕' : '🚐'}
                        </span>
                        <div>
                          <p className="font-medium">{ride.ride_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(ride.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-lg text-primary">
                        {Number(ride.estimated_price).toLocaleString()} XOF
                      </span>
                    </div>

                    <div className="space-y-1 text-sm mb-3">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                        <p className="line-clamp-1">{ride.pickup_address}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5" />
                        <p className="line-clamp-1">{ride.dropoff_address}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        {ride.distance_km && (
                          <span>{Number(ride.distance_km).toFixed(1)} km</span>
                        )}
                        {ride.estimated_duration_min && (
                          <span>~{ride.estimated_duration_min} min</span>
                        )}
                      </div>
                      <Button size="sm" onClick={() => acceptRide(ride)}>
                        Accepter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Historique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Historique récent
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myRides.filter(r => r.status === 'completed').length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              Aucune course terminée
            </p>
          ) : (
            <div className="space-y-2">
              {myRides.filter(r => r.status === 'completed').slice(0, 5).map((ride) => (
                <div key={ride.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{ride.ride_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ride.completed_at || ride.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className="font-semibold text-green-600">
                    +{Number(ride.final_price || ride.estimated_price).toLocaleString()} XOF
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alerte documents */}
      {!driver.is_verified && (
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-orange-700 dark:text-orange-400">
                  Documents en attente de vérification
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-500">
                  Ajoutez vos documents pour être vérifié et recevoir plus de courses.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Upload className="h-4 w-4 mr-2" />
                  Ajouter des documents
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DriverDashboard;
