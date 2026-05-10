import Link from "next/link";
import { notFound } from "next/navigation";

import { QuestEnrollForm } from "@/components/quest-enroll-form";
import { ProgressBar } from "@/components/progress-bar";
import { QuestStepList } from "@/components/quest-step-list";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getQuestOverview } from "@/lib/quests";

export default async function QuestOverviewPage({
  params
}: {
  params: { slug: string };
}) {
  const user = await requireUser();
  const overview = await getQuestOverview(params.slug, user.id);

  if (!overview) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
          {overview.quest.title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-500">
          {overview.quest.description}
        </p>
        <p className="text-sm text-slate-500">
          {overview.quest.duration_days} day quest
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl text-[#0F172A]">Quest progress</CardTitle>
              <p className="text-sm text-slate-500">
                {overview.completedSteps} of {overview.steps.length} steps complete
              </p>
            </div>
            {overview.enrollment ? (
              <Link
                href={
                  overview.currentStep
                    ? `/quests/${overview.quest.slug}/step/${overview.currentStep.order_index}`
                    : `/quests/${overview.quest.slug}/complete`
                }
                className={buttonVariants({ className: "w-full sm:w-auto" })}
              >
                Continue to current step
              </Link>
            ) : (
              <QuestEnrollForm slug={overview.quest.slug} label="Start Quest" />
            )}
          </div>
          <ProgressBar value={overview.progressPercentage} />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#0F172A]">Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <QuestStepList
            questSlug={overview.quest.slug}
            steps={overview.steps}
            currentOrder={overview.currentStep?.order_index}
          />
        </CardContent>
      </Card>
    </div>
  );
}
