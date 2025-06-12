
export interface Package {
  id: string;
  orderId: string;
  seller: string;
  buyer: string;
  status: 'pending' | 'shipped' | 'in_transit' | 'delivered' | 'confirmed';
  currentLocation: string;
  estimatedDelivery: string;
  trackingCode: string;
  requiresScan: boolean;
}
