"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import { localeCookieName } from "@/i18n";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";

  function switchLocale(nextLocale: "en" | "ar") {
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
      <button
        type="button"
        onClick={() => switchLocale("en")}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          !isRTL ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchLocale("ar")}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          isRTL ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        عربي
      </button>
    </div>
  );
}
