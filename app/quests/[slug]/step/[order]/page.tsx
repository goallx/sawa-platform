import { notFound, redirect } from "next/navigation";
import type { Route } from "next";

import { MissionCollapsible } from "@/components/mission-collapsible";
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

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 -mx-6 border-b border-[#E2E8F0] bg-white px-6 py-4 md:-mx-8 md:px-8">
        <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
          <div>
            <Link
              href={`/quests/${params.slug}` as Route}
              className="text-sm font-medium text-slate-500 hover:text-[#0F172A]"
            >
              ← Back to Quest
            </Link>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#0F172A]">
              Mission {data.step.order_index}: {data.step.title}
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className={cn("text-sm font-medium", minuteTone)}>
              ⏱ {data.step.estimated_minutes} min left
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
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
              <Link
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="text-sky-900 underline underline-offset-4"
              >
                Still stuck? Ask in Discord →
              </Link>
            }
          />
        </div>

        <Card>
          <CardContent className="p-6">
            <QuestStepForm slug={data.quest.slug} step={data.step} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
