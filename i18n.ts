import {defineRouting} from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always"
});

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

export function isRTL(locale: string) {
  return locale === "ar";
}
