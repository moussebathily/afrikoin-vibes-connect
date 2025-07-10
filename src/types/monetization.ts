export interface Commission {
  id: string;
  category: string;
  rate: number;
  minRate: number;
  maxRate: number;
  newSellerRate?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    listings: number;
    boosts: number;
    analytics: boolean;
    priority: boolean;
  };
  popular?: boolean;
  trialDays?: number;
  originalPrice?: number;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  providerId: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  rating: number;
  reviews: number;
  certified: boolean;
  images: string[];
  availability: string[];
  createdAt: string;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  category?: string;
  budget: number;
  spent: number;
  clicks: number;
  impressions: number;
  isActive: boolean;
  createdAt: string;
  endDate: string;
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  verified: boolean;
  followers: number;
  totalEarnings: number;
  contentCount: number;
  rating: number;
  specialties: string[];
}

export interface CreatorContent {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'image' | 'text' | 'nft';
  price: number;
  currency: string;
  creatorId: string;
  thumbnailUrl: string;
  contentUrl: string;
  downloads: number;
  rating: number;
  tags: string[];
  isPremium: boolean;
  createdAt: string;
}

export interface LoyaltyProgram {
  points: number;
  level: string;
  nextLevelPoints: number;
  rewards: Reward[];
  challenges: Challenge[];
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'bonus' | 'feature';
  value: number;
  available: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  progress: number;
  target: number;
  endDate: string;
  completed: boolean;
}

export interface RevenueMetrics {
  totalRevenue: number;
  commissions: number;
  subscriptions: number;
  services: number;
  advertising: number;
  creatorEconomy: number;
  financialServices: number;
  monthlyGrowth: number;
  activeUsers: number;
  conversionRate: number;
}