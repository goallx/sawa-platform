"use client";

import { useLocale } from "next-intl";

export function useDirection() {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return { isRTL, dir: isRTL ? "rtl" : "ltr" as const };
}
