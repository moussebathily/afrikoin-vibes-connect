import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MapPin,
  Clock,
  Store,
  ShoppingBag,
  Users,
  Star,
  Search,
  Globe,
  Sparkles,
  ExternalLink,
  Phone,
  Navigation
} from 'lucide-react'
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
  imageUrl?: string
  coordinates?: { lat: number; lng: number }
  isFeatured?: boolean
  rating?: number
}

// Données des marchés africains emblématiques
const AFRICAN_MARKETS: LocalMarket[] = [
  // Afrique de l'Ouest
  {
    id: 'sandaga',
    name: 'Marché Sandaga',
    city: 'Dakar',
    country: 'Sénégal',
    region: 'west',
    description: 'Le plus grand marché de Dakar, cœur commercial du Sénégal. Produits artisanaux, tissus, épices et bien plus.',
    specialties: ['Tissus Wax', 'Artisanat', 'Épices', 'Bijoux'],
    openDays: 'Lundi - Samedi',
    openHours: '8h00 - 19h00',
    estimatedVendors: 3000,
    yearlyVisitors: '2M+',
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
    description: 'Le plus grand marché à ciel ouvert d\'Afrique de l\'Ouest, s\'étendant sur 20 hectares.',
    specialties: ['Vaudou', 'Pagnes', 'Fruits tropicaux', 'Poissons'],
    openDays: 'Tous les jours',
    openHours: '6h00 - 18h00',
    estimatedVendors: 10000,
    yearlyVisitors: '5M+',
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
    description: 'Le plus grand marché du Ghana et l\'un des plus grands d\'Afrique, entièrement couvert.',
    specialties: ['Kente', 'Gold', 'Cacao', 'Artisanat Ashanti'],
    openDays: 'Lundi - Samedi',
    openHours: '7h00 - 18h00',
    estimatedVendors: 12000,
    yearlyVisitors: '3M+',
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
    description: 'Centre commercial emblématique du Togo, géré traditionnellement par les "Nana Benz".',
    specialties: ['Pagnes', 'Cosmétiques', 'Perles', 'Épices'],
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
    description: 'Le plus grand marché d\'Abidjan, carrefour commercial majeur de l\'Afrique de l\'Ouest.',
    specialties: ['Attiéké', 'Pagnes', 'Électronique', 'Vivres'],
    openDays: 'Tous les jours',
    openHours: '6h00 - 20h00',
    estimatedVendors: 8000,
    yearlyVisitors: '4M+',
    rating: 4.3,
    coordinates: { lat: 5.3547, lng: -4.0235 }
  },
  {
    id: 'balogun',
    name: 'Balogun Market',
    city: 'Lagos',
    country: 'Nigeria',
    region: 'west',
    description: 'Le marché le plus animé de Lagos, réputé pour les textiles et la mode.',
    specialties: ['Ankara', 'Aso-Oke', 'Mode', 'Accessoires'],
    openDays: 'Lundi - Samedi',
    openHours: '7h00 - 19h00',
    estimatedVendors: 15000,
    yearlyVisitors: '10M+',
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
    description: 'L\'un des plus grands marchés d\'Afrique, spécialisé dans le commerce de gros.',
    specialties: ['Commerce de gros', 'Textiles', 'Électronique', 'Pièces auto'],
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
    description: 'Le plus grand marché de Tanzanie, plaque tournante du commerce est-africain.',
    specialties: ['Kitenge', 'Épices Zanzibar', 'Café', 'Artisanat Maasai'],
    openDays: 'Tous les jours',
    openHours: '6h00 - 18h00',
    estimatedVendors: 5000,
    yearlyVisitors: '3M+',
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
    description: 'Le plus grand marché à ciel ouvert d\'Afrique, voire du monde.',
    specialties: ['Café éthiopien', 'Épices', 'Cuir', 'Tissus traditionnels'],
    openDays: 'Tous les jours',
    openHours: '5h00 - 20h00',
    estimatedVendors: 30000,
    yearlyVisitors: '10M+',
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
    description: 'Marché itinérant proposant l\'artisanat traditionnel Maasai et kenyan.',
    specialties: ['Bijoux Maasai', 'Sculptures', 'Shuka', 'Art africain'],
    openDays: 'Rotatif (différents lieux)',
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
    description: 'Le plus grand marché de vêtements d\'occasion d\'Afrique de l\'Est.',
    specialties: ['Mitumba', 'Vêtements', 'Chaussures', 'Accessoires'],
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
    description: 'Labyrinthe légendaire de ruelles marchandes, classé au patrimoine mondial UNESCO.',
    specialties: ['Tapis berbères', 'Lanternes', 'Épices', 'Cuir'],
    openDays: 'Tous les jours',
    openHours: '9h00 - 21h00',
    estimatedVendors: 4000,
    yearlyVisitors: '15M+',
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
    description: 'Bazar historique datant du 14ème siècle, au cœur du Caire islamique.',
    specialties: ['Or', 'Argent', 'Parfums', 'Antiquités'],
    openDays: 'Tous les jours',
    openHours: '10h00 - 23h00',
    estimatedVendors: 1000,
    yearlyVisitors: '8M+',
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
    description: 'Souks millénaires de la médina, patrimoine mondial de l\'UNESCO.',
    specialties: ['Céramique', 'Tapis', 'Parfums', 'Huile d\'olive'],
    openDays: 'Tous les jours sauf Dimanche',
    openHours: '9h00 - 19h00',
    estimatedVendors: 2000,
    rating: 4.5,
    coordinates: { lat: 36.7992, lng: 10.1706 }
  },
  // Afrique Centrale
  {
    id: 'marche-central-kinshasa',
    name: 'Marché Central de Kinshasa',
    city: 'Kinshasa',
    country: 'RDC',
    region: 'central',
    description: 'Le plus grand marché de Kinshasa, cœur économique de la ville.',
    specialties: ['Manioc', 'Poisson fumé', 'Tissus', 'Artisanat'],
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
    description: 'Le plus grand marché de Yaoundé, célèbre pour ses produits frais.',
    specialties: ['Ndolé', 'Plantains', 'Épices', 'Artisanat Bamiléké'],
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
    description: 'Marché artisanal près des chutes Victoria, sculptures et art shona.',
    specialties: ['Sculptures Shona', 'Bois', 'Cuir', 'Bijoux'],
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
    description: 'Marché aux puces emblématique du centre-ville du Cap.',
    specialties: ['Artisanat africain', 'Mode', 'Art', 'Souvenirs'],
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
    description: 'Marché dominical populaire avec artisanat et gastronomie.',
    specialties: ['Artisanat', 'Food trucks', 'Vintage', 'Art'],
    openDays: 'Dimanche',
    openHours: '9h00 - 16h00',
    estimatedVendors: 600,
    rating: 4.5,
    coordinates: { lat: -26.1455, lng: 28.0434 }
  }
]

const regionLabels: Record<string, string> = {
  all: 'Tous',
  west: 'Afrique de l\'Ouest',
  east: 'Afrique de l\'Est',
  north: 'Afrique du Nord',
  central: 'Afrique Centrale',
  south: 'Afrique Australe'
}

interface MarketCardProps {
  market: LocalMarket
  onNavigate?: (market: LocalMarket) => void
}

function MarketCard({ market, onNavigate }: MarketCardProps) {
  return (
    <Card className={`group transition-all hover:shadow-lg ${market.isFeatured ? 'border-primary/50 ring-1 ring-primary/20' : ''}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image placeholder */}
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
            <Store className="h-8 w-8 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                  {market.name}
                </h3>
                {market.localName && (
                  <p className="text-xs text-muted-foreground italic">"{market.localName}"</p>
                )}
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {market.city}, {market.country}
                </p>
              </div>
              {market.isFeatured && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Top
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {market.description}
            </p>
            
            {/* Specialties */}
            <div className="flex flex-wrap gap-1 mt-2">
              {market.specialties.slice(0, 3).map((specialty, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {market.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{market.specialties.length - 3}
                </Badge>
              )}
            </div>
            
            {/* Info row */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {market.openDays}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {market.estimatedVendors.toLocaleString()}+ vendeurs
              </span>
              {market.rating && (
                <span className="flex items-center gap-1 text-amber-600">
                  <Star className="h-3 w-3 fill-current" />
                  {market.rating}
                </span>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex gap-2 mt-3">
              {market.coordinates && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps?q=${market.coordinates!.lat},${market.coordinates!.lng}`,
                      '_blank'
                    )
                  }}
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Itinéraire
                </Button>
              )}
              <Button variant="ghost" size="sm" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AfricanLocalMarkets() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeRegion, setActiveRegion] = useState('all')
  const { t } = useTranslation()

  // Filter markets
  const filteredMarkets = AFRICAN_MARKETS.filter(market => {
    const matchesSearch = 
      market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesRegion = activeRegion === 'all' || market.region === activeRegion
    
    return matchesSearch && matchesRegion
  })

  const featuredMarkets = filteredMarkets.filter(m => m.isFeatured)
  const regularMarkets = filteredMarkets.filter(m => !m.isFeatured)

  // Stats
  const stats = {
    total: AFRICAN_MARKETS.length,
    totalVendors: AFRICAN_MARKETS.reduce((sum, m) => sum + m.estimatedVendors, 0),
    countries: [...new Set(AFRICAN_MARKETS.map(m => m.country))].length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          {t('markets.localMarkets', 'Marchés Locaux Africains')}
        </h2>
        <p className="text-muted-foreground">
          {t('markets.localMarketsDesc', 'Découvrez les marchés emblématiques du continent africain')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <Store className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Marchés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Users className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="text-xl font-bold">{(stats.totalVendors / 1000).toFixed(0)}K+</p>
            <p className="text-xs text-muted-foreground">Vendeurs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Globe className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-xl font-bold">{stats.countries}</p>
            <p className="text-xs text-muted-foreground">Pays</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('markets.searchMarkets', 'Rechercher un marché, ville, pays, produit...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Region Tabs */}
      <Tabs value={activeRegion} onValueChange={setActiveRegion}>
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
          {Object.entries(regionLabels).map(([key, label]) => (
            <TabsTrigger key={key} value={key} className="text-xs">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Featured Markets */}
      {featuredMarkets.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Marchés Incontournables
          </h3>
          <div className="space-y-3">
            {featuredMarkets.map(market => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </section>
      )}

      {/* Regular Markets */}
      <section>
        <h3 className="text-lg font-semibold mb-3">
          {activeRegion === 'all' ? 'Tous les Marchés' : regionLabels[activeRegion]}
        </h3>
        <div className="space-y-3">
          {regularMarkets.length > 0 ? (
            regularMarkets.map(market => (
              <MarketCard key={market.id} market={market} />
            ))
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <Store className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Aucun marché trouvé</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
