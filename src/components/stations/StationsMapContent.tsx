import React, { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
// @ts-ignore - CSS import handled by Vite
import 'leaflet/dist/leaflet.css'
import type { Station } from '@/pages/StationsPage'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Fix default icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const stationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
})

const kiosqueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
})

const statusColors: Record<string, string> = {
  libre: 'bg-green-100 text-green-800',
  moyen: 'bg-yellow-100 text-yellow-800',
  bonde: 'bg-red-100 text-red-800',
}
const statusEmoji: Record<string, string> = { libre: '🟢', moyen: '🟠', bonde: '🔴' }

function FitBounds({ stations }: { stations: Station[] }) {
  const map = useMap()
  useEffect(() => {
    if (stations.length === 0) return
    const bounds = L.latLngBounds(stations.map(s => [Number(s.latitude), Number(s.longitude)]))
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
  }, [stations, map])
  return null
}

interface Props {
  stations: Station[]
  onSelectStation: (station: Station) => void
}

export default function StationsMapContent({ stations, onSelectStation }: Props) {
  const defaultCenter: [number, number] = [5.3364, -4.0267]

  return (
    <MapContainer center={defaultCenter} zoom={12} className="h-full w-full" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds stations={stations} />
      {stations.map(station => (
        <Marker
          key={station.id}
          position={[Number(station.latitude), Number(station.longitude)]}
          icon={station.type === 'kiosque' ? kiosqueIcon : stationIcon}
        >
          <Popup>
            <div className="min-w-[180px]">
              <div className="flex items-center gap-1 mb-1">
                <span>{station.type === 'kiosque' ? '🏪' : '⛽'}</span>
                <strong className="text-sm">{station.name}</strong>
              </div>
              <p className="text-xs text-gray-500 mb-1">{station.address}</p>
              <div className="flex items-center gap-1 mb-2">
                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${statusColors[station.current_status] || ''}`}>
                  {statusEmoji[station.current_status]} {station.current_status}
                </span>
              </div>
              {station.price_essence && (
                <p className="text-xs">Essence: <strong>{station.price_essence} F</strong></p>
              )}
              <button
                onClick={() => onSelectStation(station)}
                className="mt-2 w-full text-xs bg-blue-600 text-white rounded px-2 py-1 hover:bg-blue-700"
              >
                Voir détails
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
