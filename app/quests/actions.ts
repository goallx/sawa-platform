"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import { requireUser } from "@/lib/auth";
import { getQuestOverview } from "@/lib/quests";
import { createClient } from "@/lib/supabase/server";

export async function enrollInQuest(formData: FormData) {
  const user = await requireUser();
  const locale = await getLocale();
  const slug = String(formData.get("slug") ?? "");
  const supabase = createClient();

  const overview = await getQuestOverview(slug, user.id);

  if (!overview) {
    throw new Error("Quest not found.");
  }

  if (overview.enrollment) {
    if (overview.currentStep) {
      redirect(`/${locale}/quests/${slug}/step/${overview.currentStep.order_index}`);
    }

    redirect(`/${locale}/quests/${slug}`);
  }

  const { data: enrollment, error: enrollmentError } = await supabase
    .from("enrollments")
    .insert({
      user_id: user.id,
      quest_id: overview.quest.id,
      status: "active"
    })
    .select()
    .single();

  if (enrollmentError || !enrollment) {
    throw new Error(enrollmentError?.message ?? "Could not create enrollment.");
  }

  const progressRows = overview.steps.map((step, index) => ({
    enrollment_id: enrollment.id,
    step_id: step.id,
    status: index === 0 ? "in_progress" : "locked",
    started_at: index === 0 ? new Date().toISOString() : null
  }));

  const { error: progressError } = await supabase.from("progress").insert(progressRows);

  if (progressError) {
    throw new Error(progressError.message);
  }

  revalidatePath("/quests");
  revalidatePath(`/quests/${slug}`);
  revalidatePath("/dashboard");
  redirect(`/${locale}/quests/${slug}/step/1`);
}

export async function saveStepForLater(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const order = Number(formData.get("order") ?? 0);
  const deliverable = normalizeOptionalString(formData.get("deliverable"));
  const notes = normalizeOptionalString(formData.get("notes"));
  const overview = await getQuestOverview(slug, user.id);

  if (!overview?.enrollment) {
    throw new Error("Enrollment not found.");
  }

  const step = overview.steps.find((item) => item.order_index === order);

  if (!step?.progress) {
    throw new Error("Progress not found.");
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("progress")
    .update({
      deliverable,
      notes,
      status: step.progress.status === "locked" ? "in_progress" : step.progress.status,
      started_at: step.progress.started_at ?? new Date().toISOString()
    })
    .eq("id", step.progress.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/quests/${slug}/step/${order}`);
  revalidatePath(`/quests/${slug}`);
  revalidatePath("/dashboard");

  return { ok: true as const };
}

export async function completeQuestStep(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const order = Number(formData.get("order") ?? 0);
  const deliverable = normalizeOptionalString(formData.get("deliverable"));
  const notes = normalizeOptionalString(formData.get("notes"));
  const overview = await getQuestOverview(slug, user.id);

  if (!overview?.enrollment) {
    throw new Error("Enrollment not found.");
  }

  const step = overview.steps.find((item) => item.order_index === order);

  if (!step?.progress) {
    throw new Error("Step progress not found.");
  }

  if (step.deliverable_type !== "none" && !deliverable) {
    throw new Error("Please add your deliverable before completing this step.");
  }

  const supabase = createClient();
  const now = new Date().toISOString();
  const nextStep = overview.steps.find((item) => item.order_index === order + 1) ?? null;

  const { error: completeError } = await supabase
    .from("progress")
    .update({
      status: "completed",
      completed_at: now,
      started_at: step.progress.started_at ?? now,
      deliverable,
      notes
    })
    .eq("id", step.progress.id);

  if (completeError) {
    throw new Error(completeError.message);
  }

  let nextUrl = `/quests/${slug}/complete`;

  if (nextStep?.progress) {
    const { error: nextError } = await supabase
      .from("progress")
      .update({
        status: "in_progress",
        started_at: nextStep.progress.started_at ?? now
      })
      .eq("id", nextStep.progress.id);

    if (nextError) {
      throw new Error(nextError.message);
    }

    nextUrl = `/quests/${slug}/step/${nextStep.order_index}`;
  } else {
    const { error: enrollmentError } = await supabase
      .from("enrollments")
      .update({
        status: "completed",
        completed_at: now
      })
      .eq("id", overview.enrollment.id);

    if (enrollmentError) {
      throw new Error(enrollmentError.message);
    }
  }

  revalidatePath("/quests");
  revalidatePath(`/quests/${slug}`);
  revalidatePath(`/quests/${slug}/step/${order}`);
  revalidatePath(`/quests/${slug}/complete`);
  revalidatePath("/dashboard");

  return {
    ok: true as const,
    nextUrl
  };
}

function normalizeOptionalString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}
