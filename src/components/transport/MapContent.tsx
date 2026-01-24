import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import type { LocationPoint } from "@/types/transport";

interface MapContentProps {
  pickup: LocationPoint;
  dropoff: LocationPoint;
  driverLocation?: { lat: number; lng: number };
  showRoute?: boolean;
  pickupIcon: L.Icon;
  dropoffIcon: L.Icon;
  driverIcon: L.Icon;
}

// Component to update map bounds
const MapBounds = ({ pickup, dropoff }: { pickup: LocationPoint; dropoff: LocationPoint }) => {
  const map = useMap();

  useEffect(() => {
    if (pickup.lat && pickup.lng && dropoff.lat && dropoff.lng) {
      const bounds = L.latLngBounds(
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (pickup.lat && pickup.lng) {
      map.setView([pickup.lat, pickup.lng], 14);
    }
  }, [pickup, dropoff, map]);

  return null;
};

const MapContent = ({ 
  pickup, 
  dropoff, 
  driverLocation, 
  showRoute = true,
  pickupIcon,
  dropoffIcon,
  driverIcon
}: MapContentProps) => {
  // Default center: Abidjan
  const defaultCenter: [number, number] = [5.3364, -4.0267];
  
  const center: [number, number] = pickup.lat && pickup.lng 
    ? [pickup.lat, pickup.lng] 
    : defaultCenter;

  const routePositions: [number, number][] = 
    pickup.lat && pickup.lng && dropoff.lat && dropoff.lng
      ? [[pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng]]
      : [];

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapBounds pickup={pickup} dropoff={dropoff} />

      {/* Pickup marker */}
      {pickup.lat && pickup.lng && (
        <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
          <Popup>
            <div className="text-center">
              <span className="text-lg">🟢</span>
              <p className="font-medium">Point de départ</p>
              <p className="text-sm text-muted-foreground">{pickup.address}</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Dropoff marker */}
      {dropoff.lat && dropoff.lng && (
        <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon}>
          <Popup>
            <div className="text-center">
              <span className="text-lg">🔴</span>
              <p className="font-medium">Destination</p>
              <p className="text-sm text-muted-foreground">{dropoff.address}</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Driver marker */}
      {driverLocation && (
        <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
          <Popup>
            <div className="text-center">
              <span className="text-lg">🚕</span>
              <p className="font-medium">Votre chauffeur</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Route line */}
      {showRoute && routePositions.length === 2 && (
        <Polyline
          positions={routePositions}
          color="#3b82f6"
          weight={4}
          opacity={0.7}
          dashArray="10, 10"
        />
      )}
    </MapContainer>
  );
};

export default MapContent;
