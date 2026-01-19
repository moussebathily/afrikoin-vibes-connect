import React, { useEffect, useRef, useState, useMemo } from 'react'
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// African city coordinates
const AFRICAN_CITIES: Record<string, { lat: number; lng: number; country: string }> = {
  'Dakar': { lat: 14.6928, lng: -17.4467, country: 'Sénégal' },
  'Lagos': { lat: 6.5244, lng: 3.3792, country: 'Nigeria' },
  'Abidjan': { lat: 5.3600, lng: -4.0083, country: "Côte d'Ivoire" },
  'Nairobi': { lat: -1.2921, lng: 36.8219, country: 'Kenya' },
  'Casablanca': { lat: 33.5731, lng: -7.5898, country: 'Maroc' },
  'Accra': { lat: 5.6037, lng: -0.1870, country: 'Ghana' },
  'Douala': { lat: 4.0511, lng: 9.7679, country: 'Cameroun' },
  'Cape Town': { lat: -33.9249, lng: 18.4241, country: 'Afrique du Sud' },
  'Johannesburg': { lat: -26.2041, lng: 28.0473, country: 'Afrique du Sud' },
  'Addis Ababa': { lat: 9.0320, lng: 38.7469, country: 'Éthiopie' },
  'Kinshasa': { lat: -4.4419, lng: 15.2663, country: 'RDC' },
  'Dar es Salaam': { lat: -6.7924, lng: 39.2083, country: 'Tanzanie' },
  'Bamako': { lat: 12.6392, lng: -8.0029, country: 'Mali' },
  'Ouagadougou': { lat: 12.3714, lng: -1.5197, country: 'Burkina Faso' },
  'Tunis': { lat: 36.8065, lng: 10.1815, country: 'Tunisie' },
  'Alger': { lat: 36.7538, lng: 3.0588, country: 'Algérie' },
  'Cairo': { lat: 30.0444, lng: 31.2357, country: 'Égypte' },
  'Kigali': { lat: -1.9706, lng: 30.1044, country: 'Rwanda' },
  'Kampala': { lat: 0.3476, lng: 32.5825, country: 'Ouganda' },
  'Lusaka': { lat: -15.3875, lng: 28.3228, country: 'Zambie' },
  'Harare': { lat: -17.8252, lng: 31.0335, country: 'Zimbabwe' },
  'Maputo': { lat: -25.9692, lng: 32.5732, country: 'Mozambique' },
  'Luanda': { lat: -8.8390, lng: 13.2894, country: 'Angola' },
  'Cotonou': { lat: 6.3654, lng: 2.4183, country: 'Bénin' },
  'Lomé': { lat: 6.1375, lng: 1.2123, country: 'Togo' },
  'Niamey': { lat: 13.5137, lng: 2.1098, country: 'Niger' },
  'Conakry': { lat: 9.6412, lng: -13.5784, country: 'Guinée' },
  'Freetown': { lat: 8.4657, lng: -13.2317, country: 'Sierra Leone' },
  'Monrovia': { lat: 6.2907, lng: -10.7605, country: 'Liberia' },
  'Banjul': { lat: 13.4549, lng: -16.5790, country: 'Gambie' },
  'Nouakchott': { lat: 18.0735, lng: -15.9582, country: 'Mauritanie' },
  'Libreville': { lat: 0.4162, lng: 9.4673, country: 'Gabon' },
  'Brazzaville': { lat: -4.2634, lng: 15.2429, country: 'Congo' },
  'Bangui': { lat: 4.3947, lng: 18.5582, country: 'Centrafrique' },
  'N\'Djamena': { lat: 12.1348, lng: 15.0557, country: 'Tchad' },
  'Mogadishu': { lat: 2.0469, lng: 45.3182, country: 'Somalie' },
  'Asmara': { lat: 15.3229, lng: 38.9251, country: 'Érythrée' },
  'Djibouti': { lat: 11.5886, lng: 43.1456, country: 'Djibouti' },
  'Antananarivo': { lat: -18.8792, lng: 47.5079, country: 'Madagascar' },
  'Port Louis': { lat: -20.1609, lng: 57.5012, country: 'Maurice' },
}

interface JobLocation {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary?: string
  count?: number
}

interface JobLocationMapProps {
  jobs: JobLocation[]
  onLocationSelect?: (location: string) => void
  selectedLocation?: string
  className?: string
}

export function JobLocationMap({ 
  jobs, 
  onLocationSelect, 
  selectedLocation,
  className 
}: JobLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState<any>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  // Parse job locations and count jobs per city
  const locationStats = useMemo(() => {
    const stats: Record<string, { count: number; jobs: JobLocation[] }> = {}
    
    jobs.forEach(job => {
      // Extract city from location string (e.g., "Dakar, Sénégal" -> "Dakar")
      const cityMatch = job.location.split(',')[0].trim()
      
      // Find matching city in our coordinates
      const matchedCity = Object.keys(AFRICAN_CITIES).find(city => 
        cityMatch.toLowerCase().includes(city.toLowerCase()) ||
        city.toLowerCase().includes(cityMatch.toLowerCase())
      )
      
      if (matchedCity) {
        if (!stats[matchedCity]) {
          stats[matchedCity] = { count: 0, jobs: [] }
        }
        stats[matchedCity].count++
        stats[matchedCity].jobs.push(job)
      }
    })
    
    return stats
  }, [jobs])

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Add Leaflet CSS
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link')
          link.id = 'leaflet-css'
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(link)
        }

        // Import Leaflet
        const L = await import('leaflet')
        
        if (!mapRef.current || map) return

        // Initialize map centered on Africa
        const mapInstance = L.map(mapRef.current, {
          center: [5, 20],
          zoom: 3,
          zoomControl: false,
          attributionControl: false
        })

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(mapInstance)

        // Custom marker icon
        const createMarkerIcon = (count: number, isSelected: boolean) => {
          const size = Math.min(40, 20 + count * 4)
          return L.divIcon({
            className: 'custom-marker',
            html: `
              <div class="flex items-center justify-center rounded-full text-white font-bold text-xs shadow-lg transition-transform ${
                isSelected ? 'scale-125 ring-2 ring-white' : ''
              }" style="
                width: ${size}px;
                height: ${size}px;
                background: ${isSelected ? 'hsl(var(--primary))' : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.7))'};
              ">
                ${count}
              </div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2]
          })
        }

        // Add markers for each city with jobs
        Object.entries(locationStats).forEach(([city, data]) => {
          const coords = AFRICAN_CITIES[city]
          if (!coords) return

          const isSelected = selectedLocation?.includes(city) || selectedCity === city

          const marker = L.marker([coords.lat, coords.lng], {
            icon: createMarkerIcon(data.count, isSelected)
          }).addTo(mapInstance)

          // Popup content
          const popupContent = `
            <div class="p-2 min-w-48">
              <h3 class="font-bold text-sm">${city}, ${coords.country}</h3>
              <p class="text-xs text-gray-600 mb-2">${data.count} offre${data.count > 1 ? 's' : ''} d'emploi</p>
              <div class="space-y-1 max-h-32 overflow-y-auto">
                ${data.jobs.slice(0, 3).map(job => `
                  <div class="text-xs p-1 bg-gray-50 rounded">
                    <span class="font-medium">${job.title}</span>
                    <span class="text-gray-500"> - ${job.company}</span>
                  </div>
                `).join('')}
                ${data.count > 3 ? `<p class="text-xs text-gray-400">+${data.count - 3} autres...</p>` : ''}
              </div>
            </div>
          `

          marker.bindPopup(popupContent)

          marker.on('click', () => {
            setSelectedCity(city)
            if (onLocationSelect) {
              onLocationSelect(city)
            }
          })
        })

        setMap(mapInstance)
        setMapLoaded(true)
      } catch (error) {
        console.error('Error loading map:', error)
      }
    }

    loadLeaflet()

    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [])

  // Update markers when selection changes
  useEffect(() => {
    if (map && mapLoaded) {
      // Refresh map when selection changes
      map.invalidateSize()
    }
  }, [selectedLocation, selectedCity, map, mapLoaded])

  const handleZoomIn = () => map?.zoomIn()
  const handleZoomOut = () => map?.zoomOut()
  const handleCenterAfrica = () => map?.setView([5, 20], 3)

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Carte des offres
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleZoomIn}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleZoomOut}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleCenterAfrica}>
              <Navigation className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        {/* Map container */}
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-lg overflow-hidden bg-muted"
          style={{ minHeight: '256px' }}
        />
        
        {/* City stats badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {Object.entries(locationStats)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 6)
            .map(([city, data]) => (
              <Badge
                key={city}
                variant={selectedCity === city ? 'default' : 'secondary'}
                className="cursor-pointer text-xs"
                onClick={() => {
                  setSelectedCity(city === selectedCity ? null : city)
                  if (onLocationSelect) {
                    onLocationSelect(city === selectedCity ? '' : city)
                  }
                  if (map && AFRICAN_CITIES[city]) {
                    map.setView([AFRICAN_CITIES[city].lat, AFRICAN_CITIES[city].lng], 6)
                  }
                }}
              >
                <MapPin className="h-3 w-3 mr-1" />
                {city} ({data.count})
              </Badge>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
