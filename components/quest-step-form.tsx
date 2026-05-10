import Link from "next/link";

import { completeQuestStep, saveStepForLater } from "@/app/quests/actions";
import { SubmitButton } from "@/components/submit-button";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { QuestStepWithProgress } from "@/lib/types";

interface QuestStepFormProps {
  slug: string;
  step: QuestStepWithProgress;
}

export function QuestStepForm({ slug, step }: QuestStepFormProps) {
  const inputType = step.deliverable_type === "url" ? "url" : "text";

  return (
    <form action={saveStepForLater} className="space-y-4 border-t border-[#E2E8F0] pt-6">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="order" value={step.order_index} />
      {step.deliverable_type !== "none" ? (
        <div className="space-y-2">
          <Label htmlFor="deliverable">
            {step.deliverable_prompt ?? "Deliverable"}
          </Label>
          <Input
            id="deliverable"
            name="deliverable"
            type={inputType}
            defaultValue={step.progress?.deliverable ?? ""}
            placeholder={step.deliverable_prompt ?? "Add your deliverable"}
            required
          />
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes for yourself</Label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={step.progress?.notes ?? ""}
          rows={4}
          className="flex w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-slate-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
          placeholder="Capture anything you want to remember for the next session."
        />
      </div>
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
        <SubmitButton
          type="submit"
          idleText="Save for Later"
          pendingText="Saving..."
          variant="outline"
          formNoValidate
          className="w-full"
        />
        <SubmitButton
          formAction={completeQuestStep}
          type="submit"
          idleText="Mark Complete"
          pendingText="Completing..."
          className="w-full"
        />
        <Link
          href="https://discord.com"
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full border-amber-200 bg-amber-100 text-amber-900 hover:bg-amber-200 lg:w-auto"
          )}
        >
          🆘 Stuck?
        </Link>
      </div>
    </form>
  );
}
