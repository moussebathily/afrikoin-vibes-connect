import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export function FaqSearch({ value, onChange, placeholder }: Props) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Rechercher une question…"}
        className="h-11 rounded-full border-border/50 bg-background/60 pl-10 pr-10 backdrop-blur"
      />
      {value && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => onChange("")}
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
          aria-label="Effacer"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}
