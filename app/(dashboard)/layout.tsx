import { getLocale } from "next-intl/server";

import { DashboardShell } from "@/components/dashboard-shell";
import { isRTL } from "@/i18n";
import { isAdminUser, requireUser } from "@/lib/auth";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [locale, user] = await Promise.all([getLocale(), requireUser()]);
  const userName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Builder";
  const userEmail = user.email ?? "builder@sawa.so";
  const userInitial = userName.charAt(0).toUpperCase() || "B";
  const rtl = isRTL(locale);

  return (
    <DashboardShell
      isRTL={rtl}
      isAdmin={isAdminUser(user)}
      userName={userName}
      userEmail={userEmail}
      userInitial={userInitial}
    >
      {children}
    </DashboardShell>
  );
}
