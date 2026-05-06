import { Sparkles, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface AIProductSuggestion {
  title?: string;
  description?: string;
  category?: string;
  suggested_price?: number;
  price_min?: number;
  price_max?: number;
  currency?: string;
  keywords?: string[];
  confidence?: "high" | "medium" | "low";
}

interface Props {
  suggestion: AIProductSuggestion;
  onApplyField: (field: keyof AIProductSuggestion, value: any) => void;
  onApplyAll: () => void;
  onDismiss: () => void;
}

const confidenceColor = {
  high: "bg-primary/15 text-primary border-primary/30",
  medium: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  low: "bg-destructive/15 text-destructive border-destructive/30",
};

export function AISuggestionPanel({
  suggestion,
  onApplyField,
  onApplyAll,
  onDismiss,
}: Props) {
  const conf = suggestion.confidence ?? "medium";

  const Row = ({
    label,
    value,
    field,
  }: {
    label: string;
    value: React.ReactNode;
    field: keyof AIProductSuggestion;
  }) => (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-border/30 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-sm break-words">{value}</p>
      </div>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onApplyField(field, suggestion[field])}
        className="shrink-0 h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary"
      >
        <Check className="h-3 w-3 mr-1" />
        Appliquer
      </Button>
    </div>
  );

  return (
    <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-3 space-y-2 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Suggestions IA</span>
          <Badge variant="outline" className={`text-[10px] ${confidenceColor[conf]}`}>
            confiance {conf}
          </Badge>
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onDismiss}
          className="h-6 w-6"
          aria-label="Fermer"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-1">
        {suggestion.title && (
          <Row label="Titre" value={suggestion.title} field="title" />
        )}
        {suggestion.description && (
          <Row
            label="Description"
            value={
              <span className="line-clamp-3">{suggestion.description}</span>
            }
            field="description"
          />
        )}
        {suggestion.category && (
          <Row label="Catégorie" value={suggestion.category} field="category" />
        )}
        {suggestion.suggested_price !== undefined && (
          <Row
            label={`Prix suggéré (${suggestion.currency ?? "XOF"})`}
            value={
              <>
                <span className="font-semibold">
                  {Math.round(suggestion.suggested_price).toLocaleString()}
                </span>
                {suggestion.price_min && suggestion.price_max && (
                  <span className="text-xs text-muted-foreground ml-2">
                    fourchette {Math.round(suggestion.price_min).toLocaleString()}–
                    {Math.round(suggestion.price_max).toLocaleString()}
                  </span>
                )}
              </>
            }
            field="suggested_price"
          />
        )}
        {suggestion.keywords && suggestion.keywords.length > 0 && (
          <div className="py-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
              Mots-clés SEO
            </p>
            <div className="flex flex-wrap gap-1">
              {suggestion.keywords.map((kw, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="text-[10px] font-normal"
                >
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button
        type="button"
        size="sm"
        onClick={onApplyAll}
        className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
      >
        <Check className="h-3 w-3 mr-1" />
        Tout appliquer aux champs vides
      </Button>
    </div>
  );
}
