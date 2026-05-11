import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ProfileForm } from "@/components/profile-form";
import { requireUser } from "@/lib/auth";
import { getProfile, getProfileStatus } from "@/lib/profiles";

export default async function ProfilePage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const status = getProfileStatus(profile);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">Your Profile</h1>
        <p className="text-sm text-slate-500">Keep your builder profile current so cohort coordination stays smooth.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#0F172A]">Profile details</CardTitle>
        </CardHeader>
        <CardContent>
          {status.missingCriticalFields ? (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <Link href="/profile" className="font-medium text-amber-900 underline underline-offset-4">
                Complete your profile to join cohorts →
              </Link>
            </div>
          ) : null}
          <ProfileForm
            profile={profile}
            userEmail={user.email ?? null}
            completionPercentage={status.completionPercentage}
            missingCriticalFields={status.missingCriticalFields}
          />
        </CardContent>
      </Card>
    </div>
  );
}
