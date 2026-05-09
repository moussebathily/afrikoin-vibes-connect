import { useEffect, useState } from "react";
import { Loader2, Languages, Check } from "lucide-react";
import { LANG_LABELS, TranslationLang, useChatTranslation } from "@/hooks/useChatTranslation";
import { cn } from "@/lib/utils";

interface Props {
  text: string;
  /** When true, text is auto-translated. When false, only original is shown. */
  autoTranslate: boolean;
  targetLang: TranslationLang;
  className?: string;
}

function LangBadge({
  code,
  variant = "info",
  icon,
}: {
  code: string;
  variant?: "info" | "muted" | "success";
  icon?: React.ReactNode;
}) {
  const meta = LANG_LABELS[code] ?? { label: code.toUpperCase(), flag: "🌐" };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide",
        variant === "info" && "bg-primary/15 text-primary",
        variant === "muted" && "bg-muted text-muted-foreground",
        variant === "success" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      )}
      title={meta.label}
    >
      <span className="text-[11px] leading-none">{meta.flag}</span>
      <span>{code}</span>
      {icon}
    </span>
  );
}

/**
 * Renders chat text with optional live translation:
 * - auto-translate when autoTranslate=true and targetLang!=off
 * - shows visible badge of detected source language
 * - shows "already in target language" indicator when source==target
 */
export function TranslatedText({ text, autoTranslate, targetLang, className }: Props) {
  const { translate } = useChatTranslation();
  const [translated, setTranslated] = useState<string | null>(null);
  const [detected, setDetected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    setTranslated(null);
    setDetected(null);
    setShowOriginal(false);
    if (!autoTranslate || targetLang === "off" || !text?.trim()) return;

    let cancelled = false;
    setLoading(true);
    translate(text, targetLang)
      .then((entry) => {
        if (cancelled || !entry) return;
        setDetected(entry.detectedSource);
        // Keep translated even if same; we'll display "already in" badge
        setTranslated(entry.translated);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [text, autoTranslate, targetLang, translate]);

  if (loading && !translated) {
    return (
      <div className={className}>
        <p className="whitespace-pre-wrap break-words">{text}</p>
        <span className="mt-1 inline-flex items-center gap-1 text-[10px] opacity-70">
          <Loader2 className="h-2.5 w-2.5 animate-spin" />
          Traduction…
        </span>
      </div>
    );
  }

  // Not translating at all
  if (!autoTranslate || targetLang === "off" || !translated) {
    return <p className={cn("whitespace-pre-wrap break-words", className)}>{text}</p>;
  }

  const sameLang = detected === targetLang;

  return (
    <div className={className}>
      <p className="whitespace-pre-wrap break-words">
        {showOriginal || sameLang ? text : translated}
      </p>
      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
        {sameLang ? (
          <LangBadge
            code={targetLang}
            variant="success"
            icon={<Check className="h-2.5 w-2.5" />}
          />
        ) : (
          <>
            <LangBadge code={detected ?? "auto"} variant="muted" />
            <Languages className="h-2.5 w-2.5 opacity-60" />
            <LangBadge code={targetLang} variant="info" />
            <button
              type="button"
              onClick={() => setShowOriginal((s) => !s)}
              className="text-[10px] opacity-70 hover:opacity-100 underline-offset-2 hover:underline transition-opacity"
            >
              {showOriginal ? "voir traduction" : "voir original"}
            </button>
          </>
        )}
        {sameLang && (
          <span className="text-[10px] opacity-60">déjà dans la langue cible</span>
        )}
      </div>
    </div>
  );
}
