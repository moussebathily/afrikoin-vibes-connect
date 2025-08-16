import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import languages from "./languages.json";

// Supported language codes
export const supportedLngs = languages.map((lang) => lang.code);

// Load translation files dynamically
const loadLocale = async (lng: string) => {
  try {
    const module = await import(`./locales/${lng}/common.json`);
    return module.default || module;
  } catch (error) {
    console.warn(`Failed to load locale ${lng}, falling back to English`);
    const fallbackModule = await import(`./locales/en/common.json`);
    return fallbackModule.default || fallbackModule;
  }
};

// Initialize i18n
export const setupI18n = async (userLng?: string) => {
  // Detect user language
  const browserLng = navigator.language;
  const storedLng = localStorage.getItem("afrikoin-language");

  let lng = userLng || storedLng || browserLng || "en";

  // Check if we support the detected language
  if (!supportedLngs.includes(lng)) {
    // Try language without region (e.g., 'en' from 'en-US')
    const baseLng = lng.split("-")[0];
    lng = supportedLngs.includes(baseLng) ? baseLng : "en";
  }

  // Load translation resources
  const resources: Record<string, any> = {};
  const bundle = await loadLocale(lng);
  resources[lng] = { common: bundle };

  await i18n.use(initReactI18next).init({
    lng,
    fallbackLng: "en",
    resources,
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    supportedLngs,
    returnEmptyString: false,
    debug: false,
  });

  // Set document direction and language
  document.dir = bundle?._meta?.rtl ? "rtl" : "ltr";
  document.documentElement.lang = lng;

  // Store user preference
  localStorage.setItem("afrikoin-language", lng);

  return i18n;
};

// Change language dynamically
export const changeLanguage = async (lng: string) => {
  if (!supportedLngs.includes(lng)) return;

  // Load new language resources
  const bundle = await loadLocale(lng);
  i18n.addResourceBundle(lng, "common", bundle, true, true);

  // Change language
  await i18n.changeLanguage(lng);

  // Update document
  document.dir = bundle?._meta?.rtl ? "rtl" : "ltr";
  document.documentElement.lang = lng;

  // Store preference
  localStorage.setItem("afrikoin-language", lng);
};

export { languages };
export default i18n;
