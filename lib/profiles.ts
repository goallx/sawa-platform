import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileStatus } from "@/lib/types";

const profileFields = [
  "full_name",
  "phone_number",
  "bio",
  "location",
  "age",
  "occupation"
] as const;

export const getProfile = cache(async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as Profile | null) ?? null;
});

export function getProfileStatus(profile: Profile | null): ProfileStatus {
  if (!profile) {
    return {
      completionPercentage: 0,
      missingCriticalFields: true
    };
  }

  const filledCount = profileFields.filter((field) => {
    const value = profile[field];

    if (typeof value === "number") {
      return Number.isFinite(value);
    }

    return Boolean(value && String(value).trim().length);
  }).length;

  return {
    completionPercentage: Math.round((filledCount / profileFields.length) * 100),
    missingCriticalFields: !profile.full_name?.trim() || !profile.phone_number?.trim()
  };
}

export function shouldShowOnboarding(profile: Profile | null) {
  return !profile?.completed_onboarding && !profile?.full_name?.trim();
}

export function getDisplayName(profile: Profile | null, fallbackEmail?: string | null) {
  return profile?.full_name?.trim() || fallbackEmail?.split("@")[0] || "Builder";
}

export async function getPostAuthRedirectPath(userId: string) {
  const profile = await getProfile(userId);
  return shouldShowOnboarding(profile) ? "/onboarding" : "/dashboard";
}
