import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TrustScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function TrustScoreBadge({ score, size = "md", showLabel = true, className }: TrustScoreBadgeProps) {
  const tier =
    score >= 80 ? "elite" : score >= 60 ? "trusted" : score >= 30 ? "active" : "new";

  const config = {
    elite: {
      label: "Élite",
      Icon: ShieldCheck,
      color: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0",
    },
    trusted: {
      label: "Vérifié",
      Icon: ShieldCheck,
      color: "bg-primary text-primary-foreground border-0",
    },
    active: {
      label: "Actif",
      Icon: Shield,
      color: "bg-secondary text-secondary-foreground border-0",
    },
    new: {
      label: "Nouveau",
      Icon: ShieldAlert,
      color: "bg-muted text-muted-foreground border-0",
    },
  }[tier];

  const Icon = config.Icon;
  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={cn(config.color, "gap-1", className)}>
            <Icon className={iconSize} />
            {showLabel && (
              <span>
                {config.label} · {score}/100
              </span>
            )}
            {!showLabel && <span>{score}</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            Score de confiance basé sur les vérifications, ventes, avis et abonnement Premium.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
