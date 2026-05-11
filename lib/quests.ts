import { cache } from "react";
import type { User } from "@supabase/supabase-js";

import { getDisplayName, getProfile, getProfileStatus } from "@/lib/profiles";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  ActivityItem,
  AdminStudentRow,
  DashboardStats,
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
  currentStepName: string | null;
  cohort: string;
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
    progressPercentage: overview.progressPercentage,
    currentStepName: overview.currentStep?.title ?? null,
    cohort: "May Intensive"
  } satisfies DashboardEnrollment;
}

export async function getDashboardData(user: User) {
  const [activeEnrollment, recentActivity, completedProgress, profile] = await Promise.all([
    getActiveEnrollmentForDashboard(user.id),
    getRecentActivity(user.id),
    getCompletedProgress(user.id),
    getProfile(user.id)
  ]);
  const profileStatus = getProfileStatus(profile);

  return {
    welcomeName: getDisplayName(profile, user.email),
    activeEnrollment,
    recentActivity,
    profile,
    profileStatus,
    stats: {
      questsCompleted: 0,
      projectsShipped: 0,
      currentStreak: calculateStreak(completedProgress),
      communityRank: 0
    } satisfies DashboardStats
  };
}

export async function getRecentActivity(userId: string) {
  const supabase = createClient();
  const { data: enrollments, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("id, quest_id, enrolled_at")
    .eq("user_id", userId)
    .order("enrolled_at", { ascending: false })
    .limit(5);

  if (enrollmentError) {
    throw new Error(enrollmentError.message);
  }

  const enrollmentIds = (enrollments ?? []).map((item) => item.id);
  const questIds = (enrollments ?? []).map((item) => item.quest_id);

  const [{ data: progress, error: progressError }, { data: quests, error: questsError }, { data: steps, error: stepsError }] =
    await Promise.all([
      enrollmentIds.length
        ? supabase
            .from("progress")
            .select("id, enrollment_id, step_id, status, completed_at, started_at")
            .in("enrollment_id", enrollmentIds)
        : Promise.resolve({ data: [], error: null }),
      questIds.length
        ? supabase.from("quests").select("id, title").in("id", questIds)
        : Promise.resolve({ data: [], error: null }),
      enrollmentIds.length
        ? supabase.from("quest_steps").select("id, title")
        : Promise.resolve({ data: [], error: null })
    ]);

  if (progressError) throw new Error(progressError.message);
  if (questsError) throw new Error(questsError.message);
  if (stepsError) throw new Error(stepsError.message);

  const questById = new Map((quests ?? []).map((quest) => [quest.id, quest.title]));
  const stepById = new Map((steps ?? []).map((step) => [step.id, step.title]));
  const activity: ActivityItem[] = [];

  for (const enrollment of enrollments ?? []) {
    activity.push({
      id: `enrolled-${enrollment.id}`,
      type: "enrolled",
      label: `Enrolled in ${questById.get(enrollment.quest_id) ?? "a quest"}`,
      timestamp: enrollment.enrolled_at
    });
  }

  for (const item of progress ?? []) {
    if (item.status === "completed" && item.completed_at) {
      activity.push({
        id: `completed-${item.id}`,
        type: "completed",
        label: `Completed ${stepById.get(item.step_id) ?? "a step"}`,
        timestamp: item.completed_at
      });
    } else if (item.started_at) {
      activity.push({
        id: `started-${item.id}`,
        type: "started",
        label: `Worked on ${stepById.get(item.step_id) ?? "a step"}`,
        timestamp: item.started_at
      });
    }
  }

  return activity
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
}

export async function getQuestCompletionData(slug: string, userId: string) {
  const overview = await getQuestOverview(slug, userId);

  if (!overview?.enrollment) {
    return null;
  }

  const liveUrl =
    overview.steps.find((step) => step.title.includes("Publish"))?.progress?.deliverable ??
    overview.steps.find((step) => step.progress?.deliverable?.startsWith("http"))?.progress
      ?.deliverable ??
    "";
  const projectName =
    overview.steps.find((step) => step.title.includes("Name & Vibe"))?.progress?.deliverable?.split(
      "\n"
    )[0] ??
    overview.quest.title;
  const startedAt = new Date(overview.enrollment.enrolled_at).getTime();
  const endedAt = new Date(
    overview.enrollment.completed_at ?? new Date().toISOString()
  ).getTime();
  const durationDays = Math.max(1, Math.ceil((endedAt - startedAt) / (1000 * 60 * 60 * 24)));

  return {
    ...overview,
    deliverables: overview.steps
      .filter((step) => step.progress?.deliverable)
      .map((step) => ({
        stepTitle: step.title,
        deliverable: step.progress?.deliverable ?? ""
      })),
    projectName,
    liveUrl,
    durationDays,
    shipPostTemplate: `Just shipped ${projectName}.\n\nBuilt it through Sawa's ${overview.quest.title} quest.\n${liveUrl ? `Live now: ${liveUrl}\n` : ""}Biggest lesson: shipping beats waiting.\n\nWould love feedback from other builders.`
  };
}

export async function getAdminDashboardData(filter: string) {
  const supabase = createAdminClient();
  const [{ data: enrollments, error: enrollmentError }, { data: progress, error: progressError }, { data: quests, error: questsError }, { data: steps, error: stepsError }, usersResponse] =
    await Promise.all([
      supabase.from("enrollments").select("*").order("enrolled_at", { ascending: false }),
      supabase.from("progress").select("*"),
      supabase.from("quests").select("*"),
      supabase.from("quest_steps").select("*"),
      supabase.auth.admin.listUsers()
    ]);

  if (enrollmentError) throw new Error(enrollmentError.message);
  if (progressError) throw new Error(progressError.message);
  if (questsError) throw new Error(questsError.message);
  if (stepsError) throw new Error(stepsError.message);
  if (usersResponse.error) throw new Error(usersResponse.error.message);

  const questById = new Map((quests ?? []).map((quest) => [quest.id, quest as Quest]));
  const stepsByQuestId = new Map<string, QuestStep[]>();

  for (const step of (steps ?? []) as QuestStep[]) {
    const existing = stepsByQuestId.get(step.quest_id) ?? [];
    existing.push(step);
    stepsByQuestId.set(step.quest_id, existing);
  }

  for (const list of stepsByQuestId.values()) {
    list.sort((a, b) => a.order_index - b.order_index);
  }

  const progressByEnrollmentId = new Map<string, ProgressRecord[]>();

  for (const record of (progress ?? []) as ProgressRecord[]) {
    const existing = progressByEnrollmentId.get(record.enrollment_id) ?? [];
    existing.push(record);
    progressByEnrollmentId.set(record.enrollment_id, existing);
  }

  const usersById = new Map(usersResponse.data.users.map((user) => [user.id, user]));
  const rows = ((enrollments ?? []) as Enrollment[])
    .map((enrollment) =>
      buildAdminStudentRow(
        enrollment,
        questById.get(enrollment.quest_id) ?? null,
        stepsByQuestId.get(enrollment.quest_id) ?? [],
        progressByEnrollmentId.get(enrollment.id) ?? [],
        usersById.get(enrollment.user_id) ?? null
      )
    )
    .filter((row): row is AdminStudentRow => Boolean(row));

  const filteredRows =
    filter === "All" ? rows : rows.filter((row) => row.status === filter);
  const now = Date.now();

  return {
    cohortName: "May Intensive",
    rows: filteredRows,
    stats: {
      totalStudents: rows.length,
      activeNow: rows.filter((row) => now - new Date(row.lastActiveAt).getTime() <= 60 * 60 * 1000)
        .length,
      completedToday: (progress ?? []).filter((record) => {
        if (!record.completed_at) return false;
        return record.completed_at.slice(0, 10) === new Date().toISOString().slice(0, 10);
      }).length,
      atRisk: rows.filter((row) => row.status === "At Risk").length
    }
  };
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
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const actions: string[] = [];
  const tips: string[] = [];
  const stuck: string[] = [];
  const context: string[] = [];

  for (const line of lines) {
    if (/^\d+\./.test(line)) {
      actions.push(line.replace(/^\d+\.\s*/, ""));
      continue;
    }

    if (line.startsWith("💡")) {
      tips.push(line.replace(/^💡\s*/, ""));
      continue;
    }

    if (line.startsWith("Stuck?")) {
      stuck.push(line.replace(/^Stuck\?\s*/, ""));
      continue;
    }

    if (!line.startsWith("#") && !line.startsWith("##") && line !== "---") {
      context.push(line);
    }
  }

  return {
    context: context.slice(0, 2),
    actions: actions.slice(0, 5),
    tips: tips.slice(0, 3),
    stuck: stuck.slice(0, 3)
  };
}

export function getDisplayNameFromUser(user: User) {
  const metadataName =
    typeof user.user_metadata?.name === "string"
      ? user.user_metadata.name
      : typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : null;

  if (metadataName?.trim()) {
    return metadataName.trim();
  }

  if (user.email?.includes("@")) {
    return user.email.split("@")[0];
  }

  return null;
}

export function formatRelativeTime(timestamp: string) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getCompletedProgress(userId: string) {
  const supabase = createClient();

  return supabase
    .from("progress")
    .select("completed_at, enrollments!inner(user_id)")
    .eq("enrollments.user_id", userId)
    .not("completed_at", "is", null)
    .then(({ data, error }) => {
      if (error) {
        throw new Error(error.message);
      }

      return (data ?? []) as Array<{ completed_at: string }>;
    });
}

function calculateStreak(progress: Array<{ completed_at: string }>) {
  const dates = Array.from(
    new Set(progress.map((item) => item.completed_at.slice(0, 10)))
  ).sort((a, b) => b.localeCompare(a));

  if (!dates.length) return 0;

  const todayKey = new Date().toISOString().slice(0, 10);
  const yesterdayKey = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  if (dates[0] !== todayKey && dates[0] !== yesterdayKey) {
    return 0;
  }

  let streak = 0;
  let cursor = new Date(`${dates[0]}T00:00:00.000Z`);

  for (const date of dates) {
    if (date !== cursor.toISOString().slice(0, 10)) {
      break;
    }

    streak += 1;
    cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
  }

  return streak;
}

function buildAdminStudentRow(
  enrollment: Enrollment,
  quest: Quest | null,
  steps: QuestStep[],
  progress: ProgressRecord[],
  user: User | null
) {
  if (!quest || !user?.email) {
    return null;
  }

  const completedSteps = progress.filter((item) => item.status === "completed").length;
  const progressPercentage = steps.length
    ? Math.round((completedSteps / steps.length) * 100)
    : 0;
  const currentStepProgress =
    progress.find((item) => item.status === "in_progress") ??
    progress.find((item) => item.status === "locked") ??
    null;
  const currentStep =
    steps.find((step) => step.id === currentStepProgress?.step_id) ?? null;
  const lastActiveCandidates = [
    enrollment.enrolled_at,
    enrollment.completed_at,
    ...progress.flatMap((item) => [item.started_at, item.completed_at].filter(Boolean) as string[])
  ];
  const lastActiveAt = lastActiveCandidates.sort().at(-1) ?? enrollment.enrolled_at;
  const now = Date.now();
  const hoursSinceActive = (now - new Date(lastActiveAt).getTime()) / (1000 * 60 * 60);
  const daysSinceEnrolled =
    (now - new Date(enrollment.enrolled_at).getTime()) / (1000 * 60 * 60 * 24);

  let status: AdminStudentRow["status"] = "On Track";
  if (currentStep?.order_index === steps.at(-1)?.order_index) {
    status = "Shipping Today";
  } else if (hoursSinceActive >= 3 || (progressPercentage < 20 && daysSinceEnrolled >= 2)) {
    status = "At Risk";
  } else if (hoursSinceActive >= 1 && hoursSinceActive < 3) {
    status = "Needs Nudge";
  }

  return {
    userId: user.id,
    email: user.email,
    name: getDisplayNameFromUser(user) ?? user.email.split("@")[0],
    questSlug: quest.slug,
    questTitle: quest.title,
    progressPercentage,
    currentStepName: currentStep?.title ?? "Waiting to start",
    currentStepOrder: currentStep?.order_index ?? null,
    lastActiveAt,
    status
  } satisfies AdminStudentRow;
}
