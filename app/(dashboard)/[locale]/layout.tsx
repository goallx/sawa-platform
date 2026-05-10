import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import { DirectionWrapper } from "@/components/DirectionWrapper";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { LogoutButton } from "@/components/logout-button";
import { locales } from "@/i18n";
import { getCurrentUser } from "@/lib/auth";
import { Link } from "@/navigation";

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(params.locale as "en" | "ar")) {
    notFound();
  }

  const [messages, user] = await Promise.all([getMessages(), getCurrentUser()]);
  const userName = user?.email?.split("@")[0] ?? "Builder";

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <DirectionWrapper
        layout="dashboard"
        sidebar={
          <>
            <div className="px-6 py-6">
              <Link href="/dashboard" className="text-xl font-bold tracking-tight text-indigo-600">
                SAWA
              </Link>
            </div>
            <nav className="flex-1 space-y-2 px-4">
              <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-900 hover:bg-white">
                Dashboard
              </Link>
              <Link href="/quests" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-900 hover:bg-white">
                Quests
              </Link>
              <a
                href="https://community.example.com"
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-900 hover:bg-white"
              >
                Community
              </a>
            </nav>
            <div className="border-t border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                  {userName[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{userName}</p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
              <div className="mt-4">
                <LogoutButton />
              </div>
            </div>
          </>
        }
        topbar={
          <div className="flex flex-row items-center justify-between gap-4 px-4 py-4 md:px-8">
            <p className="text-sm text-slate-500">Builder community platform</p>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <span className="hidden text-sm text-slate-500 sm:inline">{user?.email}</span>
            </div>
          </div>
        }
      >
        {children}
      </DirectionWrapper>
    </NextIntlClientProvider>
  );
}
