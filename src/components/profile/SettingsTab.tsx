
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Language } from '@/types/language';
import { useWithdrawal } from '@/hooks/useWithdrawal';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useRevenueCalculator } from '@/hooks/useRevenueCalculator';
import { useWithdrawalStore } from '@/store/withdrawalStore';
import { 
  Wallet, 
  TrendingUp, 
  Download, 
  Settings, 
  CreditCard, 
  Smartphone, 
  Building2,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';

interface SettingsTabProps {
  language: Language;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ language }) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newAccountType, setNewAccountType] = useState('');

  const { balance, processWithdrawal, getWithdrawalFees, canWithdraw, isProcessing, withdrawalHistory } = useWithdrawal();
  const { paymentMethods, getAllAccounts, addBanking, addMobileMoney } = usePaymentMethods();
  const { revenueStats, revenueBreakdown, optimizeWithdrawal, getRevenueInsights } = useRevenueCalculator();
  const { preferences, updatePreferences } = useWithdrawalStore();

  const text = {
    fr: {
      settings: 'Gestion des Revenus AfriKoin',
      balance: 'Solde et Revenus',
      available: 'Disponible',
      pending: 'En attente',
      thisMonth: 'Ce mois',
      withdraw: 'Retirer',
      paymentMethods: 'Méthodes de Paiement',
      withdrawalPrefs: 'Préférences de Retrait',
      history: 'Historique'
    },
    en: {
      settings: 'AfriKoin Revenue Management',
      balance: 'Balance and Revenue',
      available: 'Available',
      pending: 'Pending',
      thisMonth: 'This Month',
      withdraw: 'Withdraw',
      paymentMethods: 'Payment Methods',
      withdrawalPrefs: 'Withdrawal Preferences',
      history: 'History'
    }
  };

  const currentText = text[language] || text.fr;
  const allAccounts = getAllAccounts();
  const insights = getRevenueInsights();

  const handleWithdrawal = async () => {
    if (!selectedMethod || !selectedAccount || !withdrawalAmount) return;
    
    try {
      await processWithdrawal(
        parseInt(withdrawalAmount),
        selectedMethod as any,
        selectedAccount
      );
      setWithdrawalAmount('');
      setSelectedMethod('');
      setSelectedAccount('');
    } catch (error) {
      // Error handled by hook
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec titre et insights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            {currentText.settings}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="grid gap-2">
            {insights.map((insight, index) => (
              <Card key={index} className={`border-l-4 ${
                insight.type === 'success' ? 'border-l-green-500' :
                insight.type === 'warning' ? 'border-l-yellow-500' :
                'border-l-blue-500'
              }`}>
                <CardContent className="p-4">
                  <p className="text-sm font-medium">{insight.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{insight.action}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Tabs defaultValue="balance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="balance">{currentText.balance}</TabsTrigger>
          <TabsTrigger value="methods">{currentText.paymentMethods}</TabsTrigger>
          <TabsTrigger value="preferences">{currentText.withdrawalPrefs}</TabsTrigger>
          <TabsTrigger value="history">{currentText.history}</TabsTrigger>
        </TabsList>

        {/* Onglet Solde et Revenus */}
        <TabsContent value="balance" className="space-y-6">
          {/* Cartes de solde */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {currentText.available}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {showBalance ? formatCurrency(balance.available) : '••••••'}
                </div>
                <Progress value={75} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {currentText.pending}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {showBalance ? formatCurrency(balance.pending) : '••••••'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  En cours de traitement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {currentText.thisMonth}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {showBalance ? formatCurrency(balance.thisMonth) : '••••••'}
                </div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+48%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Retrait rapide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Retrait Rapide
              </CardTitle>
              <CardDescription>
                Retirez vos revenus vers votre méthode de paiement préférée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="amount">Montant (FCFA)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="50000"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="method">Méthode</Label>
                  <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.icon} {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="account">Compte</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allAccounts
                        .filter(acc => acc.method === selectedMethod)
                        .map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.type === 'banking' ? 
                              `****${account.iban?.slice(-4)}` : 
                              `****${account.phoneNumber?.slice(-4)}`
                            }
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {withdrawalAmount && selectedMethod && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Montant demandé:</span>
                    <span>{formatCurrency(parseInt(withdrawalAmount))}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Frais ({paymentMethods.find(m => m.id === selectedMethod)?.feePercentage}%):</span>
                    <span>-{formatCurrency(getWithdrawalFees(parseInt(withdrawalAmount), selectedMethod as any).fees)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2 mt-2">
                    <span>Montant net:</span>
                    <span className="text-green-600">
                      {formatCurrency(getWithdrawalFees(parseInt(withdrawalAmount), selectedMethod as any).netAmount)}
                    </span>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleWithdrawal}
                disabled={!canWithdraw(parseInt(withdrawalAmount)) || !selectedMethod || !selectedAccount || isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Traitement...' : 'Retirer maintenant'}
              </Button>
            </CardContent>
          </Card>

          {/* Répartition des revenus */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(revenueBreakdown)
                  .filter(([key]) => key !== 'total')
                  .map(([key, data]) => {
                    // Type guard to ensure data has the expected structure
                    if (typeof data === 'object' && data && 'label' in data && 'amount' in data && 'percentage' in data) {
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <span className="text-sm">{data.label}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(data.amount)}</div>
                            <div className="text-xs text-muted-foreground">{data.percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Méthodes de Paiement */}
        <TabsContent value="methods" className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">Vos Méthodes de Paiement</h4>
            <Dialog open={isAddingAccount} onOpenChange={setIsAddingAccount}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une méthode
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une méthode de paiement</DialogTitle>
                  <DialogDescription>
                    Choisissez le type de compte à ajouter
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col"
                    onClick={() => setNewAccountType('banking')}
                  >
                    <Building2 className="h-6 w-6 mb-2" />
                    Compte Bancaire
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col"
                    onClick={() => setNewAccountType('mobile')}
                  >
                    <Smartphone className="h-6 w-6 mb-2" />
                    Mobile Money
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{method.icon}</div>
                      <div>
                        <h5 className="font-medium">{method.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          Frais: {method.feePercentage}% | {method.processingTime}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {method.countries.join(', ')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {method.minAmount.toLocaleString()} - {method.maxAmount.toLocaleString()} FCFA
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Préférences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Préférences de Retrait
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-withdrawal">Retrait Automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Retirez automatiquement quand le seuil est atteint
                  </p>
                </div>
                <Switch
                  id="auto-withdrawal"
                  checked={preferences.isAutomatic}
                  onCheckedChange={(checked) => updatePreferences({ isAutomatic: checked })}
                />
              </div>

              {preferences.isAutomatic && (
                <div className="space-y-4 border-l-2 border-primary pl-4">
                  <div>
                    <Label htmlFor="threshold">Seuil de déclenchement (FCFA)</Label>
                    <Input
                      id="threshold"
                      type="number"
                      value={preferences.threshold}
                      onChange={(e) => updatePreferences({ threshold: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequency">Fréquence</Label>
                    <Select
                      value={preferences.frequency}
                      onValueChange={(value: 'weekly' | 'monthly') => updatePreferences({ frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Notifications Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir les confirmations de retrait par email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={preferences.notifyByEmail}
                  onCheckedChange={(checked) => updatePreferences({ notifyByEmail: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-notifications">Notifications SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir les confirmations de retrait par SMS
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={preferences.notifyBySms}
                  onCheckedChange={(checked) => updatePreferences({ notifyBySms: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Retraits</CardTitle>
              <CardDescription>
                Consultez vos dernières transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {withdrawalHistory.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(withdrawal.status)}`} />
                      <div>
                        <p className="font-medium">{formatCurrency(withdrawal.amount)}</p>
                        <p className="text-sm text-muted-foreground">
                          {paymentMethods.find(m => m.id === withdrawal.method)?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(withdrawal.requestedAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(withdrawal.status)}
                        <Badge variant={withdrawal.status === 'completed' ? 'default' : 'secondary'}>
                          {withdrawal.status}
                        </Badge>
                      </div>
                      {withdrawal.reference && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Ref: {withdrawal.reference}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTab;
