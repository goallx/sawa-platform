"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function saveProfile(formData: FormData) {
  const user = await requireUser();
  const supabase = createClient();

  const full_name = normalizeString(formData.get("full_name"));
  const phone_number = normalizeString(formData.get("phone_number"));
  const bio = normalizeString(formData.get("bio"));
  const location = normalizeString(formData.get("location"));
  const age = normalizeNumber(formData.get("age"));
  const occupation = normalizeString(formData.get("occupation"));

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name,
      phone_number,
      bio,
      location,
      age,
      occupation,
      email: user.email ?? null,
      completed_onboarding: Boolean(full_name),
      updated_at: new Date().toISOString()
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { ok: true as const };
}

function normalizeString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function normalizeNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
