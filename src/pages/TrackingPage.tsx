import React, { useEffect } from 'react';
import { Package, Truck, MapPin, Clock, Bell, History } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrackingSearch } from '@/components/tracking/TrackingSearch';
import { PackageCard } from '@/components/tracking/PackageCard';
import { usePackageTracking } from '@/hooks/usePackageTracking';
import { useToast } from '@/hooks/use-toast';

export function TrackingPage() {
  const { packages, isLoading, error, trackPackage, refreshPackage, removePackage } = usePackageTracking();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Erreur',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleSearch = async (trackingNumber: string) => {
    const result = await trackPackage(trackingNumber);
    if (result) {
      toast({
        title: 'Colis trouvé !',
        description: `${result.carrier} - ${result.trackingNumber}`,
      });
    }
  };

  const quickStats = [
    { icon: Package, label: 'Total', value: packages.length, color: 'bg-primary/20 text-primary' },
    { icon: Truck, label: 'En transit', value: packages.filter(p => p.currentStatus === 'in_transit').length, color: 'bg-accent/20 text-accent' },
    { icon: MapPin, label: 'En livraison', value: packages.filter(p => p.currentStatus === 'out_for_delivery').length, color: 'bg-success/20 text-success' },
    { icon: Clock, label: 'En attente', value: packages.filter(p => p.currentStatus === 'pending').length, color: 'bg-muted text-muted-foreground' },
  ];

  return (
    <div className="min-h-screen pb-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background px-4 pt-6 pb-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmJmMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-primary shadow-lg animate-float">
              <Truck className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Suivi de colis</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Suivez vos colis en temps réel partout en Afrique
          </p>

          <TrackingSearch onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </div>

      {/* Quick Stats */}
      {packages.length > 0 && (
        <div className="px-4 -mt-4">
          <div className="grid grid-cols-4 gap-2">
            {quickStats.map((stat) => (
              <Card 
                key={stat.label}
                className="p-3 text-center bg-card/80 backdrop-blur border-border/30 shadow-md"
              >
                <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-1`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Packages List */}
      <div className="px-4 mt-6 space-y-4">
        {packages.length === 0 ? (
          <Card className="p-8 text-center bg-gradient-to-br from-muted/30 to-muted/10 border-dashed border-2 border-border/50">
            <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucun colis suivi
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Entrez un numéro de suivi pour commencer à suivre vos colis en temps réel
            </p>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Mes colis
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Bell className="w-4 h-4 mr-1" />
                Alertes
              </Button>
            </div>

            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onRefresh={refreshPackage}
                onRemove={removePackage}
                isRefreshing={isLoading}
              />
            ))}
          </>
        )}
      </div>

      {/* Features Section */}
      <div className="px-4 mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Fonctionnalités</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '📍', title: 'Suivi GPS', desc: 'Position en temps réel' },
            { icon: '🔔', title: 'Notifications', desc: 'Alertes instantanées' },
            { icon: '📊', title: 'Historique', desc: 'Tous vos envois' },
            { icon: '🌍', title: 'Multi-transporteurs', desc: 'DHL, FedEx, UPS...' },
          ].map((feature) => (
            <Card 
              key={feature.title}
              className="p-4 bg-gradient-to-br from-card to-card/80 border-border/30 hover:border-primary/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span className="text-2xl mb-2 block">{feature.icon}</span>
              <h4 className="font-semibold text-foreground text-sm">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
