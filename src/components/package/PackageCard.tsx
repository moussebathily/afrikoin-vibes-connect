
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, CheckCircle, ScanBarcode, Clock, Truck, Package as PackageIcon } from 'lucide-react';
import { Package } from '@/types/package';
import { Language } from '@/types/language';

interface PackageCardProps {
  package: Package;
  language: Language;
  onScanPackage: (packageId: string) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ package: pkg, language, onScanPackage }) => {
  const text = {
    fr: {
      trackingCode: 'Code de suivi',
      seller: 'Vendeur',
      buyer: 'Acheteur',
      location: 'Localisation actuelle',
      estimatedDelivery: 'Livraison estimée',
      scanToConfirm: 'Scanner pour confirmer',
      scanComplete: 'Scan terminé',
      packageDelivered: 'Colis livré - Scanner pour confirmer',
      statusLabels: {
        pending: 'En attente',
        shipped: 'Expédié',
        in_transit: 'En transit',
        delivered: 'Livré',
        confirmed: 'Confirmé'
      }
    },
    en: {
      trackingCode: 'Tracking code',
      seller: 'Seller',
      buyer: 'Buyer',
      location: 'Current location',
      estimatedDelivery: 'Estimated delivery',
      scanToConfirm: 'Scan to confirm',
      scanComplete: 'Scan complete',
      packageDelivered: 'Package delivered - Scan to confirm',
      statusLabels: {
        pending: 'Pending',
        shipped: 'Shipped',
        in_transit: 'In transit',
        delivered: 'Delivered',
        confirmed: 'Confirmed'
      }
    }
  };

  const currentText = text[language] || text.fr;

  const getStatusIcon = (status: Package['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'shipped':
      case 'in_transit':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <PackageIcon className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <PackageIcon className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Package['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'in_transit':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-orange-500';
      case 'confirmed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(pkg.status)}
          <div>
            <h3 className="font-semibold">{pkg.orderId}</h3>
            <p className="text-sm text-muted-foreground">
              {currentText.trackingCode}: {pkg.trackingCode}
            </p>
          </div>
        </div>
        <Badge 
          className={`${getStatusColor(pkg.status)} text-white`}
        >
          {currentText.statusLabels[pkg.status]}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">{currentText.seller}:</span>
          <span className="text-sm">{pkg.seller}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">{currentText.buyer}:</span>
          <span className="text-sm">{pkg.buyer}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">{currentText.location}:</span>
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="text-sm">{pkg.currentLocation}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">{currentText.estimatedDelivery}:</span>
          <span className="text-sm">{pkg.estimatedDelivery}</span>
        </div>
      </div>

      {/* Actions de confirmation */}
      {pkg.status === 'delivered' && pkg.requiresScan && (
        <div className="border-t pt-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
            <p className="text-sm text-orange-800 font-medium">
              {currentText.packageDelivered}
            </p>
          </div>
          <Button 
            onClick={() => onScanPackage(pkg.id)}
            className="w-full flex items-center justify-center space-x-2"
          >
            <ScanBarcode className="w-4 h-4" />
            <span>{currentText.scanToConfirm}</span>
          </Button>
        </div>
      )}

      {pkg.status === 'confirmed' && (
        <div className="border-t pt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-800 font-medium">
                {currentText.scanComplete}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PackageCard;
