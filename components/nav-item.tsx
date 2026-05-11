"use client";

import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  collapsed?: boolean;
  external?: boolean;
  onClick?: () => void;
}

export function NavItem({
  href,
  label,
  icon: Icon,
  active = false,
  collapsed = false,
  external = false,
  onClick
}: NavItemProps) {
  const className = cn(
    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
    active
      ? "bg-indigo-50 text-indigo-600"
      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
    collapsed ? "justify-center px-2" : "gap-3"
  );

  const content = (
    <>
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed ? <span className="truncate">{label}</span> : null}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={className}
        title={collapsed ? label : undefined}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href as Route}
      className={className}
      title={collapsed ? label : undefined}
      onClick={onClick}
    >
      {content}
    </Link>
  );
}
