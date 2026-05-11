import { getLocale } from "next-intl/server";

import { DashboardShell } from "@/components/dashboard-shell";
import { isRTL } from "@/i18n";
import { requireUser } from "@/lib/auth";
import { getDisplayName, getProfile } from "@/lib/profiles";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [locale, user] = await Promise.all([getLocale(), requireUser()]);
  const profile = await getProfile(user.id);
  const userName = getDisplayName(profile, user.email);
  const userEmail = user.email ?? "builder@sawa.so";
  const userInitial = userName.charAt(0).toUpperCase() || "B";
  const rtl = isRTL(locale);

  return (
    <DashboardShell
      isRTL={rtl}
      userName={userName}
      userEmail={userEmail}
      userInitial={userInitial}
    >
      {children}
    </DashboardShell>
  );
}
