import { redirect } from "next/navigation";
import type { Route } from "next";

import { AdminFilterLinks } from "@/components/admin-filter-links";
import { AdminNudgeButton } from "@/components/admin-nudge-button";
import { ProgressBar } from "@/components/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdminUser, requireUser } from "@/lib/auth";
import { formatRelativeTime, getAdminDashboardData } from "@/lib/quests";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";

export default async function AdminPage({
  searchParams
}: {
  searchParams?: { filter?: string };
}) {
  const user = await requireUser();

  if (!isAdminUser(user)) {
    redirect("/dashboard");
  }

  const filter = searchParams?.filter ?? "All";
  const dashboard = await getAdminDashboardData(filter);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
          Admin • {dashboard.cohortName}
        </h1>
        <AdminFilterLinks currentFilter={filter} />
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <AdminStat label="Total Students" value={dashboard.stats.totalStudents} />
        <AdminStat label="Active Now" value={dashboard.stats.activeNow} />
        <AdminStat label="Completed Today" value={dashboard.stats.completedToday} />
        <AdminStat label="At Risk" value={dashboard.stats.atRisk} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#0F172A]">Students</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-[920px] w-full text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-sm text-slate-500">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Progress</th>
                <th className="pb-3 pr-4 font-medium">Current Step</th>
                <th className="pb-3 pr-4 font-medium">Last Active</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.rows.map((row) => {
                const href = row.currentStepOrder
                  ? (`/quests/${row.questSlug}/step/${row.currentStepOrder}` as Route)
                  : (`/quests/${row.questSlug}` as Route);

                return (
                  <tr key={row.userId} className="border-b border-[#E2E8F0] align-top last:border-b-0">
                    <td className="py-4 pr-4">
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{row.name}</p>
                        <p className="text-xs text-slate-500">{row.email}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="min-w-[180px] space-y-2">
                        <ProgressBar value={row.progressPercentage} />
                        <p className="text-xs text-slate-500">{row.progressPercentage}%</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-sm text-[#0F172A]">{row.currentStepName}</td>
                    <td className="py-4 pr-4 text-sm text-slate-500">
                      {formatRelativeTime(row.lastActiveAt)}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={cn(
                          "inline-flex rounded-lg border px-3 py-1 text-xs font-medium",
                          row.status === "On Track" && "border-[#E2E8F0] bg-white text-[#0F172A]",
                          row.status === "Needs Nudge" && "border-amber-200 bg-amber-50 text-amber-900",
                          row.status === "At Risk" && "border-sky-200 bg-sky-50 text-sky-900",
                          row.status === "Shipping Today" && "border-[#4F46E5] bg-indigo-50 text-[#4F46E5]"
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex gap-2">
                        <Link
                          href={href}
                          className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50"
                        >
                          View Progress
                        </Link>
                        <AdminNudgeButton email={row.email} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminStat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="space-y-2 p-5">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-3xl font-semibold tracking-tight text-[#0F172A]">{value}</p>
      </CardContent>
    </Card>
  );
}
