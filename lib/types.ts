export type QuestStatus = "draft" | "active" | "archived";
export type EnrollmentStatus = "active" | "completed" | "dropped";
export type ProgressStatus = "locked" | "in_progress" | "completed";
export type DeliverableType = "text" | "url" | "screenshot" | "none";

export interface Quest {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  duration_days: number;
  status: QuestStatus;
  order_index: number;
  created_at: string;
}

export interface QuestStep {
  id: string;
  quest_id: string;
  title: string;
  content: string;
  order_index: number;
  estimated_minutes: number;
  deliverable_type: DeliverableType;
  deliverable_prompt: string | null;
  created_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  quest_id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  completed_at: string | null;
}

export interface ProgressRecord {
  id: string;
  enrollment_id: string;
  step_id: string;
  status: ProgressStatus;
  started_at: string | null;
  completed_at: string | null;
  deliverable: string | null;
  notes: string | null;
}

export interface QuestWithEnrollment extends Quest {
  enrollment?: Enrollment | null;
}

export interface QuestStepWithProgress extends QuestStep {
  progress?: ProgressRecord | null;
}

export interface ActivityItem {
  id: string;
  type: "enrolled" | "completed" | "started" | "saved";
  label: string;
  timestamp: string;
}

export interface DashboardStats {
  questsCompleted: number;
  projectsShipped: number;
  currentStreak: number;
  communityRank: number;
}

export interface AdminStudentRow {
  userId: string;
  email: string;
  name: string;
  questSlug: string;
  questTitle: string;
  progressPercentage: number;
  currentStepName: string;
  currentStepOrder: number | null;
  lastActiveAt: string;
  status: "On Track" | "Needs Nudge" | "At Risk" | "Shipping Today";
}
