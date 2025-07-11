
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  country: string;
  isVerified: boolean;
}

interface Balance {
  available: number;
  pending: number;
  total: number;
}

interface ActionLimits {
  dailyListings: number;
  dailyMessages: number;
  dailyPayments: number;
  streamDuration: number;
  uploadSize: number;
}

interface ActionState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  balance: Balance | null;
  
  // Action tracking
  dailyActions: Record<string, number>;
  actionLimits: ActionLimits;
  
  // Loading states
  isLoading: Record<string, boolean>;
  
  // Permissions
  permissions: string[];
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (status: boolean) => void;
  setBalance: (balance: Balance) => void;
  fetchUserData: () => Promise<void>;
  incrementActionCount: (action: string) => void;
  setLoading: (action: string, status: boolean) => void;
  checkPermission: (permission: string) => boolean;
  canPerformAction: (action: string) => boolean;
  resetDailyActions: () => void;
}

const defaultLimits: ActionLimits = {
  dailyListings: 10,
  dailyMessages: 100,
  dailyPayments: 20,
  streamDuration: 3600, // 1 hour in seconds
  uploadSize: 50 * 1024 * 1024 // 50MB
};

export const useActionStore = create<ActionState>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      balance: null,
      dailyActions: {},
      actionLimits: defaultLimits,
      isLoading: {},
      permissions: [],

      // Actions
      setUser: (user) => set({ user }),
      
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      
      setBalance: (balance) => set({ balance }),
      
      fetchUserData: async () => {
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (!authUser) {
            set({ user: null, isAuthenticated: false, balance: null });
            return;
          }

          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          // Fetch user balance
          const { data: userBalance } = await supabase
            .from('user_balances')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          if (profile) {
            const user: User = {
              id: authUser.id,
              email: profile.email,
              name: profile.name || 'User',
              role: profile.role as 'user' | 'admin' | 'moderator',
              country: profile.country || '',
              isVerified: profile.is_verified
            };

            set({ 
              user, 
              isAuthenticated: true,
              balance: userBalance ? {
                available: parseFloat(String(userBalance.available_balance || 0)),
                pending: parseFloat(String(userBalance.pending_balance || 0)),
                total: parseFloat(String(userBalance.total_balance || 0))
              } : null
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          set({ user: null, isAuthenticated: false, balance: null });
        }
      },
      
      incrementActionCount: (action) => set((state) => ({
        dailyActions: {
          ...state.dailyActions,
          [action]: (state.dailyActions[action] || 0) + 1
        }
      })),
      
      setLoading: (action, status) => set((state) => ({
        isLoading: {
          ...state.isLoading,
          [action]: status
        }
      })),
      
      checkPermission: (permission) => {
        const { permissions, user } = get();
        return permissions.includes(permission) || user?.role === 'admin';
      },
      
      canPerformAction: (action) => {
        const { dailyActions, actionLimits, user, balance } = get();
        const actionCount = dailyActions[action] || 0;
        
        switch (action) {
          case 'create_listing':
            return actionCount < actionLimits.dailyListings;
          case 'send_message':
            return actionCount < actionLimits.dailyMessages;
          case 'make_payment':
            return actionCount < actionLimits.dailyPayments && user?.isVerified && (balance?.available || 0) > 0;
          case 'start_stream':
            return user?.isVerified && actionCount < 5; // Max 5 streams per day
          case 'withdraw_funds':
            return user?.isVerified && (balance?.available || 0) > 0;
          default:
            return true;
        }
      },
      
      resetDailyActions: () => set({ dailyActions: {} })
    }),
    { name: 'action-store' }
  )
);
