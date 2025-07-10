import { create } from 'zustand';
import { 
  BankingInfo, 
  MobileMoneyAccount, 
  WithdrawalRequest, 
  WithdrawalPreferences, 
  RevenueBalance,
  WithdrawalMethod,
  WithdrawalFees,
  PaymentMethodInfo
} from '@/types/withdrawal';

interface WithdrawalStore {
  // State
  balance: RevenueBalance;
  bankingAccounts: BankingInfo[];
  mobileMoneyAccounts: MobileMoneyAccount[];
  withdrawalHistory: WithdrawalRequest[];
  preferences: WithdrawalPreferences;
  isLoading: boolean;
  error: string | null;

  // Payment Methods Config
  paymentMethods: PaymentMethodInfo[];
  fees: WithdrawalFees;

  // Actions
  setBalance: (balance: RevenueBalance) => void;
  addBankingAccount: (account: Omit<BankingInfo, 'id' | 'createdAt'>) => void;
  addMobileMoneyAccount: (account: Omit<MobileMoneyAccount, 'id' | 'createdAt'>) => void;
  removeBankingAccount: (id: string) => void;
  removeMobileMoneyAccount: (id: string) => void;
  setDefaultBankingAccount: (id: string) => void;
  setDefaultMobileMoneyAccount: (id: string) => void;
  createWithdrawalRequest: (amount: number, method: WithdrawalMethod, accountId: string) => Promise<string>;
  updateWithdrawalStatus: (id: string, status: WithdrawalRequest['status']) => void;
  updatePreferences: (preferences: Partial<WithdrawalPreferences>) => void;
  calculateFees: (amount: number, method: WithdrawalMethod) => { fees: number; netAmount: number };
  getPaymentMethodInfo: (method: WithdrawalMethod) => PaymentMethodInfo | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialBalance: RevenueBalance = {
  available: 75000, // 75,000 FCFA disponible
  pending: 25000,   // 25,000 FCFA en attente
  thisMonth: 145000, // Revenus de ce mois
  lastMonth: 98000,  // Revenus du mois dernier
  totalLifetime: 1250000, // Total cumulé
  currency: 'XOF'
};

const initialPreferences: WithdrawalPreferences = {
  isAutomatic: false,
  threshold: 50000, // 50,000 FCFA
  frequency: 'weekly',
  preferredMethod: 'orange_money',
  notifyByEmail: true,
  notifyBySms: false
};

const paymentMethodsConfig: PaymentMethodInfo[] = [
  {
    id: 'iban',
    name: 'Virement Bancaire (IBAN)',
    icon: '🏦',
    feePercentage: 2,
    minAmount: 10000,
    maxAmount: 5000000,
    processingTime: '2-3 jours ouvrés',
    countries: ['Tous pays SEPA']
  },
  {
    id: 'orange_money',
    name: 'Orange Money',
    icon: '🧡',
    feePercentage: 1.5,
    minAmount: 1000,
    maxAmount: 2000000,
    processingTime: 'Instantané',
    countries: ['Sénégal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso']
  },
  {
    id: 'wave',
    name: 'Wave',
    icon: '🌊',
    feePercentage: 1.5,
    minAmount: 1000,
    maxAmount: 1500000,
    processingTime: 'Instantané',
    countries: ['Sénégal', 'Côte d\'Ivoire']
  },
  {
    id: 'mtn_money',
    name: 'MTN Mobile Money',
    icon: '💛',
    feePercentage: 2,
    minAmount: 1000,
    maxAmount: 2000000,
    processingTime: 'Instantané',
    countries: ['Ghana', 'Uganda', 'Cameroun']
  },
  {
    id: 'airtel_money',
    name: 'Airtel Money',
    icon: '❤️',
    feePercentage: 2,
    minAmount: 1000,
    maxAmount: 1000000,
    processingTime: 'Instantané',
    countries: ['Kenya', 'Tanzania', 'Rwanda']
  },
  {
    id: 'flooz',
    name: 'Flooz',
    icon: '💚',
    feePercentage: 2.5,
    minAmount: 1000,
    maxAmount: 1000000,
    processingTime: 'Instantané',
    countries: ['Bénin', 'Togo']
  }
];

const feesConfig: WithdrawalFees = {
  iban: 2,
  orange_money: 1.5,
  wave: 1.5,
  mtn_money: 2,
  airtel_money: 2,
  flooz: 2.5
};

export const useWithdrawalStore = create<WithdrawalStore>((set, get) => ({
  // Initial State
  balance: initialBalance,
  bankingAccounts: [],
  mobileMoneyAccounts: [
    {
      id: '1',
      operator: 'orange_money',
      phoneNumber: '+221781234567',
      accountHolder: 'Utilisateur Test',
      isDefault: true,
      createdAt: new Date().toISOString()
    }
  ],
  withdrawalHistory: [
    {
      id: '1',
      amount: 50000,
      method: 'orange_money',
      accountId: '1',
      status: 'completed',
      requestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
      reference: 'AF-OM-001234',
      fees: 750,
      netAmount: 49250
    }
  ],
  preferences: initialPreferences,
  isLoading: false,
  error: null,
  paymentMethods: paymentMethodsConfig,
  fees: feesConfig,

  // Actions
  setBalance: (balance) => set({ balance }),
  
  addBankingAccount: (account) => set((state) => ({
    bankingAccounts: [
      ...state.bankingAccounts,
      {
        ...account,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      }
    ]
  })),

  addMobileMoneyAccount: (account) => set((state) => ({
    mobileMoneyAccounts: [
      ...state.mobileMoneyAccounts,
      {
        ...account,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      }
    ]
  })),

  removeBankingAccount: (id) => set((state) => ({
    bankingAccounts: state.bankingAccounts.filter(acc => acc.id !== id)
  })),

  removeMobileMoneyAccount: (id) => set((state) => ({
    mobileMoneyAccounts: state.mobileMoneyAccounts.filter(acc => acc.id !== id)
  })),

  setDefaultBankingAccount: (id) => set((state) => ({
    bankingAccounts: state.bankingAccounts.map(acc => ({
      ...acc,
      isDefault: acc.id === id
    }))
  })),

  setDefaultMobileMoneyAccount: (id) => set((state) => ({
    mobileMoneyAccounts: state.mobileMoneyAccounts.map(acc => ({
      ...acc,
      isDefault: acc.id === id
    }))
  })),

  createWithdrawalRequest: async (amount, method, accountId) => {
    const { calculateFees } = get();
    const { fees, netAmount } = calculateFees(amount, method);
    
    const newRequest: WithdrawalRequest = {
      id: crypto.randomUUID(),
      amount,
      method,
      accountId,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      fees,
      netAmount
    };

    set((state) => ({
      withdrawalHistory: [newRequest, ...state.withdrawalHistory],
      balance: {
        ...state.balance,
        available: state.balance.available - amount,
        pending: state.balance.pending + amount
      }
    }));

    // Simulate processing
    setTimeout(() => {
      get().updateWithdrawalStatus(newRequest.id, 'processing');
      setTimeout(() => {
        get().updateWithdrawalStatus(newRequest.id, 'completed');
      }, 3000);
    }, 1000);

    return newRequest.id;
  },

  updateWithdrawalStatus: (id, status) => set((state) => ({
    withdrawalHistory: state.withdrawalHistory.map(req => {
      if (req.id === id) {
        const updatedReq = { 
          ...req, 
          status,
          processedAt: status === 'completed' ? new Date().toISOString() : req.processedAt
        };
        
        // Update balance when completed
        if (status === 'completed') {
          const newBalance = {
            ...state.balance,
            pending: state.balance.pending - req.amount
          };
          setTimeout(() => set({ balance: newBalance }), 0);
        }
        
        return updatedReq;
      }
      return req;
    })
  })),

  updatePreferences: (preferences) => set((state) => ({
    preferences: { ...state.preferences, ...preferences }
  })),

  calculateFees: (amount, method) => {
    const feePercentage = get().fees[method];
    const fees = Math.round(amount * (feePercentage / 100));
    const netAmount = amount - fees;
    return { fees, netAmount };
  },

  getPaymentMethodInfo: (method) => {
    return get().paymentMethods.find(pm => pm.id === method);
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}));