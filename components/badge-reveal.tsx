"use client";

import { useEffect, useState } from "react";

export function BadgeReveal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 150);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className={`rounded-lg border border-[#E2E8F0] bg-white p-5 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#4F46E5]">Badge unlocked</p>
        <h3 className="text-xl font-semibold text-[#0F172A]">Explorer → Creator</h3>
        <p className="text-sm text-slate-500">You&apos;ve leveled up.</p>
      </div>
    </div>
  );
}
