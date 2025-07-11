import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useActionStore } from '@/store/actionStore';
import { WithdrawalMethod } from '@/types/withdrawal';
import { useToast } from '@/hooks/use-toast';

export const useWithdrawal = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const { balance, fetchUserData } = useActionStore();

  const processWithdrawal = async (
    amount: number,
    method: WithdrawalMethod,
    paymentMethodId: string
  ) => {
    try {
      setIsProcessing(true);
      
      // Validation
      if (amount <= 0) {
        throw new Error('Le montant doit être positif');
      }
      
      if (!balance || amount > balance.available) {
        throw new Error('Solde insuffisant');
      }

      // Call secure edge function
      const { data, error } = await supabase.functions.invoke('process-withdrawal', {
        body: {
          amount,
          paymentMethodId
        }
      });

      if (error) {
        throw new Error(error.message || 'Erreur lors du traitement du retrait');
      }

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors du traitement du retrait');
      }
      
      // Refresh user data
      await fetchUserData();
      
      toast({
        title: 'Demande de retrait créée',
        description: `Votre demande de retrait de ${amount.toLocaleString()} FCFA a été créée avec succès.`,
      });

      return data.withdrawalId;
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
    // Calculate fees based on method type
    let feeRate = 0.015; // Default 1.5%
    
    if (method === 'iban') {
      feeRate = 0.02; // 2% for bank transfers
    } else if (method === 'mtn_money' || method === 'airtel_money') {
      feeRate = 0.02; // 2% for MTN and Airtel
    } else if (method === 'flooz') {
      feeRate = 0.025; // 2.5% for Flooz
    }
    
    const fees = amount * feeRate;
    const netAmount = amount - fees;
    
    return { fees, netAmount };
  };

  const canWithdraw = (amount: number) => {
    return amount > 0 && balance && amount <= balance.available;
  };

  const getPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Erreur lors de la récupération des méthodes de paiement');
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  };

  const getWithdrawalHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select(`
          *,
          payment_methods (
            method_type,
            provider,
            account_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('Erreur lors de la récupération de l\'historique');
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching withdrawal history:', error);
      return [];
    }
  };

  return {
    balance,
    processWithdrawal,
    getWithdrawalFees,
    canWithdraw,
    getPaymentMethods,
    getWithdrawalHistory,
    isProcessing
  };
};