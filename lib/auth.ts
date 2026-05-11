import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { getPostAuthRedirectPath } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function redirectAuthenticatedUser(user: User) {
  const nextPath = await getPostAuthRedirectPath(user.id);
  redirect(nextPath);
}

export function getUserProfileDefaults(user: User | null) {
  if (!user) {
    return {
      email: null,
      fullName: null
    };
  }

  const metadata = user.user_metadata ?? {};
  const fullName =
    (typeof metadata.full_name === "string" && metadata.full_name.trim()) ||
    (typeof metadata.name === "string" && metadata.name.trim()) ||
    [metadata.given_name, metadata.family_name]
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
      .join(" ")
      .trim() ||
    null;

  return {
    email: user.email ?? null,
    fullName
  };
}

export function isAdminUser(user: User | null) {
  if (!user) {
    return false;
  }

  const envAdmins = (process.env.ADMINS ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const role =
    (user.user_metadata?.role as string | undefined) ??
    (user.app_metadata?.role as string | undefined);

  return role === "admin" || (!!user.email && envAdmins.includes(user.email));
}
