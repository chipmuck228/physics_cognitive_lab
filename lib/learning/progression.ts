import { hasCompletedExamSet } from "@/lib/learning/exam";
import { hasCompletedTransferScenarios } from "@/lib/learning/transfer";
import { canTransition, stageIndex } from "@/lib/learning/state-machine";
import { LearningStage, type LearningSession } from "@/types/learning";

/**
 * Evidence gates sit on top of legal state-machine edges.
 * Phase A only requires the Start action to leave ENTRY.
 * Later stages gain cognitive-action requirements in Phase B+.
 */
export function canLeaveStage(
  session: LearningSession,
  target: LearningStage,
): boolean {
  if (!canTransition(session.stage, target)) {
    return false;
  }

  if (target === LearningStage.OBSERVE && session.stage === LearningStage.ENTRY) {
    return true;
  }

  if (stageIndexIsBackward(session.stage, target)) {
    return true;
  }

  return hasCompletedCognitiveStep(session, session.stage);
}

export function hasCompletedCognitiveStep(
  session: LearningSession,
  stage: LearningStage,
): boolean {
  switch (stage) {
    case LearningStage.ENTRY:
      return true;
    case LearningStage.OBSERVE:
      return session.observations.length > 0;
    case LearningStage.DESCRIBE:
      return session.descriptions.length > 0;
    case LearningStage.PREDICT:
      return session.predictions.length > 0;
    case LearningStage.EXPERIMENT:
      return session.experimentHistory.length > 0;
    case LearningStage.EXPLAIN:
      return session.explanations.length > 0;
    case LearningStage.MODEL:
      return session.modelAttempts.some((attempt) => attempt.correctStructure);
    case LearningStage.TRANSFER:
      return hasCompletedTransferScenarios(session.transferAttempts);
    case LearningStage.EXAM:
      return hasCompletedExamSet(session.examAttempts);
    case LearningStage.AI_OFF:
      return Boolean(session.independentAssessment?.completedWithoutAI);
    case LearningStage.COMPLETE:
      return session.completed;
    default:
      return false;
  }
}

function stageIndexIsBackward(from: LearningStage, to: LearningStage): boolean {
  return stageIndex(to) < stageIndex(from);
}
