import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { locales } from "@/i18n";
import { Link } from "@/navigation";

export default async function MarketingLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(params.locale as "en" | "ar")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <div className="min-h-screen bg-white text-[#0F172A]">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600">
              SAWA
            </Link>
            <LanguageSwitcher />
          </div>
        </header>
        <main className="px-4 py-8 md:px-8">{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
