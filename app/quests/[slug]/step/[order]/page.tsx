import { AlertCircle } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { MarkdownContent } from "@/components/markdown-content";
import { ProgressBar } from "@/components/progress-bar";
import { QuestStepForm } from "@/components/quest-step-form";
import { QuestStepList } from "@/components/quest-step-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getQuestStepPageData, parseQuestStepContent } from "@/lib/quests";

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

  const { mission, tips, stuck } = parseQuestStepContent(data.step.content);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium text-[#4F46E5]">
            {data.quest.title}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
            {data.step.title}
          </h1>
          <p className="text-sm text-slate-500">{data.step.estimated_minutes} min mission</p>
        </div>

        <Card>
          <CardContent className="space-y-6 p-6">
            <MarkdownContent content={mission} />

            {tips ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
                <h2 className="text-sm font-semibold text-amber-900">Tips</h2>
                <div className="mt-3">
                  <MarkdownContent content={tips} />
                </div>
              </div>
            ) : null}

            {stuck ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-700" />
                  <h2 className="text-sm font-semibold text-amber-900">Stuck?</h2>
                </div>
                <div className="mt-3">
                  <MarkdownContent content={stuck} />
                </div>
              </div>
            ) : null}

            <QuestStepForm slug={data.quest.slug} step={data.step} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <CardTitle className="text-xl text-[#0F172A]">Progress</CardTitle>
              <p className="text-sm text-slate-500">{data.progressPercentage}% complete</p>
            </div>
            <ProgressBar value={data.progressPercentage} />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-[#0F172A]">Quest steps</CardTitle>
          </CardHeader>
          <CardContent>
            <QuestStepList
              questSlug={data.quest.slug}
              steps={data.steps}
              currentOrder={data.step.order_index}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
