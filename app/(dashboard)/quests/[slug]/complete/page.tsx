import { notFound } from "next/navigation";

import { ShareWinCard } from "@/components/share-win-card";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getQuestCompletionData } from "@/lib/quests";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";

export default async function QuestCompletePage({
  params
}: {
  params: { slug: string };
}) {
  const user = await requireUser();
  const completion = await getQuestCompletionData(params.slug, user.id);

  if (!completion) {
    notFound();
  }

  const shareText = `I just shipped my first AI-powered landing page in 3 days with Sawa 🚀
No code. Just built.
${completion.liveUrl || "[URL]"}`;
  const peerReactions = [
    {
      name: "Noor",
      message: "Just shipped mine too! 🔥",
      avatarClass: "bg-slate-100 text-slate-700"
    },
    {
      name: "Yousef",
      message: "Welcome to the club 🎉",
      avatarClass: "bg-indigo-50 text-indigo-700"
    },
    {
      name: "Mentor Wael",
      message: "Proud of you. On to Quest 2?",
      avatarClass: "bg-slate-100 text-slate-700"
    }
  ] as const;

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-16">
      <div className="space-y-4 text-center">
        <div className="text-5xl leading-none">🎉</div>
        <h1 className="text-[32px] font-bold tracking-tight text-[#0F172A]">
          YOU SHIPPED
        </h1>
        <p className="text-[20px] font-semibold text-[#4F46E5]">
          {completion.quest.title}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#0F172A]">Your artifact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border border-[#E2E8F0] bg-slate-50 px-4 py-4">
            <p className="text-lg font-semibold text-[#0F172A] break-words">
              {completion.liveUrl || "Live URL coming soon"}
            </p>
          </div>
          <div className="flex h-52 items-center justify-center rounded-lg border border-[#E2E8F0] bg-slate-100 text-sm font-medium text-slate-500">
            Your page
          </div>
          <p className="text-sm text-slate-500">
            Built in {completion.durationDays} day{completion.durationDays === 1 ? "" : "s"} •{" "}
            {completion.completedSteps} missions • {completion.liveUrl ? "1 live URL" : "0 live URLs"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#0F172A]">Level up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-4 rounded-lg border border-[#E2E8F0] bg-white p-5">
            <div className="rounded-lg border border-[#E2E8F0] bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              Explorer
            </div>
            <div className="text-lg text-slate-400">→</div>
            <div className="rounded-lg border border-[#4F46E5] bg-indigo-50 px-5 py-3 text-base font-semibold text-[#4F46E5]">
              ✦ Creator
            </div>
          </div>
          <p className="text-center text-sm text-slate-500">
            You&apos;ve leveled up. New quests unlocked.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#0F172A]">Share your win</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-500">Use this as your ship post template.</p>
          <ShareWinCard copyText={shareText} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#0F172A]">Peer reactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {peerReactions.map((reaction) => (
            <div key={reaction.name} className="flex items-start gap-3 rounded-lg border border-[#E2E8F0] p-4">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  reaction.avatarClass
                )}
              >
                {reaction.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">{reaction.name}</p>
                <p className="text-sm text-slate-500">{reaction.message}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#0F172A]">Next steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border border-[#E2E8F0] p-4">
            <p className="text-sm font-semibold text-[#0F172A]">Quest 2: Real Signups</p>
            <p className="mt-2 text-sm text-slate-500">
              Available next. Turn your shipped page into something that collects real interest.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/dashboard" className="text-sm font-medium text-[#4F46E5] hover:text-[#4338CA]">
              Back to Dashboard
            </Link>
            <Link
              href="/quests"
              className={cn(buttonVariants({ variant: "outline" }), "justify-center")}
            >
              Explore more quests
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
