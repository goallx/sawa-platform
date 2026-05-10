import Link from "next/link";
import type { Route } from "next";
import { CheckCircle2, Circle, Lock } from "lucide-react";

import { getStepStatusLabel } from "@/lib/quests";
import type { QuestStepWithProgress } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuestStepListProps {
  questSlug: string;
  steps: QuestStepWithProgress[];
  currentOrder?: number;
}

export function QuestStepList({
  questSlug,
  steps,
  currentOrder
}: QuestStepListProps) {
  return (
    <div className="space-y-3">
      {steps.map((step) => {
        const status = step.progress?.status ?? "locked";
        const isCurrent = currentOrder === step.order_index || status === "in_progress";
        const href: Route | null =
          status === "locked"
            ? null
            : (`/quests/${questSlug}/step/${step.order_index}` as Route);

        return (
          <div
            key={step.id}
            className={cn(
              "rounded-lg border border-[#E2E8F0] px-4 py-3",
              isCurrent ? "border-[#4F46E5] bg-indigo-50/40" : "bg-white"
            )}
          >
            <div className="flex items-start gap-3">
              <StatusIcon status={status} />
              <div className="min-w-0 flex-1">
                {href ? (
                  <Link
                    href={href}
                    className="block text-sm font-semibold text-[#0F172A] hover:text-[#4F46E5]"
                  >
                    {step.title}
                  </Link>
                ) : (
                  <p className="text-sm font-semibold text-[#0F172A]">{step.title}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {getStepStatusLabel(status)} · {step.estimated_minutes} min
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "completed") {
    return <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#4F46E5]" />;
  }

  if (status === "in_progress") {
    return <Circle className="mt-0.5 h-5 w-5 fill-[#4F46E5] text-[#4F46E5]" />;
  }

  return <Lock className="mt-0.5 h-5 w-5 text-slate-400" />;
}
