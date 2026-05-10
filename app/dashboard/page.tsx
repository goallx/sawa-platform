import Link from "next/link";

import { ProgressBar } from "@/components/progress-bar";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getActiveEnrollmentForDashboard } from "@/lib/quests";

export default async function DashboardPage() {
  const user = await requireUser();
  const activeEnrollment = await getActiveEnrollmentForDashboard(user.id);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
          Dashboard
        </h1>
        <p className="text-base text-slate-500">
          Here&apos;s what you&apos;re building today
        </p>
      </div>
      <Card>
        {activeEnrollment ? (
          <>
            <CardHeader className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm text-slate-500">Active quest</p>
                <CardTitle className="text-2xl text-[#0F172A]">
                  {activeEnrollment.quest.title}
                </CardTitle>
              </div>
              <ProgressBar value={activeEnrollment.progressPercentage} />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-500">
                {activeEnrollment.progressPercentage}% complete
              </p>
              <Link
                href={
                  activeEnrollment.currentStep
                    ? `/quests/${activeEnrollment.quest.slug}/step/${activeEnrollment.currentStep.order_index}`
                    : `/quests/${activeEnrollment.quest.slug}`
                }
                className={buttonVariants({ className: "w-fit" })}
              >
                Continue
              </Link>
            </CardContent>
          </>
        ) : (
          <CardContent className="space-y-4 p-6">
            <p className="text-sm text-slate-500">
              No active quest yet. Start one and build momentum.
            </p>
            <Link href="/quests" className={buttonVariants({ className: "w-fit" })}>
              Browse Quests
            </Link>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
