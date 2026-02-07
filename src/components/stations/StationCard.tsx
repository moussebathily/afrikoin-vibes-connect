import React from 'react'
import type { Station } from '@/pages/StationsPage'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Fuel } from 'lucide-react'

const statusConfig = {
  libre: { emoji: '🟢', label: 'Libre', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  moyen: { emoji: '🟠', label: 'Moyen', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  bonde: { emoji: '🔴', label: 'Bondé', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

interface StationCardProps {
  station: Station
  onClick: () => void
}

export default function StationCard({ station, onClick }: StationCardProps) {
  const status = statusConfig[station.current_status as keyof typeof statusConfig] || statusConfig.libre

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{station.type === 'kiosque' ? '🏪' : '⛽'}</span>
              <h3 className="font-semibold text-sm truncate">{station.name}</h3>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{station.address || station.city}</span>
            </div>

            {/* Fuel types */}
            <div className="flex flex-wrap gap-1 mb-2">
              {station.fuel_types?.map(f => (
                <Badge key={f} variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                  {f}
                </Badge>
              ))}
            </div>

            {/* Prices */}
            <div className="flex gap-3 text-xs">
              {station.price_essence && (
                <span className="text-muted-foreground">Essence: <strong className="text-foreground">{station.price_essence} F</strong></span>
              )}
              {station.price_diesel && (
                <span className="text-muted-foreground">Diesel: <strong className="text-foreground">{station.price_diesel} F</strong></span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge className={`${status.class} border-0 text-xs`}>
              {status.emoji} {status.label}
            </Badge>

            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{station.is_24h ? '24h/24' : station.opening_hours || 'N/A'}</span>
            </div>

            {station.brand && (
              <span className="text-[10px] font-medium text-muted-foreground">{station.brand}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
