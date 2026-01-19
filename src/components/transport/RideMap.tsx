import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LocationPoint } from "@/types/transport";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const pickupIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const dropoffIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const driverIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface RideMapProps {
  pickup: LocationPoint;
  dropoff: LocationPoint;
  driverLocation?: { lat: number; lng: number };
  showRoute?: boolean;
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

const RideMap = ({ pickup, dropoff, driverLocation, showRoute = true }: RideMapProps) => {
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
    <div className="h-[300px] w-full rounded-lg overflow-hidden">
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
    </div>
  );
};

export default RideMap;
