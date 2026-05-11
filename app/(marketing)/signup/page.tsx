import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { AuthForm } from "@/components/auth-form";
import { isRTL } from "@/i18n";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function SignupPage() {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  const rtl = isRTL(locale);
  const ArrowIcon = rtl ? ChevronRight : ChevronLeft;

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className={`w-full px-4 py-4 md:px-8 ${rtl ? "text-right" : "text-left"}`}>
        <Link
          href="/"
          className={`inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-900 ${
            rtl ? "flex-row-reverse" : ""
          }`}
        >
          <ArrowIcon className="h-4 w-4" />
          <span>Back to Sawa</span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
