import { STAGE_LABELS } from "@/lib/content/microwave-bread";
import { stageIndex } from "@/lib/learning/state-machine";
import { LEARNING_STAGE_ORDER, type LearningStage } from "@/types/learning";

interface StageProgressProps {
  stage: LearningStage;
}

export function StageProgress({ stage }: StageProgressProps) {
  const currentIndex = stageIndex(stage);

  return (
    <ol
      className="flex flex-wrap items-center gap-1.5"
      aria-label="Learning progress"
    >
      {LEARNING_STAGE_ORDER.map((item, index) => {
        const isCurrent = item === stage;
        const isPast = index < currentIndex;
        const state = isCurrent ? "current" : isPast ? "complete" : "upcoming";

        return (
          <li key={item} className="flex items-center gap-1.5">
            <span
              className={`block h-2 w-2 rounded-full ${
                isCurrent
                  ? "bg-[var(--heat)]"
                  : isPast
                    ? "bg-[var(--ink)]"
                    : "bg-[var(--line)]"
              }`}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`${STAGE_LABELS[item]}, ${state}`}
            />
            {isCurrent ? (
              <span className="text-xs font-medium tracking-wide text-[var(--ink)]">
                {STAGE_LABELS[item]}
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
