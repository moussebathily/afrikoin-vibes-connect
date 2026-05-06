import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TRANSLATION_LANGUAGES, TranslationLang } from "@/hooks/useChatTranslation";
import { cn } from "@/lib/utils";

interface Props {
  value: TranslationLang;
  onChange: (lang: TranslationLang) => void;
}

export function TranslationToggle({ value, onChange }: Props) {
  const active = value !== "off";
  const current = TRANSLATION_LANGUAGES.find((l) => l.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Traduction live"
          title="Traduction live des messages"
          className={cn(
            "p-2 rounded-xl transition-colors flex items-center gap-1",
            active
              ? "bg-primary/15 text-primary hover:bg-primary/25"
              : "hover:bg-muted text-muted-foreground hover:text-foreground",
          )}
        >
          <Languages className="h-4 w-4" />
          {active && (
            <span className="text-[10px] font-semibold uppercase">
              {current?.value}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs">
          Traduire les messages reçus
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {TRANSLATION_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => onChange(lang.value)}
            className={cn(
              "text-sm flex items-center gap-2 cursor-pointer",
              value === lang.value && "bg-primary/10 text-primary font-medium",
            )}
          >
            <span>{lang.flag}</span>
            <span className="flex-1">{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
