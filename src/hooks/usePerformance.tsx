
import { useState, useEffect, useCallback } from 'react';
import { analytics } from '@/services/analyticsService';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionLatency: number;
  memoryUsage: number;
}

export const usePerformance = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    interactionLatency: 0,
    memoryUsage: 0
  });

  const startTime = performance.now();

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    setMetrics(prev => ({ ...prev, renderTime }));
    
    // Track component render performance
    analytics.trackPerformance(`${componentName}_render_time`, renderTime);
    
    // Monitor memory usage
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      setMetrics(prev => ({ 
        ...prev, 
        memoryUsage: memoryInfo.usedJSHeapSize / 1024 / 1024 // MB
      }));
    }
  }, [componentName, startTime]);

  const trackAction = useCallback((actionName: string, startTime: number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    analytics.trackPerformance(`${componentName}_${actionName}`, duration);
    setMetrics(prev => ({ ...prev, interactionLatency: duration }));
  }, [componentName]);

  const measureAsync = useCallback(async <T,>(
    actionName: string,
    asyncFunction: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await asyncFunction();
      trackAction(actionName, start);
      return result;
    } catch (error) {
      trackAction(`${actionName}_error`, start);
      throw error;
    }
  }, [trackAction]);

  return { metrics, trackAction, measureAsync };
};
