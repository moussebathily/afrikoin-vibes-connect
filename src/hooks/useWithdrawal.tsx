import { useState } from 'react';
import { useWithdrawalStore } from '@/store/withdrawalStore';
import { WithdrawalMethod } from '@/types/withdrawal';
import { useToast } from '@/hooks/use-toast';

export const useWithdrawal = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const {
    balance,
    withdrawalHistory,
    preferences,
    createWithdrawalRequest,
    calculateFees,
    getPaymentMethodInfo,
    isLoading,
    error
  } = useWithdrawalStore();

  const processWithdrawal = async (
    amount: number,
    method: WithdrawalMethod,
    accountId: string
  ) => {
    try {
      setIsProcessing(true);
      
      // Validation
      if (amount <= 0) {
        throw new Error('Le montant doit être positif');
      }
      
      if (amount > balance.available) {
        throw new Error('Solde insuffisant');
      }

      const methodInfo = getPaymentMethodInfo(method);
      if (!methodInfo) {
        throw new Error('Méthode de paiement non valide');
      }

      if (amount < methodInfo.minAmount) {
        throw new Error(`Montant minimum: ${methodInfo.minAmount.toLocaleString()} FCFA`);
      }

      if (amount > methodInfo.maxAmount) {
        throw new Error(`Montant maximum: ${methodInfo.maxAmount.toLocaleString()} FCFA`);
      }

      // Create withdrawal request
      const requestId = await createWithdrawalRequest(amount, method, accountId);
      
      toast({
        title: 'Demande de retrait créée',
        description: `Votre demande de retrait de ${amount.toLocaleString()} FCFA a été créée avec succès.`,
      });

      return requestId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors du retrait';
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const getWithdrawalFees = (amount: number, method: WithdrawalMethod) => {
    return calculateFees(amount, method);
  };

  const canWithdraw = (amount: number) => {
    return amount > 0 && amount <= balance.available;
  };

  return {
    balance,
    withdrawalHistory,
    preferences,
    processWithdrawal,
    getWithdrawalFees,
    canWithdraw,
    isProcessing,
    isLoading,
    error
  };
};