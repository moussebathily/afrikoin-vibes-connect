import React, { useState, useEffect } from 'react'
import { MapPin, Navigation, Search, X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

// African countries with major cities
const AFRICAN_LOCATIONS = [
  { country: 'Sénégal', cities: ['Dakar', 'Saint-Louis', 'Thiès', 'Touba'] },
  { country: 'Nigeria', cities: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan'] },
  { country: "Côte d'Ivoire", cities: ['Abidjan', 'Yamoussoukro', 'Bouaké'] },
  { country: 'Kenya', cities: ['Nairobi', 'Mombasa', 'Kisumu'] },
  { country: 'Maroc', cities: ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger'] },
  { country: 'Ghana', cities: ['Accra', 'Kumasi', 'Tema'] },
  { country: 'Cameroun', cities: ['Douala', 'Yaoundé', 'Bafoussam'] },
  { country: 'Afrique du Sud', cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'] },
  { country: 'Éthiopie', cities: ['Addis Ababa', 'Dire Dawa'] },
  { country: 'Tanzanie', cities: ['Dar es Salaam', 'Dodoma', 'Zanzibar'] },
  { country: 'Égypte', cities: ['Cairo', 'Alexandria', 'Giza'] },
  { country: 'Algérie', cities: ['Alger', 'Oran', 'Constantine'] },
  { country: 'RDC', cities: ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi'] },
  { country: 'Mali', cities: ['Bamako', 'Sikasso', 'Ségou'] },
  { country: 'Burkina Faso', cities: ['Ouagadougou', 'Bobo-Dioulasso'] },
  { country: 'Rwanda', cities: ['Kigali'] },
  { country: 'Ouganda', cities: ['Kampala', 'Entebbe'] },
  { country: 'Tunisie', cities: ['Tunis', 'Sfax', 'Sousse'] },
  { country: 'Angola', cities: ['Luanda', 'Huambo'] },
  { country: 'Mozambique', cities: ['Maputo', 'Beira'] },
  { country: 'Madagascar', cities: ['Antananarivo', 'Toamasina'] },
  { country: 'Guinée', cities: ['Conakry', 'Nzérékoré'] },
  { country: 'Bénin', cities: ['Cotonou', 'Porto-Novo'] },
  { country: 'Togo', cities: ['Lomé', 'Sokodé'] },
  { country: 'Niger', cities: ['Niamey', 'Zinder'] },
  { country: 'Tchad', cities: ["N'Djamena", 'Moundou'] },
  { country: 'Gabon', cities: ['Libreville', 'Port-Gentil'] },
  { country: 'Congo', cities: ['Brazzaville', 'Pointe-Noire'] },
  { country: 'Maurice', cities: ['Port Louis'] },
  { country: 'Zambie', cities: ['Lusaka', 'Kitwe'] },
  { country: 'Zimbabwe', cities: ['Harare', 'Bulawayo'] },
]

interface LocationFilterProps {
  selectedLocations: string[]
  onLocationsChange: (locations: string[]) => void
  className?: string
}

export function LocationFilter({
  selectedLocations,
  onLocationsChange,
  className
}: LocationFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [currentLocationName, setCurrentLocationName] = useState<string | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(false)

  // Filter locations based on search
  const filteredLocations = AFRICAN_LOCATIONS.filter(loc =>
    loc.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.cities.some(city => city.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Toggle location selection
  const toggleLocation = (location: string) => {
    const newLocations = selectedLocations.includes(location)
      ? selectedLocations.filter(l => l !== location)
      : [...selectedLocations, location]
    onLocationsChange(newLocations)
  }

  // Toggle entire country
  const toggleCountry = (country: string, cities: string[]) => {
    const allCitiesSelected = cities.every(city => selectedLocations.includes(city))
    
    if (allCitiesSelected) {
      onLocationsChange(selectedLocations.filter(l => !cities.includes(l)))
    } else {
      const newLocations = [...new Set([...selectedLocations, ...cities])]
      onLocationsChange(newLocations)
    }
  }

  // Get user's current location
  const detectCurrentLocation = async () => {
    setLoadingLocation(true)
    
    try {
      if ('geolocation' in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000
          })
        })

        // Reverse geocoding using Nominatim
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
        )
        const data = await response.json()
        
        const city = data.address?.city || data.address?.town || data.address?.village
        const country = data.address?.country
        
        if (city) {
          setCurrentLocationName(`${city}, ${country}`)
          setUseCurrentLocation(true)
          
          // Add to selected locations if it matches an African city
          const matchedCity = AFRICAN_LOCATIONS.flatMap(l => l.cities).find(
            c => c.toLowerCase() === city.toLowerCase()
          )
          if (matchedCity && !selectedLocations.includes(matchedCity)) {
            onLocationsChange([...selectedLocations, matchedCity])
          }
        }
      }
    } catch (error) {
      console.error('Error detecting location:', error)
    } finally {
      setLoadingLocation(false)
    }
  }

  // Clear all selections
  const clearSelections = () => {
    onLocationsChange([])
    setUseCurrentLocation(false)
    setCurrentLocationName(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={`gap-2 ${className}`}>
          <MapPin className="h-4 w-4" />
          {selectedLocations.length > 0 ? (
            <span>
              {selectedLocations.length} lieu{selectedLocations.length > 1 ? 'x' : ''}
            </span>
          ) : (
            <span>Localisation</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Filtrer par localisation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current location button */}
          <Button
            variant={useCurrentLocation ? 'default' : 'outline'}
            className="w-full justify-start gap-2"
            onClick={detectCurrentLocation}
            disabled={loadingLocation}
          >
            <Navigation className={`h-4 w-4 ${loadingLocation ? 'animate-spin' : ''}`} />
            {loadingLocation 
              ? 'Détection en cours...' 
              : currentLocationName 
                ? currentLocationName 
                : 'Utiliser ma position actuelle'
            }
            {useCurrentLocation && <CheckCircle2 className="h-4 w-4 ml-auto text-green-500" />}
          </Button>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une ville ou un pays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Selected locations badges */}
          {selectedLocations.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedLocations.map(location => (
                <Badge
                  key={location}
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => toggleLocation(location)}
                >
                  {location}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-muted-foreground"
                onClick={clearSelections}
              >
                Tout effacer
              </Button>
            </div>
          )}

          {/* Location list */}
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {filteredLocations.map(({ country, cities }) => {
                const selectedCount = cities.filter(c => selectedLocations.includes(c)).length
                const allSelected = selectedCount === cities.length

                return (
                  <div key={country} className="space-y-1">
                    <button
                      onClick={() => toggleCountry(country, cities)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent text-sm font-medium"
                    >
                      <span>{country}</span>
                      <div className="flex items-center gap-2">
                        {selectedCount > 0 && (
                          <Badge variant={allSelected ? 'default' : 'secondary'} className="text-xs">
                            {selectedCount}/{cities.length}
                          </Badge>
                        )}
                      </div>
                    </button>
                    <div className="ml-4 flex flex-wrap gap-1">
                      {cities
                        .filter(city => 
                          !searchQuery || 
                          city.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(city => (
                          <Badge
                            key={city}
                            variant={selectedLocations.includes(city) ? 'default' : 'outline'}
                            className="cursor-pointer text-xs"
                            onClick={() => toggleLocation(city)}
                          >
                            {city}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>

          {/* Apply button */}
          <Button className="w-full" onClick={() => setIsOpen(false)}>
            Appliquer ({selectedLocations.length} sélectionné{selectedLocations.length > 1 ? 's' : ''})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
