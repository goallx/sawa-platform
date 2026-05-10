export const questSeed = {
  slug: "ai-powered-landing-page",
  title: "AI-Powered Landing Page",
  description:
    "Design, write, build, and publish a lightweight landing page in three focused days.",
  duration_days: 3,
  status: "active",
  order_index: 1,
  steps: [
    {
      title: "1.1 Pick Your Idea",
      order_index: 1,
      estimated_minutes: 10,
      deliverable_type: "text",
      deliverable_prompt: "Describe your project in one sentence",
      content: `# Pick Your Idea

Choose one project idea that is specific enough to build momentum around in three days.

## Mission

- Pick something you can explain in one sentence.
- Make sure the audience is obvious.
- Keep the outcome clear and practical.

## Tips

- Start with a problem you understand well.
- If you have two ideas, pick the one you could describe to a stranger fastest.
- Avoid marketplace or platform ideas for this sprint unless the niche is extremely narrow.

## Stuck?

- If your idea feels too broad, add a target audience and a format.
- If you are torn between options, choose the one you could publish first, not the one with the biggest vision.
- If nothing feels good enough, write three rough ideas and pick the least complicated one.`,
      day: 1
    },
    {
      title: "1.2 Name & Vibe",
      order_index: 2,
      estimated_minutes: 15,
      deliverable_type: "text",
      deliverable_prompt: "Your project name and 3 vibe words",
      content: `# Name & Vibe

Give your project a name and a simple personality so the page feels coherent.

## Mission

- Write 5 possible names quickly.
- Pick the strongest one.
- Choose 3 vibe words that guide the design and tone.

## Tips

- The best names are easy to say and easy to remember.
- Vibe words should affect design choices, not just sound nice.
- Good examples: calm, sharp, playful, premium, minimal.

## Stuck?

- If every name feels generic, borrow from the benefit rather than the category.
- If the vibe feels fuzzy, imagine the homepage in three adjectives.
- If you are overthinking, pick a working name and keep moving.`,
      day: 1
    },
    {
      title: "1.3 Write Content",
      order_index: 3,
      estimated_minutes: 20,
      deliverable_type: "text",
      deliverable_prompt: "Paste your headline, bullets, and CTA",
      content: `# Write Content

Draft the words before you touch layout so the page has a clear message.

## Mission

- Write one strong headline.
- Add three supporting bullets.
- Finish with one clear call to action.

## Tips

- Lead with the outcome, not the feature.
- Bullets should be specific and easy to scan.
- Your CTA should sound like the next obvious step.

## Stuck?

- If the headline feels weak, start with "Get", "Launch", or "Build" and refine later.
- If bullets sound repetitive, make each one answer a different question.
- If you cannot write the CTA, ask what action you actually want after someone reads the page.`,
      day: 1
    },
    {
      title: "2.1 Set Up Carrd",
      order_index: 4,
      estimated_minutes: 10,
      deliverable_type: "url",
      deliverable_prompt: "Your Carrd dashboard URL",
      content: `# Set Up Carrd

Open Carrd, create the project shell, and get your workspace ready for the build.

## Mission

- Create a new Carrd site.
- Pick a starting template or blank page.
- Confirm your dashboard and project links are accessible.

## Tips

- Choose simple structure over decorative detail.
- Keep spacing generous from the start.
- Use your vibe words to guide the template choice.

## Stuck?

- If the template feels distracting, switch to a cleaner one immediately.
- If you cannot decide, use the simplest layout with a hero and one content section.
- If your workspace feels messy, rename the project before moving on.`,
      day: 2
    },
    {
      title: "2.2 Build Hero Section",
      order_index: 5,
      estimated_minutes: 40,
      deliverable_type: "url",
      deliverable_prompt: "Carrd draft link",
      content: `# Build Hero Section

Turn your core message into a clean hero with strong hierarchy.

## Mission

- Add your headline and supporting copy.
- Include one clear primary CTA.
- Make sure the first screen explains the offer quickly.

## Tips

- Prioritize whitespace so the hero breathes.
- Keep the CTA visible without scrolling.
- Use one strong visual idea, not three competing ones.

## Stuck?

- If the hero looks crowded, delete one element before adding anything else.
- If the copy feels dull, shorten it and emphasize the outcome.
- If the CTA feels unclear, make it specific to the result.`,
      day: 2
    },
    {
      title: "2.3 Build Value Section",
      order_index: 6,
      estimated_minutes: 30,
      deliverable_type: "url",
      deliverable_prompt: "Updated Carrd link",
      content: `# Build Value Section

Show why the project matters and why someone should care enough to keep reading.

## Mission

- Add a second section below the hero.
- Turn your bullets into a scannable value block.
- Keep visual rhythm consistent with the hero.

## Tips

- Use short headings and plain language.
- Give each value point its own breathing room.
- Keep the section structurally simple on mobile.

## Stuck?

- If the section feels repetitive, rewrite one bullet from the user's point of view.
- If the layout feels heavy, reduce the number of columns.
- If it still feels weak, add one concrete proof point or example.`,
      day: 2
    },
    {
      title: "2.4 Mobile Check",
      order_index: 7,
      estimated_minutes: 10,
      deliverable_type: "text",
      deliverable_prompt: "What did you fix?",
      content: `# Mobile Check

Review the page on a small screen and smooth out the rough edges.

## Mission

- Check spacing, line lengths, and button size.
- Fix anything cramped or awkward.
- Make sure the page still feels intentional on mobile.

## Tips

- Test the first two sections carefully.
- Headlines usually need smaller line breaks on mobile.
- Large gaps often feel larger on phones than on desktop.

## Stuck?

- If the layout breaks, simplify before trying clever fixes.
- If text feels too long, tighten copy instead of shrinking it endlessly.
- If the CTA drops too low, reduce vertical padding around it.`,
      day: 2
    },
    {
      title: "3.1 One Fix",
      order_index: 8,
      estimated_minutes: 15,
      deliverable_type: "text",
      deliverable_prompt: "What did you change?",
      content: `# One Fix

Choose one meaningful improvement that makes the page stronger before launch.

## Mission

- Review the page with fresh eyes.
- Pick one change that improves clarity or trust.
- Make the fix and confirm it actually helped.

## Tips

- Strong fixes are usually small and obvious in hindsight.
- Improve the first thing that creates friction.
- Avoid last-minute redesigns.

## Stuck?

- If you cannot pick a fix, ask what would make you hesitate as a visitor.
- If everything looks fine, tighten the weakest sentence.
- If you want to change too much, choose the smallest move with the clearest payoff.`,
      day: 3
    },
    {
      title: "3.2 Publish",
      order_index: 9,
      estimated_minutes: 10,
      deliverable_type: "url",
      deliverable_prompt: "Live Carrd URL",
      content: `# Publish

Ship the page so it exists in public, not just in draft mode.

## Mission

- Publish the Carrd page.
- Open the live link on desktop and mobile.
- Confirm the CTA and layout still work after publish.

## Tips

- Check the live URL instead of trusting preview mode.
- Read the page once from top to bottom before sharing.
- Fix only obvious issues before moving on.

## Stuck?

- If publish settings feel confusing, slow down and verify the final link step by step.
- If the live page looks different, inspect spacing and image sizing first.
- If you find a bug, fix it immediately and republish once.`,
      day: 3
    },
    {
      title: "3.3 Ship Post",
      order_index: 10,
      estimated_minutes: 20,
      deliverable_type: "text",
      deliverable_prompt: "Paste your ship post text",
      content: `# Ship Post

Close the quest by writing the short post that tells people what you built.

## Mission

- Write a concise ship post.
- Say what you made, who it is for, and what you learned.
- Include the live link.

## Tips

- Keep the post human and direct.
- Mention one constraint or insight from the build.
- End with a simple invitation for feedback.

## Stuck?

- If the post sounds stiff, write it like a quick note to another builder.
- If you are unsure what to say, follow this order: what, who, result, link.
- If you feel hesitant to share, post anyway and treat it as version one.`,
      day: 3
    }
  ]
} as const;
