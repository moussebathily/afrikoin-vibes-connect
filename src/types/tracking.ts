export type TrackingStatus = 
  | 'pending' 
  | 'picked_up' 
  | 'in_transit' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'failed' 
  | 'returned';

export interface TrackingEvent {
  id: string;
  status: TrackingStatus;
  location: string;
  timestamp: Date;
  description: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Package {
  id: string;
  trackingNumber: string;
  carrier: string;
  carrierLogo?: string;
  origin: string;
  destination: string;
  currentStatus: TrackingStatus;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  events: TrackingEvent[];
  recipientName: string;
  senderName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrackingSearchResult {
  found: boolean;
  package?: Package;
  error?: string;
}

export const STATUS_CONFIG: Record<TrackingStatus, {
  label: string;
  color: string;
  icon: string;
  progress: number;
}> = {
  pending: {
    label: 'En attente',
    color: 'bg-muted text-muted-foreground',
    icon: 'Clock',
    progress: 0
  },
  picked_up: {
    label: 'Collecté',
    color: 'bg-blue-500/20 text-blue-600',
    icon: 'PackageCheck',
    progress: 20
  },
  in_transit: {
    label: 'En transit',
    color: 'bg-primary/20 text-primary',
    icon: 'Truck',
    progress: 50
  },
  out_for_delivery: {
    label: 'En livraison',
    color: 'bg-accent/20 text-accent',
    icon: 'MapPin',
    progress: 80
  },
  delivered: {
    label: 'Livré',
    color: 'bg-success/20 text-success',
    icon: 'CheckCircle2',
    progress: 100
  },
  failed: {
    label: 'Échec',
    color: 'bg-destructive/20 text-destructive',
    icon: 'XCircle',
    progress: 0
  },
  returned: {
    label: 'Retourné',
    color: 'bg-secondary/20 text-secondary',
    icon: 'RotateCcw',
    progress: 0
  }
};
