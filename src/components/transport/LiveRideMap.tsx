import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation, Clock, MapPin } from "lucide-react";
import { useDriverLocationSubscription } from "@/hooks/useDriverLocation";
import RideMap from "./RideMap";

interface DriverLocation {
  lat: number;
  lng: number;
  timestamp: string;
}

interface LiveRideMapProps {
  rideId: string;
  driverId: string | null;
  pickup: { address: string; lat: number; lng: number };
  dropoff: { address: string; lat: number; lng: number };
  rideStatus: string;
}

const LiveRideMap = ({ 
  rideId, 
  driverId, 
  pickup, 
  dropoff, 
  rideStatus 
}: LiveRideMapProps) => {
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const handleLocationUpdate = useCallback((location: DriverLocation) => {
    setDriverLocation(location);
    setLastUpdate(new Date(location.timestamp));
  }, []);

  // Subscribe to driver location updates
  useDriverLocationSubscription(
    rideStatus === 'accepted' || rideStatus === 'in_progress' ? driverId : null,
    handleLocationUpdate
  );

  const getStatusMessage = () => {
    switch (rideStatus) {
      case 'pending':
        return { text: 'Recherche d\'un chauffeur...', color: 'bg-yellow-500' };
      case 'accepted':
        return { text: 'Le chauffeur arrive', color: 'bg-blue-500' };
      case 'in_progress':
        return { text: 'Course en cours', color: 'bg-green-500' };
      case 'completed':
        return { text: 'Course terminée', color: 'bg-gray-500' };
      case 'cancelled':
        return { text: 'Course annulée', color: 'bg-red-500' };
      default:
        return { text: 'En attente', color: 'bg-gray-400' };
    }
  };

  const status = getStatusMessage();

  return (
    <div className="space-y-3">
      {/* Status banner */}
      <div className="flex items-center justify-between">
        <Badge className={status.color}>
          {rideStatus === 'accepted' || rideStatus === 'in_progress' ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              {status.text}
            </span>
          ) : (
            status.text
          )}
        </Badge>
        
        {lastUpdate && (rideStatus === 'accepted' || rideStatus === 'in_progress') && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Mis à jour: {lastUpdate.toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        )}
      </div>

      {/* Map with real-time driver location */}
      <RideMap
        pickup={pickup}
        dropoff={dropoff}
        driverLocation={driverLocation ? { lat: driverLocation.lat, lng: driverLocation.lng } : undefined}
        showRoute={true}
      />

      {/* Location info */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
          <div className="w-3 h-3 bg-green-500 rounded-full mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-medium text-green-700 dark:text-green-400">Départ</p>
            <p className="text-muted-foreground truncate">{pickup.address}</p>
          </div>
        </div>
        <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
          <div className="w-3 h-3 bg-red-500 rounded-full mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-medium text-red-700 dark:text-red-400">Arrivée</p>
            <p className="text-muted-foreground truncate">{dropoff.address}</p>
          </div>
        </div>
      </div>

      {/* Driver location indicator */}
      {driverLocation && (rideStatus === 'accepted' || rideStatus === 'in_progress') && (
        <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
          <Navigation className="h-4 w-4 text-yellow-600 dark:text-yellow-400 animate-pulse" />
          <div className="text-sm">
            <span className="font-medium text-yellow-700 dark:text-yellow-400">
              Position du chauffeur en direct
            </span>
            <span className="text-muted-foreground ml-2">
              ({driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)})
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveRideMap;
