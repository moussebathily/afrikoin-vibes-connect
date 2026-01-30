import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, AreaChart, Area, ComposedChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Calendar, DollarSign, MapPin, CarFront, Minus } from 'lucide-react';
import type { Ride, Rental } from '@/types/transport';

interface AdminTrendChartsProps {
  rides: Ride[];
  rentals: Rental[];
}

type PeriodType = '7d' | '30d' | '90d';

const periodConfig: Record<PeriodType, { label: string; days: number }> = {
  '7d': { label: '7 jours', days: 7 },
  '30d': { label: '30 jours', days: 30 },
  '90d': { label: '90 jours', days: 90 },
};

export function AdminTrendCharts({ rides, rentals }: AdminTrendChartsProps) {
  const [period, setPeriod] = useState<PeriodType>('30d');

  // Generate daily data for the selected period
  const dailyData = useMemo(() => {
    const { days } = periodConfig[period];
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const data: Array<{
      date: string;
      label: string;
      rides: number;
      completedRides: number;
      cancelledRides: number;
      revenue: number;
      rentals: number;
      rentalRevenue: number;
    }> = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Format label based on period
      let label: string;
      if (days <= 7) {
        label = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      } else if (days <= 30) {
        label = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      } else {
        label = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      }

      // Count rides for this day
      const dayRides = rides.filter(r => r.created_at.split('T')[0] === dateStr);
      const completedRides = dayRides.filter(r => r.status === 'completed').length;
      const cancelledRides = dayRides.filter(r => r.status === 'cancelled').length;
      const revenue = dayRides
        .filter(r => r.status === 'completed' && r.payment_status === 'paid')
        .reduce((sum, r) => sum + (r.final_price || r.estimated_price || 0), 0);

      // Count rentals for this day
      const dayRentals = rentals.filter(r => r.created_at.split('T')[0] === dateStr);
      const rentalRevenue = dayRentals
        .filter(r => r.payment_status === 'paid')
        .reduce((sum, r) => sum + (r.total_amount || 0), 0);

      data.push({
        date: dateStr,
        label,
        rides: dayRides.length,
        completedRides,
        cancelledRides,
        revenue,
        rentals: dayRentals.length,
        rentalRevenue,
      });
    }

    return data;
  }, [rides, rentals, period]);

  // Calculate trends (compare last half vs first half of period)
  const trends = useMemo(() => {
    const midpoint = Math.floor(dailyData.length / 2);
    const firstHalf = dailyData.slice(0, midpoint);
    const secondHalf = dailyData.slice(midpoint);

    const firstRides = firstHalf.reduce((sum, d) => sum + d.rides, 0);
    const secondRides = secondHalf.reduce((sum, d) => sum + d.rides, 0);
    const ridesTrend = firstRides > 0 ? ((secondRides - firstRides) / firstRides) * 100 : 0;

    const firstRevenue = firstHalf.reduce((sum, d) => sum + d.revenue, 0);
    const secondRevenue = secondHalf.reduce((sum, d) => sum + d.revenue, 0);
    const revenueTrend = firstRevenue > 0 ? ((secondRevenue - firstRevenue) / firstRevenue) * 100 : 0;

    const firstRentals = firstHalf.reduce((sum, d) => sum + d.rentals, 0);
    const secondRentals = secondHalf.reduce((sum, d) => sum + d.rentals, 0);
    const rentalsTrend = firstRentals > 0 ? ((secondRentals - firstRentals) / firstRentals) * 100 : 0;

    return { ridesTrend, revenueTrend, rentalsTrend };
  }, [dailyData]);

  // Summary stats for period
  const periodStats = useMemo(() => {
    const totalRides = dailyData.reduce((sum, d) => sum + d.rides, 0);
    const totalCompleted = dailyData.reduce((sum, d) => sum + d.completedRides, 0);
    const totalCancelled = dailyData.reduce((sum, d) => sum + d.cancelledRides, 0);
    const totalRevenue = dailyData.reduce((sum, d) => sum + d.revenue, 0);
    const totalRentals = dailyData.reduce((sum, d) => sum + d.rentals, 0);
    const totalRentalRevenue = dailyData.reduce((sum, d) => sum + d.rentalRevenue, 0);
    const avgDailyRides = totalRides / dailyData.length;
    const avgDailyRevenue = totalRevenue / dailyData.length;

    return {
      totalRides,
      totalCompleted,
      totalCancelled,
      totalRevenue,
      totalRentals,
      totalRentalRevenue,
      avgDailyRides,
      avgDailyRevenue,
      completionRate: totalRides > 0 ? (totalCompleted / totalRides) * 100 : 0,
    };
  }, [dailyData]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const TrendIndicator = ({ value }: { value: number }) => {
    if (Math.abs(value) < 1) {
      return (
        <span className="flex items-center gap-1 text-muted-foreground text-sm">
          <Minus className="h-3 w-3" />
          Stable
        </span>
      );
    }
    if (value > 0) {
      return (
        <span className="flex items-center gap-1 text-green-600 text-sm">
          <TrendingUp className="h-3 w-3" />
          +{value.toFixed(1)}%
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-red-600 text-sm">
        <TrendingDown className="h-3 w-3" />
        {value.toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Period Selector & Summary */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Tendances par période
            </CardTitle>
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
              {(Object.keys(periodConfig) as PeriodType[]).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPeriod(p)}
                  className="h-7 px-3"
                >
                  {periodConfig[p].label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Courses</span>
                <TrendIndicator value={trends.ridesTrend} />
              </div>
              <p className="text-2xl font-bold">{periodStats.totalRides}</p>
              <p className="text-xs text-muted-foreground">
                ~{periodStats.avgDailyRides.toFixed(1)}/jour
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Revenus courses</span>
                <TrendIndicator value={trends.revenueTrend} />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(periodStats.totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">
                ~{formatCurrency(periodStats.avgDailyRevenue)}/jour
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Locations</span>
                <TrendIndicator value={trends.rentalsTrend} />
              </div>
              <p className="text-2xl font-bold">{periodStats.totalRentals}</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(periodStats.totalRentalRevenue)} FCFA
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Taux réussite</span>
                <Badge variant={periodStats.completionRate >= 80 ? 'default' : 'secondary'}>
                  {periodStats.completionRate.toFixed(0)}%
                </Badge>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">{periodStats.totalCompleted} ✓</span>
                <span className="text-red-600">{periodStats.totalCancelled} ✗</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-green-600" />
            Évolution des revenus ({periodConfig[period].label})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRentalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11 }} 
                interval={period === '90d' ? 6 : period === '30d' ? 2 : 0}
                className="text-muted-foreground"
              />
              <YAxis 
                tickFormatter={formatCurrency}
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString()} FCFA`, 
                  name === 'revenue' ? 'Courses' : 'Locations'
                ]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                name="Courses"
                stroke="#22c55e" 
                strokeWidth={2}
                fill="url(#colorRevenueGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="rentalRevenue" 
                name="Locations"
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fill="url(#colorRentalGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Rides Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-blue-600" />
            Évolution des courses ({periodConfig[period].label})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11 }}
                interval={period === '90d' ? 6 : period === '30d' ? 2 : 0}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 11 }}
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
              <Bar dataKey="rides" name="Total courses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.6} />
              <Line 
                type="monotone" 
                dataKey="completedRides" 
                name="Terminées"
                stroke="#22c55e" 
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="cancelledRides" 
                name="Annulées"
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Rentals Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CarFront className="h-5 w-5 text-purple-600" />
            Évolution des locations ({periodConfig[period].label})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11 }}
                interval={period === '90d' ? 6 : period === '30d' ? 2 : 0}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 11 }}
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
              <Line 
                type="monotone" 
                dataKey="rentals" 
                name="Nouvelles locations"
                stroke="#9333ea" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
