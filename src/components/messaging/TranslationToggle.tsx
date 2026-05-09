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
  translateOwn: boolean;
  onTranslateOwnChange: (value: boolean) => void;
}

export function TranslationToggle({
  value,
  onChange,
  translateOwn,
  onTranslateOwnChange,
}: Props) {
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
      <DropdownMenuContent align="end" className="w-64">
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
        <DropdownMenuSeparator />
        <div
          className={cn(
            "flex items-center justify-between gap-2 px-2 py-2 text-xs",
            !active && "opacity-50 pointer-events-none",
          )}
        >
          <div className="flex flex-col">
            <span className="font-medium">Traduire aussi mes messages</span>
            <span className="text-[10px] text-muted-foreground">
              Afficher la traduction de ce que vous envoyez
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={translateOwn}
            disabled={!active}
            onClick={() => onTranslateOwnChange(!translateOwn)}
            className={cn(
              "relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors",
              translateOwn ? "bg-primary" : "bg-muted",
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-background shadow transition-transform",
                translateOwn ? "translate-x-4" : "translate-x-0.5",
              )}
            />
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
