import { useWithdrawalStore } from '@/store/withdrawalStore';
import { BankingInfo, MobileMoneyAccount, WithdrawalMethod } from '@/types/withdrawal';
import { useToast } from '@/hooks/use-toast';

export const usePaymentMethods = () => {
  const { toast } = useToast();
  
  const {
    bankingAccounts,
    mobileMoneyAccounts,
    paymentMethods,
    addBankingAccount,
    addMobileMoneyAccount,
    removeBankingAccount,
    removeMobileMoneyAccount,
    setDefaultBankingAccount,
    setDefaultMobileMoneyAccount
  } = useWithdrawalStore();

  const addBanking = async (account: Omit<BankingInfo, 'id' | 'createdAt'>) => {
    try {
      // Basic IBAN validation
      const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/;
      if (!ibanRegex.test(account.iban.replace(/\s/g, ''))) {
        throw new Error('Format IBAN invalide');
      }

      addBankingAccount(account);
      toast({
        title: 'Compte bancaire ajouté',
        description: 'Votre compte bancaire a été ajouté avec succès.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de l\'ajout';
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const addMobileMoney = async (account: Omit<MobileMoneyAccount, 'id' | 'createdAt'>) => {
    try {
      // Basic phone number validation
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(account.phoneNumber)) {
        throw new Error('Numéro de téléphone invalide (format: +221781234567)');
      }

      addMobileMoneyAccount(account);
      toast({
        title: 'Compte Mobile Money ajouté',
        description: 'Votre compte Mobile Money a été ajouté avec succès.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de l\'ajout';
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const removeBanking = (id: string) => {
    removeBankingAccount(id);
    toast({
      title: 'Compte supprimé',
      description: 'Le compte bancaire a été supprimé.',
    });
  };

  const removeMobileMoney = (id: string) => {
    removeMobileMoneyAccount(id);
    toast({
      title: 'Compte supprimé',
      description: 'Le compte Mobile Money a été supprimé.',
    });
  };

  const setDefaultBanking = (id: string) => {
    setDefaultBankingAccount(id);
    toast({
      title: 'Compte par défaut',
      description: 'Ce compte bancaire est maintenant votre compte par défaut.',
    });
  };

  const setDefaultMobileMoney = (id: string) => {
    setDefaultMobileMoneyAccount(id);
    toast({
      title: 'Compte par défaut',
      description: 'Ce compte Mobile Money est maintenant votre compte par défaut.',
    });
  };

  const getAllAccounts = () => {
    const banking = bankingAccounts.map(acc => ({
      ...acc,
      type: 'banking' as const,
      method: 'iban' as WithdrawalMethod
    }));
    
    const mobile = mobileMoneyAccounts.map(acc => ({
      ...acc,
      type: 'mobile' as const,
      method: acc.operator as WithdrawalMethod
    }));

    return [...banking, ...mobile];
  };

  const getDefaultAccount = (method?: WithdrawalMethod) => {
    if (method === 'iban') {
      return bankingAccounts.find(acc => acc.isDefault);
    }
    
    if (method && ['orange_money', 'wave', 'mtn_money', 'airtel_money', 'flooz'].includes(method)) {
      return mobileMoneyAccounts.find(acc => acc.operator === method && acc.isDefault);
    }

    // Return any default account
    return getAllAccounts().find(acc => acc.isDefault);
  };

  const getMethodInfo = (method: WithdrawalMethod) => {
    return paymentMethods.find(pm => pm.id === method);
  };

  return {
    bankingAccounts,
    mobileMoneyAccounts,
    paymentMethods,
    addBanking,
    addMobileMoney,
    removeBanking,
    removeMobileMoney,
    setDefaultBanking,
    setDefaultMobileMoney,
    getAllAccounts,
    getDefaultAccount,
    getMethodInfo
  };
};