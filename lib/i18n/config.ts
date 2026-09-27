export const LOCALES = ["ro", "ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ro";
export const LOCALE_COOKIE = "lang";

/** Shown in the language selector: short code and native name. */
export const LOCALE_NAMES: Record<Locale, string> = {
  ro: "Română",
  ru: "Русский",
  en: "English",
};

/** BCP 47 tags for Intl formatting and <html lang>. */
export const INTL_LOCALES: Record<Locale, string> = {
  ro: "ro-RO",
  ru: "ru-RU",
  en: "en-GB",
};

export const OG_LOCALES: Record<Locale, string> = {
  ro: "ro_RO",
  ru: "ru_RU",
  en: "en_GB",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
