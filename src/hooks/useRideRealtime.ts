import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { RideStatus } from '@/types/transport';

interface RideUpdate {
  id: string;
  ride_number: string;
  status: RideStatus;
  driver_id: string | null;
  pickup_address: string;
  dropoff_address: string;
}

const statusMessages: Record<RideStatus, { title: string; description: string; variant?: 'default' | 'destructive' }> = {
  pending: {
    title: '🔍 Recherche en cours',
    description: 'Nous recherchons un chauffeur pour vous...'
  },
  accepted: {
    title: '✅ Chauffeur trouvé !',
    description: 'Un chauffeur a accepté votre course. Il arrive bientôt !'
  },
  in_progress: {
    title: '🚗 Course en cours',
    description: 'Vous êtes en route vers votre destination.'
  },
  completed: {
    title: '🎉 Course terminée',
    description: 'Merci d\'avoir utilisé AfriKoin Transport !'
  },
  cancelled: {
    title: '❌ Course annulée',
    description: 'Votre course a été annulée.',
    variant: 'destructive'
  }
};

export const useRideRealtime = (onRideUpdate?: (ride: RideUpdate) => void) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleRideChange = useCallback((payload: any) => {
    const ride = payload.new as RideUpdate;
    
    // Notify about status change
    const statusInfo = statusMessages[ride.status];
    if (statusInfo) {
      toast({
        title: statusInfo.title,
        description: `${ride.ride_number}: ${statusInfo.description}`,
        variant: statusInfo.variant || 'default',
      });
    }

    // Call external handler if provided
    onRideUpdate?.(ride);
  }, [toast, onRideUpdate]);

  useEffect(() => {
    if (!user) return;

    // Subscribe to customer's rides
    const customerChannel = supabase
      .channel(`customer-rides-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rides',
          filter: `customer_id=eq.${user.id}`
        },
        handleRideChange
      )
      .subscribe();

    return () => {
      supabase.removeChannel(customerChannel);
    };
  }, [user, handleRideChange]);

  return null;
};

// Hook for drivers to receive new ride requests
export const useDriverRideRealtime = (
  driverId: string | null,
  onNewRide?: (ride: any) => void,
  onRideUpdate?: (ride: any) => void
) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!driverId) return;

    // Subscribe to new pending rides
    const pendingChannel = supabase
      .channel('pending-rides')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'rides',
          filter: `status=eq.pending`
        },
        (payload) => {
          const ride = payload.new;
          toast({
            title: '🆕 Nouvelle course disponible !',
            description: `De: ${ride.pickup_address}`,
          });
          onNewRide?.(ride);
        }
      )
      .subscribe();

    // Subscribe to assigned rides updates
    const assignedChannel = supabase
      .channel(`driver-rides-${driverId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rides',
          filter: `driver_id=eq.${driverId}`
        },
        (payload) => {
          const ride = payload.new;
          
          if (ride.status === 'cancelled') {
            toast({
              title: '❌ Course annulée',
              description: `Le client a annulé la course ${ride.ride_number}`,
              variant: 'destructive'
            });
          }
          
          onRideUpdate?.(ride);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(pendingChannel);
      supabase.removeChannel(assignedChannel);
    };
  }, [driverId, toast, onNewRide, onRideUpdate]);

  return null;
};
