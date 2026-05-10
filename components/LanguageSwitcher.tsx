"use client";

import { useLocale } from "next-intl";

import { Link, usePathname } from "@/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const isRTL = locale === "ar";

  return (
    <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
      <Link
        href={pathname}
        locale="en"
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          !isRTL ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        EN
      </Link>
      <Link
        href={pathname}
        locale="ar"
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          isRTL ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        عربي
      </Link>
    </div>
  );
}
