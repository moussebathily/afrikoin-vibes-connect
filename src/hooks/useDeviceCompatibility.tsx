import { useState, useEffect } from 'react';
import { Device } from '@capacitor/device';

interface DeviceInfo {
  platform: 'ios' | 'android' | 'web';
  model: string;
  operatingSystem: string;
  osVersion: string;
  isTablet: boolean;
  isSmallScreen: boolean;
  isLargeScreen: boolean;
  hasNotch: boolean;
  supportsTouchEvents: boolean;
  supportsHover: boolean;
  isLowEndDevice: boolean;
  pixelRatio: number;
}

export const useDeviceCompatibility = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    platform: 'web',
    model: 'Unknown',
    operatingSystem: 'Unknown',
    osVersion: '0',
    isTablet: false,
    isSmallScreen: false,
    isLargeScreen: false,
    hasNotch: false,
    supportsTouchEvents: false,
    supportsHover: false,
    isLowEndDevice: false,
    pixelRatio: 1,
  });

  useEffect(() => {
    const detectDeviceCapabilities = async () => {
      try {
        // Récupérer les infos via Capacitor si disponible
        let platform: 'ios' | 'android' | 'web' = 'web';
        let model = 'Unknown';
        let operatingSystem = 'Unknown';
        let osVersion = '0';
        let isTablet = false;

        if ((window as any).Capacitor) {
          try {
            const deviceInfo = await Device.getInfo();
            platform = deviceInfo.platform as 'ios' | 'android' | 'web';
            model = deviceInfo.model || 'Unknown';
            operatingSystem = deviceInfo.operatingSystem;
            osVersion = deviceInfo.osVersion;
            // Note: isTablet is not available in newer Capacitor Device API
          } catch (error) {
            console.warn('Capacitor Device API not available:', error);
          }
        }

        // Détection User Agent pour tous les cas
        const userAgent = navigator.userAgent.toLowerCase();
        if (platform === 'web') {
          if (/iphone|ipad|ipod/.test(userAgent)) {
            platform = 'ios';
          } else if (/android/.test(userAgent)) {
            platform = 'android';
          }
        }
        
        // Détection tablette via User Agent et taille d'écran
        isTablet = /ipad/.test(userAgent) || 
                  (/android/.test(userAgent) && !/mobile/.test(userAgent)) ||
                  (window.innerWidth >= 768 && window.innerHeight >= 1024);

        // Détection de la taille d'écran
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isSmallScreen = screenWidth < 375 || screenHeight < 667; // iPhone SE et plus petit
        const isLargeScreen = screenWidth >= 428 || screenHeight >= 926; // iPhone Pro Max et plus grand

        // Détection du notch/cutout
        const hasNotch = (
          platform === 'ios' && 
          (screenHeight >= 812 || screenWidth >= 812)
        ) || (
          platform === 'android' && 
          ('CSS' in window && CSS.supports && CSS.supports('padding-top: env(safe-area-inset-top)'))
        );

        // Détection des capacités tactiles
        const supportsTouchEvents = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const supportsHover = window.matchMedia('(hover: hover)').matches;

        // Détection des appareils bas de gamme
        const isLowEndDevice = (
          (navigator as any).hardwareConcurrency <= 2 ||
          (navigator as any).deviceMemory <= 2 ||
          screenWidth < 375
        );

        // Ratio de pixels
        const pixelRatio = window.devicePixelRatio || 1;

        setDeviceInfo({
          platform,
          model,
          operatingSystem,
          osVersion,
          isTablet,
          isSmallScreen,
          isLargeScreen,
          hasNotch,
          supportsTouchEvents,
          supportsHover,
          isLowEndDevice,
          pixelRatio,
        });
      } catch (error) {
        console.error('Error detecting device capabilities:', error);
      }
    };

    detectDeviceCapabilities();

    // Réévaluer lors du redimensionnement
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      setDeviceInfo(prev => ({
        ...prev,
        isSmallScreen: screenWidth < 375 || screenHeight < 667,
        isLargeScreen: screenWidth >= 428 || screenHeight >= 926,
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Classes CSS conditionnelles pour la compatibilité
  const getCompatibilityClasses = () => {
    const classes = [];
    
    if (deviceInfo.isSmallScreen) classes.push('device-small');
    if (deviceInfo.isLargeScreen) classes.push('device-large');
    if (deviceInfo.isTablet) classes.push('device-tablet');
    if (deviceInfo.hasNotch) classes.push('device-notch');
    if (deviceInfo.supportsTouchEvents) classes.push('device-touch');
    if (deviceInfo.supportsHover) classes.push('device-hover');
    if (deviceInfo.isLowEndDevice) classes.push('device-low-end');
    if (deviceInfo.pixelRatio >= 2) classes.push('device-retina');
    
    classes.push(`platform-${deviceInfo.platform}`);
    
    return classes.join(' ');
  };

  // Styles optimisés pour l'appareil
  const getOptimizedStyles = () => {
    return {
      fontSize: deviceInfo.isSmallScreen ? '14px' : '16px',
      minTouchTarget: deviceInfo.supportsTouchEvents ? '44px' : '32px',
      transition: deviceInfo.isLowEndDevice ? 'none' : 'all 0.2s ease',
    };
  };

  return {
    deviceInfo,
    compatibilityClasses: getCompatibilityClasses(),
    optimizedStyles: getOptimizedStyles(),
  };
};