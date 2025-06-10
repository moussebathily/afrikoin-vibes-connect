
import React from 'react';
import { Card } from '@/components/ui/card';
import { Wallet, Star, Award } from 'lucide-react';
import { Language } from '@/types/language';

interface ProfileStatsProps {
  language: Language;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ language }) => {
  const text = {
    fr: {
      balance: 'Solde',
      rating: 'Évaluation',
      completedSales: 'Ventes réalisées'
    },
    en: {
      balance: 'Balance',
      rating: 'Rating',
      completedSales: 'Completed Sales'
    }
  };

  const currentText = text[language] || text.fr;

  const userStats = {
    balance: '2,450,000 FCFA',
    rating: 4.9,
    completedSales: 127
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6 text-center">
        <Wallet className="w-8 h-8 text-primary mx-auto mb-2" />
        <h3 className="font-semibold text-lg">{currentText.balance}</h3>
        <p className="text-2xl font-bold text-primary">{userStats.balance}</p>
      </Card>
      <Card className="p-6 text-center">
        <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
        <h3 className="font-semibold text-lg">{currentText.rating}</h3>
        <p className="text-2xl font-bold">{userStats.rating}/5</p>
      </Card>
      <Card className="p-6 text-center">
        <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <h3 className="font-semibold text-lg">{currentText.completedSales}</h3>
        <p className="text-2xl font-bold">{userStats.completedSales}</p>
      </Card>
    </div>
  );
};

export default ProfileStats;
