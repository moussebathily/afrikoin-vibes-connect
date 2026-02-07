import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Search, Filter, MapPin, Fuel, Clock, Navigation, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StationCard from '@/components/stations/StationCard'
import StationDetailDialog from '@/components/stations/StationDetailDialog'
import StationsMap from '@/components/stations/StationsMap'

export type Station = {
  id: string
  name: string
  type: string
  latitude: number
  longitude: number
  address: string | null
  city: string | null
  country: string | null
  fuel_types: string[]
  products: string[]
  opening_hours: string | null
  is_24h: boolean
  is_open: boolean
  phone: string | null
  brand: string | null
  price_essence: number | null
  price_diesel: number | null
  price_gaz: number | null
  current_status: string
  total_reports: number
  image_url: string | null
}

const FUEL_FILTERS = ['essence', 'diesel', 'gaz']
const STATUS_FILTERS = [
  { value: 'libre', label: '🟢 Libre', color: 'bg-green-500' },
  { value: 'moyen', label: '🟠 Moyen', color: 'bg-yellow-500' },
  { value: 'bonde', label: '🔴 Bondé', color: 'bg-red-500' },
]

export default function StationsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedFuel, setSelectedFuel] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  const { data: stations = [], isLoading } = useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stations')
        .select('*')
        .order('name')
      if (error) throw error
      return (data || []) as Station[]
    },
  })

  const cities = useMemo(() => {
    const c = new Set(stations.map(s => s.city).filter(Boolean))
    return Array.from(c) as string[]
  }, [stations])

  const filtered = useMemo(() => {
    return stations.filter(s => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.address?.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedCity && s.city !== selectedCity) return false
      if (selectedType && s.type !== selectedType) return false
      if (selectedFuel && !s.fuel_types?.includes(selectedFuel)) return false
      if (selectedStatus && s.current_status !== selectedStatus) return false
      return true
    })
  }, [stations, search, selectedCity, selectedType, selectedFuel, selectedStatus])

  const hasFilters = selectedCity || selectedType || selectedFuel || selectedStatus

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">⛽ Stations & Kiosques</h1>
            <p className="text-xs text-muted-foreground">{filtered.length} point{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une station, un quartier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters row */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {/* Type filter */}
          <Badge
            variant={selectedType === 'station' ? 'default' : 'outline'}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedType(selectedType === 'station' ? null : 'station')}
          >
            ⛽ Stations
          </Badge>
          <Badge
            variant={selectedType === 'kiosque' ? 'default' : 'outline'}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedType(selectedType === 'kiosque' ? null : 'kiosque')}
          >
            🏪 Kiosques
          </Badge>

          {/* Fuel filters */}
          {FUEL_FILTERS.map(f => (
            <Badge
              key={f}
              variant={selectedFuel === f ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap capitalize"
              onClick={() => setSelectedFuel(selectedFuel === f ? null : f)}
            >
              {f}
            </Badge>
          ))}

          {/* Status filters */}
          {STATUS_FILTERS.map(s => (
            <Badge
              key={s.value}
              variant={selectedStatus === s.value ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedStatus(selectedStatus === s.value ? null : s.value)}
            >
              {s.label}
            </Badge>
          ))}

          {/* City filter */}
          {cities.map(c => (
            <Badge
              key={c}
              variant={selectedCity === c ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedCity(selectedCity === c ? null : c)}
            >
              📍 {c}
            </Badge>
          ))}

          {hasFilters && (
            <Badge
              variant="destructive"
              className="cursor-pointer whitespace-nowrap"
              onClick={() => {
                setSelectedCity(null)
                setSelectedType(null)
                setSelectedFuel(null)
                setSelectedStatus(null)
              }}
            >
              <X className="h-3 w-3 mr-1" /> Reset
            </Badge>
          )}
        </div>

        {/* View toggle */}
        <Tabs value={viewMode} onValueChange={v => setViewMode(v as 'map' | 'list')} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="map" className="flex-1">🗺️ Carte</TabsTrigger>
            <TabsTrigger value="list" className="flex-1">📋 Liste</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg animate-pulse" />
          </div>
        ) : viewMode === 'map' ? (
          <StationsMap stations={filtered} onSelectStation={setSelectedStation} />
        ) : (
          <div className="overflow-y-auto h-full px-4 pb-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Fuel className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>Aucune station trouvée</p>
              </div>
            ) : (
              filtered.map(station => (
                <StationCard
                  key={station.id}
                  station={station}
                  onClick={() => setSelectedStation(station)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Detail dialog */}
      {selectedStation && (
        <StationDetailDialog
          station={selectedStation}
          open={!!selectedStation}
          onClose={() => setSelectedStation(null)}
        />
      )}
    </div>
  )
}
