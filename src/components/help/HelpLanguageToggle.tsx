import { Button } from "@/components/ui/button"
import type { FaqLang } from "@/data/faqData"

const LANGS: { code: FaqLang; label: string; flag: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "wo", label: "Wolof", flag: "🇸🇳" },
  { code: "ha", label: "Hausa", flag: "🇳🇪" },
  { code: "en", label: "English", flag: "🇬🇧" },
]

interface Props {
  value: FaqLang
  onChange: (lang: FaqLang) => void
}

export function HelpLanguageToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-full border border-border/40 bg-background/60 p-1 backdrop-blur">
      {LANGS.map((l) => (
        <Button
          key={l.code}
          type="button"
          size="sm"
          variant={value === l.code ? "default" : "ghost"}
          onClick={() => onChange(l.code)}
          className="h-7 rounded-full px-3 text-xs"
        >
          <span className="mr-1">{l.flag}</span>
          {l.label}
        </Button>
      ))}
    </div>
  )
}
