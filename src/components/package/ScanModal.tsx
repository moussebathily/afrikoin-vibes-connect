
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScanBarcode } from 'lucide-react';
import { Language } from '@/types/language';

interface ScanModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onConfirm: () => void;
}

const ScanModal: React.FC<ScanModalProps> = ({ isOpen, language, onClose, onConfirm }) => {
  const text = {
    fr: {
      scanToConfirm: 'Scanner pour confirmer',
      confirmReceipt: 'Confirmer réception',
      scanInstructions: 'Scannez le code QR ou le code-barres du colis pour confirmer la réception'
    },
    en: {
      scanToConfirm: 'Scan to confirm',
      confirmReceipt: 'Confirm receipt',
      scanInstructions: 'Scan the QR code or barcode on the package to confirm receipt'
    }
  };

  const currentText = text[language] || text.fr;

  if (!isOpen) return null;

  return (
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
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1"
            >
              {currentText.confirmReceipt}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ScanModal;
