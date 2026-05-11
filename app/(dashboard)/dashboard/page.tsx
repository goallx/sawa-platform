import { ProgressBar } from "@/components/progress-bar";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/quests";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";

const liveBuilders = [
  {
    name: "Noor",
    step: "Writing the hero",
    emoji: "📝",
    avatarClass: "bg-slate-100 text-slate-700"
  },
  {
    name: "Yousef",
    step: "Building the CTA",
    emoji: "🔨",
    avatarClass: "bg-indigo-50 text-indigo-700"
  },
  {
    name: "Lina",
    step: "Polishing mobile",
    emoji: "📝",
    avatarClass: "bg-slate-100 text-slate-700"
  },
  {
    name: "Omar",
    step: "Shipping the draft",
    emoji: "🚀",
    avatarClass: "bg-indigo-50 text-indigo-700"
  },
  {
    name: "Sara",
    step: "Writing value props",
    emoji: "🔨",
    avatarClass: "bg-slate-100 text-slate-700"
  },
  {
    name: "Khaled",
    step: "Wrapped for today",
    emoji: "✅",
    avatarClass: "bg-indigo-50 text-indigo-700"
  }
] as const;

export default async function DashboardPage() {
  const user = await requireUser();
  const dashboard = await getDashboardData(user);
  const activeEnrollment = dashboard.activeEnrollment;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
          {dashboard.welcomeName ? `Hey ${dashboard.welcomeName}` : "Hey, builder"}
        </h1>
        <p className="text-base text-slate-500">May Intensive • Day 2 of 3</p>
      </div>

      <section className="rounded-lg border border-[#E2E8F0] bg-slate-50">
        <div className="border-b border-[#E2E8F0] px-5 py-4">
          <p className="text-sm font-medium tracking-[0.12em] text-[#4F46E5]">
            LIVE NOW • 6 builders active
          </p>
        </div>
        <div className="overflow-x-auto px-5 py-5">
          <div className="flex min-w-max gap-4">
            {liveBuilders.map((builder) => (
              <Card key={builder.name} className="w-[150px] shrink-0 bg-white">
                <CardContent className="flex flex-col items-center gap-3 p-4 text-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold",
                      builder.avatarClass
                    )}
                  >
                    {builder.name[0]}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#0F172A]">{builder.name}</p>
                    <p className="text-xs leading-5 text-slate-500">{builder.step}</p>
                  </div>
                  <p className="text-lg leading-none">{builder.emoji}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {activeEnrollment ? (
        <Card className="border-[#E2E8F0]">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#4F46E5]">Your Active Quest</p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#0F172A]">
                Quest 1: AI-Powered Landing Page
              </h2>
              <p className="text-sm text-slate-500">
                {activeEnrollment.currentStepName ?? "Ready to begin"}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-[#0F172A]">
                  Step 2.2 of 10
                </p>
                <p className="text-sm font-medium text-[#4F46E5]">
                  {activeEnrollment.progressPercentage}%
                </p>
              </div>
              <ProgressBar
                value={activeEnrollment.progressPercentage}
                className="h-3 bg-slate-100"
              />
            </div>

            <div className="space-y-3">
              <Link
                href={
                  activeEnrollment.currentStep
                    ? `/quests/${activeEnrollment.quest.slug}/step/${activeEnrollment.currentStep.order_index}`
                    : `/quests/${activeEnrollment.quest.slug}`
                }
                className={buttonVariants({ className: "w-full sm:w-fit px-6 py-3 text-base" })}
              >
                Continue Building →
              </Link>
              <p className="text-sm font-medium text-amber-900">
                Today&apos;s deadline: Ship draft by 6pm • 4 hours left
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-[#E2E8F0] pt-4 text-sm text-slate-500">
              <p>Your streak: {dashboard.stats.currentStreak || 2} days</p>
              <p>Shipped: 0</p>
              <p>Helped: 0</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-5 p-8 text-center">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-[#0F172A]">
                No active quest. Pick one and start building.
              </h2>
              <p className="text-sm text-slate-500">
                The cohort is already moving. Jump into a quest and ship alongside them.
              </p>
            </div>
            <div>
              <Link href="/quests" className={buttonVariants({ className: "px-6" })}>
                Browse Quests
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
