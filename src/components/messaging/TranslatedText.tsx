import { useEffect, useState } from "react";
import { Loader2, Languages } from "lucide-react";
import { TranslationLang, useChatTranslation } from "@/hooks/useChatTranslation";
import { cn } from "@/lib/utils";

interface Props {
  text: string;
  /** When true, text is auto-translated. When false, only manual button shown. */
  autoTranslate: boolean;
  targetLang: TranslationLang;
  className?: string;
}

/**
 * Renders chat text with optional live translation:
 * - auto-translate when autoTranslate=true and targetLang!=off
 * - shows original toggle and source language detected
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
        // Skip showing badge if source matches target (already in language)
        if (entry.detectedSource === targetLang) {
          setTranslated(null);
        } else {
          setTranslated(entry.translated);
          setDetected(entry.detectedSource);
        }
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

  if (!translated) {
    return <p className={cn("whitespace-pre-wrap break-words", className)}>{text}</p>;
  }

  return (
    <div className={className}>
      <p className="whitespace-pre-wrap break-words">
        {showOriginal ? text : translated}
      </p>
      <button
        type="button"
        onClick={() => setShowOriginal((s) => !s)}
        className="mt-1 inline-flex items-center gap-1 text-[10px] opacity-70 hover:opacity-100 transition-opacity"
      >
        <Languages className="h-2.5 w-2.5" />
        {showOriginal
          ? `Voir la traduction (${targetLang})`
          : `Traduit depuis ${detected ?? "auto"} • voir l'original`}
      </button>
    </div>
  );
}
