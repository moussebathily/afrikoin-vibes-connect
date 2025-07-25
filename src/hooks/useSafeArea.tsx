import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { Device } from '@capacitor/device';

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const useSafeArea = () => {
  const [safeAreaInsets, setSafeAreaInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  const [isEdgeToEdge, setIsEdgeToEdge] = useState(false);

  useEffect(() => {
    const initializeSafeArea = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const deviceInfo = await Device.getInfo();
          const platform = Capacitor.getPlatform();
          
          // Detect edge-to-edge capability based on Android version
          const isAndroidEdgeToEdge = platform === 'android' && 
            deviceInfo.androidSDKVersion && 
            parseInt(deviceInfo.androidSDKVersion.toString()) >= 34; // Android 14+ (API 34+)
          
          setIsEdgeToEdge(isAndroidEdgeToEdge);

          if (isAndroidEdgeToEdge) {
            // For Android 14+, let CSS env() variables handle safe areas
            // Only set minimal fallback values
            setSafeAreaInsets({
              top: 0, // CSS env(safe-area-inset-top) will handle this
              bottom: 0, // CSS env(safe-area-inset-bottom) will handle this
              left: 0,
              right: 0,
            });
          } else {
            // For older Android versions, use StatusBar height
            try {
              const statusBarInfo = await StatusBar.getInfo();
              setSafeAreaInsets({
                top: 24, // Use default height as StatusBar.getInfo() doesn't provide height in v7
                bottom: 0,
                left: 0,
                right: 0,
              });
            } catch (statusBarError) {
              // Fallback for older devices
              setSafeAreaInsets({
                top: 24,
                bottom: 0,
                left: 0,
                right: 0,
              });
            }
          }
        } catch (error) {
          console.warn('Error getting safe area insets:', error);
          // Fallback for any errors
          setSafeAreaInsets({
            top: 24,
            bottom: 0,
            left: 0,
            right: 0,
          });
        }
      } else {
        // For web, use CSS env() variables with fallbacks
        const computedStyle = getComputedStyle(document.documentElement);
        setSafeAreaInsets({
          top: parseInt(computedStyle.getPropertyValue('--safe-area-top') || '0'),
          bottom: parseInt(computedStyle.getPropertyValue('--safe-area-bottom') || '0'),
          left: parseInt(computedStyle.getPropertyValue('--safe-area-left') || '0'),
          right: parseInt(computedStyle.getPropertyValue('--safe-area-right') || '0'),
        });
        setIsEdgeToEdge(false);
      }
    };

    initializeSafeArea();

    // Listen for orientation changes and device events
    const handleResize = () => {
      initializeSafeArea();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const safeAreaStyle = isEdgeToEdge ? {
    // For edge-to-edge, use CSS custom properties that map to env()
    paddingTop: 'env(safe-area-inset-top, 0px)',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    paddingLeft: 'env(safe-area-inset-left, 0px)',
    paddingRight: 'env(safe-area-inset-right, 0px)',
  } : {
    paddingTop: `${safeAreaInsets.top}px`,
    paddingBottom: `${safeAreaInsets.bottom}px`,
    paddingLeft: `${safeAreaInsets.left}px`,
    paddingRight: `${safeAreaInsets.right}px`,
  };

  const safeAreaClasses = isEdgeToEdge 
    ? 'pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]'
    : '';

  return {
    safeAreaInsets,
    isEdgeToEdge,
    safeAreaStyle,
    safeAreaClasses,
  };
};