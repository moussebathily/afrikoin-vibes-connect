import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  Commission, 
  SubscriptionPlan, 
  Service, 
  Advertisement, 
  Creator, 
  CreatorContent, 
  LoyaltyProgram, 
  RevenueMetrics 
} from '@/types/monetization';
import { defaultCommissions } from './data/defaultCommissions';
import { defaultSubscriptionPlans } from './data/defaultSubscriptionPlans';
import { defaultLoyaltyProgram } from './data/defaultLoyaltyProgram';
import { defaultRevenueMetrics } from './data/defaultRevenueMetrics';
import { useCommissionCalculator } from '@/hooks/useCommissionCalculator';
import { useLoyaltyProgram } from '@/hooks/useLoyaltyProgram';

interface MonetizationState {
  // Commissions
  commissions: Commission[];
  
  // Subscriptions
  subscriptionPlans: SubscriptionPlan[];
  userSubscription: SubscriptionPlan | null;
  
  // Services
  services: Service[];
  
  // Advertising
  advertisements: Advertisement[];
  
  // Creator Economy
  creators: Creator[];
  creatorContent: CreatorContent[];
  
  // Loyalty Program
  loyaltyProgram: LoyaltyProgram;
  
  // Revenue Metrics
  revenueMetrics: RevenueMetrics;
  
  // Loading states
  isLoading: Record<string, boolean>;
  
  // Actions
  setCommissions: (commissions: Commission[]) => void;
  calculateCommission: (amount: number, category: string, isNewSeller?: boolean) => number;
  setSubscriptionPlans: (plans: SubscriptionPlan[]) => void;
  setUserSubscription: (subscription: SubscriptionPlan | null) => void;
  addService: (service: Service) => void;
  setServices: (services: Service[]) => void;
  addAdvertisement: (ad: Advertisement) => void;
  setCreators: (creators: Creator[]) => void;
  setCreatorContent: (content: CreatorContent[]) => void;
  updateLoyaltyProgram: (program: LoyaltyProgram) => void;
  addLoyaltyPoints: (points: number) => void;
  setRevenueMetrics: (metrics: RevenueMetrics) => void;
  setLoading: (key: string, loading: boolean) => void;
}

export const useMonetizationStore = create<MonetizationState>()(
  devtools(
    (set, get) => ({
      // Initial state
      commissions: defaultCommissions,
      subscriptionPlans: defaultSubscriptionPlans,
      userSubscription: defaultSubscriptionPlans[0], // Default to basic plan
      services: [],
      advertisements: [],
      creators: [],
      creatorContent: [],
      loyaltyProgram: defaultLoyaltyProgram,
      revenueMetrics: defaultRevenueMetrics,
      isLoading: {},

      // Actions
      setCommissions: (commissions) => set({ commissions }),
      
      calculateCommission: (amount, category, isNewSeller = false) => {
        const { commissions } = get();
        const { calculateCommission } = useCommissionCalculator(commissions);
        return calculateCommission(amount, category, isNewSeller);
      },
      
      setSubscriptionPlans: (plans) => set({ subscriptionPlans: plans }),
      
      setUserSubscription: (subscription) => set({ userSubscription: subscription }),
      
      addService: (service) => set((state) => ({
        services: [...state.services, service]
      })),
      
      setServices: (services) => set({ services }),
      
      addAdvertisement: (ad) => set((state) => ({
        advertisements: [...state.advertisements, ad]
      })),
      
      setCreators: (creators) => set({ creators }),
      
      setCreatorContent: (content) => set({ creatorContent: content }),
      
      updateLoyaltyProgram: (program) => set({ loyaltyProgram: program }),
      
      addLoyaltyPoints: (points) => set((state) => {
        const { addLoyaltyPoints } = useLoyaltyProgram();
        const updatedProgram = addLoyaltyPoints(state.loyaltyProgram, points);
        return { loyaltyProgram: updatedProgram };
      }),
      
      setRevenueMetrics: (metrics) => set({ revenueMetrics: metrics }),
      
      setLoading: (key, loading) => set((state) => ({
        isLoading: { ...state.isLoading, [key]: loading }
      }))
    }),
    { name: 'monetization-store' }
  )
);