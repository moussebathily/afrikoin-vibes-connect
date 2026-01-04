import React, { useState } from 'react';
import { Search, Package, Loader2, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface TrackingSearchProps {
  onSearch: (trackingNumber: string) => Promise<void>;
  isLoading: boolean;
}

export function TrackingSearch({ onSearch, isLoading }: TrackingSearchProps) {
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      await onSearch(trackingNumber.trim());
      setTrackingNumber('');
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border/50 shadow-elegant">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-gradient-primary shadow-lg">
          <Package className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Suivi de colis</h2>
          <p className="text-sm text-muted-foreground">Entrez votre numéro de suivi</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Ex: AF123456789XY"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
            className="pl-12 pr-4 h-14 text-lg bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isLoading || !trackingNumber.trim()}
            className="flex-1 h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold rounded-xl shadow-elegant transition-all hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Recherche...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Suivre le colis
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="h-12 px-4 border-border/50 hover:bg-muted/50 rounded-xl"
            onClick={() => {/* TODO: Implement QR scanner */}}
          >
            <ScanLine className="w-5 h-5" />
          </Button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {['DHL', 'FedEx', 'UPS', 'Afri Express'].map((carrier) => (
          <span
            key={carrier}
            className="px-3 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded-full"
          >
            {carrier}
          </span>
        ))}
      </div>
    </Card>
  );
}
