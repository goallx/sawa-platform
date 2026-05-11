import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

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
