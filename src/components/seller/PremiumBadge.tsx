import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PremiumBadge({ className, size = "md" }: PremiumBadgeProps) {
  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <Badge
      className={cn(
        "gap-1 border-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white shadow-md",
        className
      )}
    >
      <Crown className={iconSize} />
      Premium
    </Badge>
  );
}
