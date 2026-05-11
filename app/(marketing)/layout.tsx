import { getLocale } from "next-intl/server";

import { DirectionWrapper } from "@/components/DirectionWrapper";
import { isRTL } from "@/i18n";

export default async function MarketingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <DirectionWrapper
      layout="plain"
      className={`min-h-screen bg-white text-[#0F172A] ${
        isRTL(locale) ? "font-[var(--font-arabic)]" : "font-[var(--font-inter)]"
      }`}
    >
      <main>{children}</main>
    </DirectionWrapper>
  );
}
