import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WeeklyRankingsCard } from '@/components/rankings/WeeklyRankingsCard'
import { supabase } from '@/integrations/supabase/client'
import { useTranslation } from 'react-i18next'
import { Trophy, Crown, Medal, Star } from 'lucide-react'
import { WeeklyRanking, ContentCategory } from '@/types/content'
import { toast } from 'sonner'

export function RankingsPage() {
  const [rankings, setRankings] = useState<WeeklyRanking[]>([])
  const [categories, setCategories] = useState<ContentCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  // Available countries (can be expanded)
  const countries = [
    { code: 'all', name: 'Tous les pays' },
    { code: 'DZ', name: 'Algérie' },
    { code: 'MA', name: 'Maroc' },
    { code: 'TN', name: 'Tunisie' },
    { code: 'SN', name: 'Sénégal' },
    { code: 'CI', name: 'Côte d\'Ivoire' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'GH', name: 'Ghana' },
    { code: 'KE', name: 'Kenya' },
    { code: 'ZA', name: 'Afrique du Sud' },
    { code: 'EG', name: 'Égypte' }
  ]

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchRankings()
  }, [selectedCategory, selectedCountry])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchRankings = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('weekly_rankings')
        .select(`
          *,
          profiles!weekly_rankings_user_id_fkey(name, avatar_url, is_verified)
        `)
        .order('rank_position')

      if (selectedCategory !== 'all') {
        query = query.eq('category_slug', selectedCategory)
      }

      if (selectedCountry !== 'all') {
        query = query.eq('country_code', selectedCountry)
      }

      const { data, error } = await query.limit(50)

      if (error) throw error
      setRankings(data || [])
    } catch (error) {
      console.error('Error fetching rankings:', error)
      toast.error('Erreur lors du chargement des classements')
    } finally {
      setLoading(false)
    }
  }

  const getTopPerformers = () => {
    return rankings.slice(0, 3)
  }

  const getRemainingRankings = () => {
    return rankings.slice(3)
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('rankings.title')}</h1>
            <p className="text-muted-foreground">{t('rankings.subtitle')}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sélectionner un pays" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {rankings.length > 0 ? (
        <div className="space-y-8">
          {/* Top 3 Podium */}
          {getTopPerformers().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  Podium de la semaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getTopPerformers().map((ranking, index) => {
                    const position = ranking.rank_position || index + 1
                    const colors = [
                      'bg-gradient-to-br from-yellow-400 to-yellow-600',
                      'bg-gradient-to-br from-gray-300 to-gray-500', 
                      'bg-gradient-to-br from-amber-400 to-amber-600'
                    ]
                    const icons = [Crown, Trophy, Medal]
                    const IconComponent = icons[position - 1] || Star

                    return (
                      <div
                        key={ranking.id}
                        className={`relative p-6 rounded-xl text-white ${colors[position - 1] || 'bg-muted'} text-center`}
                      >
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-white rounded-full p-2">
                            <IconComponent className="h-6 w-6 text-gray-800" />
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="text-3xl font-bold">#{position}</div>
                          <div className="text-lg font-semibold mt-2">
                            {ranking.profiles?.name || 'Utilisateur'}
                          </div>
                          {ranking.title && (
                            <div className="text-sm opacity-90 mt-1">
                              {ranking.title}
                            </div>
                          )}
                          <div className="text-2xl font-bold mt-3">
                            {ranking.total_score.toLocaleString()}
                          </div>
                          <div className="text-sm opacity-90">points</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Complete Rankings */}
          <WeeklyRankingsCard 
            rankings={rankings} 
            category={selectedCategory !== 'all' ? 
              categories.find(c => c.slug === selectedCategory)?.name || 'Toutes' : 
              'Toutes'
            }
            countryCode={selectedCountry !== 'all' ? selectedCountry : undefined}
          />
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun classement disponible</h3>
            <p className="text-muted-foreground">
              Les classements apparaîtront ici une fois que les utilisateurs commenceront à publier du contenu.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}