"use client";

import {Menu, X} from "lucide-react";
import type {Route} from "next";
import {useLocale, useTranslations} from "next-intl";
import {useState} from "react";

import {locales} from "@/i18n";
import {Link, usePathname} from "@/navigation";
import {LogoutButton} from "@/components/logout-button";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

const navigation: Array<
  | {href: Route; labelKey: "dashboard" | "quests"; external?: false}
  | {href: string; labelKey: "community"; external: true}
> = [
  {href: "/dashboard", labelKey: "dashboard"},
  {href: "/quests", labelKey: "quests"},
  {href: "https://community.example.com", labelKey: "community", external: true}
];

interface AppShellProps {
  children: React.ReactNode;
  userEmail?: string;
}

export function AppShell({children, userEmail}: AppShellProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = Boolean(userEmail);
  const nextLocale = locales.find((item) => item !== locale) ?? "en";
  const sidebarBorder = locale === "ar" ? "md:border-s" : "md:border-e";

  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      <div className="md:hidden">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-white px-4 py-4">
          <Link
            href={isAuthenticated ? "/dashboard" : "/login"}
            className="text-xl font-bold tracking-tight text-[#4F46E5]"
          >
            {t("brand")}
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={pathname}
              locale={nextLocale}
              className="text-sm font-medium text-[#0F172A]"
            >
              {locale === "en" ? "عربي" : "EN"}
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {menuOpen ? (
          <div className="border-b border-[#E2E8F0] bg-slate-50 px-4 py-4">
            <nav className="space-y-2">
              {navigation.map((item) =>
                item.external ? (
                  <a
                    key={item.labelKey}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-white"
                  >
                    {t(item.labelKey)}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-white text-[#4F46E5]"
                        : "text-[#0F172A] hover:bg-white"
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t(item.labelKey)}
                  </Link>
                )
              )}
            </nav>
            <div className="mt-4 border-t border-[#E2E8F0] pt-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">{userEmail}</p>
                  <LogoutButton />
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA]"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("login")}
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <div className={cn("flex min-h-screen", locale === "ar" ? "md:flex-row-reverse" : "md:flex-row")}>
        <aside
          className={cn(
            "hidden w-[240px] shrink-0 border-[#E2E8F0] bg-slate-50 md:flex md:flex-col",
            sidebarBorder
          )}
        >
          <div className="px-6 py-6">
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="text-[20px] font-bold tracking-tight text-[#4F46E5]"
            >
              {t("brand")}
            </Link>
          </div>
          <nav className="flex-1 space-y-2 px-4">
            {navigation.map((item) =>
              item.external ? (
                <a
                  key={item.labelKey}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-white"
                >
                  {t(item.labelKey)}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-white text-[#4F46E5]"
                      : "text-[#0F172A] hover:bg-white"
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              )
            )}
          </nav>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-white">
          <header className="hidden items-center justify-between border-b border-[#E2E8F0] px-4 py-4 md:flex md:px-8">
            <p className="text-sm text-slate-500">{t("tagline")}</p>
            <div className="flex items-center gap-3">
              <Link
                href={pathname}
                locale={nextLocale}
                className="text-sm font-medium text-[#0F172A]"
              >
                {locale === "en" ? "EN | عربي" : "عربي | EN"}
              </Link>
              {isAuthenticated ? (
                <>
                  <span className="hidden text-sm text-slate-500 sm:inline">
                    {userEmail}
                  </span>
                  <LogoutButton />
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA]"
                >
                  {t("login")}
                </Link>
              )}
            </div>
          </header>
          <main className="flex-1 bg-white p-6 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
