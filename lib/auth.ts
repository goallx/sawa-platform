import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { defaultLocale } from "@/i18n";
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
    const locale = cookies().get("NEXT_LOCALE")?.value ?? defaultLocale;
    redirect(`/${locale}/login`);
  }

  return user;
}
