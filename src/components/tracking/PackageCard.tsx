import React, { useState } from 'react';
import { 
  Package as PackageIcon, 
  MapPin, 
  Calendar, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Trash2,
  Share2,
  Bell,
  Copy,
  Check
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package, STATUS_CONFIG } from '@/types/tracking';
import { TrackingTimeline } from './TrackingTimeline';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface PackageCardProps {
  pkg: Package;
  onRefresh: (trackingNumber: string) => Promise<void>;
  onRemove: (trackingNumber: string) => void;
  isRefreshing: boolean;
}

export function PackageCard({ pkg, onRefresh, onRemove, isRefreshing }: PackageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const config = STATUS_CONFIG[pkg.currentStatus];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pkg.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copié !',
      description: 'Numéro de suivi copié dans le presse-papiers',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Suivi colis ${pkg.trackingNumber}`,
        text: `Suivez mon colis: ${pkg.trackingNumber} - ${config.label}`,
        url: window.location.href,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-card to-card/90 border-border/50 shadow-lg hover:shadow-elegant transition-all duration-300 animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{pkg.carrierLogo}</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground">{pkg.trackingNumber}</h3>
                <button 
                  onClick={handleCopy}
                  className="p-1 hover:bg-muted/50 rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
              </div>
              <p className="text-sm text-muted-foreground">{pkg.carrier}</p>
            </div>
          </div>
          
          <Badge className={`${config.color} font-medium`}>
            {config.label}
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="mt-4 space-y-2">
          <Progress 
            value={config.progress} 
            className="h-2 bg-muted/50"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Expédié</span>
            <span>En transit</span>
            <span>Livré</span>
          </div>
        </div>
      </div>

      {/* Route info */}
      <div className="p-4 bg-muted/20">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">De:</span>
              <span className="font-medium text-foreground truncate">{pkg.origin}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-success" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-muted-foreground">Vers:</span>
              <span className="font-medium text-foreground truncate">{pkg.destination}</span>
            </div>
          </div>
        </div>

        {pkg.estimatedDelivery && pkg.currentStatus !== 'delivered' && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Livraison estimée:</span>
            <span className="font-medium text-foreground">
              {format(new Date(pkg.estimatedDelivery), "dd MMMM yyyy", { locale: fr })}
            </span>
          </div>
        )}

        {pkg.actualDelivery && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">Livré le:</span>
            <span className="font-medium text-success">
              {format(new Date(pkg.actualDelivery), "dd MMMM yyyy à HH:mm", { locale: fr })}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 flex items-center gap-2 border-t border-border/30">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRefresh(pkg.trackingNumber)}
          disabled={isRefreshing}
          className="flex-1 h-10 border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="h-10 px-3 border-border/50 hover:bg-muted/50"
        >
          <Share2 className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="h-10 px-3 border-border/50 hover:bg-muted/50"
        >
          <Bell className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(pkg.trackingNumber)}
          className="h-10 px-3 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Expandable timeline */}
      <div className="border-t border-border/30">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
        >
          <span>Historique de suivi ({pkg.events.length} événements)</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        
        {isExpanded && (
          <div className="px-4 pb-4 animate-fade-in">
            <TrackingTimeline events={pkg.events} />
          </div>
        )}
      </div>

      {/* Last update */}
      <div className="px-4 py-2 bg-muted/10 text-xs text-muted-foreground text-center">
        Dernière mise à jour: {formatDistanceToNow(new Date(pkg.updatedAt), { addSuffix: true, locale: fr })}
      </div>
    </Card>
  );
}
