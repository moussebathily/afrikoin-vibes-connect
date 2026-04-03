import { useEffect, useState, Suspense, lazy } from "react";
import L from "leaflet";
// @ts-ignore - CSS import handled by Vite
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

// Lazy load the map content to avoid SSR/hydration issues
const MapContent = lazy(() => import("./MapContent"));

const RideMap = ({ pickup, dropoff, driverLocation, showRoute = true }: RideMapProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-[300px] w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        <div className="text-muted-foreground">Chargement de la carte...</div>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden">
      <Suspense fallback={
        <div className="h-full w-full bg-muted flex items-center justify-center">
          <div className="text-muted-foreground">Chargement de la carte...</div>
        </div>
      }>
        <MapContent
          pickup={pickup}
          dropoff={dropoff}
          driverLocation={driverLocation}
          showRoute={showRoute}
          pickupIcon={pickupIcon}
          dropoffIcon={dropoffIcon}
          driverIcon={driverIcon}
        />
      </Suspense>
    </div>
  );
};

export default RideMap;
