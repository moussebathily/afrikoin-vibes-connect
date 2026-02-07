import React, { Suspense, lazy, useState, useEffect } from 'react'
import type { Station } from '@/pages/StationsPage'

const StationsMapContent = lazy(() => import('./StationsMapContent'))

interface Props {
  stations: Station[]
  onSelectStation: (station: Station) => void
}

export default function StationsMap({ stations, onSelectStation }: Props) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-full w-full bg-muted flex items-center justify-center">
        <div className="text-muted-foreground">Chargement de la carte...</div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="h-full w-full bg-muted flex items-center justify-center">
        <div className="text-muted-foreground">Chargement de la carte...</div>
      </div>
    }>
      <StationsMapContent stations={stations} onSelectStation={onSelectStation} />
    </Suspense>
  )
}
