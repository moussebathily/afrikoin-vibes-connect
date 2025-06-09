
import { useState, useEffect } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isCapacitor, setIsCapacitor] = useState(false);

  useEffect(() => {
    // Détection si on est sur mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const mobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(mobile || window.innerWidth <= 768);
    };

    // Détection si on est dans Capacitor
    const checkCapacitor = () => {
      setIsCapacitor(!!(window as any).Capacitor);
    };

    checkMobile();
    checkCapacitor();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile, isCapacitor };
};
