export const locales = ["en", "ar"] as const;
export const defaultLocale = "en";
export const localePrefix = "as-needed";
export const localeCookieName = "NEXT_LOCALE";

export type AppLocale = (typeof locales)[number];

export function resolveLocale(locale?: string | null): AppLocale | null {
  if (!locale) {
    return null;
  }

  return locales.includes(locale as AppLocale) ? (locale as AppLocale) : null;
}

export function detectLocaleFromHeader(acceptLanguage?: string | null): AppLocale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  const values = acceptLanguage
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  for (const value of values) {
    if (value.startsWith("ar")) {
      return "ar";
    }

    if (value.startsWith("en")) {
      return "en";
    }
  }

  return defaultLocale;
}

export function isRTL(locale: string) {
  return locale === "ar";
}
