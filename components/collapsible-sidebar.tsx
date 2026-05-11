"use client";

import {
  ChevronLeft,
  ChevronRight,
  Compass,
  LayoutDashboard,
  User,
  X
} from "lucide-react";
import Link from "next/link";

import { LogoutButton } from "@/components/logout-button";
import { NavItem } from "@/components/nav-item";
import { cn } from "@/lib/utils";

interface CollapsibleSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isRTL: boolean;
  currentPath: string;
  userName: string;
  userEmail: string;
  userInitial: string;
  mobile?: boolean;
  onNavigate?: () => void;
  onCloseMobile?: () => void;
}

const EXPANDED_WIDTH = "w-[240px]";
const COLLAPSED_WIDTH = "w-16";

export function CollapsibleSidebar({
  collapsed,
  onToggleCollapse,
  isRTL,
  currentPath,
  userName,
  userEmail,
  userInitial,
  mobile = false,
  onNavigate,
  onCloseMobile
}: CollapsibleSidebarProps) {
  const effectiveCollapsed = mobile ? false : collapsed;
  const collapseIcon = effectiveCollapsed
    ? isRTL
      ? ChevronLeft
      : ChevronRight
    : isRTL
      ? ChevronRight
      : ChevronLeft;
  const CollapseIcon = collapseIcon;

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-slate-50 transition-all duration-300 ease-in-out",
        effectiveCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-4">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center text-indigo-600",
            effectiveCollapsed ? "w-full justify-center text-lg font-bold" : "gap-2 text-xl font-bold"
          )}
          onClick={onNavigate}
        >
          {effectiveCollapsed ? (
            <span>&gt;</span>
          ) : (
            <>
              <span>SAWA</span>
              <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 -translate-y-0.5 fill-indigo-600">
                <path d="M1 2h6.2L4.6 0l1.4 0L11 5.5 6 11 4.6 11l2.6-2H1z" />
              </svg>
            </>
          )}
        </Link>

        {mobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-slate-900"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              "rounded-lg p-2 text-slate-500 hover:bg-white hover:text-slate-900",
              effectiveCollapsed && "absolute"
            )}
            aria-label={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <CollapseIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-1">
          <NavItem
            href="/dashboard"
            label="Dashboard"
            icon={LayoutDashboard}
            active={currentPath === "/dashboard"}
            collapsed={effectiveCollapsed}
            onClick={onNavigate}
          />
          <NavItem
            href="/quests"
            label="Quests"
            icon={Compass}
            active={currentPath === "/quests" || currentPath.startsWith("/quests/")}
            collapsed={effectiveCollapsed}
            onClick={onNavigate}
          />
          <NavItem
            href="/profile"
            label="Profile"
            icon={User}
            active={currentPath === "/profile"}
            collapsed={effectiveCollapsed}
            onClick={onNavigate}
          />
        </div>
      </div>

      <div className="border-t border-slate-200 p-3">
        <div
          className={cn(
            "flex items-center gap-3",
            isRTL && !effectiveCollapsed ? "flex-row-reverse text-right" : "",
            effectiveCollapsed && "justify-center"
          )}
          title={effectiveCollapsed ? `${userName} • ${userEmail}` : undefined}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
            {userInitial}
            <span className="absolute bottom-0 end-0 h-2.5 w-2.5 rounded-full border-2 border-slate-50 bg-emerald-500" />
          </div>
          {!effectiveCollapsed ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{userName}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="truncate">{userEmail}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className={cn("mt-3", effectiveCollapsed && "flex justify-center")}>
          <LogoutButton collapsed={effectiveCollapsed} />
        </div>
      </div>
    </div>
  );
}
