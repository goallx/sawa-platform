"use client";

import { useEffect } from "react";

import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  isRTL: boolean;
  children: React.ReactNode;
}

export function MobileDrawer({ open, onClose, isRTL, children }: MobileDrawerProps) {
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute inset-y-0 w-[280px] bg-white transition-transform duration-300 ease-in-out",
          isRTL ? "right-0 border-l border-slate-200" : "left-0 border-r border-slate-200",
          open ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"
        )}
      >
        {children}
      </div>
    </div>
  );
}
