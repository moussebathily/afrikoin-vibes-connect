
export type Language = 'fr' | 'en' | 'es' | 'ar' | 'pt' | 'zh' | 'ru' | 'de' | 'it' | 'hi' | 'tr' | 'ja' | 'ko' | 'lb' | 
  'bm' | 'so' | 'ml' | 'sg' | 'ta' | 'bo' | 'kh' | 'go' | 'se' | 'da' | 'lo' | 'sa' | 
  'ln' | 'ki' | 'kg' | 'fa' | 'pu' | 'my' | 'te' | 'gb' | 'mb' | 
  'sw' | 'am' | 'ti' | 'som' | 'or' | 
  'zu' | 'xh' | 'af' | 'kx' | 
  'ba' | 'bao' | 'mf' | 'mo' | 'wa';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  region?: string;
}

export const languages: LanguageOption[] = [
  // Langues internationales principales
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese (Mandarin)', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch', flag: '🇱🇺' },

  // Afrique de l'Ouest
  { code: 'bm', name: 'Bambara/Bamanankan', nativeName: 'Bamanankan', flag: '🇲🇱', region: 'Afrique de l\'Ouest' },
  { code: 'so', name: 'Soninké', nativeName: 'Soninké', flag: '🟡', region: 'Afrique de l\'Ouest' },
  { code: 'ml', name: 'Malinké/Mandinka', nativeName: 'Mandinka', flag: '🟡', region: 'Afrique de l\'Ouest' },
  { code: 'sg', name: 'Songhaï', nativeName: 'Songhaï', flag: '🟡', region: 'Afrique de l\'Ouest' },
  { code: 'ta', name: 'Tamasheq', nativeName: 'Tamasheq', flag: '🟡', region: 'Afrique de l\'Ouest' },
  { code: 'bo', name: 'Bozo', nativeName: 'Bozo', flag: '🟡', region: 'Afrique de l\'Ouest' },
  { code: 'kh', name: 'Khassonké', nativeName: 'Khassonké', flag: '🟡', region: 'Afrique de l\'Ouest' },
  { code: 'go', name: 'Gourmantchéma', nativeName: 'Gourmantchéma', flag: '🟡', region: 'Afrique de l\'Ouest' },
  { code: 'se', name: 'Sénoufo', nativeName: 'Sénoufo', flag: '🟡', region: 'Afrique de l\'Ouest' },
  { code: 'da', name: 'Daagare', nativeName: 'Daagare', flag: '🟡', region: 'Afrique de l\'Ouest' },
  { code: 'lo', name: 'Lobiri', nativeName: 'Lobiri', flag: '🟡', region: 'Afrique de l\'Ouest' },
  { code: 'sa', name: 'Samo', nativeName: 'Samo', flag: '🟡', region: 'Afrique de l\'Ouest' },

  // Afrique Centrale
  { code: 'ln', name: 'Lingala', nativeName: 'Lingála', flag: '🇨🇩', region: 'Afrique Centrale' },
  { code: 'ki', name: 'Kituba', nativeName: 'Kituba', flag: '🔵', region: 'Afrique Centrale' },
  { code: 'kg', name: 'Kikongo', nativeName: 'Kikongo', flag: '🔵', region: 'Afrique Centrale' },
  { code: 'fa', name: 'Fang', nativeName: 'Fang', flag: '🔵', region: 'Afrique Centrale' },
  { code: 'pu', name: 'Punu', nativeName: 'Punu', flag: '🔵', region: 'Afrique Centrale' },
  { code: 'my', name: 'Myènè', nativeName: 'Myènè', flag: '🔵', region: 'Afrique Centrale' },
  { code: 'te', name: 'Téké', nativeName: 'Téké', flag: '🔵', region: 'Afrique Centrale' },
  { code: 'gb', name: 'Gbaya', nativeName: 'Gbaya', flag: '🔵', region: 'Afrique Centrale' },
  { code: 'mb', name: 'Mbum', nativeName: 'Mbum', flag: '🔵', region: 'Afrique Centrale' },

  // Afrique de l'Est et Corne de l'Afrique
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🌍', region: 'Afrique de l\'Est' },
  { code: 'am', name: 'Amharique', nativeName: 'አማርኛ', flag: '🇪🇹', region: 'Afrique de l\'Est' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', flag: '🇪🇷', region: 'Afrique de l\'Est' },
  { code: 'som', name: 'Somali', nativeName: 'Af-Soomaali', flag: '🇸🇴', region: 'Afrique de l\'Est' },
  { code: 'or', name: 'Oromo', nativeName: 'Afaan Oromo', flag: '🇪🇹', region: 'Afrique de l\'Est' },

  // Afrique Australe
  { code: 'zu', name: 'Zoulou', nativeName: 'isiZulu', flag: '🇿🇦', region: 'Afrique Australe' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🟣', region: 'Afrique Australe' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🟣', region: 'Afrique Australe' },
  { code: 'kx', name: 'Khoisan', nativeName: 'Khoisan', flag: '🟣', region: 'Afrique Australe' },

  // Cameroun & Bassin du Congo
  { code: 'ba', name: 'Bamiléké', nativeName: 'Bamiléké', flag: '🔺', region: 'Cameroun & Bassin du Congo' },
  { code: 'bao', name: 'Bamoun', nativeName: 'Bamoun', flag: '🔺', region: 'Cameroun & Bassin du Congo' },
  { code: 'mf', name: 'Mafa', nativeName: 'Mafa', flag: '🔺', region: 'Cameroun & Bassin du Congo' },
  { code: 'mo', name: 'Mousgoum', nativeName: 'Mousgoum', flag: '🔺', region: 'Cameroun & Bassin du Congo' },
  { code: 'wa', name: 'Wandala', nativeName: 'Wandala', flag: '🔺', region: 'Cameroun & Bassin du Congo' }
];
