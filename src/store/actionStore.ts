
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  country: string;
  isVerified: boolean;
  credits: number;
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
      dailyActions: {},
      actionLimits: defaultLimits,
      isLoading: {},
      permissions: [],

      // Actions
      setUser: (user) => set({ user }),
      
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      
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
        const { dailyActions, actionLimits, user } = get();
        const actionCount = dailyActions[action] || 0;
        
        switch (action) {
          case 'create_listing':
            return actionCount < actionLimits.dailyListings;
          case 'send_message':
            return actionCount < actionLimits.dailyMessages;
          case 'make_payment':
            return actionCount < actionLimits.dailyPayments && user?.isVerified;
          case 'start_stream':
            return user?.isVerified && actionCount < 5; // Max 5 streams per day
          default:
            return true;
        }
      },
      
      resetDailyActions: () => set({ dailyActions: {} })
    }),
    { name: 'action-store' }
  )
);
