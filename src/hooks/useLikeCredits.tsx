import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/useDebounce';

interface LikeCredits {
  id: string;
  balance: number;
  total_purchased: number;
  total_used: number;
}

interface UseLikeParams {
  targetPostId?: string;
  targetUserId?: string;
  usageType?: 'manual' | 'automatic';
  likesCount?: number;
}

export const useLikeCredits = () => {
  const [credits, setCredits] = useState<LikeCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsing, setIsUsing] = useState(false);
  const [loadingUser, setLoadingUser] = useState<string | null>(null);
  const { toast } = useToast();

  // Debounce loading to prevent multiple requests
  const debouncedLoadingUser = useDebounce(loadingUser, 500);

  const loadCredits = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || debouncedLoadingUser === user.id) return;
      setLoadingUser(user.id);

      // Check if credits already exist
      const { data, error } = await supabase
        .from('like_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Créer un nouveau solde avec likes gratuits
          const { data: newCredits, error: insertError } = await supabase
            .from('like_credits')
            .insert({
              user_id: user.id,
              balance: 10,
              total_purchased: 0,
              total_used: 0
            })
            .select()
            .single();

          if (insertError) throw insertError;
          setCredits(newCredits);
        } else {
          throw error;
        }
      } else {
        setCredits(data);
      }
    } catch (error) {
      console.error('Failed to load credits:', error);
    } finally {
      setIsLoading(false);
      setLoadingUser(null);
    }
  }, [debouncedLoadingUser]);

  useEffect(() => {
    loadCredits();
  }, [loadCredits]);

  const useLike = async (params: UseLikeParams = {}) => {
    try {
      setIsUsing(true);
      
      const { data, error } = await supabase.functions.invoke('use-like', {
        body: {
          targetPostId: params.targetPostId,
          targetUserId: params.targetUserId,
          usageType: params.usageType || 'manual',
          likesCount: params.likesCount || 1,
        }
      });

      if (error) throw error;

      if (data.success) {
        // Mettre à jour le solde local
        if (credits) {
          setCredits({
            ...credits,
            balance: data.remainingBalance,
            total_used: credits.total_used + (params.likesCount || 1)
          });
        }

        toast({
          title: "Like utilisé ! ❤️",
          description: data.message,
        });

        return { success: true, remainingBalance: data.remainingBalance };
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to use like:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'utiliser le like.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsUsing(false);
    }
  };

  const canUseLikes = (count: number = 1) => {
    return credits ? credits.balance >= count : false;
  };

  return {
    credits,
    isLoading,
    isUsing,
    loadCredits,
    useLike,
    canUseLikes,
  };
};