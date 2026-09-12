import { canTransition, stageIndex } from "@/lib/learning/state-machine";
import { registerProductionSceneAdapters } from "@/lib/runtime/register-production-adapters";
import { getSceneAdapter } from "@/lib/runtime/registry";
import { LearningStage, type LearningSession } from "@/types/learning";

registerProductionSceneAdapters();

/** Scene 02 production last stage. Official L6 is derived, never written by the Scene. */
export const ENGINE_PHASE8_LAST_STAGE = LearningStage.COMPLETE;
export const ENGINE_PHASE7_LAST_STAGE = ENGINE_PHASE8_LAST_STAGE;
export const ENGINE_PHASE6_LAST_STAGE = ENGINE_PHASE7_LAST_STAGE;
export const ENGINE_PHASE5_LAST_STAGE = ENGINE_PHASE6_LAST_STAGE;
export const ENGINE_PHASE4_LAST_STAGE = ENGINE_PHASE5_LAST_STAGE;
export const ENGINE_PHASE3_LAST_STAGE = ENGINE_PHASE4_LAST_STAGE;

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
  return getSceneAdapter(session.sceneId).completion[stage](session);
}

function stageIndexIsBackward(from: LearningStage, to: LearningStage): boolean {
  return stageIndex(to) < stageIndex(from);
}
