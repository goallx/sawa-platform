"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Route } from "next";

import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation: Array<
  | { href: Route; label: string; external?: false }
  | { href: string; label: string; external: true }
> = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/quests", label: "Quests" },
  { href: "https://community.example.com", label: "Community", external: true }
];

interface AppShellProps {
  children: React.ReactNode;
  userEmail?: string;
}

export function AppShell({ children, userEmail }: AppShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = Boolean(userEmail);

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">
      <div className="md:hidden">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-white px-4 py-4">
          <Link
            href={isAuthenticated ? "/dashboard" : "/login"}
            className="text-xl font-bold tracking-tight text-[#4F46E5]"
          >
            SAWA
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
        {menuOpen ? (
          <div className="border-b border-[#E2E8F0] bg-slate-50 px-4 py-4">
            <nav className="space-y-2">
              {navigation.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-white"
                  >
                    {item.label}
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
                    {item.label}
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
                  Log in
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex min-h-screen">
        <aside className="hidden w-[240px] shrink-0 border-r border-[#E2E8F0] bg-slate-50 md:flex md:flex-col">
          <div className="px-6 py-6">
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="text-[20px] font-bold tracking-tight text-[#4F46E5]"
            >
              SAWA
            </Link>
          </div>
          <nav className="flex-1 space-y-2 px-4">
            {navigation.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-white"
                >
                  {item.label}
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
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-white">
          <header className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-4 md:px-8">
            <div>
              <p className="text-sm text-slate-500">
                Builder community platform
              </p>
            </div>
            <div className="flex items-center gap-3">
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
                  Log in
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
