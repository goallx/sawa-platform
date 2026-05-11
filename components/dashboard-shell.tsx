"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { CollapsibleSidebar } from "@/components/collapsible-sidebar";
import { DashboardTopbar } from "@/components/dashboard-topbar";
import { MobileDrawer } from "@/components/mobile-drawer";
import { cn } from "@/lib/utils";

const SIDEBAR_STORAGE_KEY = "sawa-sidebar-collapsed";

interface DashboardShellProps {
  children: React.ReactNode;
  isRTL: boolean;
  userName: string;
  userEmail: string;
  userInitial: string;
}

export function DashboardShell({
  children,
  isRTL,
  userName,
  userEmail,
  userInitial
}: DashboardShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    setCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const desktopOffsetClass = useMemo(() => {
    if (isRTL) {
      return collapsed ? "md:mr-16" : "md:mr-[240px]";
    }

    return collapsed ? "md:ml-16" : "md:ml-[240px]";
  }, [collapsed, isRTL]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-white text-[#0F172A]">
      <aside
        className={cn(
          "fixed inset-y-0 z-40 hidden border-slate-200 bg-slate-50 transition-all duration-300 ease-in-out md:flex",
          isRTL ? "right-0 border-l" : "left-0 border-r",
          collapsed ? "w-16" : "w-[240px]"
        )}
      >
        <CollapsibleSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((value) => !value)}
          isRTL={isRTL}
          currentPath={pathname}
          userName={userName}
          userEmail={userEmail}
          userInitial={userInitial}
        />
      </aside>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} isRTL={isRTL}>
        <CollapsibleSidebar
          collapsed={false}
          onToggleCollapse={() => undefined}
          isRTL={isRTL}
          currentPath={pathname}
          userName={userName}
          userEmail={userEmail}
          userInitial={userInitial}
          mobile
          onNavigate={() => setMobileOpen(false)}
          onCloseMobile={() => setMobileOpen(false)}
        />
      </MobileDrawer>

      <div className={cn("min-h-screen transition-all duration-300 ease-in-out", desktopOffsetClass)}>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <DashboardTopbar
            isRTL={isRTL}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((value) => !value)}
            onOpenMobile={() => setMobileOpen(true)}
          />
        </header>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
