import { STAGE_LABELS } from "@/lib/content/microwave-bread";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import { LEARNING_STAGE_ORDER, type LearningStage } from "@/types/learning";

interface StageProgressProps {
  stage: LearningStage;
  labels?: Record<LearningStage, string>;
  stages?: readonly LearningStage[];
}

export function StageProgress({
  stage,
  labels = STAGE_LABELS,
  stages = LEARNING_STAGE_ORDER,
}: StageProgressProps) {
  const currentIndex = stages.indexOf(stage);

  return (
    <ol
      className="flex flex-wrap items-center gap-1.5"
      aria-label={STUDENT_CHROME.progressAria}
    >
      {stages.map((item, index) => {
        const isCurrent = item === stage;
        const isPast = currentIndex >= 0 && index < currentIndex;
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
              aria-label={`${labels[item]}，${state === "current" ? "当前" : state === "complete" ? "已完成" : "还没到"}`}
            />
            {isCurrent ? (
              <span className="text-xs font-medium tracking-wide text-[var(--ink)]">
                {labels[item]}
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
