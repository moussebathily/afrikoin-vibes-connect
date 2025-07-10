import { Commission } from '@/types/monetization';

export const defaultCommissions: Commission[] = [
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