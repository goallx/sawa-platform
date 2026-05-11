import { notFound, redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import type { Route } from "next";

import { DirectionWrapper } from "@/components/DirectionWrapper";
import { MissionCollapsible } from "@/components/mission-collapsible";
import { ProgressBar } from "@/components/progress-bar";
import { QuestStepList } from "@/components/quest-step-list";
import { QuestStepForm } from "@/components/quest-step-form";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { getQuestStepPageData, parseQuestStepContent } from "@/lib/quests";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";

export default async function QuestStepPage({
  params
}: {
  params: { slug: string; order: string };
}) {
  const user = await requireUser();
  const locale = await getLocale();
  const order = Number(params.order);
  const data = await getQuestStepPageData(params.slug, order, user.id);

  if (!data || !Number.isFinite(order)) {
    notFound();
  }

  if (!data.enrollment) {
    redirect(`/quests/${params.slug}`);
  }

  if (!data.step) {
    notFound();
  }

  if (!data.step.progress || data.step.progress.status === "locked") {
    redirect(`/quests/${params.slug}`);
  }

  const mission = parseQuestStepContent(data.step.content);
  const minuteTone =
    data.step.estimated_minutes < 10 ? "text-amber-900" : "text-[#4F46E5]";
  const isRTL = locale === "ar";
  const backArrow = isRTL ? "→" : "←";
  const completionLabel = `${data.completedSteps} of ${data.steps.length} missions done`;

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 -mx-6 border-b border-[#E2E8F0] bg-white px-6 py-4 md:-mx-8 md:px-8">
        <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
          <div>
            <Link
              href={`/quests/${params.slug}` as Route}
              className="text-sm font-medium text-slate-500 hover:text-[#0F172A]"
            >
              {backArrow} Back to Quest
            </Link>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#0F172A]">
              Mission {data.step.order_index}: {data.step.title}
            </p>
          </div>
          <div className={isRTL ? "text-left md:text-left" : "text-left md:text-right"}>
            <p className={cn("text-sm font-medium", minuteTone)}>
              ⏱ {data.step.estimated_minutes} min left
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        <DirectionWrapper
          layout="step"
          content={
            <div className="space-y-6">
              {mission.context.length ? (
                <div className="space-y-2">
                  {mission.context.map((line, index) => (
                    <p key={index} className="text-base leading-7 text-slate-600">
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}

              <Card className="mx-auto w-full max-w-3xl">
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#4F46E5]">
                      DO THIS NOW
                    </p>
                    <ol className="space-y-3">
                      {mission.actions.map((action, index) => (
                        <li key={index} className="flex gap-3 text-base text-[#0F172A]">
                          <span className="font-semibold text-[#4F46E5]">{index + 1}.</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <a
                    href="#deliverable-section"
                    className={cn(buttonVariants(), "w-full justify-center")}
                  >
                    I did this →
                  </a>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <MissionCollapsible title="💡 Tips" tone="amber" items={mission.tips} />
                <MissionCollapsible
                  title="🆘 Stuck?"
                  tone="sky"
                  items={mission.stuck}
                  footer={
                    <p className="text-sm text-sky-900">
                      Save your draft, step away for a minute, then come back and try the smallest next move.
                    </p>
                  }
                />
              </div>

              <Card>
                <CardContent className="p-6">
                  <QuestStepForm slug={data.quest.slug} step={data.step} />
                </CardContent>
              </Card>
            </div>
          }
          aside={
            <div className="space-y-4 lg:sticky lg:top-24">
              <Card>
                <CardContent className="space-y-4 p-5">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-[#0F172A]">{data.quest.title}</p>
                    <p className="text-sm text-slate-500">{completionLabel}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-medium text-[#4F46E5]">
                        {data.progressPercentage}%
                      </span>
                    </div>
                    <ProgressBar value={data.progressPercentage} className="h-3 bg-slate-100" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-[#0F172A]">Mission flow</p>
                  </div>
                  <QuestStepList
                    questSlug={data.quest.slug}
                    steps={data.steps}
                    currentOrder={data.step.order_index}
                  />
                </CardContent>
              </Card>
            </div>
          }
        />
      </div>
    </div>
  );
}
