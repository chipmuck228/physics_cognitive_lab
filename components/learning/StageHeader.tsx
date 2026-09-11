import { STAGE_LABELS, STAGE_PROMPTS } from "@/lib/content/microwave-bread";
import type { LearningStage } from "@/types/learning";

interface StageHeaderProps {
  stage: LearningStage;
}

export function StageHeader({ stage }: StageHeaderProps) {
  const prompt = STAGE_PROMPTS[stage];

  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--ink-muted)]">
        {STAGE_LABELS[stage]}
      </p>
      {prompt ? (
        <h1 className="mt-1 font-serif text-xl leading-snug text-[var(--ink)] sm:text-2xl">
          {prompt}
        </h1>
      ) : null}
    </div>
  );
}
