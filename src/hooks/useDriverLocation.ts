import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DriverLocation {
  lat: number;
  lng: number;
  timestamp: string;
}

// Hook for drivers to broadcast their location
export const useDriverLocationBroadcast = (
  driverId: string | null,
  isActive: boolean = false
) => {
  const { toast } = useToast();
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateLocation = useCallback(async (position: GeolocationPosition) => {
    if (!driverId) return;

    try {
      await supabase
        .from('drivers')
        .update({
          current_lat: position.coords.latitude,
          current_lng: position.coords.longitude,
          last_location_update: new Date().toISOString()
        })
        .eq('id', driverId);
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  }, [driverId]);

  useEffect(() => {
    if (!driverId || !isActive) {
      // Clean up when not active
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      toast({
        title: "GPS non disponible",
        description: "Votre appareil ne supporte pas la géolocalisation",
        variant: "destructive"
      });
      return;
    }

    // Watch position with high accuracy
    watchIdRef.current = navigator.geolocation.watchPosition(
      updateLocation,
      (error) => {
        console.error('Geolocation error:', error);
        if (error.code === error.PERMISSION_DENIED) {
          toast({
            title: "Permission GPS refusée",
            description: "Activez la localisation pour le suivi en temps réel",
            variant: "destructive"
          });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    // Also update every 10 seconds as backup
    intervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        updateLocation,
        (error) => console.error('Backup location error:', error),
        { enableHighAccuracy: true }
      );
    }, 10000);

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [driverId, isActive, updateLocation, toast]);

  return null;
};

// Hook for customers to subscribe to driver location updates
export const useDriverLocationSubscription = (
  driverId: string | null,
  onLocationUpdate?: (location: DriverLocation) => void
) => {
  useEffect(() => {
    if (!driverId) return;

    // Initial fetch
    const fetchInitialLocation = async () => {
      const { data } = await supabase
        .from('drivers')
        .select('current_lat, current_lng, last_location_update')
        .eq('id', driverId)
        .single();

      if (data?.current_lat && data?.current_lng) {
        onLocationUpdate?.({
          lat: Number(data.current_lat),
          lng: Number(data.current_lng),
          timestamp: data.last_location_update || new Date().toISOString()
        });
      }
    };

    fetchInitialLocation();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`driver-location-${driverId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'drivers',
          filter: `id=eq.${driverId}`
        },
        (payload) => {
          const driver = payload.new;
          if (driver.current_lat && driver.current_lng) {
            onLocationUpdate?.({
              lat: Number(driver.current_lat),
              lng: Number(driver.current_lng),
              timestamp: driver.last_location_update || new Date().toISOString()
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId, onLocationUpdate]);

  return null;
};
