"use client";

export function AdminNudgeButton({ email }: { email: string }) {
  return (
    <button
      type="button"
      onClick={() => console.log(`Send nudge to ${email}`)}
      className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50"
    >
      Send Nudge
    </button>
  );
}
