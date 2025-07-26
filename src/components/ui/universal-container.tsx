import React from 'react';
import { useDeviceCompatibility } from '@/hooks/useDeviceCompatibility';
import { cn } from '@/lib/utils';

interface UniversalContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'spacious';
  touchOptimized?: boolean;
}

export const UniversalContainer: React.FC<UniversalContainerProps> = ({
  children,
  className,
  variant = 'default',
  touchOptimized = true,
}) => {
  const { compatibilityClasses, deviceInfo } = useDeviceCompatibility();

  const baseClasses = [
    'w-full',
    'universal-scroll',
    compatibilityClasses,
  ];

  const variantClasses = {
    default: 'responsive-spacing responsive-text',
    compact: deviceInfo.isSmallScreen ? 'p-2 text-sm' : 'p-4 text-base',
    spacious: deviceInfo.isLargeScreen ? 'p-8 text-lg' : 'p-6 text-base',
  };

  const touchClasses = touchOptimized && deviceInfo.supportsTouchEvents ? 'universal-touch' : '';

  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      touchClasses,
      className
    )}>
      {children}
    </div>
  );
};