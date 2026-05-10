import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getQuestOverview } from "@/lib/quests";
import { cn } from "@/lib/utils";

export default async function QuestCompletePage({
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
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
          Quest complete
        </h1>
        <p className="text-base text-slate-500">
          You finished {overview.quest.title}. Nice work shipping it.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#0F172A]">
            What you just finished
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-slate-500">
            You completed {overview.completedSteps} steps across {overview.quest.duration_days} days.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard" className={buttonVariants()}>
              Back to dashboard
            </Link>
            <Link
              href="/quests"
              className={cn(buttonVariants({ variant: "outline" }), "justify-center")}
            >
              Browse Quests
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
