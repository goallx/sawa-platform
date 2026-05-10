import { requireUser } from "@/lib/auth";
import { getActiveQuests } from "@/lib/quests";
import { QuestCard } from "@/components/quest-card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function QuestsPage() {
  const user = await requireUser();
  const quests = await getActiveQuests(user.id);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
          Quests
        </h1>
        <p className="text-base text-slate-500">Choose your path</p>
      </div>
      {quests.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {quests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-[#E2E8F0] bg-white p-8">
          <p className="text-sm text-slate-500">No active quests yet.</p>
          <Link href="/api/seed" className={buttonVariants({ className: "mt-4 inline-flex" })}>
            Seed the first quest
          </Link>
        </div>
      )}
    </div>
  );
}
