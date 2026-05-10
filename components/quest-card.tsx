import { QuestEnrollForm } from "@/components/quest-enroll-form";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/navigation";
import type { QuestWithEnrollment } from "@/lib/types";

export function QuestCard({ quest }: { quest: QuestWithEnrollment }) {
  const isEnrolled = Boolean(quest.enrollment);

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <CardTitle className="text-xl text-[#0F172A]">{quest.title}</CardTitle>
          <p className="text-sm leading-6 text-slate-500">
            {quest.description}
          </p>
        </div>
        <p className="text-sm text-slate-500">{quest.duration_days} day quest</p>
      </CardHeader>
      <CardContent className="pt-0">
        {isEnrolled ? (
          <Link
            href={`/quests/${quest.slug}`}
            className={buttonVariants({ className: "w-full sm:w-auto" })}
          >
            Continue
          </Link>
        ) : (
          <QuestEnrollForm slug={quest.slug} label="Enroll" />
        )}
      </CardContent>
    </Card>
  );
}
