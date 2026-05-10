import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { questSeed } from "@/lib/quest-seed";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  return seedQuest();
}

export async function POST() {
  return seedQuest();
}

async function seedQuest() {
  await requireUser();
  const supabase = createClient();

  const { data: existingQuest, error: existingError } = await supabase
    .from("quests")
    .select("id, slug")
    .eq("slug", questSeed.slug)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  let questId = existingQuest?.id;

  if (!questId) {
    const { data: createdQuest, error: createQuestError } = await supabase
      .from("quests")
      .insert({
        slug: questSeed.slug,
        title: questSeed.title,
        description: questSeed.description,
        duration_days: questSeed.duration_days,
        status: questSeed.status,
        order_index: questSeed.order_index
      })
      .select("id")
      .single();

    if (createQuestError || !createdQuest) {
      return NextResponse.json(
        { error: createQuestError?.message ?? "Could not create quest." },
        { status: 500 }
      );
    }

    questId = createdQuest.id;
  }

  const { data: existingSteps, error: existingStepsError } = await supabase
    .from("quest_steps")
    .select("id")
    .eq("quest_id", questId);

  if (existingStepsError) {
    return NextResponse.json({ error: existingStepsError.message }, { status: 500 });
  }

  if (!existingSteps?.length) {
    const { error: stepsError } = await supabase.from("quest_steps").insert(
      questSeed.steps.map((step) => ({
        quest_id: questId,
        title: step.title,
        content: step.content,
        order_index: step.order_index,
        estimated_minutes: step.estimated_minutes,
        deliverable_type: step.deliverable_type,
        deliverable_prompt: step.deliverable_prompt
      }))
    );

    if (stepsError) {
      return NextResponse.json({ error: stepsError.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    ok: true,
    quest: questSeed.slug,
    insertedSteps: questSeed.steps.length
  });
}
