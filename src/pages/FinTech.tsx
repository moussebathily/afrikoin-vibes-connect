
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  Send, 
  TrendingUp, 
  Coins, 
  Shield, 
  CreditCard,
  Globe,
  PiggyBank,
  Building,
  Smartphone
} from 'lucide-react';
import { Language } from '@/types/language';

interface FinTechProps {
  language: Language;
}

const FinTech: React.FC<FinTechProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState('wallet');

  const text = {
    fr: {
      title: 'Services Financiers AfriKoin',
      subtitle: 'Votre banque numérique panafricaine',
      wallet: 'Portefeuille',
      transfer: 'Virements',
      investment: 'Investissements',
      crypto: 'Cryptomonnaies',
      insurance: 'Assurance',
      loans: 'Microcrédits',
      balance: 'Solde disponible',
      sendMoney: 'Envoyer de l\'argent',
      receiveMoney: 'Recevoir',
      payBills: 'Payer factures',
      topUp: 'Recharger',
      quickActions: 'Actions rapides',
      recentTransactions: 'Transactions récentes',
      investmentOpportunities: 'Opportunités d\'investissement',
      cryptoPortfolio: 'Portefeuille Crypto',
      totalValue: 'Valeur totale'
    },
    en: {
      title: 'AfriKoin Financial Services',
      subtitle: 'Your Pan-African digital bank',
      wallet: 'Wallet',
      transfer: 'Transfers',
      investment: 'Investments',
      crypto: 'Cryptocurrencies',
      insurance: 'Insurance',
      loans: 'Microloans',
      balance: 'Available balance',
      sendMoney: 'Send money',
      receiveMoney: 'Receive',
      payBills: 'Pay bills',
      topUp: 'Top up',
      quickActions: 'Quick actions',
      recentTransactions: 'Recent transactions',
      investmentOpportunities: 'Investment opportunities',
      cryptoPortfolio: 'Crypto Portfolio',
      totalValue: 'Total value'
    }
  };

  const currentText = text[language] || text.fr;

  const walletData = {
    balance: '2,450,000 FCFA',
    usdBalance: '$4,080',
    euroBalance: '€3,720',
    cryptoBalance: '0.15 BTC'
  };

  const transactions = [
    {
      id: 1,
      type: 'received',
      from: 'Koffi Mensah',
      amount: '+150,000 FCFA',
      date: '15 Nov 2024',
      status: 'completed'
    },
    {
      id: 2,
      type: 'sent',
      to: 'Fatou Diallo',
      amount: '-75,000 FCFA',
      date: '14 Nov 2024',
      status: 'completed'
    },
    {
      id: 3,
      type: 'bill',
      service: 'Orange Money',
      amount: '-25,000 FCFA',
      date: '13 Nov 2024',
      status: 'pending'
    }
  ];

  const investments = [
    {
      id: 1,
      name: 'Fonds Agricole Ouest-Africain',
      return: '+12.5%',
      amount: '500,000 FCFA',
      risk: 'Modéré',
      duration: '12 mois'
    },
    {
      id: 2,
      name: 'Immobilier Dakar Premium',
      return: '+18.2%',
      amount: '1,200,000 FCFA',
      risk: 'Élevé',
      duration: '24 mois'
    },
    {
      id: 3,
      name: 'Obligations d\'État Ivoiriennes',
      return: '+7.8%',
      amount: '800,000 FCFA',
      risk: 'Faible',
      duration: '36 mois'
    }
  ];

  const cryptoAssets = [
    {
      symbol: 'AFKN',
      name: 'AfriKoin Token',
      amount: '1,250 AFKN',
      value: '125,000 FCFA',
      change: '+15.2%'
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: '0.15 BTC',
      value: '450,000 FCFA',
      change: '+3.8%'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: '2.3 ETH',
      value: '280,000 FCFA',
      change: '-1.2%'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{currentText.title}</h1>
          <p className="text-lg opacity-90">{currentText.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5">
            <Wallet className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-muted-foreground">{currentText.balance}</h3>
            <p className="text-2xl font-bold">{walletData.balance}</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-green-500/10 to-green-500/5">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-muted-foreground">USD</h3>
            <p className="text-2xl font-bold">{walletData.usdBalance}</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <Globe className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-muted-foreground">EUR</h3>
            <p className="text-2xl font-bold">{walletData.euroBalance}</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-orange-500/10 to-orange-500/5">
            <Coins className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-muted-foreground">Crypto</h3>
            <p className="text-2xl font-bold">{walletData.cryptoBalance}</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{currentText.quickActions}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="flex flex-col items-center gap-2 h-20">
              <Send className="w-6 h-6" />
              {currentText.sendMoney}
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
              <Wallet className="w-6 h-6" />
              {currentText.receiveMoney}
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
              <CreditCard className="w-6 h-6" />
              {currentText.payBills}
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
              <Smartphone className="w-6 h-6" />
              {currentText.topUp}
            </Button>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="wallet">{currentText.wallet}</TabsTrigger>
            <TabsTrigger value="transfer">{currentText.transfer}</TabsTrigger>
            <TabsTrigger value="investment">{currentText.investment}</TabsTrigger>
            <TabsTrigger value="crypto">{currentText.crypto}</TabsTrigger>
            <TabsTrigger value="insurance">{currentText.insurance}</TabsTrigger>
            <TabsTrigger value="loans">{currentText.loans}</TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">{currentText.recentTransactions}</h3>
              <div className="space-y-4">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.type === 'received' ? 'bg-green-500' : 
                        transaction.type === 'sent' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className="font-medium">
                          {transaction.from || transaction.to || transaction.service}
                        </p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'received' ? 'text-green-600' : 'text-red-600'
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
          </TabsContent>

          <TabsContent value="investment" className="mt-6">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">{currentText.investmentOpportunities}</h3>
                <div className="grid gap-4">
                  {investments.map(investment => (
                    <div key={investment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{investment.name}</h4>
                        <Badge className="bg-green-500">{investment.return}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Montant:</span>
                          <p className="font-medium">{investment.amount}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Risque:</span>
                          <p className="font-medium">{investment.risk}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Durée:</span>
                          <p className="font-medium">{investment.duration}</p>
                        </div>
                      </div>
                      <Button className="w-full mt-4">Investir maintenant</Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">{currentText.cryptoPortfolio}</h3>
              <div className="space-y-4">
                {cryptoAssets.map(asset => (
                  <div key={asset.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Coins className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">{asset.amount}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{asset.value}</p>
                      <Badge className={asset.change.startsWith('+') ? 'bg-green-500' : 'bg-red-500'}>
                        {asset.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="insurance" className="mt-6">
            <Card className="p-6">
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Services d'assurance</h3>
                <p className="text-muted-foreground mb-6">
                  Protégez vos biens et vos proches avec nos solutions d'assurance adaptées à l'Afrique
                </p>
                <Button>Explorer les assurances</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="loans" className="mt-6">
            <Card className="p-6">
              <div className="text-center py-12">
                <PiggyBank className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Microcrédits</h3>
                <p className="text-muted-foreground mb-6">
                  Accédez rapidement à des microcrédits pour développer votre activité
                </p>
                <Button>Demander un crédit</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FinTech;
