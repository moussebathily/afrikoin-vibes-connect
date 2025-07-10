import { SubscriptionPlan } from '@/types/monetization';

export const defaultSubscriptionPlans: SubscriptionPlan[] = [
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
    trialDays: 30,
    originalPrice: 5000,
    priceRange: { min: 1000, max: 5000 },
    features: [
      '🎁 1 mois d\'essai gratuit',
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
    trialDays: 30,
    originalPrice: 15000,
    priceRange: { min: 7500, max: 15000 },
    features: [
      '🎁 1 mois d\'essai gratuit',
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