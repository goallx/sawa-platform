import {getRequestConfig} from "next-intl/server";
import {hasLocale} from "next-intl";

import {defaultLocale, locales} from "@/i18n";

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(locales, requested) ? requested : defaultLocale;

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
