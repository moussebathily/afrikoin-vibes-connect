import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type TranslationLang = "fr" | "wo" | "ha" | "en" | "ar" | "sw" | "yo" | "off";

interface CacheEntry {
  translated: string;
  detectedSource: string;
}

// ---- Persistent translation cache: key = `${source}|${target}|${text}` ----
const STORAGE_CACHE_KEY = "afrikoin:chat-translate-cache:v1";
const MAX_CACHE_ENTRIES = 500;

type SerializedCache = Record<string, CacheEntry>;

const loadCache = (): Map<string, CacheEntry> => {
  try {
    const raw = localStorage.getItem(STORAGE_CACHE_KEY);
    if (!raw) return new Map();
    const parsed = JSON.parse(raw) as SerializedCache;
    return new Map(Object.entries(parsed));
  } catch {
    return new Map();
  }
};

const cache: Map<string, CacheEntry> = loadCache();
const inflight = new Map<string, Promise<CacheEntry>>();

let persistTimer: ReturnType<typeof setTimeout> | null = null;
const persistCache = () => {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    try {
      // Trim to last MAX_CACHE_ENTRIES (Map preserves insertion order)
      if (cache.size > MAX_CACHE_ENTRIES) {
        const excess = cache.size - MAX_CACHE_ENTRIES;
        const it = cache.keys();
        for (let i = 0; i < excess; i++) {
          const k = it.next().value;
          if (k) cache.delete(k);
        }
      }
      const obj: SerializedCache = {};
      cache.forEach((v, k) => (obj[k] = v));
      localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(obj));
    } catch {}
  }, 400);
};

const STORAGE_KEY = "afrikoin:chat-translate-lang";
const STORAGE_KEY_OWN = "afrikoin:chat-translate-own";

export function useChatTranslation() {
  const [targetLang, setTargetLangState] = useState<TranslationLang>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) as TranslationLang) || "off";
    } catch {
      return "off";
    }
  });

  const [translateOwn, setTranslateOwnState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_OWN) === "1";
    } catch {
      return false;
    }
  });

  const userIdRef = useRef<string | null>(null);
  const hydratedRef = useRef(false);

  // Load remote settings once authenticated
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await (supabase as any).auth.getUser();
      if (!user || cancelled) return;
      userIdRef.current = user.id;
      const { data } = await (supabase as any)
        .from("user_settings")
        .select("chat_translate_lang, chat_translate_own")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        if (data.chat_translate_lang) {
          setTargetLangState(data.chat_translate_lang as TranslationLang);
          try { localStorage.setItem(STORAGE_KEY, data.chat_translate_lang); } catch {}
        }
        if (typeof data.chat_translate_own === "boolean") {
          setTranslateOwnState(data.chat_translate_own);
          try { localStorage.setItem(STORAGE_KEY_OWN, data.chat_translate_own ? "1" : "0"); } catch {}
        }
      }
      hydratedRef.current = true;
    })();
    return () => { cancelled = true; };
  }, []);

  // Debounced upsert to remote
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleSync = useCallback((lang: TranslationLang, own: boolean) => {
    if (!userIdRef.current || !hydratedRef.current) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      try {
        await (supabase as any)
          .from("user_settings")
          .upsert(
            {
              user_id: userIdRef.current,
              chat_translate_lang: lang,
              chat_translate_own: own,
            },
            { onConflict: "user_id" },
          );
      } catch {}
    }, 600);
  }, []);

  const setTargetLang = useCallback((lang: TranslationLang) => {
    setTargetLangState(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
    scheduleSync(lang, translateOwn);
  }, [translateOwn, scheduleSync]);

  const setTranslateOwn = useCallback((value: boolean) => {
    setTranslateOwnState(value);
    try { localStorage.setItem(STORAGE_KEY_OWN, value ? "1" : "0"); } catch {}
    scheduleSync(targetLang, value);
  }, [targetLang, scheduleSync]);

  const translate = useCallback(
    async (text: string, lang?: TranslationLang): Promise<CacheEntry | null> => {
      const target = lang ?? targetLang;
      if (!text?.trim() || target === "off") return null;

      // Try any cached entry by (source,target,text). First check known sources.
      const trimmed = text.trim();
      // Fast path: exact key with auto source
      const autoKey = `auto|${target}|${trimmed}`;
      const cachedAuto = cache.get(autoKey);
      if (cachedAuto) return cachedAuto;

      // Scan for any source that matches this text+target
      for (const [k, v] of cache) {
        if (k.endsWith(`|${target}|${trimmed}`)) return v;
      }

      const inflightKey = autoKey;
      const pending = inflight.get(inflightKey);
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
          // Store under detected source for better future hit rate
          const finalKey = `${entry.detectedSource}|${target}|${trimmed}`;
          cache.set(finalKey, entry);
          persistCache();
          return entry;
        } finally {
          inflight.delete(inflightKey);
        }
      })();

      inflight.set(inflightKey, promise);
      return promise;
    },
    [targetLang],
  );

  return { targetLang, setTargetLang, translateOwn, setTranslateOwn, translate };
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

export const LANG_LABELS: Record<string, { label: string; flag: string }> = {
  fr: { label: "Français", flag: "🇫🇷" },
  wo: { label: "Wolof", flag: "🇸🇳" },
  ha: { label: "Hausa", flag: "🇳🇪" },
  en: { label: "English", flag: "🇬🇧" },
  ar: { label: "Arabic", flag: "🇸🇦" },
  sw: { label: "Swahili", flag: "🇰🇪" },
  yo: { label: "Yoruba", flag: "🇳🇬" },
  auto: { label: "Auto", flag: "🌐" },
};
