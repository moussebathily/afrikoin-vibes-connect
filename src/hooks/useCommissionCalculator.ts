import { Commission } from '@/types/monetization';

export const useCommissionCalculator = (commissions: Commission[]) => {
  const calculateCommission = (amount: number, category: string, isNewSeller = false) => {
    const commission = commissions.find(c => c.category === category && c.isActive);
    
    if (!commission) return amount * 0.05; // Default 5%
    
    const rate = isNewSeller && commission.newSellerRate 
      ? commission.newSellerRate 
      : commission.rate;
      
    return amount * rate;
  };

  return { calculateCommission };
};