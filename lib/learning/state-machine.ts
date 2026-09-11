import {
  LEARNING_STAGE_ORDER,
  LearningStage,
  type LearningStage as LearningStageType,
} from "@/types/learning";

export function stageIndex(stage: LearningStageType): number {
  return LEARNING_STAGE_ORDER.indexOf(stage);
}

export function isLearningStage(value: string): value is LearningStageType {
  return LEARNING_STAGE_ORDER.includes(value as LearningStageType);
}

export function nextStage(
  stage: LearningStageType,
): LearningStageType | null {
  const index = stageIndex(stage);
  if (index < 0 || index >= LEARNING_STAGE_ORDER.length - 1) {
    return null;
  }
  return LEARNING_STAGE_ORDER[index + 1];
}

export function previousStage(
  stage: LearningStageType,
): LearningStageType | null {
  const index = stageIndex(stage);
  if (index <= 0) {
    return null;
  }
  return LEARNING_STAGE_ORDER[index - 1];
}

/**
 * Forward: only the immediate next stage.
 * Backward: any earlier stage, for UI convenience.
 * COMPLETE is terminal. Skipping required later stages is blocked.
 */
export function canTransition(
  from: LearningStageType,
  to: LearningStageType,
): boolean {
  if (from === to) {
    return false;
  }

  if (from === LearningStage.COMPLETE) {
    return false;
  }

  const fromIndex = stageIndex(from);
  const toIndex = stageIndex(to);
  if (fromIndex < 0 || toIndex < 0) {
    return false;
  }

  if (toIndex < fromIndex) {
    return true;
  }

  return toIndex === fromIndex + 1;
}

export function assertCanTransition(
  from: LearningStageType,
  to: LearningStageType,
): void {
  if (!canTransition(from, to)) {
    throw new Error(`Illegal learning transition: ${from} → ${to}`);
  }
}

export function canReachComplete(from: LearningStageType): boolean {
  return from === LearningStage.AI_OFF;
}
