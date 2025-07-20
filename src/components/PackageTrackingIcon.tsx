
import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language } from '@/types/language';
import PackageTracking from './PackageTracking';

interface PackageTrackingIconProps {
  language: Language;
  className?: string;
}

const PackageTrackingIcon: React.FC<PackageTrackingIconProps> = ({ 
  language, 
  className = "" 
}) => {
  const [showPackageTracking, setShowPackageTracking] = useState(false);

  const text = {
    fr: {
      tooltip: 'Suivi de colis'
    },
    en: {
      tooltip: 'Package tracking'
    }
  };

  const currentText = text[language] || text.fr;

  if (showPackageTracking) {
    return <PackageTracking language={language} />;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setShowPackageTracking(true)}
      className={`relative ${className}`}
      aria-label={`${currentText.tooltip} - 2 nouveaux colis`}
    >
      <Package className="w-4 h-4" />
      {/* Badge de notification optionnel */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
        <span className="text-[8px] text-white font-bold">2</span>
      </div>
    </Button>
  );
};

export default PackageTrackingIcon;
