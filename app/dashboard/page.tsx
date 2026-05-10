import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  await requireUser();

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
        <CardContent className="min-h-[220px] p-6" />
      </Card>
    </div>
  );
}
