import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [wasOffline, setWasOffline] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (wasOffline) {
        toast({
          title: "Connexion rétablie",
          description: "Vous êtes de nouveau en ligne.",
        })
        setWasOffline(false)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
      toast({
        title: "Hors ligne",
        description: "Vérifiez votre connexion internet.",
        variant: "destructive",
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [wasOffline, toast])

  const retryWhenOnline = useCallback(<T,>(fn: () => Promise<T>): Promise<T> => {
    if (isOnline) return fn()
    return new Promise((resolve, reject) => {
      const handler = () => {
        window.removeEventListener('online', handler)
        fn().then(resolve).catch(reject)
      }
      window.addEventListener('online', handler)
    })
  }, [isOnline])

  return { isOnline, retryWhenOnline }
}
