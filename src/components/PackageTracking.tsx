
import React, { useState } from 'react';
import { Language } from '@/types/language';
import { Package } from '@/types/package';
import PackageCard from './package/PackageCard';
import ScanModal from './package/ScanModal';

interface PackageTrackingProps {
  language: Language;
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
      subtitle: 'Suivez vos commandes et confirmez la réception'
    },
    en: {
      title: 'Live package tracking',
      subtitle: 'Track your orders and confirm receipt'
    }
  };

  const currentText = text[language] || text.fr;

  const handleScanPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowScanner(true);
  };

  const confirmPackageReceipt = () => {
    if (selectedPackage) {
      setPackages(prev => 
        prev.map(pkg => 
          pkg.id === selectedPackage 
            ? { ...pkg, status: 'confirmed' as const, requiresScan: false }
            : pkg
        )
      );
      setShowScanner(false);
      setSelectedPackage(null);
      console.log(`Package ${selectedPackage} confirmed via scan`);
    }
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
    setSelectedPackage(null);
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
            <PackageCard
              key={pkg.id}
              package={pkg}
              language={language}
              onScanPackage={handleScanPackage}
            />
          ))}
        </div>

        {/* Modal de scan */}
        <ScanModal
          isOpen={showScanner}
          language={language}
          onClose={handleCloseScanner}
          onConfirm={confirmPackageReceipt}
        />
      </div>
    </section>
  );
};

export default PackageTracking;
