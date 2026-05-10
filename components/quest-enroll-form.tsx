import { enrollInQuest } from "@/app/quests/actions";
import { SubmitButton } from "@/components/submit-button";

export function QuestEnrollForm({ slug, label }: { slug: string; label: string }) {
  return (
    <form action={enrollInQuest}>
      <input type="hidden" name="slug" value={slug} />
      <SubmitButton
        type="submit"
        idleText={label}
        pendingText="Starting..."
        className="w-full sm:w-auto"
      />
    </form>
  );
}
