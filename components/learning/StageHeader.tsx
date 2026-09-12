import { STAGE_LABELS, STAGE_PROMPTS } from "@/lib/content/microwave-bread";
import type { LearningStage } from "@/types/learning";

interface StageHeaderProps {
  stage: LearningStage;
  labels?: Record<LearningStage, string>;
  prompts?: Partial<Record<LearningStage, string>>;
}

export function StageHeader({
  stage,
  labels = STAGE_LABELS,
  prompts = STAGE_PROMPTS,
}: StageHeaderProps) {
  const prompt = prompts[stage];

  return (
    <div className="min-w-0">
      <p className="text-xs font-medium tracking-wide text-[var(--ink-muted)]">
        {labels[stage]}
      </p>
      {prompt ? (
        <h1 className="mt-1 font-serif text-xl leading-snug text-[var(--ink)] sm:text-2xl">
          {prompt}
        </h1>
      ) : null}
    </div>
  );
}
