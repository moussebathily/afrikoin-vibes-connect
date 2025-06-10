
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Language } from '@/types/language';

interface TransactionsTabProps {
  language: Language;
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({ language }) => {
  const text = {
    fr: {
      transactions: 'Transactions'
    },
    en: {
      transactions: 'Transactions'
    }
  };

  const currentText = text[language] || text.fr;

  const recentTransactions = [
    {
      id: 1,
      type: 'sale',
      item: 'Smartphone Samsung',
      amount: '+250,000 FCFA',
      date: '15 Nov 2024',
      status: 'completed'
    },
    {
      id: 2,
      type: 'purchase',
      item: 'Sac à main designer',
      amount: '-85,000 FCFA',
      date: '12 Nov 2024',
      status: 'completed'
    },
    {
      id: 3,
      type: 'sale',
      item: 'Ordinateur portable',
      amount: '+450,000 FCFA',
      date: '08 Nov 2024',
      status: 'pending'
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">{currentText.transactions}</h3>
      <div className="space-y-4">
        {recentTransactions.map(transaction => (
          <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                transaction.type === 'sale' ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              <div>
                <p className="font-medium">{transaction.item}</p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'sale' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.amount}
              </p>
              <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                {transaction.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TransactionsTab;
