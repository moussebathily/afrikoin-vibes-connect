import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Download,
  FileText,
  FileSpreadsheet,
  FileBarChart,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

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
  const [exporting, setExporting] = useState<null | "csv" | "pdf" | "xlsx">(null);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

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

  const { toast } = useToast();

  const eventLabel = (t: string) => EVENT_META[t]?.label ?? t;

  const getTransactionId = (it: PremiumActivity) => {
    const md = it.metadata ?? {};
    return (
      md.transaction_id ||
      md.payment_id ||
      md.payment_intent ||
      md.payment_intent_id ||
      md.checkout_session_id ||
      md.session_id ||
      md.stripe_event_id ||
      md.event_id ||
      md.invoice_id ||
      md.reference ||
      md.tx_ref ||
      md.charge_id ||
      it.id
    );
  };

  const PLACEHOLDER = "—";

  // Normalize stream/video reference: returns a complete URL when possible,
  // otherwise a prefixed identifier (youtube:ID, twitch:ID, etc.).
  const getStreamRef = (it: PremiumActivity) => {
    const md = it.metadata ?? {};
    const isUrl = (v: any) => typeof v === "string" && /^https?:\/\//i.test(v);

    // 1) Direct URLs
    const directUrl =
      md.livestream_url ||
      md.live_url ||
      md.stream_url ||
      md.video_url ||
      md.video_link ||
      md.youtube_url ||
      md.twitch_url ||
      md.facebook_live_url;
    if (isUrl(directUrl)) return directUrl as string;

    // 2) Platform-specific IDs → reconstruct URL
    if (md.youtube_id) return `https://www.youtube.com/watch?v=${md.youtube_id}`;
    if (md.twitch_id || md.twitch_channel) return `https://www.twitch.tv/${md.twitch_id || md.twitch_channel}`;
    if (md.facebook_video_id) return `https://www.facebook.com/watch/?v=${md.facebook_video_id}`;
    if (md.tiktok_id) return `https://www.tiktok.com/video/${md.tiktok_id}`;

    // 3) Generic IDs → prefixed identifier
    const platform = (md.platform || md.provider || "").toString().toLowerCase();
    const genericId = md.livestream_id || md.stream_id || md.video_id || md.broadcast_id;
    if (genericId) {
      const prefix = platform || "stream";
      return `${prefix}:${genericId}`;
    }

    return "";
  };

  // Display value for stream column with placeholder fallback
  const streamCell = (it: PremiumActivity) => getStreamRef(it) || PLACEHOLDER;

  const formatAmount = (amount: number | null, currency: string | null) => {
    if (amount == null || isNaN(Number(amount))) return PLACEHOLDER;
    const cur = (currency || "").toUpperCase();
    if (!cur) {
      return `${Number(amount).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${PLACEHOLDER}`;
    }
    try {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: cur,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(amount));
    } catch {
      return `${Number(amount).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cur}`;
    }
  };

  const availablePlans = Array.from(new Set(items.map((i) => i.plan).filter(Boolean))) as string[];
  const availableTypes = Array.from(new Set(items.map((i) => i.event_type).filter(Boolean)));

  const filteredItems = items.filter((it) => {
    const t = new Date(it.created_at).getTime();
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (t < from.getTime()) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (t > to.getTime()) return false;
    }
    if (planFilter !== "all" && (it.plan ?? "") !== planFilter) return false;
    if (typeFilter !== "all" && it.event_type !== typeFilter) return false;
    return true;
  });

  const buildFileName = (ext: "csv" | "pdf" | "xlsx") => {
    const now = new Date();
    const ym = format(now, "yyyy-MM");
    const monthName = format(now, "MMMM", { locale: fr })
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const count = filteredItems.length;
    const range =
      dateFrom || dateTo
        ? `_${dateFrom || "debut"}_au_${dateTo || "fin"}`
        : "";
    const planTag = planFilter !== "all" ? `_plan-${planFilter}` : "";
    const typeTag = typeFilter !== "all" ? `_type-${typeFilter}` : "";
    return `activite-premium-${ym}-${monthName}${range}${planTag}${typeTag}-${count}evt${count > 1 ? "s" : ""}.${ext}`;
  };

  const exportCSV = async () => {
    if (!filteredItems.length || exporting) {
      if (!filteredItems.length) {
        toast({
          title: "Aucun événement à exporter",
          description: "Aucune activité ne correspond à la période sélectionnée.",
          variant: "destructive",
        });
      }
      return;
    }
    setExporting("csv");
    try {
      const headers = [
        "Date",
        "ID transaction",
        "Événement",
        "Source",
        "Plan",
        "Montant",
        "Devise",
        "Montant formaté",
        "Méthode de paiement",
        "Statut précédent",
        "Nouveau statut",
        "Premium jusqu'au",
        "Vidéo / Livestream",
        "Message",
      ];
      const escape = (v: any) => {
        const s = v == null ? "" : String(v);
        return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const rows = filteredItems.map((it) => [
        format(new Date(it.created_at), "yyyy-MM-dd HH:mm:ss"),
        getTransactionId(it),
        eventLabel(it.event_type),
        it.source ?? "",
        it.plan ?? "",
        it.amount != null ? Number(it.amount).toFixed(2) : "",
        (it.currency ?? "").toUpperCase(),
        formatAmount(it.amount, it.currency),
        it.payment_method ?? "",
        it.previous_status ?? "",
        it.new_status ?? "",
        it.premium_until ? format(new Date(it.premium_until), "yyyy-MM-dd") : "",
        getStreamRef(it),
        it.message ?? "",
      ]);
      const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
      const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = buildFileName("csv");
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Export CSV téléchargé", description: `${filteredItems.length} événement(s) exportés.` });
    } catch (err) {
      console.error("CSV export error:", err);
      toast({
        title: "Échec de l'export CSV",
        description: err instanceof Error ? err.message : "Une erreur est survenue lors de la génération du fichier CSV. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setExporting(null);
    }
  };

  const exportPDF = async () => {
    if (!filteredItems.length || exporting) {
      if (!filteredItems.length) {
        toast({
          title: "Aucun événement à exporter",
          description: "Aucune activité ne correspond à la période sélectionnée.",
          variant: "destructive",
        });
      }
      return;
    }
    setExporting("pdf");
    try {
      const [{ default: jsPDF }, autoTableMod] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);
      const autoTable = (autoTableMod as any).default ?? (autoTableMod as any);
      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      doc.setFontSize(16);
      doc.text("Fil d'activité Premium", 40, 40);
      doc.setFontSize(10);
      doc.setTextColor(100);
      const periodLabel =
        dateFrom || dateTo
          ? ` • Période : ${dateFrom ? format(new Date(dateFrom), "dd/MM/yyyy") : "début"} → ${dateTo ? format(new Date(dateTo), "dd/MM/yyyy") : "fin"}`
          : "";
      doc.text(
        `Généré le ${format(new Date(), "d MMMM yyyy 'à' HH:mm", { locale: fr })} • ${filteredItems.length} événement(s)${periodLabel}`,
        40,
        58
      );

      autoTable(doc, {
        startY: 75,
        head: [["Date", "ID transaction", "Événement", "Plan", "Montant", "Méthode", "Jusqu'au", "Vidéo / Live", "Message"]],
        body: filteredItems.map((it) => [
          format(new Date(it.created_at), "dd/MM/yyyy HH:mm", { locale: fr }),
          String(getTransactionId(it)),
          eventLabel(it.event_type),
          it.plan ?? "—",
          formatAmount(it.amount, it.currency) || "—",
          it.payment_method ?? "—",
          it.premium_until ? format(new Date(it.premium_until), "dd/MM/yyyy") : "—",
          String(getStreamRef(it) || "—"),
          it.message ?? "",
        ]),
        styles: { fontSize: 9, cellPadding: 6, overflow: "linebreak" },
        headStyles: { fillColor: [245, 158, 11], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 100, font: "courier", fontSize: 8 },
          2: { cellWidth: 65 },
          3: { cellWidth: 55 },
          4: { cellWidth: 85, halign: "right" },
          5: { cellWidth: 65 },
          6: { cellWidth: 60 },
          7: { cellWidth: 110, font: "courier", fontSize: 8 },
          8: { cellWidth: "auto" },
        },
        margin: { left: 40, right: 40 },
      });

      doc.save(buildFileName("pdf"));
      toast({ title: "Export PDF téléchargé", description: `${filteredItems.length} événement(s) exportés.` });
    } catch (err) {
      console.error("PDF export error:", err);
      toast({
        title: "Échec de l'export PDF",
        description: err instanceof Error ? err.message : "Une erreur est survenue lors de la génération du fichier PDF. Vérifiez votre connexion et réessayez.",
        variant: "destructive",
      });
    } finally {
      setExporting(null);
    }
  };

  const exportXLSX = async () => {
    if (!filteredItems.length || exporting) {
      if (!filteredItems.length) {
        toast({
          title: "Aucun événement à exporter",
          description: "Aucune activité ne correspond aux filtres sélectionnés.",
          variant: "destructive",
        });
      }
      return;
    }
    setExporting("xlsx");
    try {
      const XLSX = await import("xlsx");
      const headers = [
        "Date",
        "ID transaction",
        "Événement",
        "Source",
        "Plan",
        "Montant",
        "Devise",
        "Montant formaté",
        "Méthode de paiement",
        "Statut précédent",
        "Nouveau statut",
        "Premium jusqu'au",
        "Vidéo / Livestream",
        "Message",
      ];
      const rows = filteredItems.map((it) => [
        format(new Date(it.created_at), "yyyy-MM-dd HH:mm:ss"),
        String(getTransactionId(it)),
        eventLabel(it.event_type),
        it.source ?? "",
        it.plan ?? "",
        it.amount != null ? Number(it.amount) : "",
        (it.currency ?? "").toUpperCase(),
        formatAmount(it.amount, it.currency),
        it.payment_method ?? "",
        it.previous_status ?? "",
        it.new_status ?? "",
        it.premium_until ? format(new Date(it.premium_until), "yyyy-MM-dd") : "",
        String(getStreamRef(it) || ""),
        it.message ?? "",
      ]);
      const periodLabel = `${dateFrom || "début"} → ${dateTo || "fin"}`;
      const meta = [
        ["Fil d'activité Premium"],
        [`Généré le`, format(new Date(), "yyyy-MM-dd HH:mm")],
        [`Période`, periodLabel],
        [`Plan`, planFilter === "all" ? "Tous" : planFilter],
        [`Type`, typeFilter === "all" ? "Tous" : eventLabel(typeFilter)],
        [`Nombre d'événements`, filteredItems.length],
        [],
      ];
      const aoa = [...meta, headers, ...rows];
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      // Apply numeric format to "Montant" column (index 5) for each data row
      const headerRowIndex = meta.length; // 0-based; data rows follow
      const amountColLetter = XLSX.utils.encode_col(5);
      for (let i = 0; i < rows.length; i++) {
        const r = headerRowIndex + 1 + i; // skip header row
        const addr = `${amountColLetter}${r + 1}`;
        const cell = ws[addr];
        if (cell && typeof cell.v === "number") {
          cell.t = "n";
          cell.z = "#,##0.00";
        }
      }
      ws["!cols"] = [
        { wch: 20 }, { wch: 28 }, { wch: 16 }, { wch: 14 }, { wch: 12 },
        { wch: 14 }, { wch: 8 }, { wch: 18 }, { wch: 18 }, { wch: 16 },
        { wch: 16 }, { wch: 14 }, { wch: 40 }, { wch: 50 },
      ];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Activité Premium");
      XLSX.writeFile(wb, buildFileName("xlsx"));
      toast({ title: "Export XLSX téléchargé", description: `${filteredItems.length} événement(s) exportés.` });
    } catch (err) {
      console.error("XLSX export error:", err);
      toast({
        title: "Échec de l'export XLSX",
        description: err instanceof Error ? err.message : "Une erreur est survenue lors de la génération du fichier XLSX.",
        variant: "destructive",
      });
    } finally {
      setExporting(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Fil d'activité Premium
            </CardTitle>
            <CardDescription>
              Historique des événements ayant modifié votre statut Premium (paiements, webhooks, résiliations).
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={!filteredItems.length || exporting !== null}>
                {exporting !== null ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {exporting === "csv"
                  ? "Génération CSV…"
                  : exporting === "pdf"
                  ? "Génération PDF…"
                  : exporting === "xlsx"
                  ? "Génération XLSX…"
                  : `Exporter${filteredItems.length !== items.length ? ` (${filteredItems.length})` : ""}`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportCSV} disabled={exporting !== null}>
                {exporting === "csv" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                )}
                Exporter en CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportPDF} disabled={exporting !== null}>
                {exporting === "pdf" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                Exporter en PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportXLSX} disabled={exporting !== null}>
                {exporting === "xlsx" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileBarChart className="h-4 w-4 mr-2" />
                )}
                Exporter en XLSX
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {items.length > 0 && (
          <div className="mt-4 flex flex-wrap items-end gap-3 rounded-md border border-border bg-muted/30 p-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="premium-date-from" className="text-xs text-muted-foreground">Du</Label>
              <Input
                id="premium-date-from"
                type="date"
                value={dateFrom}
                max={dateTo || undefined}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 w-[160px]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="premium-date-to" className="text-xs text-muted-foreground">Au</Label>
              <Input
                id="premium-date-to"
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 w-[160px]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Plan</Label>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="h-9 w-[160px]">
                  <SelectValue placeholder="Tous les plans" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les plans</SelectItem>
                  {availablePlans.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Type d'événement</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {availableTypes.map((t) => (
                    <SelectItem key={t} value={t}>{eventLabel(t)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(dateFrom || dateTo || planFilter !== "all" || typeFilter !== "all") && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => { setDateFrom(""); setDateTo(""); setPlanFilter("all"); setTypeFilter("all"); }}
              >
                Réinitialiser
              </Button>
            )}
            <span className="ml-auto text-xs text-muted-foreground">
              {filteredItems.length} / {items.length} événement(s)
            </span>
          </div>
        )}
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
