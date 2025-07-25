import { useEffect } from 'react';
import { usePerformance } from '@/hooks/usePerformance';

interface PerformanceOptimizerProps {
  componentName: string;
  children: React.ReactNode;
}

export const PerformanceOptimizer = ({ 
  componentName, 
  children 
}: PerformanceOptimizerProps) => {
  const { trackAction } = usePerformance(componentName);

  useEffect(() => {
    // Track component mount
    trackAction('mount', performance.now());
    
    return () => {
      // Track component unmount
      trackAction('unmount', performance.now());
    };
  }, [trackAction]);

  return <>{children}</>;
};

export default PerformanceOptimizer;