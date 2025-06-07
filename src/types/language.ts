
export type Language = 'fr' | 'en' | 'bm' | 'ar' | 'ti' | 'pt' | 'es' | 'zh' | 'ru' | 'hi';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export const languages: LanguageOption[] = [
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'bm', name: 'Bambara', nativeName: 'Bamanankan' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ti', name: 'Tigrigna', nativeName: 'ትግርኛ' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
];
