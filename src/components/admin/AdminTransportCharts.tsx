import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Car, MapPin, DollarSign } from 'lucide-react';
import type { Ride, Vehicle, Driver } from '@/types/transport';

interface AdminTransportChartsProps {
  rides: Ride[];
  vehicles: Vehicle[];
  drivers: Driver[];
}

export function AdminTransportCharts({ rides, vehicles, drivers }: AdminTransportChartsProps) {
  // Données pour le graphique des revenus par jour (7 derniers jours)
  const revenueByDay = useMemo(() => {
    const days: Record<string, number> = {};
    const today = new Date();
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      days[key] = 0;
    }
    
    // Sum revenues
    rides
      .filter(r => r.status === 'completed' && r.payment_status === 'paid')
      .forEach(ride => {
        const rideDate = new Date(ride.created_at);
        const daysDiff = Math.floor((today.getTime() - rideDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 6) {
          const key = rideDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
          if (days[key] !== undefined) {
            days[key] += ride.final_price || ride.estimated_price || 0;
          }
        }
      });
    
    return Object.entries(days).map(([name, revenue]) => ({ name, revenue }));
  }, [rides]);

  // Données pour le graphique des courses par jour
  const ridesByDay = useMemo(() => {
    const days: Record<string, { total: number; completed: number; cancelled: number }> = {};
    const today = new Date();
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      days[key] = { total: 0, completed: 0, cancelled: 0 };
    }
    
    // Count rides
    rides.forEach(ride => {
      const rideDate = new Date(ride.created_at);
      const daysDiff = Math.floor((today.getTime() - rideDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 6) {
        const key = rideDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
        if (days[key]) {
          days[key].total += 1;
          if (ride.status === 'completed') days[key].completed += 1;
          if (ride.status === 'cancelled') days[key].cancelled += 1;
        }
      }
    });
    
    return Object.entries(days).map(([name, data]) => ({ name, ...data }));
  }, [rides]);

  // Données pour le graphique des véhicules par type
  const vehiclesByType = useMemo(() => {
    const types: Record<string, number> = { moto: 0, taxi: 0, utility: 0, rental: 0 };
    
    vehicles.forEach(vehicle => {
      if (types[vehicle.vehicle_type] !== undefined) {
        types[vehicle.vehicle_type] += 1;
      }
    });
    
    return [
      { name: 'Motos', value: types.moto, color: 'hsl(var(--chart-1))' },
      { name: 'Taxis', value: types.taxi, color: 'hsl(var(--chart-2))' },
      { name: 'Utilitaires', value: types.utility, color: 'hsl(var(--chart-3))' },
      { name: 'Location', value: types.rental, color: 'hsl(var(--chart-4))' },
    ].filter(item => item.value > 0);
  }, [vehicles]);

  // Données pour le graphique des statuts des chauffeurs
  const driversByStatus = useMemo(() => {
    const statuses = { offline: 0, available: 0, busy: 0 };
    
    drivers.forEach(driver => {
      if (statuses[driver.status] !== undefined) {
        statuses[driver.status] += 1;
      }
    });
    
    return [
      { name: 'Disponibles', value: statuses.available, color: '#22c55e' },
      { name: 'Occupés', value: statuses.busy, color: '#f97316' },
      { name: 'Hors ligne', value: statuses.offline, color: '#6b7280' },
    ].filter(item => item.value > 0);
  }, [drivers]);

  // Véhicules actifs vs inactifs
  const vehicleStatus = useMemo(() => {
    const active = vehicles.filter(v => v.is_active && v.is_verified).length;
    const pending = vehicles.filter(v => v.is_active && !v.is_verified).length;
    const inactive = vehicles.filter(v => !v.is_active).length;
    
    return [
      { name: 'Actifs', value: active, color: '#22c55e' },
      { name: 'En attente', value: pending, color: '#f97316' },
      { name: 'Inactifs', value: inactive, color: '#ef4444' },
    ].filter(item => item.value > 0);
  }, [vehicles]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <div className="space-y-6">
      {/* Revenus par jour */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-green-600" />
            Revenus des 7 derniers jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueByDay}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                className="text-muted-foreground"
              />
              <YAxis 
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Revenus']}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Courses par jour */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-blue-600" />
            Courses des 7 derniers jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ridesByDay}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="total" name="Total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Terminées" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" name="Annulées" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Graphiques en camembert */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Véhicules par type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Car className="h-4 w-4" />
              Types de véhicules
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vehiclesByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={vehiclesByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {vehiclesByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value, 'Véhicules']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    iconType="circle" 
                    iconSize={8}
                    formatter={(value) => <span className="text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-muted-foreground">
                Aucun véhicule
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statut des véhicules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Statut véhicules
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vehicleStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={vehicleStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {vehicleStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value, 'Véhicules']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    iconType="circle" 
                    iconSize={8}
                    formatter={(value) => <span className="text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-muted-foreground">
                Aucune donnée
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statut des chauffeurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Statut chauffeurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {driversByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={driversByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {driversByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value, 'Chauffeurs']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    iconType="circle" 
                    iconSize={8}
                    formatter={(value) => <span className="text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-muted-foreground">
                Aucun chauffeur
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
