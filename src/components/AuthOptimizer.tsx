
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function AuthOptimizer() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [reconnecting, setReconnecting] = useState(false);
  const { toast } = useToast();
  const { user, session } = useAuth();

  useEffect(() => {
    // Monitor network status
    const handleOnline = () => {
      setIsOnline(true);
      if (reconnecting) {
        handleReconnection();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'Connexion perdue',
        description: 'Vérifiez votre connexion internet',
        variant: 'destructive',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [reconnecting, toast]);

  const handleReconnection = async () => {
    if (!isOnline) return;
    
    setReconnecting(true);
    
    try {
      // Try to refresh the session
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh failed:', error);
        toast({
          title: 'Reconnexion échouée',
          description: 'Veuillez vous reconnecter',
          variant: 'destructive',
        });
      } else if (data.session) {
        toast({
          title: 'Reconnecté',
          description: 'Votre session a été restaurée',
        });
      }
    } catch (error) {
      console.error('Reconnection error:', error);
    } finally {
      setReconnecting(false);
    }
  };

  // Auto-reconnect when coming back online
  useEffect(() => {
    if (isOnline && !session && !reconnecting) {
      const timer = setTimeout(() => {
        handleReconnection();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline, session, reconnecting]);

  return null; // This is a utility component that doesn't render anything
}
