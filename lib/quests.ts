import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type {
  Enrollment,
  ProgressRecord,
  Quest,
  QuestStep,
  QuestStepWithProgress,
  QuestWithEnrollment
} from "@/lib/types";

export interface QuestOverview {
  quest: Quest;
  steps: QuestStepWithProgress[];
  enrollment: Enrollment | null;
  currentStep: QuestStepWithProgress | null;
  progressPercentage: number;
  completedSteps: number;
}

export interface DashboardEnrollment {
  enrollment: Enrollment;
  quest: Quest;
  steps: QuestStepWithProgress[];
  currentStep: QuestStepWithProgress | null;
  progressPercentage: number;
}

export async function getActiveQuests(userId: string) {
  const supabase = createClient();

  const [{ data: quests, error: questsError }, { data: enrollments, error: enrollmentsError }] =
    await Promise.all([
      supabase
        .from("quests")
        .select("*")
        .eq("status", "active")
        .order("order_index", { ascending: true }),
      supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", userId)
        .in("status", ["active", "completed"])
    ]);

  if (questsError) {
    throw new Error(questsError.message);
  }

  if (enrollmentsError) {
    throw new Error(enrollmentsError.message);
  }

  const enrollmentsByQuestId = new Map(
    (enrollments ?? []).map((enrollment) => [enrollment.quest_id, enrollment as Enrollment])
  );

  return (quests ?? []).map((quest) => ({
    ...(quest as Quest),
    enrollment: enrollmentsByQuestId.get(quest.id) ?? null
  })) as QuestWithEnrollment[];
}

export const getQuestOverview = cache(async (slug: string, userId: string) => {
  const supabase = createClient();
  const { data: quest, error: questError } = await supabase
    .from("quests")
    .select("*")
    .eq("slug", slug)
    .single();

  if (questError || !quest) {
    return null;
  }

  const [{ data: steps, error: stepsError }, { data: enrollments, error: enrollmentsError }] =
    await Promise.all([
      supabase
        .from("quest_steps")
        .select("*")
        .eq("quest_id", quest.id)
        .order("order_index", { ascending: true }),
      supabase
        .from("enrollments")
        .select("*")
        .eq("quest_id", quest.id)
        .eq("user_id", userId)
        .order("enrolled_at", { ascending: false })
        .limit(1)
    ]);

  if (stepsError) {
    throw new Error(stepsError.message);
  }

  if (enrollmentsError) {
    throw new Error(enrollmentsError.message);
  }

  const enrollment = (enrollments?.[0] as Enrollment | undefined) ?? null;
  let progressRecords: ProgressRecord[] = [];

  if (enrollment) {
    const { data: progress, error: progressError } = await supabase
      .from("progress")
      .select("*")
      .eq("enrollment_id", enrollment.id);

    if (progressError) {
      throw new Error(progressError.message);
    }

    progressRecords = (progress ?? []) as ProgressRecord[];
  }

  const progressByStepId = new Map(progressRecords.map((item) => [item.step_id, item]));
  const stepsWithProgress = ((steps ?? []) as QuestStep[]).map((step) => ({
    ...step,
    progress: progressByStepId.get(step.id) ?? null
  }));

  return buildQuestOverview(quest as Quest, stepsWithProgress, enrollment);
});

export const getQuestStepPageData = cache(async (slug: string, order: number, userId: string) => {
  const overview = await getQuestOverview(slug, userId);

  if (!overview) {
    return null;
  }

  const step = overview.steps.find((item) => item.order_index === order) ?? null;

  return {
    ...overview,
    step
  };
});

export async function getActiveEnrollmentForDashboard(userId: string) {
  const supabase = createClient();
  const { data: enrollments, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("enrolled_at", { ascending: false })
    .limit(1);

  if (enrollmentError) {
    throw new Error(enrollmentError.message);
  }

  const enrollment = (enrollments?.[0] as Enrollment | undefined) ?? null;

  if (!enrollment) {
    return null;
  }

  const [{ data: quest, error: questError }, { data: steps, error: stepsError }, { data: progress, error: progressError }] =
    await Promise.all([
      supabase.from("quests").select("*").eq("id", enrollment.quest_id).single(),
      supabase
        .from("quest_steps")
        .select("*")
        .eq("quest_id", enrollment.quest_id)
        .order("order_index", { ascending: true }),
      supabase.from("progress").select("*").eq("enrollment_id", enrollment.id)
    ]);

  if (questError || !quest) {
    throw new Error(questError?.message ?? "Quest not found.");
  }

  if (stepsError) {
    throw new Error(stepsError.message);
  }

  if (progressError) {
    throw new Error(progressError.message);
  }

  const progressByStepId = new Map(
    ((progress ?? []) as ProgressRecord[]).map((item) => [item.step_id, item])
  );
  const stepsWithProgress = ((steps ?? []) as QuestStep[]).map((step) => ({
    ...step,
    progress: progressByStepId.get(step.id) ?? null
  }));

  const overview = buildQuestOverview(quest as Quest, stepsWithProgress, enrollment);

  return {
    enrollment,
    quest: quest as Quest,
    steps: overview.steps,
    currentStep: overview.currentStep,
    progressPercentage: overview.progressPercentage
  } satisfies DashboardEnrollment;
}

function buildQuestOverview(
  quest: Quest,
  stepsWithProgress: QuestStepWithProgress[],
  enrollment: Enrollment | null
) {
  const completedSteps = stepsWithProgress.filter(
    (step) => step.progress?.status === "completed"
  ).length;
  const progressPercentage = stepsWithProgress.length
    ? Math.round((completedSteps / stepsWithProgress.length) * 100)
    : 0;
  const currentStep =
    stepsWithProgress.find((step) => step.progress?.status === "in_progress") ?? null;

  return {
    quest,
    steps: stepsWithProgress,
    enrollment,
    currentStep,
    progressPercentage,
    completedSteps
  } satisfies QuestOverview;
}

export function getStepStatusLabel(status: string | null | undefined) {
  if (status === "completed") return "Completed";
  if (status === "in_progress") return "In progress";
  return "Locked";
}

export function parseQuestStepContent(content: string) {
  const tipsMarker = "\n## Tips\n";
  const stuckMarker = "\n## Stuck?\n";

  const tipsIndex = content.indexOf(tipsMarker);
  const stuckIndex = content.indexOf(stuckMarker);

  const mission =
    tipsIndex === -1 ? content : content.slice(0, tipsIndex).trim();
  const tips =
    tipsIndex === -1
      ? ""
      : content
          .slice(tipsIndex + tipsMarker.length, stuckIndex === -1 ? content.length : stuckIndex)
          .trim();
  const stuck =
    stuckIndex === -1 ? "" : content.slice(stuckIndex + stuckMarker.length).trim();

  return { mission, tips, stuck };
}
