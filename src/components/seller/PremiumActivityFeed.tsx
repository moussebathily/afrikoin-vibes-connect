import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import {
  Activity,
  CreditCard,
  XCircle,
  RefreshCw,
  Webhook,
  Clock,
  CheckCircle2,
  Settings2,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";

interface PremiumActivity {
  id: string;
  event_type: string;
  source: string | null;
  plan: string | null;
  amount: number | null;
  currency: string | null;
  payment_method: string | null;
  previous_status: string | null;
  new_status: string | null;
  premium_until: string | null;
  message: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

const EVENT_META: Record<
  string,
  { label: string; Icon: any; className: string; badge: "default" | "secondary" | "destructive" | "outline" }
> = {
  payment: { label: "Paiement", Icon: CreditCard, className: "text-emerald-600 bg-emerald-500/10", badge: "default" },
  renewal: { label: "Renouvellement", Icon: RefreshCw, className: "text-blue-600 bg-blue-500/10", badge: "default" },
  reactivation: { label: "Réactivation", Icon: CheckCircle2, className: "text-emerald-600 bg-emerald-500/10", badge: "default" },
  webhook: { label: "Webhook", Icon: Webhook, className: "text-purple-600 bg-purple-500/10", badge: "secondary" },
  cancellation: { label: "Résiliation", Icon: XCircle, className: "text-amber-600 bg-amber-500/10", badge: "outline" },
  expiration: { label: "Expiration", Icon: Clock, className: "text-muted-foreground bg-muted", badge: "outline" },
  manual: { label: "Manuel", Icon: Settings2, className: "text-foreground bg-muted", badge: "secondary" },
};

interface Props {
  userId: string;
}

export function PremiumActivityFeed({ userId }: Props) {
  const [items, setItems] = useState<PremiumActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await (supabase as any)
      .from("seller_premium_activity")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(25);
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (!userId) return;
    load();

    const channel = (supabase as any)
      .channel(`premium-activity-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "seller_premium_activity",
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          setItems((prev) => [payload.new as PremiumActivity, ...prev].slice(0, 25));
        }
      )
      .subscribe();

    return () => {
      (supabase as any).removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Fil d'activité Premium
        </CardTitle>
        <CardDescription>
          Historique des événements ayant modifié votre statut Premium (paiements, webhooks, résiliations).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Aucune activité enregistrée pour le moment.
          </div>
        ) : (
          <ScrollArea className="max-h-[420px] pr-3">
            <ol className="relative border-l border-border ml-3 space-y-4">
              {items.map((it) => {
                const meta = EVENT_META[it.event_type] ?? EVENT_META.manual;
                const Icon = meta.Icon;
                return (
                  <li key={it.id} className="ml-6">
                    <span
                      className={`absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background ${meta.className}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={meta.badge}>{meta.label}</Badge>
                      {it.plan && <Badge variant="outline" className="capitalize">{it.plan}</Badge>}
                      {it.payment_method && (
                        <Badge variant="secondary" className="capitalize">
                          {it.payment_method.replace("_", " ")}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground" title={format(new Date(it.created_at), "Pp", { locale: fr })}>
                        {formatDistanceToNow(new Date(it.created_at), { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                    {it.message && (
                      <p className="mt-1 text-sm text-foreground">{it.message}</p>
                    )}
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {it.amount != null && (
                        <span>
                          Montant : <strong>{Number(it.amount).toLocaleString("fr-FR")} {it.currency ?? "XOF"}</strong>
                        </span>
                      )}
                      {it.premium_until && (
                        <span>
                          Jusqu'au {format(new Date(it.premium_until), "d MMM yyyy", { locale: fr })}
                        </span>
                      )}
                      {it.previous_status && it.new_status && (
                        <span>
                          {it.previous_status} → {it.new_status}
                        </span>
                      )}
                      {it.source && <span className="opacity-60">via {it.source}</span>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
