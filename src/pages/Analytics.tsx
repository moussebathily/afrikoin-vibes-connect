import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Target, Calendar, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMonetizationStore } from '@/store/monetizationStore';
import { Language } from '@/types/language';

interface AnalyticsProps {
  language: Language;
}

const Analytics: React.FC<AnalyticsProps> = ({ language }) => {
  const { revenueMetrics, setRevenueMetrics } = useMonetizationStore();
  const [timeRange, setTimeRange] = useState('30d');

  const text = {
    fr: {
      title: 'Analytics & Revenus',
      subtitle: 'Tableau de bord des performances et revenus',
      overview: 'Vue d\'ensemble',
      revenue: 'Revenus',
      growth: 'Croissance',
      users: 'Utilisateurs',
      totalRevenue: 'Revenus totaux',
      monthlyGrowth: 'Croissance mensuelle',
      activeUsers: 'Utilisateurs actifs',
      conversionRate: 'Taux de conversion',
      revenueStreams: 'Sources de revenus',
      commissions: 'Commissions',
      subscriptions: 'Abonnements',
      services: 'Services',
      advertising: 'Publicité',
      creatorEconomy: 'Économie créateurs',
      financialServices: 'Services financiers',
      last30Days: '30 derniers jours',
      last90Days: '90 derniers jours',
      thisYear: 'Cette année'
    },
    en: {
      title: 'Analytics & Revenue',
      subtitle: 'Performance and revenue dashboard',
      overview: 'Overview',
      revenue: 'Revenue',
      growth: 'Growth',
      users: 'Users',
      totalRevenue: 'Total Revenue',
      monthlyGrowth: 'Monthly Growth',
      activeUsers: 'Active Users',
      conversionRate: 'Conversion Rate',
      revenueStreams: 'Revenue Streams',
      commissions: 'Commissions',
      subscriptions: 'Subscriptions',
      services: 'Services',
      advertising: 'Advertising',
      creatorEconomy: 'Creator Economy',
      financialServices: 'Financial Services',
      last30Days: 'Last 30 days',
      last90Days: 'Last 90 days',
      thisYear: 'This year'
    }
  };

  const currentText = text[language] || text.fr;

  // Mock data simulation
  useEffect(() => {
    const mockMetrics = {
      totalRevenue: 1150000,
      commissions: 500000,
      subscriptions: 300000,
      services: 150000,
      advertising: 200000,
      creatorEconomy: 180000,
      financialServices: 120000,
      monthlyGrowth: 15.8,
      activeUsers: 12450,
      conversionRate: 3.2
    };
    setRevenueMetrics(mockMetrics);
  }, [setRevenueMetrics]);

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const revenueStreams = [
    {
      name: currentText.commissions,
      value: revenueMetrics.commissions,
      percentage: (revenueMetrics.commissions / revenueMetrics.totalRevenue) * 100,
      color: 'bg-primary',
      growth: 12.5
    },
    {
      name: currentText.subscriptions,
      value: revenueMetrics.subscriptions,
      percentage: (revenueMetrics.subscriptions / revenueMetrics.totalRevenue) * 100,
      color: 'bg-accent',
      growth: 25.3
    },
    {
      name: currentText.advertising,
      value: revenueMetrics.advertising,
      percentage: (revenueMetrics.advertising / revenueMetrics.totalRevenue) * 100,
      color: 'bg-secondary',
      growth: 8.7
    },
    {
      name: currentText.creatorEconomy,
      value: revenueMetrics.creatorEconomy,
      percentage: (revenueMetrics.creatorEconomy / revenueMetrics.totalRevenue) * 100,
      color: 'bg-muted',
      growth: 45.2
    },
    {
      name: currentText.services,
      value: revenueMetrics.services,
      percentage: (revenueMetrics.services / revenueMetrics.totalRevenue) * 100,
      color: 'bg-destructive',
      growth: 18.9
    },
    {
      name: currentText.financialServices,
      value: revenueMetrics.financialServices,
      percentage: (revenueMetrics.financialServices / revenueMetrics.totalRevenue) * 100,
      color: 'bg-success',
      growth: 32.1
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {currentText.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {currentText.subtitle}
            </p>
          </div>
          
          <div className="flex gap-2">
            {[
              { key: '30d', label: currentText.last30Days },
              { key: '90d', label: currentText.last90Days },
              { key: '1y', label: currentText.thisYear }
            ].map((option) => (
              <Button
                key={option.key}
                variant={timeRange === option.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(option.key)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="overview">{currentText.overview}</TabsTrigger>
            <TabsTrigger value="revenue">{currentText.revenue}</TabsTrigger>
            <TabsTrigger value="users">{currentText.users}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {currentText.totalRevenue}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(revenueMetrics.totalRevenue)}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +{formatPercentage(revenueMetrics.monthlyGrowth)} ce mois
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {currentText.monthlyGrowth}
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPercentage(revenueMetrics.monthlyGrowth)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Croissance soutenue
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {currentText.activeUsers}
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {revenueMetrics.activeUsers.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +8.2% vs mois dernier
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {currentText.conversionRate}
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPercentage(revenueMetrics.conversionRate)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +0.3% vs moyenne
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Streams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {currentText.revenueStreams}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueStreams.map((stream, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{stream.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">
                            {formatCurrency(stream.value)}
                          </span>
                          <Badge 
                            variant={stream.growth > 0 ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {stream.growth > 0 ? '+' : ''}{formatPercentage(stream.growth)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className={`${stream.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${stream.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-12">
                          {formatPercentage(stream.percentage)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart Placeholder */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Évolution des revenus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Graphique des revenus par période</p>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Top catégories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Électronique', revenue: 450000, growth: 15.2 },
                      { name: 'Mode', revenue: 320000, growth: 8.7 },
                      { name: 'Maison', revenue: 280000, growth: 12.1 }
                    ].map((category, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{category.name}</span>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {formatCurrency(category.revenue)}
                          </div>
                          <div className="text-xs text-green-600">
                            +{formatPercentage(category.growth)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Objectifs du mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Revenus cible</span>
                        <span>92%</span>
                      </div>
                      <div className="bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-[92%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Nouveaux utilisateurs</span>
                        <span>78%</span>
                      </div>
                      <div className="bg-muted rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full w-[78%]" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Utilisateurs par plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Basique</span>
                      <span className="font-bold">8,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Premium</span>
                      <span className="font-bold">3,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Business</span>
                      <span className="font-bold">800</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acquisition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Référencement</span>
                      <span className="font-bold">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Social Media</span>
                      <span className="font-bold">32%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Direct</span>
                      <span className="font-bold">23%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rétention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Jour 1</span>
                      <span className="font-bold">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Jour 7</span>
                      <span className="font-bold">67%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Jour 30</span>
                      <span className="font-bold">45%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;