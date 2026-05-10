import { Link } from "@/navigation";
import { cn } from "@/lib/utils";

const filters = ["All", "On Track", "Needs Nudge", "At Risk"] as const;

export function AdminFilterLinks({ currentFilter }: { currentFilter: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Link
          key={filter}
          href={filter === "All" ? "/admin" : `/admin?filter=${encodeURIComponent(filter)}`}
          className={cn(
            "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
            currentFilter === filter
              ? "border-[#4F46E5] bg-white text-[#4F46E5]"
              : "border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-slate-50"
          )}
        >
          {filter}
        </Link>
      ))}
    </div>
  );
}
