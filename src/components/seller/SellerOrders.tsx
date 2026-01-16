import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  currency: string;
  payment_status: string;
  created_at: string;
}

interface SellerOrdersProps {
  orders: Order[];
  onViewOrder?: (orderId: string) => void;
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: "En attente", icon: Clock, color: "bg-yellow-500/10 text-yellow-500" },
  processing: { label: "En cours", icon: Package, color: "bg-blue-500/10 text-blue-500" },
  shipped: { label: "Expédiée", icon: Truck, color: "bg-accent/10 text-accent" },
  delivered: { label: "Livrée", icon: CheckCircle, color: "bg-success/10 text-success" },
  cancelled: { label: "Annulée", icon: XCircle, color: "bg-destructive/10 text-destructive" }
};

export function SellerOrders({ orders, onViewOrder }: SellerOrdersProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucune commande pour le moment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Commandes récentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {orders.map((order) => {
          const status = statusConfig[order.status] || statusConfig.pending;
          const StatusIcon = status.icon;

          return (
            <div 
              key={order.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onViewOrder?.(order.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${status.color}`}>
                  <StatusIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(order.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold">
                    {order.total_amount.toLocaleString()} {order.currency}
                  </p>
                  <Badge variant={order.payment_status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                    {order.payment_status === 'completed' ? 'Payé' : 'En attente'}
                  </Badge>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
