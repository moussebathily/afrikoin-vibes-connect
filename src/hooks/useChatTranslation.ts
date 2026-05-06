import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type TranslationLang = "fr" | "wo" | "ha" | "en" | "ar" | "sw" | "yo" | "off";

interface CacheEntry {
  translated: string;
  detectedSource: string;
}

// Module-level cache (lives until reload). Key = `${lang}|${text}`
const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<CacheEntry>>();

const STORAGE_KEY = "afrikoin:chat-translate-lang";

export function useChatTranslation() {
  const [targetLang, setTargetLangState] = useState<TranslationLang>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) as TranslationLang) || "off";
    } catch {
      return "off";
    }
  });

  const setTargetLang = useCallback((lang: TranslationLang) => {
    setTargetLangState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, []);

  const translate = useCallback(
    async (text: string, lang?: TranslationLang): Promise<CacheEntry | null> => {
      const target = lang ?? targetLang;
      if (!text?.trim() || target === "off") return null;

      const key = `${target}|${text}`;
      const cached = cache.get(key);
      if (cached) return cached;

      const pending = inflight.get(key);
      if (pending) return pending;

      const promise = (async () => {
        try {
          const { data, error } = await (supabase as any).functions.invoke(
            "ai-text-translator",
            {
              body: {
                text,
                targetLanguage: target,
                sourceLanguage: "auto",
                context: "chat",
              },
            },
          );
          if (error) throw error;
          if (data?.error) throw new Error(data.error);

          const entry: CacheEntry = {
            translated: data.translated_text ?? text,
            detectedSource: data.source_language ?? "auto",
          };
          cache.set(key, entry);
          return entry;
        } finally {
          inflight.delete(key);
        }
      })();

      inflight.set(key, promise);
      return promise;
    },
    [targetLang],
  );

  return { targetLang, setTargetLang, translate };
}

export const TRANSLATION_LANGUAGES: { value: TranslationLang; label: string; flag: string }[] = [
  { value: "off", label: "Désactivé", flag: "🚫" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "wo", label: "Wolof", flag: "🇸🇳" },
  { value: "ha", label: "Hausa", flag: "🇳🇪" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "ar", label: "العربية", flag: "🇸🇦" },
  { value: "sw", label: "Swahili", flag: "🇰🇪" },
  { value: "yo", label: "Yoruba", flag: "🇳🇬" },
];
