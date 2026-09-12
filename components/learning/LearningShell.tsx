import type { ReactNode } from "react";

import { Button } from "@/components/common/Button";
import { StageHeader } from "@/components/learning/StageHeader";
import { StageProgress } from "@/components/learning/StageProgress";
import { STUDENT_CHROME } from "@/lib/content/student-language";
import { LearningStage, type LearningStage as LearningStageType } from "@/types/learning";

interface LearningShellProps {
  stage: LearningStageType;
  scene?: ReactNode;
  task: ReactNode;
  tutor?: ReactNode;
  actions: ReactNode;
  onStartOver: () => void;
  onGoBack?: () => void;
  canGoBack?: boolean;
  stageLabels?: Record<LearningStageType, string>;
  stagePrompts?: Partial<Record<LearningStageType, string>>;
  progressStages?: readonly LearningStageType[];
  examNotice?: string;
}

export function LearningShell({
  stage,
  scene,
  task,
  tutor,
  actions,
  onStartOver,
  onGoBack,
  canGoBack = false,
  stageLabels,
  stagePrompts,
  progressStages,
  examNotice,
}: LearningShellProps) {
  const isEntry = stage === LearningStage.ENTRY;
  const isExamWorld = stage === LearningStage.EXAM;
  const isAssessment =
    isExamWorld ||
    stage === LearningStage.AI_OFF ||
    stage === LearningStage.COMPLETE;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--ink)]">
      <header className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <p className="shrink-0 text-sm font-medium tracking-wide text-[var(--ink-muted)]">
            {STUDENT_CHROME.productName}
          </p>
          {!isEntry ? (
            <StageProgress
              stage={stage}
              labels={stageLabels}
              stages={progressStages}
            />
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {canGoBack && onGoBack ? (
            <Button variant="ghost" onClick={onGoBack} aria-label={STUDENT_CHROME.backAria}>
              {STUDENT_CHROME.back}
            </Button>
          ) : null}
          <Button variant="ghost" onClick={onStartOver} aria-label={STUDENT_CHROME.startOverAria}>
            {STUDENT_CHROME.startOver}
          </Button>
        </div>
      </header>

      {!isEntry ? (
        <div className="border-b border-[var(--line)] px-4 py-4 sm:px-6">
          <StageHeader stage={stage} labels={stageLabels} prompts={stagePrompts} />
          {isExamWorld ? (
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              {examNotice ?? STUDENT_CHROME.examSeparate}
            </p>
          ) : null}
        </div>
      ) : null}

      <main
        className={`mx-auto grid w-full flex-1 ${
          isEntry || isAssessment
            ? "max-w-3xl grid-cols-1"
            : "max-w-6xl grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.9fr)]"
        }`}
      >
        {scene && !isAssessment ? (
          <div className="flex items-center justify-center p-4 sm:p-8">{scene}</div>
        ) : null}
        <aside
          className={`flex flex-col justify-center p-4 sm:p-8 ${
            isEntry || isAssessment
              ? ""
              : "border-t border-[var(--line)] lg:border-l lg:border-t-0"
          }`}
        >
          <div className="space-y-6">
            {task}
            {tutor}
          </div>
        </aside>
      </main>

      <footer className="border-t border-[var(--line)] px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-end gap-3">
          {actions}
        </div>
      </footer>
    </div>
  );
}
