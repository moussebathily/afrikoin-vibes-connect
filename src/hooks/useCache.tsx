
import { useState, useEffect, useCallback } from 'react';

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expires: number;
}

export const useCache = <T,>(options: CacheOptions = {}) => {
  const { ttl = 5 * 60 * 1000, maxSize = 50 } = options; // Default 5 minutes TTL
  const [cache, setCache] = useState<Map<string, CacheItem<T>>>(new Map());

  const set = useCallback((key: string, data: T) => {
    const now = Date.now();
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      expires: now + ttl
    };

    setCache(prev => {
      const newCache = new Map(prev);
      
      // Remove expired items and enforce max size
      const activeItems = Array.from(newCache.entries())
        .filter(([, item]) => item.expires > now)
        .slice(-(maxSize - 1)); // Keep room for new item
      
      const cleanCache = new Map(activeItems);
      cleanCache.set(key, item);
      
      return cleanCache;
    });
  }, [ttl, maxSize]);

  const get = useCallback((key: string): T | null => {
    const item = cache.get(key);
    if (!item) return null;
    
    if (item.expires < Date.now()) {
      // Item expired, remove it
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(key);
        return newCache;
      });
      return null;
    }
    
    return item.data;
  }, [cache]);

  const remove = useCallback((key: string) => {
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
  }, []);

  const clear = useCallback(() => {
    setCache(new Map());
  }, []);

  const has = useCallback((key: string): boolean => {
    const item = cache.get(key);
    return item ? item.expires > Date.now() : false;
  }, [cache]);

  // Cleanup expired items periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCache(prev => {
        const activeItems = Array.from(prev.entries())
          .filter(([, item]) => item.expires > now);
        return new Map(activeItems);
      });
    }, 60000); // Cleanup every minute

    return () => clearInterval(interval);
  }, []);

  return { set, get, remove, clear, has, size: cache.size };
};
