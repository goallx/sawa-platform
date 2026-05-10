import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { defaultLocale } from "@/i18n";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";

export default async function SignupPage() {
  const user = await getCurrentUser();
  const locale = cookies().get("NEXT_LOCALE")?.value ?? defaultLocale;

  if (user) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
      <AuthForm mode="signup" />
    </div>
  );
}
