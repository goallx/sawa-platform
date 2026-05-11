import { redirect } from "next/navigation";

import { OnboardingFlow } from "@/components/onboarding-flow";
import { getUserProfileDefaults, requireUser } from "@/lib/auth";
import { getProfile } from "@/lib/profiles";

export default async function OnboardingPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const authDefaults = getUserProfileDefaults(user);

  if (profile?.completed_onboarding) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <OnboardingFlow profile={profile} authDefaults={authDefaults} />
    </div>
  );
}
