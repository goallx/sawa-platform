"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface MissionCollapsibleProps {
  title: string;
  tone: "amber" | "sky";
  items: string[];
  footer?: React.ReactNode;
}

export function MissionCollapsible({
  title,
  tone,
  items,
  footer
}: MissionCollapsibleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-[#0F172A]">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-500 transition-transform",
            open ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      {open ? (
        <div
          className={cn(
            "border-t px-5 py-4",
            tone === "amber"
              ? "border-amber-200 bg-amber-50 text-amber-900"
              : "border-sky-200 bg-sky-50 text-sky-900"
          )}
        >
          <div className="space-y-2 text-sm leading-6">
            {items.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
          {footer ? <div className="mt-3 text-sm font-medium">{footer}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
