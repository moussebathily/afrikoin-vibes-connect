export type WithdrawalMethod = 
  | 'iban'
  | 'orange_money'
  | 'wave'
  | 'mtn_money'
  | 'airtel_money'
  | 'flooz';

export interface BankingInfo {
  id: string;
  iban: string;
  bankName: string;
  accountHolder: string;
  isDefault: boolean;
  createdAt: string;
}

export interface MobileMoneyAccount {
  id: string;
  operator: 'orange_money' | 'wave' | 'mtn_money' | 'airtel_money' | 'flooz';
  phoneNumber: string;
  accountHolder: string;
  isDefault: boolean;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  method: WithdrawalMethod;
  accountId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  requestedAt: string;
  processedAt?: string;
  reference?: string;
  fees: number;
  netAmount: number;
}

export interface WithdrawalPreferences {
  isAutomatic: boolean;
  threshold: number;
  frequency: 'weekly' | 'monthly';
  preferredMethod: WithdrawalMethod;
  preferredAccountId?: string;
  notifyByEmail: boolean;
  notifyBySms: boolean;
}

export interface RevenueBalance {
  available: number;
  pending: number;
  thisMonth: number;
  lastMonth: number;
  totalLifetime: number;
  currency: string;
}

export interface WithdrawalFees {
  iban: number; // 2%
  orange_money: number; // 1.5%
  wave: number; // 1.5%
  mtn_money: number; // 2%
  airtel_money: number; // 2%
  flooz: number; // 2.5%
}

export interface PaymentMethodInfo {
  id: WithdrawalMethod;
  name: string;
  icon: string;
  feePercentage: number;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
  countries: string[];
}