import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { defaultLocale } from "@/i18n";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  const locale = cookies().get("NEXT_LOCALE")?.value ?? defaultLocale;

  redirect(user ? `/${locale}/dashboard` : `/${locale}/login`);
}
