import { TutorAction, type TutorAction as TutorActionType } from "@/types/ai";
import { LearningStage, type LearningStage as LearningStageType } from "@/types/learning";

export const STAGE_TUTOR_POLICY: Record<LearningStageType, TutorActionType[]> = {
  [LearningStage.ENTRY]: [],
  [LearningStage.OBSERVE]: [TutorAction.ASK, TutorAction.ENCOURAGE],
  [LearningStage.DESCRIBE]: [
    TutorAction.ASK,
    TutorAction.HINT,
    TutorAction.ENCOURAGE,
  ],
  [LearningStage.PREDICT]: [
    TutorAction.ASK,
    TutorAction.HINT,
    TutorAction.CHALLENGE,
  ],
  [LearningStage.EXPERIMENT]: [],
  [LearningStage.EXPLAIN]: [
    TutorAction.ASK,
    TutorAction.HINT,
    TutorAction.CHALLENGE,
    TutorAction.ENCOURAGE,
    TutorAction.EXPLAIN,
  ],
  [LearningStage.MODEL]: [
    TutorAction.ASK,
    TutorAction.HINT,
    TutorAction.CHALLENGE,
  ],
  [LearningStage.TRANSFER]: [
    TutorAction.ASK,
    TutorAction.HINT,
    TutorAction.CHALLENGE,
  ],
  [LearningStage.EXAM]: [
    TutorAction.ASK,
    TutorAction.HINT,
    TutorAction.CHALLENGE,
    TutorAction.EXPLAIN,
  ],
  [LearningStage.AI_OFF]: [],
  [LearningStage.COMPLETE]: [],
};

export const PROTECTED_REVEAL_STAGES: LearningStageType[] = [
  LearningStage.OBSERVE,
  LearningStage.DESCRIBE,
  LearningStage.PREDICT,
  LearningStage.EXPLAIN,
  LearningStage.MODEL,
  LearningStage.TRANSFER,
  LearningStage.EXAM,
];

export function isTutorAllowed(stage: LearningStageType): boolean {
  return STAGE_TUTOR_POLICY[stage].length > 0;
}

export function canCallTutor(stage: LearningStageType): boolean {
  return isTutorAllowed(stage) && !isTutorHardBlocked(stage);
}

export function isTutorHardBlocked(stage: LearningStageType): boolean {
  return stage === LearningStage.AI_OFF || stage === LearningStage.COMPLETE;
}

export function isActionAllowed(
  stage: LearningStageType,
  action: TutorActionType,
): boolean {
  return STAGE_TUTOR_POLICY[stage].includes(action);
}

export function isRevealProtected(stage: LearningStageType): boolean {
  return PROTECTED_REVEAL_STAGES.includes(stage);
}
