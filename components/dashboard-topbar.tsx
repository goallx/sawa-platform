"use client";

import { Bell, Menu, PanelLeft, PanelLeftClose } from "lucide-react";
import { usePathname } from "next/navigation";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

interface DashboardTopbarProps {
  isRTL: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/admin")) {
    return "Admin";
  }

  if (pathname.startsWith("/profile")) {
    return "Profile";
  }

  if (pathname.startsWith("/quests")) {
    return "Quests";
  }

  return "Dashboard";
}

export function DashboardTopbar({
  isRTL,
  collapsed,
  onToggleCollapse,
  onOpenMobile
}: DashboardTopbarProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-4 md:px-8",
        isRTL ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
        <button
          type="button"
          onClick={onOpenMobile}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
      </div>

      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:inline-flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
        <div className="scale-90">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
