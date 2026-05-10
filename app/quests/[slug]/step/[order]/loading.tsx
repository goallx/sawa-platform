import { Skeleton } from "@/components/ui/skeleton";

export default function QuestStepLoading() {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    </div>
  );
}
