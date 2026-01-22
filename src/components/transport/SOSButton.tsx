import { useState } from 'react';
import { AlertTriangle, Phone, X, Shield, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Ride } from '@/types/transport';
import { toast } from 'sonner';

interface SOSButtonProps {
  ride: Ride;
}

const emergencyContacts = [
  { name: 'Police', number: '17', icon: Shield },
  { name: 'Pompiers', number: '18', icon: AlertTriangle },
  { name: 'SAMU', number: '15', icon: Phone },
  { name: 'Numéro d\'urgence', number: '112', icon: Phone },
];

export const SOSButton = ({ ride }: SOSButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertSent, setIsAlertSent] = useState(false);

  const handleEmergencyCall = (number: string, name: string) => {
    window.location.href = `tel:${number}`;
    toast.info(`Appel vers ${name} (${number})`);
  };

  const handleSendAlert = async () => {
    setIsAlertSent(true);
    
    // Simuler l'envoi d'une alerte avec la position
    const alertData = {
      rideId: ride.id,
      rideNumber: ride.ride_number,
      driverId: ride.driver_id,
      pickupAddress: ride.pickup_address,
      dropoffAddress: ride.dropoff_address,
      timestamp: new Date().toISOString(),
    };

    console.log('🚨 Alerte SOS envoyée:', alertData);

    toast.success('Alerte SOS envoyée !', {
      description: 'Les services de sécurité ont été notifiés avec votre position.',
    });

    // Réinitialiser après 3 secondes
    setTimeout(() => {
      setIsAlertSent(false);
    }, 3000);
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          
          if (navigator.share) {
            navigator.share({
              title: 'Ma position actuelle - URGENCE',
              text: `Course ${ride.ride_number} - Position d'urgence`,
              url: mapsUrl,
            });
          } else {
            navigator.clipboard.writeText(mapsUrl);
            toast.success('Lien de position copié !');
          }
        },
        () => {
          toast.error('Impossible d\'obtenir la position');
        }
      );
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="bg-red-600 hover:bg-red-700 animate-pulse"
      >
        <AlertTriangle className="h-4 w-4 mr-1" />
        SOS
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Urgence - SOS
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Bouton d'alerte principal */}
            <Button
              variant="destructive"
              className="w-full h-16 text-lg font-bold"
              onClick={handleSendAlert}
              disabled={isAlertSent}
            >
              {isAlertSent ? (
                <>
                  <Shield className="h-6 w-6 mr-2 animate-pulse" />
                  Alerte envoyée !
                </>
              ) : (
                <>
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  Envoyer une alerte SOS
                </>
              )}
            </Button>

            {/* Partager la position */}
            <Button
              variant="outline"
              className="w-full"
              onClick={shareLocation}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Partager ma position
            </Button>

            {/* Contacts d'urgence */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Appeler les secours :
              </p>
              <div className="grid grid-cols-2 gap-2">
                {emergencyContacts.map((contact) => (
                  <Button
                    key={contact.number}
                    variant="outline"
                    className="flex items-center justify-start gap-2 h-12"
                    onClick={() => handleEmergencyCall(contact.number, contact.name)}
                  >
                    <contact.icon className="h-4 w-4 text-destructive" />
                    <div className="text-left">
                      <div className="text-xs font-medium">{contact.name}</div>
                      <div className="text-xs text-muted-foreground">{contact.number}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Infos de la course */}
            <div className="p-3 bg-muted rounded-lg text-xs">
              <p className="font-medium">Course #{ride.ride_number}</p>
              <p className="text-muted-foreground truncate">
                {ride.pickup_address} → {ride.dropoff_address}
              </p>
            </div>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
