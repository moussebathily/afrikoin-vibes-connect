import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, ZoomIn, ZoomOut, Layers, Store, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from 'react-i18next'

// Types
interface LocalMarket {
  id: string
  name: string
  localName?: string
  city: string
  country: string
  region: 'west' | 'east' | 'north' | 'central' | 'south'
  description: string
  specialties: string[]
  openDays: string
  openHours: string
  estimatedVendors: number
  yearlyVisitors?: string
  coordinates: { lat: number; lng: number }
  isFeatured?: boolean
  rating?: number
}

// Données des marchés africains avec coordonnées
const AFRICAN_MARKETS: LocalMarket[] = [
  // Afrique de l'Ouest
  {
    id: 'sandaga',
    name: 'Marché Sandaga',
    city: 'Dakar',
    country: 'Sénégal',
    region: 'west',
    description: 'Le plus grand marché de Dakar',
    specialties: ['Tissus Wax', 'Artisanat', 'Épices'],
    openDays: 'Lundi - Samedi',
    openHours: '8h00 - 19h00',
    estimatedVendors: 3000,
    isFeatured: true,
    rating: 4.5,
    coordinates: { lat: 14.6697, lng: -17.4359 }
  },
  {
    id: 'dantokpa',
    name: 'Marché Dantokpa',
    localName: 'Tokpa',
    city: 'Cotonou',
    country: 'Bénin',
    region: 'west',
    description: 'Le plus grand marché à ciel ouvert d\'Afrique de l\'Ouest',
    specialties: ['Vaudou', 'Pagnes', 'Fruits'],
    openDays: 'Tous les jours',
    openHours: '6h00 - 18h00',
    estimatedVendors: 10000,
    isFeatured: true,
    rating: 4.7,
    coordinates: { lat: 6.3616, lng: 2.4265 }
  },
  {
    id: 'kejetia',
    name: 'Kejetia Market',
    city: 'Kumasi',
    country: 'Ghana',
    region: 'west',
    description: 'Le plus grand marché du Ghana',
    specialties: ['Kente', 'Gold', 'Cacao'],
    openDays: 'Lundi - Samedi',
    openHours: '7h00 - 18h00',
    estimatedVendors: 12000,
    isFeatured: true,
    rating: 4.6,
    coordinates: { lat: 6.6867, lng: -1.6177 }
  },
  {
    id: 'grand-marche-lome',
    name: 'Grand Marché de Lomé',
    localName: 'Assigamé',
    city: 'Lomé',
    country: 'Togo',
    region: 'west',
    description: 'Centre commercial emblématique du Togo',
    specialties: ['Pagnes', 'Cosmétiques', 'Perles'],
    openDays: 'Lundi - Samedi',
    openHours: '7h00 - 18h00',
    estimatedVendors: 4000,
    rating: 4.4,
    coordinates: { lat: 6.1283, lng: 1.2226 }
  },
  {
    id: 'adjame',
    name: 'Marché d\'Adjamé',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    region: 'west',
    description: 'Le plus grand marché d\'Abidjan',
    specialties: ['Attiéké', 'Pagnes', 'Électronique'],
    openDays: 'Tous les jours',
    openHours: '6h00 - 20h00',
    estimatedVendors: 8000,
    rating: 4.3,
    coordinates: { lat: 5.3547, lng: -4.0235 }
  },
  {
    id: 'balogun',
    name: 'Balogun Market',
    city: 'Lagos',
    country: 'Nigeria',
    region: 'west',
    description: 'Le marché le plus animé de Lagos',
    specialties: ['Ankara', 'Aso-Oke', 'Mode'],
    openDays: 'Lundi - Samedi',
    openHours: '7h00 - 19h00',
    estimatedVendors: 15000,
    isFeatured: true,
    rating: 4.5,
    coordinates: { lat: 6.4548, lng: 3.3989 }
  },
  {
    id: 'onitsha',
    name: 'Onitsha Main Market',
    city: 'Onitsha',
    country: 'Nigeria',
    region: 'west',
    description: 'L\'un des plus grands marchés d\'Afrique',
    specialties: ['Commerce de gros', 'Textiles', 'Électronique'],
    openDays: 'Tous les jours',
    openHours: '6h00 - 19h00',
    estimatedVendors: 20000,
    rating: 4.4,
    coordinates: { lat: 6.1429, lng: 6.7906 }
  },
  // Afrique de l'Est
  {
    id: 'kariakoo',
    name: 'Kariakoo Market',
    city: 'Dar es Salaam',
    country: 'Tanzanie',
    region: 'east',
    description: 'Le plus grand marché de Tanzanie',
    specialties: ['Kitenge', 'Épices Zanzibar', 'Café'],
    openDays: 'Tous les jours',
    openHours: '6h00 - 18h00',
    estimatedVendors: 5000,
    isFeatured: true,
    rating: 4.5,
    coordinates: { lat: -6.8231, lng: 39.2724 }
  },
  {
    id: 'merkato',
    name: 'Merkato',
    city: 'Addis-Abeba',
    country: 'Éthiopie',
    region: 'east',
    description: 'Le plus grand marché à ciel ouvert d\'Afrique',
    specialties: ['Café éthiopien', 'Épices', 'Cuir'],
    openDays: 'Tous les jours',
    openHours: '5h00 - 20h00',
    estimatedVendors: 30000,
    isFeatured: true,
    rating: 4.8,
    coordinates: { lat: 9.0312, lng: 38.7345 }
  },
  {
    id: 'maasai-market',
    name: 'Maasai Market',
    city: 'Nairobi',
    country: 'Kenya',
    region: 'east',
    description: 'Marché d\'artisanat traditionnel Maasai',
    specialties: ['Bijoux Maasai', 'Sculptures', 'Shuka'],
    openDays: 'Rotatif',
    openHours: '9h00 - 18h00',
    estimatedVendors: 500,
    rating: 4.6,
    coordinates: { lat: -1.2867, lng: 36.8233 }
  },
  {
    id: 'gikomba',
    name: 'Gikomba Market',
    city: 'Nairobi',
    country: 'Kenya',
    region: 'east',
    description: 'Le plus grand marché de vêtements d\'occasion',
    specialties: ['Mitumba', 'Vêtements', 'Chaussures'],
    openDays: 'Tous les jours',
    openHours: '5h00 - 18h00',
    estimatedVendors: 6000,
    rating: 4.2,
    coordinates: { lat: -1.2898, lng: 36.8406 }
  },
  // Afrique du Nord
  {
    id: 'souks-marrakech',
    name: 'Souks de Marrakech',
    city: 'Marrakech',
    country: 'Maroc',
    region: 'north',
    description: 'Labyrinthe légendaire classé UNESCO',
    specialties: ['Tapis berbères', 'Lanternes', 'Épices'],
    openDays: 'Tous les jours',
    openHours: '9h00 - 21h00',
    estimatedVendors: 4000,
    isFeatured: true,
    rating: 4.9,
    coordinates: { lat: 31.6295, lng: -7.9811 }
  },
  {
    id: 'khan-el-khalili',
    name: 'Khan el-Khalili',
    city: 'Le Caire',
    country: 'Égypte',
    region: 'north',
    description: 'Bazar historique datant du 14ème siècle',
    specialties: ['Or', 'Argent', 'Parfums'],
    openDays: 'Tous les jours',
    openHours: '10h00 - 23h00',
    estimatedVendors: 1000,
    isFeatured: true,
    rating: 4.7,
    coordinates: { lat: 30.0477, lng: 31.2625 }
  },
  {
    id: 'medina-tunis',
    name: 'Médina de Tunis',
    city: 'Tunis',
    country: 'Tunisie',
    region: 'north',
    description: 'Souks millénaires patrimoine UNESCO',
    specialties: ['Céramique', 'Tapis', 'Parfums'],
    openDays: 'Tous les jours sauf Dimanche',
    openHours: '9h00 - 19h00',
    estimatedVendors: 2000,
    rating: 4.5,
    coordinates: { lat: 36.7992, lng: 10.1706 }
  },
  // Afrique Centrale
  {
    id: 'marche-central-kinshasa',
    name: 'Marché Central',
    city: 'Kinshasa',
    country: 'RDC',
    region: 'central',
    description: 'Le plus grand marché de Kinshasa',
    specialties: ['Manioc', 'Poisson fumé', 'Tissus'],
    openDays: 'Tous les jours',
    openHours: '6h00 - 18h00',
    estimatedVendors: 8000,
    rating: 4.2,
    coordinates: { lat: -4.3217, lng: 15.3097 }
  },
  {
    id: 'marche-mokolo',
    name: 'Marché Mokolo',
    city: 'Yaoundé',
    country: 'Cameroun',
    region: 'central',
    description: 'Le plus grand marché de Yaoundé',
    specialties: ['Ndolé', 'Plantains', 'Épices'],
    openDays: 'Tous les jours',
    openHours: '5h00 - 18h00',
    estimatedVendors: 4000,
    rating: 4.3,
    coordinates: { lat: 3.8761, lng: 11.5087 }
  },
  // Afrique Australe
  {
    id: 'victoria-falls',
    name: 'Victoria Falls Craft Market',
    city: 'Victoria Falls',
    country: 'Zimbabwe',
    region: 'south',
    description: 'Marché artisanal près des chutes Victoria',
    specialties: ['Sculptures Shona', 'Bois', 'Cuir'],
    openDays: 'Tous les jours',
    openHours: '8h00 - 17h00',
    estimatedVendors: 300,
    rating: 4.6,
    coordinates: { lat: -17.9242, lng: 25.8567 }
  },
  {
    id: 'greenmarket-square',
    name: 'Greenmarket Square',
    city: 'Cape Town',
    country: 'Afrique du Sud',
    region: 'south',
    description: 'Marché aux puces emblématique du Cap',
    specialties: ['Artisanat', 'Mode', 'Art'],
    openDays: 'Lundi - Samedi',
    openHours: '9h00 - 17h00',
    estimatedVendors: 200,
    rating: 4.4,
    coordinates: { lat: -33.9222, lng: 18.4234 }
  },
  {
    id: 'rosebank-market',
    name: 'Rosebank Sunday Market',
    city: 'Johannesburg',
    country: 'Afrique du Sud',
    region: 'south',
    description: 'Marché dominical populaire',
    specialties: ['Artisanat', 'Food', 'Vintage'],
    openDays: 'Dimanche',
    openHours: '9h00 - 16h00',
    estimatedVendors: 600,
    rating: 4.5,
    coordinates: { lat: -26.1455, lng: 28.0434 }
  }
]

const regionColors: Record<string, string> = {
  west: '#f59e0b',
  east: '#10b981',
  north: '#3b82f6',
  central: '#8b5cf6',
  south: '#ef4444'
}

const regionLabels: Record<string, string> = {
  west: 'Afrique de l\'Ouest',
  east: 'Afrique de l\'Est',
  north: 'Afrique du Nord',
  central: 'Afrique Centrale',
  south: 'Afrique Australe'
}

interface AfricanMarketsMapProps {
  onMarketSelect?: (market: LocalMarket) => void
  selectedMarketId?: string
  className?: string
}

export function AfricanMarketsMap({ 
  onMarketSelect, 
  selectedMarketId,
  className 
}: AfricanMarketsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState<LocalMarket | null>(null)
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const { t } = useTranslation()

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Add Leaflet CSS
        if (!document.getElementById('leaflet-css-markets')) {
          const link = document.createElement('link')
          link.id = 'leaflet-css-markets'
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
          attributionControl: false,
          minZoom: 2,
          maxZoom: 15
        })

        // Add tile layer with dark/light mode support
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap © CartoDB'
        }).addTo(mapInstance)

        // Custom marker icon function
        const createMarkerIcon = (market: LocalMarket, isSelected: boolean) => {
          const color = regionColors[market.region]
          const size = market.isFeatured ? 36 : 28
          const scale = isSelected ? 1.3 : 1
          
          return L.divIcon({
            className: 'custom-market-marker',
            html: `
              <div style="
                width: ${size * scale}px;
                height: ${size * scale}px;
                background: ${isSelected ? 'white' : color};
                border: 3px solid ${color};
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                transition: all 0.2s ease;
                cursor: pointer;
              ">
                <svg 
                  width="${(size * scale) / 2}" 
                  height="${(size * scale) / 2}" 
                  viewBox="0 0 24 24" 
                  fill="${isSelected ? color : 'white'}"
                  style="transform: rotate(45deg);"
                >
                  <path d="M4 7V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V7M4 7H20M4 7L8 3H16L20 7"/>
                </svg>
              </div>
            `,
            iconSize: [size * scale, size * scale],
            iconAnchor: [(size * scale) / 2, size * scale]
          })
        }

        // Add markers for each market
        const markers: any[] = []
        
        AFRICAN_MARKETS.forEach(market => {
          const isSelected = selectedMarketId === market.id

          const marker = L.marker([market.coordinates.lat, market.coordinates.lng], {
            icon: createMarkerIcon(market, isSelected)
          }).addTo(mapInstance)

          // Store reference
          markers.push({ market, marker })

          // Click handler
          marker.on('click', () => {
            setSelectedMarket(market)
            if (onMarketSelect) {
              onMarketSelect(market)
            }
            
            // Pan to marker
            mapInstance.setView([market.coordinates.lat, market.coordinates.lng], 8, {
              animate: true
            })
          })

          // Tooltip
          marker.bindTooltip(`
            <div style="text-align: center;">
              <strong>${market.name}</strong><br/>
              <small>${market.city}, ${market.country}</small>
            </div>
          `, {
            direction: 'top',
            offset: [0, -20]
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

  const handleZoomIn = () => map?.zoomIn()
  const handleZoomOut = () => map?.zoomOut()
  const handleCenterAfrica = () => map?.setView([5, 20], 3)
  
  const handleRegionFilter = (region: string) => {
    if (activeRegion === region) {
      setActiveRegion(null)
      map?.setView([5, 20], 3)
    } else {
      setActiveRegion(region)
      // Zoom to region
      const regionMarkets = AFRICAN_MARKETS.filter(m => m.region === region)
      if (regionMarkets.length > 0) {
        const avgLat = regionMarkets.reduce((sum, m) => sum + m.coordinates.lat, 0) / regionMarkets.length
        const avgLng = regionMarkets.reduce((sum, m) => sum + m.coordinates.lng, 0) / regionMarkets.length
        map?.setView([avgLat, avgLng], 5)
      }
    }
  }

  const closeMarketCard = () => setSelectedMarket(null)

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Carte des Marchés Africains
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
        {/* Region filter buttons */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {Object.entries(regionLabels).map(([key, label]) => (
            <Badge
              key={key}
              variant={activeRegion === key ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              style={{
                backgroundColor: activeRegion === key ? regionColors[key] : undefined,
                borderColor: regionColors[key],
                color: activeRegion === key ? 'white' : regionColors[key]
              }}
              onClick={() => handleRegionFilter(key)}
            >
              {label}
            </Badge>
          ))}
        </div>

        {/* Map container */}
        <div className="relative">
          <div 
            ref={mapRef} 
            className="w-full h-80 rounded-lg overflow-hidden bg-muted"
            style={{ minHeight: '320px' }}
          />
          
          {/* Selected market popup */}
          {selectedMarket && (
            <div className="absolute bottom-2 left-2 right-2 z-[1000]">
              <Card className="bg-background/95 backdrop-blur-sm shadow-lg">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{selectedMarket.name}</h4>
                        {selectedMarket.isFeatured && (
                          <Badge className="text-xs bg-amber-500">Top</Badge>
                        )}
                      </div>
                      {selectedMarket.localName && (
                        <p className="text-xs text-muted-foreground italic">"{selectedMarket.localName}"</p>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {selectedMarket.city}, {selectedMarket.country}
                      </p>
                      <p className="text-xs mt-1">{selectedMarket.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedMarket.specialties.slice(0, 3).map((s, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          size="sm" 
                          className="text-xs h-7"
                          onClick={() => {
                            window.open(
                              `https://www.google.com/maps?q=${selectedMarket.coordinates.lat},${selectedMarket.coordinates.lng}`,
                              '_blank'
                            )
                          }}
                        >
                          <Navigation className="h-3 w-3 mr-1" />
                          Itinéraire
                        </Button>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 flex-shrink-0"
                      onClick={closeMarketCard}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            Ouest
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            Est
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            Nord
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-violet-500" />
            Central
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            Sud
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
