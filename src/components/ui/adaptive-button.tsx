import React from 'react';
import { Button, ButtonProps } from './button';
import { useDeviceCompatibility } from '@/hooks/useDeviceCompatibility';
import { cn } from '@/lib/utils';

interface AdaptiveButtonProps extends ButtonProps {
  adaptToDevice?: boolean;
}

export const AdaptiveButton: React.FC<AdaptiveButtonProps> = ({
  children,
  className,
  adaptToDevice = true,
  ...props
}) => {
  const { deviceInfo, compatibilityClasses } = useDeviceCompatibility();

  const getAdaptiveClasses = () => {
    if (!adaptToDevice) return '';

    const classes = [];

    // Taille adaptative selon l'écran
    if (deviceInfo.isSmallScreen) {
      classes.push('text-sm px-3 py-2');
    } else if (deviceInfo.isLargeScreen) {
      classes.push('text-lg px-6 py-3');
    } else {
      classes.push('text-base px-4 py-2');
    }

    // Optimisations tactiles
    if (deviceInfo.supportsTouchEvents) {
      classes.push('min-h-[44px] touch-manipulation');
    }

    // Optimisations hover
    if (!deviceInfo.supportsHover) {
      classes.push('active:scale-95');
    }

    // Performance pour appareils bas de gamme
    if (deviceInfo.isLowEndDevice) {
      classes.push('transition-none');
    }

    return classes.join(' ');
  };

  return (
    <Button
      className={cn(
        compatibilityClasses,
        getAdaptiveClasses(),
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};