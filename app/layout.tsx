import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter, Noto_Sans_Arabic } from "next/font/google";

import { defaultLocale, isRTL } from "@/i18n";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic"
});

export const metadata: Metadata = {
  title: "Sawa",
  description: "Sawa is a builder community platform."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = cookies().get("NEXT_LOCALE")?.value ?? defaultLocale;

  return (
    <html lang={locale} dir={isRTL(locale) ? "rtl" : "ltr"}>
      <body
        className={`${inter.variable} ${notoSansArabic.variable} ${
          isRTL(locale) ? "font-[var(--font-arabic)]" : "font-[var(--font-inter)]"
        } bg-white text-[#0F172A]`}
      >
        {children}
      </body>
    </html>
  );
}
