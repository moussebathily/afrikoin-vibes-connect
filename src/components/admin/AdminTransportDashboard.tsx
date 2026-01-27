import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAdminRole } from '@/hooks/useAdminRole'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Users, Car, MapPin, TrendingUp, AlertTriangle, CheckCircle, 
  Clock, Ban, Search, RefreshCw, Eye, Shield, Activity,
  DollarSign, Star, Truck, Calendar
} from 'lucide-react'
import type { Driver, Vehicle, Ride, Rental, RideStatus, DriverStatus } from '@/types/transport'
import { AdminVehicleManagement } from './AdminVehicleManagement'
import { AdminTransportCharts } from './AdminTransportCharts'
import { AdminRentalManagement } from './AdminRentalManagement'
import { AdminExportButtons } from './AdminExportButtons'

interface AdminStats {
  totalDrivers: number
  activeDrivers: number
  pendingVerification: number
  totalVehicles: number
  activeVehicles: number
  totalRides: number
  completedRides: number
  pendingRides: number
  inProgressRides: number
  cancelledRides: number
  totalRevenue: number
  averageRating: number
}

export function AdminTransportDashboard() {
  const { isAdmin, loading: adminLoading } = useAdminRole()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<AdminStats>({
    totalDrivers: 0, activeDrivers: 0, pendingVerification: 0,
    totalVehicles: 0, activeVehicles: 0,
    totalRides: 0, completedRides: 0, pendingRides: 0, inProgressRides: 0, cancelledRides: 0,
    totalRevenue: 0, averageRating: 0
  })
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [rides, setRides] = useState<Ride[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchStats = useCallback(async () => {
    try {
      // Fetch drivers stats
      const { data: driversData } = await supabase.from('drivers').select('*')
      const driversList = driversData || []
      
      // Fetch vehicles stats
      const { data: vehiclesData } = await supabase.from('vehicles').select('*, driver:drivers(*)')
      const vehiclesList = vehiclesData || []
      
      // Fetch rides stats
      const { data: ridesData } = await supabase
        .from('rides')
        .select('*, driver:drivers(*), vehicle:vehicles(*)')
        .order('created_at', { ascending: false })
        .limit(100)
      const ridesList = ridesData || []

      // Fetch rentals
      const { data: rentalsData } = await supabase
        .from('rentals')
        .select('*, vehicle:vehicles(*), driver:drivers(*)')
        .order('created_at', { ascending: false })
        .limit(100)
      const rentalsList = rentalsData || []

      // Calculate stats
      const activeDrivers = driversList.filter(d => d.status === 'available' || d.status === 'busy').length
      const pendingVerification = driversList.filter(d => !d.is_verified).length
      const activeVehicles = vehiclesList.filter(v => v.is_active && v.is_verified).length
      const completedRides = ridesList.filter(r => r.status === 'completed').length
      const pendingRides = ridesList.filter(r => r.status === 'pending').length
      const inProgressRides = ridesList.filter(r => r.status === 'in_progress' || r.status === 'accepted').length
      const cancelledRides = ridesList.filter(r => r.status === 'cancelled').length
      const totalRevenue = ridesList
        .filter(r => r.status === 'completed' && r.payment_status === 'paid')
        .reduce((sum, r) => sum + (r.final_price || r.estimated_price || 0), 0)
      const ratingsSum = driversList.reduce((sum, d) => sum + (d.average_rating || 0), 0)
      const averageRating = driversList.length > 0 ? ratingsSum / driversList.length : 0

      setStats({
        totalDrivers: driversList.length,
        activeDrivers,
        pendingVerification,
        totalVehicles: vehiclesList.length,
        activeVehicles,
        totalRides: ridesList.length,
        completedRides,
        pendingRides,
        inProgressRides,
        cancelledRides,
        totalRevenue,
        averageRating
      })

      setDrivers(driversList as Driver[])
      setVehicles(vehiclesList as Vehicle[])
      setRides(ridesList as Ride[])
      setRentals(rentalsList as Rental[])
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      toast({ title: 'Erreur', description: 'Impossible de charger les statistiques', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (isAdmin) {
      fetchStats()
      
      // Real-time subscriptions
      const ridesChannel = supabase
        .channel('admin-rides-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rides' }, () => {
          fetchStats()
        })
        .subscribe()

      const driversChannel = supabase
        .channel('admin-drivers-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'drivers' }, () => {
          fetchStats()
        })
        .subscribe()

      return () => {
        supabase.removeChannel(ridesChannel)
        supabase.removeChannel(driversChannel)
      }
    }
  }, [isAdmin, fetchStats])

  const updateDriverStatus = async (driverId: string, isActive: boolean, isVerified: boolean) => {
    try {
      const { error } = await supabase
        .from('drivers')
        .update({ is_active: isActive, is_verified: isVerified })
        .eq('id', driverId)

      if (error) throw error

      toast({ title: 'Succès', description: 'Statut du chauffeur mis à jour' })
      fetchStats()
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le statut', variant: 'destructive' })
    }
  }

  const updateVehicleStatus = async (vehicleId: string, isActive: boolean, isVerified: boolean) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ is_active: isActive, is_verified: isVerified })
        .eq('id', vehicleId)

      if (error) throw error

      toast({ title: 'Succès', description: 'Statut du véhicule mis à jour' })
      fetchStats()
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le statut', variant: 'destructive' })
    }
  }

  const cancelRide = async (rideId: string) => {
    try {
      const { error } = await supabase
        .from('rides')
        .update({ status: 'cancelled' as RideStatus, cancelled_at: new Date().toISOString(), cancellation_reason: 'Annulée par admin' })
        .eq('id', rideId)

      if (error) throw error

      toast({ title: 'Succès', description: 'Course annulée' })
      fetchStats()
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible d\'annuler la course', variant: 'destructive' })
    }
  }

  const getStatusBadge = (status: RideStatus) => {
    const config: Record<RideStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'En attente', variant: 'secondary' },
      accepted: { label: 'Acceptée', variant: 'default' },
      in_progress: { label: 'En cours', variant: 'default' },
      completed: { label: 'Terminée', variant: 'outline' },
      cancelled: { label: 'Annulée', variant: 'destructive' }
    }
    const { label, variant } = config[status] || { label: status, variant: 'secondary' }
    return <Badge variant={variant}>{label}</Badge>
  }

  const getDriverStatusBadge = (status: DriverStatus) => {
    const config: Record<DriverStatus, { label: string; className: string }> = {
      offline: { label: 'Hors ligne', className: 'bg-muted text-muted-foreground' },
      available: { label: 'Disponible', className: 'bg-green-500/20 text-green-700 dark:text-green-400' },
      busy: { label: 'Occupé', className: 'bg-orange-500/20 text-orange-700 dark:text-orange-400' }
    }
    const { label, className } = config[status] || { label: status, className: '' }
    return <Badge className={className}>{label}</Badge>
  }

  const filteredDrivers = drivers.filter(d => 
    d.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.phone.includes(searchTerm)
  )

  const filteredRides = rides.filter(r => 
    r.ride_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.pickup_address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="flex flex-col items-center py-8 text-center">
          <Shield className="h-16 w-16 text-destructive mb-4" />
          <h3 className="text-xl font-bold mb-2">Accès refusé</h3>
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour accéder au tableau de bord admin.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Dashboard Admin Transport
          </h2>
          <p className="text-muted-foreground">Gestion des chauffeurs, véhicules et courses</p>
        </div>
        <div className="flex gap-2">
          <AdminExportButtons rides={rides} drivers={drivers} vehicles={vehicles} rentals={rentals} />
          <Button onClick={fetchStats} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chauffeurs</p>
                <p className="text-2xl font-bold">{stats.totalDrivers}</p>
                <p className="text-xs text-green-600">{stats.activeDrivers} actifs</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Véhicules</p>
                <p className="text-2xl font-bold">{stats.totalVehicles}</p>
                <p className="text-xs text-green-600">{stats.activeVehicles} vérifiés</p>
              </div>
              <Car className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Courses</p>
                <p className="text-2xl font-bold">{stats.totalRides}</p>
                <p className="text-xs text-orange-600">{stats.inProgressRides} en cours</p>
              </div>
              <MapPin className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenus</p>
                <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">FCFA</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <Card className="bg-yellow-500/10">
          <CardContent className="py-3 text-center">
            <Clock className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
            <p className="text-lg font-bold">{stats.pendingRides}</p>
            <p className="text-xs text-muted-foreground">En attente</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-500/10">
          <CardContent className="py-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <p className="text-lg font-bold">{stats.completedRides}</p>
            <p className="text-xs text-muted-foreground">Terminées</p>
          </CardContent>
        </Card>
        
        <Card className="bg-red-500/10">
          <CardContent className="py-3 text-center">
            <Ban className="h-5 w-5 mx-auto text-red-600 mb-1" />
            <p className="text-lg font-bold">{stats.cancelledRides}</p>
            <p className="text-xs text-muted-foreground">Annulées</p>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-500/10">
          <CardContent className="py-3 text-center">
            <AlertTriangle className="h-5 w-5 mx-auto text-orange-600 mb-1" />
            <p className="text-lg font-bold">{stats.pendingVerification}</p>
            <p className="text-xs text-muted-foreground">À vérifier</p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-500/10">
          <CardContent className="py-3 text-center">
            <Activity className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <p className="text-lg font-bold">{stats.inProgressRides}</p>
            <p className="text-xs text-muted-foreground">En cours</p>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-500/10">
          <CardContent className="py-3 text-center">
            <Star className="h-5 w-5 mx-auto text-purple-600 mb-1" />
            <p className="text-lg font-bold">{stats.averageRating.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Note moy.</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Aperçu</span>
          </TabsTrigger>
          <TabsTrigger value="drivers" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Chauffeurs</span>
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="gap-2">
            <Car className="h-4 w-4" />
            <span className="hidden sm:inline">Véhicules</span>
          </TabsTrigger>
          <TabsTrigger value="rides" className="gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Courses</span>
          </TabsTrigger>
          <TabsTrigger value="rentals" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Locations</span>
          </TabsTrigger>
        </TabsList>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Charts */}
          <AdminTransportCharts rides={rides} vehicles={vehicles} drivers={drivers} />
          
          {/* Recent Rides */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Courses récentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rides.slice(0, 5).map(ride => (
                <div key={ride.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{ride.ride_number}</span>
                      {getStatusBadge(ride.status)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{ride.pickup_address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{(ride.final_price || ride.estimated_price).toLocaleString()} FCFA</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ride.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drivers Tab */}
        <TabsContent value="drivers" className="space-y-4">
          {filteredDrivers.map(driver => (
            <Card key={driver.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{driver.full_name}</h4>
                      <p className="text-sm text-muted-foreground">{driver.phone}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getDriverStatusBadge(driver.status)}
                        {driver.is_verified ? (
                          <Badge className="bg-green-500/20 text-green-700">Vérifié</Badge>
                        ) : (
                          <Badge variant="destructive">Non vérifié</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-bold">{driver.average_rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{driver.total_rides} courses</p>
                    <p className="text-sm font-medium text-green-600">
                      {driver.total_earnings?.toLocaleString() || 0} FCFA
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  {!driver.is_verified && (
                    <Button 
                      size="sm" 
                      onClick={() => updateDriverStatus(driver.id, true, true)}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Vérifier
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant={driver.is_active ? "destructive" : "default"}
                    onClick={() => updateDriverStatus(driver.id, !driver.is_active, driver.is_verified)}
                    className="flex-1"
                  >
                    {driver.is_active ? <Ban className="h-4 w-4 mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                    {driver.is_active ? 'Désactiver' : 'Activer'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredDrivers.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucun chauffeur trouvé</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles">
          <AdminVehicleManagement 
            vehicles={vehicles} 
            drivers={drivers} 
            onRefresh={fetchStats} 
          />
        </TabsContent>

        {/* Rides Tab */}
        <TabsContent value="rides" className="space-y-4">
          {filteredRides.map(ride => (
            <Card key={ride.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">{ride.ride_number}</span>
                      {getStatusBadge(ride.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(ride.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {(ride.final_price || ride.estimated_price).toLocaleString()} FCFA
                    </p>
                    <Badge variant="outline">{ride.payment_status}</Badge>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                    <p className="flex-1">{ride.pickup_address}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    <p className="flex-1">{ride.dropoff_address}</p>
                  </div>
                </div>
                
                {ride.driver && (
                  <div className="flex items-center gap-2 mt-3 p-2 bg-muted/50 rounded">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{ride.driver.full_name}</span>
                    <span className="text-xs text-muted-foreground">{ride.driver.phone}</span>
                  </div>
                )}
                
                {(ride.status === 'pending' || ride.status === 'accepted' || ride.status === 'in_progress') && (
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="w-full mt-3"
                    onClick={() => cancelRide(ride.id)}
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    Annuler la course
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          
          {filteredRides.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucune course trouvée</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Rentals Tab */}
        <TabsContent value="rentals" className="space-y-4">
          <AdminRentalManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
