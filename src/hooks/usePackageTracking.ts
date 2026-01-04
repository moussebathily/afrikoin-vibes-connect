import { useState, useCallback } from 'react';
import { Package, TrackingStatus, TrackingEvent } from '@/types/tracking';

// Simulated carriers
const CARRIERS = [
  { id: 'dhl', name: 'DHL Express', logo: '📦' },
  { id: 'fedex', name: 'FedEx', logo: '📮' },
  { id: 'ups', name: 'UPS', logo: '🚚' },
  { id: 'afri-express', name: 'Afri Express', logo: '🌍' },
  { id: 'jumia', name: 'Jumia Logistics', logo: '🛒' },
];

// Generate mock tracking data
function generateMockPackage(trackingNumber: string): Package {
  const carrier = CARRIERS[Math.floor(Math.random() * CARRIERS.length)];
  const cities = [
    { name: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792 },
    { name: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219 },
    { name: 'Accra, Ghana', lat: 5.6037, lng: -0.1870 },
    { name: 'Dakar, Sénégal', lat: 14.7167, lng: -17.4677 },
    { name: 'Le Caire, Égypte', lat: 30.0444, lng: 31.2357 },
    { name: 'Casablanca, Maroc', lat: 33.5731, lng: -7.5898 },
    { name: 'Johannesburg, Afrique du Sud', lat: -26.2041, lng: 28.0473 },
  ];

  const origin = cities[Math.floor(Math.random() * cities.length)];
  let destination = cities[Math.floor(Math.random() * cities.length)];
  while (destination.name === origin.name) {
    destination = cities[Math.floor(Math.random() * cities.length)];
  }

  const statuses: TrackingStatus[] = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
  const currentStatusIndex = Math.floor(Math.random() * statuses.length);
  const currentStatus = statuses[currentStatusIndex];

  const events: TrackingEvent[] = [];
  const now = new Date();

  for (let i = 0; i <= currentStatusIndex; i++) {
    const eventTime = new Date(now.getTime() - (currentStatusIndex - i) * 24 * 60 * 60 * 1000);
    const status = statuses[i];
    
    let location = origin.name;
    let description = '';
    
    switch (status) {
      case 'pending':
        description = 'Colis enregistré, en attente de collecte';
        break;
      case 'picked_up':
        description = 'Colis collecté par le transporteur';
        break;
      case 'in_transit':
        location = 'Centre de tri international';
        description = 'Colis en cours de traitement au centre de tri';
        break;
      case 'out_for_delivery':
        location = destination.name;
        description = 'Colis en cours de livraison';
        break;
      case 'delivered':
        location = destination.name;
        description = 'Colis livré avec succès';
        break;
    }

    events.push({
      id: `event-${i}`,
      status,
      location,
      timestamp: eventTime,
      description,
      coordinates: i === 0 ? { lat: origin.lat, lng: origin.lng } : 
                   i === currentStatusIndex ? { lat: destination.lat, lng: destination.lng } : undefined
    });
  }

  const estimatedDelivery = new Date(now.getTime() + (5 - currentStatusIndex) * 24 * 60 * 60 * 1000);

  return {
    id: `pkg-${Date.now()}`,
    trackingNumber: trackingNumber.toUpperCase(),
    carrier: carrier.name,
    carrierLogo: carrier.logo,
    origin: origin.name,
    destination: destination.name,
    currentStatus,
    estimatedDelivery,
    actualDelivery: currentStatus === 'delivered' ? now : undefined,
    weight: Math.round(Math.random() * 50 * 10) / 10,
    events: events.reverse(),
    recipientName: 'Jean Dupont',
    senderName: 'AfriShop Express',
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: now
  };
}

export function usePackageTracking() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackPackage = useCallback(async (trackingNumber: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (trackingNumber.length < 6) {
        throw new Error('Numéro de suivi invalide');
      }

      const existingPackage = packages.find(p => p.trackingNumber === trackingNumber.toUpperCase());
      if (existingPackage) {
        return existingPackage;
      }

      const newPackage = generateMockPackage(trackingNumber);
      setPackages(prev => [newPackage, ...prev]);
      return newPackage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du suivi');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [packages]);

  const refreshPackage = useCallback(async (trackingNumber: string) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPackages(prev => prev.map(pkg => {
        if (pkg.trackingNumber === trackingNumber) {
          const statuses: TrackingStatus[] = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
          const currentIndex = statuses.indexOf(pkg.currentStatus);
          
          if (currentIndex < statuses.length - 1 && Math.random() > 0.5) {
            const newStatus = statuses[currentIndex + 1];
            const newEvent: TrackingEvent = {
              id: `event-${Date.now()}`,
              status: newStatus,
              location: pkg.destination,
              timestamp: new Date(),
              description: newStatus === 'delivered' ? 'Colis livré avec succès' : 
                          newStatus === 'out_for_delivery' ? 'Colis en cours de livraison' :
                          'Mise à jour du statut'
            };
            
            return {
              ...pkg,
              currentStatus: newStatus,
              events: [newEvent, ...pkg.events],
              updatedAt: new Date(),
              actualDelivery: newStatus === 'delivered' ? new Date() : undefined
            };
          }
        }
        return pkg;
      }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removePackage = useCallback((trackingNumber: string) => {
    setPackages(prev => prev.filter(p => p.trackingNumber !== trackingNumber));
  }, []);

  return {
    packages,
    isLoading,
    error,
    trackPackage,
    refreshPackage,
    removePackage
  };
}
