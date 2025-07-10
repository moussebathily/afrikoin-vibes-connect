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

const defaultSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basique',
    price: 0,
    currency: 'FCFA',
    interval: 'month',
    features: [
      '10 annonces par mois',
      'Support communautaire',
      'Accès aux fonctionnalités de base'
    ],
    limits: {
      listings: 10,
      boosts: 0,
      analytics: false,
      priority: false
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 5000,
    currency: 'FCFA',
    interval: 'month',
    features: [
      'Annonces illimitées',
      '5 boosts par mois',
      'Analytics basiques',
      'Support prioritaire'
    ],
    limits: {
      listings: -1,
      boosts: 5,
      analytics: true,
      priority: true
    },
    popular: true
  },
  {
    id: 'business',
    name: 'Business',
    price: 15000,
    currency: 'FCFA',
    interval: 'month',
    features: [
      'Tout Premium inclus',
      'Boosts illimités',
      'Analytics avancés',
      'Support dédié',
      'API access'
    ],
    limits: {
      listings: -1,
      boosts: -1,
      analytics: true,
      priority: true
    }
  }
];

const defaultCommissions: Commission[] = [
  {
    id: '1',
    category: 'electronics',
    rate: 0.05,
    minRate: 0.03,
    maxRate: 0.08,
    newSellerRate: 0.02,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    category: 'fashion',
    rate: 0.08,
    minRate: 0.05,
    maxRate: 0.12,
    newSellerRate: 0.05,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    category: 'home',
    rate: 0.06,
    minRate: 0.04,
    maxRate: 0.10,
    newSellerRate: 0.03,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultLoyaltyProgram: LoyaltyProgram = {
  points: 0,
  level: 'Bronze',
  nextLevelPoints: 500,
  rewards: [
    {
      id: '1',
      title: 'Réduction 10%',
      description: 'Réduction de 10% sur votre prochaine commission',
      pointsCost: 100,
      type: 'discount',
      value: 0.1,
      available: true
    },
    {
      id: '2',
      title: 'Boost gratuit',
      description: 'Un boost gratuit pour votre annonce',
      pointsCost: 250,
      type: 'feature',
      value: 1,
      available: true
    }
  ],
  challenges: [
    {
      id: '1',
      title: 'Première vente',
      description: 'Effectuez votre première vente ce mois',
      pointsReward: 50,
      progress: 0,
      target: 1,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false
    }
  ]
};

const defaultRevenueMetrics: RevenueMetrics = {
  totalRevenue: 0,
  commissions: 0,
  subscriptions: 0,
  services: 0,
  advertising: 0,
  creatorEconomy: 0,
  financialServices: 0,
  monthlyGrowth: 0,
  activeUsers: 0,
  conversionRate: 0
};

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
        const commission = commissions.find(c => c.category === category && c.isActive);
        
        if (!commission) return amount * 0.05; // Default 5%
        
        const rate = isNewSeller && commission.newSellerRate 
          ? commission.newSellerRate 
          : commission.rate;
          
        return amount * rate;
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
        const newPoints = state.loyaltyProgram.points + points;
        let newLevel = state.loyaltyProgram.level;
        let nextLevelPoints = state.loyaltyProgram.nextLevelPoints;
        
        // Level progression logic
        if (newPoints >= 500 && newLevel === 'Bronze') {
          newLevel = 'Silver';
          nextLevelPoints = 1500;
        } else if (newPoints >= 1500 && newLevel === 'Silver') {
          newLevel = 'Gold';
          nextLevelPoints = 5000;
        } else if (newPoints >= 5000 && newLevel === 'Gold') {
          newLevel = 'Platinum';
          nextLevelPoints = 10000;
        }
        
        return {
          loyaltyProgram: {
            ...state.loyaltyProgram,
            points: newPoints,
            level: newLevel,
            nextLevelPoints
          }
        };
      }),
      
      setRevenueMetrics: (metrics) => set({ revenueMetrics: metrics }),
      
      setLoading: (key, loading) => set((state) => ({
        isLoading: { ...state.isLoading, [key]: loading }
      }))
    }),
    { name: 'monetization-store' }
  )
);