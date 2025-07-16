import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';

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
          // Detect if we're in edge-to-edge mode
          const isAndroid15Plus = Capacitor.getPlatform() === 'android';
          setIsEdgeToEdge(isAndroid15Plus);

          if (isAndroid15Plus) {
            // For Android 15+, use default status bar height
            // The actual safe area will be handled by CSS env() variables
            setSafeAreaInsets({
              top: 24, // Default status bar height in dp
              bottom: 0, // Will be handled by CSS env() variables
              left: 0,
              right: 0,
            });
          }
        } catch (error) {
          console.warn('Error getting safe area insets:', error);
        }
      } else {
        // For web, use CSS env() variables as fallback
        const computedStyle = getComputedStyle(document.documentElement);
        setSafeAreaInsets({
          top: parseInt(computedStyle.getPropertyValue('--safe-area-top') || '0'),
          bottom: parseInt(computedStyle.getPropertyValue('--safe-area-bottom') || '0'),
          left: parseInt(computedStyle.getPropertyValue('--safe-area-left') || '0'),
          right: parseInt(computedStyle.getPropertyValue('--safe-area-right') || '0'),
        });
      }
    };

    initializeSafeArea();

    // Listen for orientation changes
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

  const safeAreaStyle = {
    paddingTop: `${safeAreaInsets.top}px`,
    paddingBottom: `${safeAreaInsets.bottom}px`,
    paddingLeft: `${safeAreaInsets.left}px`,
    paddingRight: `${safeAreaInsets.right}px`,
  };

  const safeAreaClasses = isEdgeToEdge 
    ? 'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]'
    : '';

  return {
    safeAreaInsets,
    isEdgeToEdge,
    safeAreaStyle,
    safeAreaClasses,
  };
};