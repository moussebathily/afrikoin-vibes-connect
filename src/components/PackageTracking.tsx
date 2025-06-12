
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, MapPin, Clock, CheckCircle, Truck, ScanBarcode } from 'lucide-react';
import { Language } from '@/types/language';

interface PackageTrackingProps {
  language: Language;
}

interface Package {
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

const PackageTracking: React.FC<PackageTrackingProps> = ({ language }) => {
  const [packages, setPackages] = useState<Package[]>([
    {
      id: '1',
      orderId: 'AFR-2024-001',
      seller: 'Amina Boutique',
      buyer: 'Jean Baptiste',
      status: 'delivered',
      currentLocation: 'Dakar, Sénégal',
      estimatedDelivery: '2024-01-15',
      trackingCode: 'AFR001234567',
      requiresScan: true
    },
    {
      id: '2',
      orderId: 'AFR-2024-002',
      seller: 'Ferme Bio Kano',
      buyer: 'Marie Diallo',
      status: 'in_transit',
      currentLocation: 'Abidjan, Côte d\'Ivoire',
      estimatedDelivery: '2024-01-16',
      trackingCode: 'AFR001234568',
      requiresScan: false
    }
  ]);

  const [showScanner, setShowScanner] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const text = {
    fr: {
      title: 'Suivi de colis en direct',
      subtitle: 'Suivez vos commandes et confirmez la réception',
      scanToConfirm: 'Scanner pour confirmer',
      confirmReceipt: 'Confirmer réception',
      trackingCode: 'Code de suivi',
      seller: 'Vendeur',
      buyer: 'Acheteur',
      status: 'Statut',
      location: 'Localisation actuelle',
      estimatedDelivery: 'Livraison estimée',
      scanRequired: 'Scan requis',
      scanComplete: 'Scan terminé',
      statusLabels: {
        pending: 'En attente',
        shipped: 'Expédié',
        in_transit: 'En transit',
        delivered: 'Livré',
        confirmed: 'Confirmé'
      },
      scanInstructions: 'Scannez le code QR ou le code-barres du colis pour confirmer la réception',
      scanSuccess: 'Colis confirmé avec succès !',
      packageDelivered: 'Colis livré - Scanner pour confirmer'
    },
    en: {
      title: 'Live package tracking',
      subtitle: 'Track your orders and confirm receipt',
      scanToConfirm: 'Scan to confirm',
      confirmReceipt: 'Confirm receipt',
      trackingCode: 'Tracking code',
      seller: 'Seller',
      buyer: 'Buyer',
      status: 'Status',
      location: 'Current location',
      estimatedDelivery: 'Estimated delivery',
      scanRequired: 'Scan required',
      scanComplete: 'Scan complete',
      statusLabels: {
        pending: 'Pending',
        shipped: 'Shipped',
        in_transit: 'In transit',
        delivered: 'Delivered',
        confirmed: 'Confirmed'
      },
      scanInstructions: 'Scan the QR code or barcode on the package to confirm receipt',
      scanSuccess: 'Package confirmed successfully!',
      packageDelivered: 'Package delivered - Scan to confirm'
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
        return <Package className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
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

  const handleScanPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowScanner(true);
  };

  const confirmPackageReceipt = (packageId: string) => {
    setPackages(prev => 
      prev.map(pkg => 
        pkg.id === packageId 
          ? { ...pkg, status: 'confirmed' as const, requiresScan: false }
          : pkg
      )
    );
    setShowScanner(false);
    setSelectedPackage(null);
    console.log(`Package ${packageId} confirmed via scan`);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {currentText.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentText.subtitle}
          </p>
        </div>

        {/* Liste des colis */}
        <div className="grid md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="p-6">
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
                    onClick={() => handleScanPackage(pkg.id)}
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
          ))}
        </div>

        {/* Modal de scan */}
        {showScanner && selectedPackage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4 p-6">
              <div className="text-center">
                <ScanBarcode className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">{currentText.scanToConfirm}</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {currentText.scanInstructions}
                </p>
                
                {/* Simulation du scanner */}
                <div className="border-2 border-dashed border-primary rounded-lg p-8 mb-6">
                  <div className="w-full h-32 bg-primary/10 rounded flex items-center justify-center">
                    <ScanBarcode className="w-12 h-12 text-primary animate-pulse" />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowScanner(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={() => confirmPackageReceipt(selectedPackage)}
                    className="flex-1"
                  >
                    {currentText.confirmReceipt}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default PackageTracking;
