"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { completeQuestStep, saveStepForLater } from "@/app/(dashboard)/quests/actions";
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
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!formRef.current) return;

    setError(null);
    setMessage(null);

    const formData = new FormData(formRef.current);

    startTransition(async () => {
      try {
        await saveStepForLater(formData);
        setMessage("Saved for later.");
        router.refresh();
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Could not save this step.");
      }
    });
  }

  async function handleComplete() {
    if (!formRef.current) return;

    setError(null);
    setMessage(null);

    if (!formRef.current.reportValidity()) {
      return;
    }

    const formData = new FormData(formRef.current);

    startTransition(async () => {
      try {
        const result = await completeQuestStep(formData);
        setMessage("Shipped! Unlocking next...");
        setTimeout(() => {
          router.push(result.nextUrl as Route);
          router.refresh();
        }, 1000);
      } catch (nextError) {
        setError(
          nextError instanceof Error ? nextError.message : "Could not complete this mission."
        );
      }
    });
  }

  return (
    <form ref={formRef} id="deliverable-section" className="space-y-5">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="order" value={step.order_index} />

      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-[#0F172A]">
          YOUR DELIVERABLE
        </h2>
        <p className="text-sm text-slate-500">
          Share the proof so you can unlock the next mission.
        </p>
      </div>

      {(step.deliverable_type === "text" || step.deliverable_type === "screenshot") && (
        <div className="space-y-2">
          <Label htmlFor="deliverable">{step.deliverable_prompt ?? "Deliverable"}</Label>
          <textarea
            id="deliverable"
            name="deliverable"
            defaultValue={step.progress?.deliverable ?? ""}
            rows={6}
            className="flex w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-slate-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
            placeholder={step.deliverable_prompt ?? "Add your deliverable"}
            required
          />
        </div>
      )}

      {step.deliverable_type === "url" && (
        <div className="space-y-2">
          <Label htmlFor="deliverable">{step.deliverable_prompt ?? "Deliverable"}</Label>
          <Input
            id="deliverable"
            name="deliverable"
            type="url"
            defaultValue={step.progress?.deliverable ?? ""}
            placeholder={step.deliverable_prompt ?? "https://"}
            required
            className="h-12 px-4"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes for yourself</Label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={step.progress?.notes ?? ""}
          rows={4}
          className="flex w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-slate-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15"
          placeholder="Anything you want to remember before the next mission."
        />
      </div>

      {message ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
          {error}
        </div>
      ) : null}

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleComplete}
          disabled={isPending}
          className={cn(buttonVariants(), "w-full py-3 text-base")}
        >
          {isPending ? "Unlocking..." : "✓ Mark Complete — Unlock Next Mission"}
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
        >
          {isPending ? "Saving..." : "Save for Later"}
        </button>
      </div>
    </form>
  );
}
