import { Card, CardContent } from "@/components/ui/card";
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  Star, 
  ShoppingCart,
  Eye
} from "lucide-react";

interface SellerStatsProps {
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  rating: number;
  totalReviews: number;
  totalViews: number;
  currency?: string;
}

export function SellerStats({
  totalSales,
  totalRevenue,
  totalProducts,
  rating,
  totalReviews,
  totalViews,
  currency = "XOF"
}: SellerStatsProps) {
  const stats = [
    {
      label: "Ventes totales",
      value: totalSales.toLocaleString(),
      icon: ShoppingCart,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      label: "Revenus",
      value: `${(totalRevenue / 1000).toFixed(0)}K ${currency}`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      label: "Produits",
      value: totalProducts.toString(),
      icon: Package,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      label: "Note moyenne",
      value: rating.toFixed(1),
      subValue: `(${totalReviews} avis)`,
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      label: "Vues totales",
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      label: "Taux conversion",
      value: totalViews > 0 ? `${((totalSales / totalViews) * 100).toFixed(1)}%` : "0%",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <Card key={index} variant="elevated" className="hover-lift">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
                {stat.subValue && (
                  <p className="text-xs text-muted-foreground">{stat.subValue}</p>
                )}
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
