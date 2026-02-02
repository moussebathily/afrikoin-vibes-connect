import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Users, Star, TrendingUp, TrendingDown, Minus, Trophy,
  Target, Clock, DollarSign, Car, Award, ChevronDown, ChevronUp
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts'
import type { Driver, Ride } from '@/types/transport'

interface DriverPerformanceProps {
  drivers: Driver[]
  rides: Ride[]
}

interface DriverStats {
  driver: Driver
  completedRides: number
  totalRevenue: number
  avgRevenuePerRide: number
  completionRate: number
  avgRating: number
  rankChange: 'up' | 'down' | 'stable'
  performanceScore: number
}

export function AdminDriverPerformance({ drivers, rides }: DriverPerformanceProps) {
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'revenue' | 'rides' | 'rating' | 'score'>('score')

  // Calculate detailed stats for each driver
  const driverStats = useMemo(() => {
    return drivers.map(driver => {
      const driverRides = rides.filter(r => r.driver_id === driver.id)
      const completedRides = driverRides.filter(r => r.status === 'completed')
      const cancelledRides = driverRides.filter(r => r.status === 'cancelled')
      
      const totalRevenue = completedRides.reduce(
        (sum, r) => sum + (r.final_price || r.estimated_price || 0), 0
      )
      const avgRevenuePerRide = completedRides.length > 0 
        ? totalRevenue / completedRides.length 
        : 0
      
      const completionRate = driverRides.length > 0 
        ? (completedRides.length / driverRides.length) * 100 
        : 0

      // Calculate performance score (0-100)
      const ratingScore = (driver.average_rating || 0) * 20 // Max 100
      const completionScore = completionRate // Max 100
      const activityScore = Math.min((completedRides.length / 10) * 100, 100) // Max 100 for 10+ rides
      const performanceScore = (ratingScore * 0.4 + completionScore * 0.4 + activityScore * 0.2)

      // Mock rank change for demo
      const rankChange: 'up' | 'down' | 'stable' = 
        performanceScore > 70 ? 'up' : performanceScore < 40 ? 'down' : 'stable'

      return {
        driver,
        completedRides: completedRides.length,
        totalRevenue,
        avgRevenuePerRide,
        completionRate,
        avgRating: driver.average_rating || 0,
        rankChange,
        performanceScore
      }
    })
  }, [drivers, rides])

  // Sort drivers based on selected criteria
  const sortedDriverStats = useMemo(() => {
    return [...driverStats].sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.totalRevenue - a.totalRevenue
        case 'rides':
          return b.completedRides - a.completedRides
        case 'rating':
          return b.avgRating - a.avgRating
        case 'score':
        default:
          return b.performanceScore - a.performanceScore
      }
    })
  }, [driverStats, sortBy])

  // Top performers
  const topPerformers = sortedDriverStats.slice(0, 3)

  // Chart data for top 10 drivers
  const chartData = sortedDriverStats.slice(0, 10).map(s => ({
    name: s.driver.full_name.split(' ')[0],
    courses: s.completedRides,
    revenus: Math.round(s.totalRevenue / 1000), // In thousands
    note: s.avgRating
  }))

  // Radar chart data for selected driver
  const getRadarData = (stats: DriverStats) => [
    { subject: 'Note', value: stats.avgRating * 20, fullMark: 100 },
    { subject: 'Courses', value: Math.min(stats.completedRides * 10, 100), fullMark: 100 },
    { subject: 'Revenus', value: Math.min(stats.totalRevenue / 500, 100), fullMark: 100 },
    { subject: 'Complétion', value: stats.completionRate, fullMark: 100 },
    { subject: 'Performance', value: stats.performanceScore, fullMark: 100 }
  ]

  const getRankIcon = (rank: 'up' | 'down' | 'stable') => {
    switch (rank) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500/20 text-green-700">Excellent</Badge>
    if (score >= 60) return <Badge className="bg-blue-500/20 text-blue-700">Bon</Badge>
    if (score >= 40) return <Badge className="bg-yellow-500/20 text-yellow-700">Moyen</Badge>
    return <Badge className="bg-red-500/20 text-red-700">À améliorer</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top 3 Chauffeurs
          </CardTitle>
          <CardDescription>Les meilleurs performers ce mois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPerformers.map((stats, index) => (
              <Card 
                key={stats.driver.id} 
                className={`relative overflow-hidden ${
                  index === 0 ? 'border-yellow-500/50 bg-yellow-500/5' :
                  index === 1 ? 'border-gray-400/50 bg-gray-400/5' :
                  'border-orange-600/50 bg-orange-600/5'
                }`}
              >
                <div className={`absolute top-0 right-0 w-16 h-16 ${
                  index === 0 ? 'bg-yellow-500/20' :
                  index === 1 ? 'bg-gray-400/20' :
                  'bg-orange-600/20'
                } rounded-bl-full flex items-start justify-end p-2`}>
                  <Award className={`h-5 w-5 ${
                    index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-500' :
                    'text-orange-600'
                  }`} />
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      index === 0 ? 'bg-yellow-500 text-yellow-950' :
                      index === 1 ? 'bg-gray-400 text-gray-950' :
                      'bg-orange-600 text-orange-950'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{stats.driver.full_name}</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{stats.avgRating.toFixed(1)}</span>
                        <span className="mx-1">•</span>
                        <span>{stats.completedRides} courses</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenus</span>
                      <span className="font-bold text-green-600">
                        {stats.totalRevenue.toLocaleString()} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Score</span>
                      <span className="font-bold">{stats.performanceScore.toFixed(0)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Comparatif des performances
          </CardTitle>
          <CardDescription>Top 10 chauffeurs par activité</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis yAxisId="left" className="text-xs" />
                <YAxis yAxisId="right" orientation="right" className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="courses" fill="hsl(var(--primary))" name="Courses" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="revenus" fill="hsl(142 76% 36%)" name="Revenus (k FCFA)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Driver List with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Performance par chauffeur
              </CardTitle>
              <CardDescription>Détails et métriques individuelles</CardDescription>
            </div>
            <div className="flex gap-2">
              {(['score', 'revenue', 'rides', 'rating'] as const).map(criteria => (
                <Button
                  key={criteria}
                  variant={sortBy === criteria ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy(criteria)}
                >
                  {criteria === 'score' && 'Score'}
                  {criteria === 'revenue' && 'Revenus'}
                  {criteria === 'rides' && 'Courses'}
                  {criteria === 'rating' && 'Note'}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedDriverStats.map((stats, index) => (
            <div key={stats.driver.id} className="border rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedDriver(
                  expandedDriver === stats.driver.id ? null : stats.driver.id
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    {getRankIcon(stats.rankChange)}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{stats.driver.full_name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span>{stats.avgRating.toFixed(1)}</span>
                      <span>•</span>
                      <span>{stats.completedRides} courses</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getPerformanceBadge(stats.performanceScore)}
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {stats.totalRevenue.toLocaleString()} FCFA
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Score: {stats.performanceScore.toFixed(0)}%
                    </p>
                  </div>
                  {expandedDriver === stats.driver.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
              
              {expandedDriver === stats.driver.id && (
                <div className="border-t p-4 bg-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Metrics */}
                    <div className="space-y-4">
                      <h5 className="font-semibold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Métriques détaillées
                      </h5>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Score de performance</span>
                            <span className="font-medium">{stats.performanceScore.toFixed(0)}%</span>
                          </div>
                          <Progress value={stats.performanceScore} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Taux de complétion</span>
                            <span className="font-medium">{stats.completionRate.toFixed(0)}%</span>
                          </div>
                          <Progress value={stats.completionRate} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Note moyenne</span>
                            <span className="font-medium">{stats.avgRating.toFixed(1)}/5</span>
                          </div>
                          <Progress value={stats.avgRating * 20} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-background rounded-lg border">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Car className="h-4 w-4" />
                            <span>Courses</span>
                          </div>
                          <p className="text-2xl font-bold mt-1">{stats.completedRides}</p>
                        </div>
                        <div className="p-3 bg-background rounded-lg border">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <DollarSign className="h-4 w-4" />
                            <span>Moy/course</span>
                          </div>
                          <p className="text-2xl font-bold mt-1">
                            {stats.avgRevenuePerRide.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Radar Chart */}
                    <div>
                      <h5 className="font-semibold flex items-center gap-2 mb-4">
                        <Target className="h-4 w-4" />
                        Profil de performance
                      </h5>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={getRadarData(stats)}>
                            <PolarGrid className="stroke-muted" />
                            <PolarAngleAxis dataKey="subject" className="text-xs" />
                            <PolarRadiusAxis 
                              angle={30} 
                              domain={[0, 100]} 
                              className="text-xs"
                            />
                            <Radar
                              name="Performance"
                              dataKey="value"
                              stroke="hsl(var(--primary))"
                              fill="hsl(var(--primary))"
                              fillOpacity={0.5}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {sortedDriverStats.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Aucun chauffeur à afficher</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
