import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useActionStore } from '@/store/actionStore';

export function AuthInitializer() {
  const { user, session } = useAuth();
  const { fetchUserData } = useActionStore();

  useEffect(() => {
    if (user && session) {
      fetchUserData();
    }
  }, [user, session, fetchUserData]);

  return null; // This component doesn't render anything
}