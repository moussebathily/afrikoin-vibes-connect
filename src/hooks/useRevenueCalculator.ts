import { useMemo } from 'react';
import { useMonetizationStore } from '@/store/monetizationStore';
import { useWithdrawalStore } from '@/store/withdrawalStore';

export const useRevenueCalculator = () => {
  const { revenueMetrics, subscriptionPlans } = useMonetizationStore();
  const { balance } = useWithdrawalStore();

  const projections = useMemo(() => {
    const currentUsers = 1000; // Utilisateurs actuels
    const growthRate = 0.15; // 15% de croissance mensuelle
    const avgRevenuePerUser = 145; // 145 FCFA par utilisateur par mois

    const calculateProjection = (months: number) => {
      const projectedUsers = Math.round(currentUsers * Math.pow(1 + growthRate, months));
      const monthlyRevenue = projectedUsers * avgRevenuePerUser;
      return {
        users: projectedUsers,
        monthlyRevenue,
        yearlyRevenue: monthlyRevenue * 12
      };
    };

    return {
      month1: calculateProjection(1),
      month3: calculateProjection(3),
      month6: calculateProjection(6),
      month12: calculateProjection(12)
    };
  }, []);

  const revenueBreakdown = useMemo(() => {
    const commissions = revenueMetrics.commissions;
    const subscriptions = revenueMetrics.subscriptions;
    const services = revenueMetrics.services;
    const total = commissions + subscriptions + services;

    return {
      commissions: {
        amount: commissions,
        percentage: total > 0 ? (commissions / total) * 100 : 0,
        label: 'Commissions marketplace'
      },
      subscriptions: {
        amount: subscriptions,
        percentage: total > 0 ? (subscriptions / total) * 100 : 0,
        label: 'Abonnements premium'
      },
      services: {
        amount: services,
        percentage: total > 0 ? (services / total) * 100 : 0,
        label: 'Services additionnels'
      },
      total
    };
  }, [revenueMetrics]);

  const monthlyGrowth = useMemo(() => {
    const currentMonth = balance.thisMonth;
    const lastMonth = balance.lastMonth;
    
    if (lastMonth === 0) return 0;
    
    return ((currentMonth - lastMonth) / lastMonth) * 100;
  }, [balance]);

  const revenueStats = useMemo(() => {
    return {
      availableBalance: balance.available,
      pendingBalance: balance.pending,
      monthlyRevenue: balance.thisMonth,
      monthlyGrowth,
      yearlyProjection: balance.thisMonth * 12,
      avgDailyRevenue: balance.thisMonth / 30,
      revenuePerUser: balance.thisMonth / 1000 // Estimé sur 1000 utilisateurs
    };
  }, [balance, monthlyGrowth]);

  const optimizeWithdrawal = (amount: number) => {
    const methods = [
      { id: 'wave', fee: 1.5 },
      { id: 'orange_money', fee: 1.5 },
      { id: 'iban', fee: 2 },
      { id: 'mtn_money', fee: 2 },
      { id: 'airtel_money', fee: 2 },
      { id: 'flooz', fee: 2.5 }
    ];

    const optimized = methods.map(method => ({
      ...method,
      fees: Math.round(amount * (method.fee / 100)),
      netAmount: amount - Math.round(amount * (method.fee / 100))
    })).sort((a, b) => a.fees - b.fees);

    return {
      recommended: optimized[0],
      all: optimized
    };
  };

  const getRevenueInsights = () => {
    const insights = [];
    
    if (monthlyGrowth > 20) {
      insights.push({
        type: 'success',
        message: `Excellente croissance de ${monthlyGrowth.toFixed(1)}% ce mois !`,
        action: 'Considérez investir dans le marketing pour maintenir cette croissance.'
      });
    }
    
    if (balance.available > 100000) {
      insights.push({
        type: 'info',
        message: 'Vous avez un solde important disponible.',
        action: 'Pensez à effectuer un retrait ou à réinvestir dans votre business.'
      });
    }
    
    if (revenueBreakdown.commissions.percentage > 60) {
      insights.push({
        type: 'warning',
        message: 'Vos revenus dépendent fortement des commissions marketplace.',
        action: 'Diversifiez avec plus de services premium et d\'abonnements.'
      });
    }

    return insights;
  };

  return {
    projections,
    revenueBreakdown,
    revenueStats,
    optimizeWithdrawal,
    getRevenueInsights
  };
};