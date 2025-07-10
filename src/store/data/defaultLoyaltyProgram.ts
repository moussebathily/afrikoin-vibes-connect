import { LoyaltyProgram } from '@/types/monetization';

export const defaultLoyaltyProgram: LoyaltyProgram = {
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