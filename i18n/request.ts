import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import {
  defaultLocale,
  detectLocaleFromHeader,
  localeCookieName,
  resolveLocale
} from "@/i18n";

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const cookieLocale = resolveLocale(cookies().get(localeCookieName)?.value);
  const routeLocale = resolveLocale(requested);
  const headerLocale = detectLocaleFromHeader(headers().get("accept-language"));
  const locale = routeLocale ?? cookieLocale ?? headerLocale ?? defaultLocale;

  const [common, landing, dashboard, quest] = await Promise.all([
    import(`@/messages/${locale}/common.json`),
    import(`@/messages/${locale}/landing.json`),
    import(`@/messages/${locale}/dashboard.json`),
    import(`@/messages/${locale}/quest.json`)
  ]);

  return {
    locale,
    messages: {
      common: common.default,
      landing: landing.default,
      dashboard: dashboard.default,
      quest: quest.default
    }
  };
});
