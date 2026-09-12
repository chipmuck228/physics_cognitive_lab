import { looksLikeCartTutorLeak } from "@/lib/ai/scene-tutor-leaks";
import { forceChangesMotionStateAssessmentOverlay } from "@/content/physics-models/force-changes-motion-state/assessment-overlay";
import { hasCompletedCartAiOff } from "@/lib/learning/cart-ai-off";
import { hasSufficientCartDescription } from "@/lib/learning/cart-describe";
import { accumulateCartSceneEvidence } from "@/lib/learning/cart-evidence";
import {
  hasCompletedCartExperiments,
  runSceneCartExperiment,
} from "@/lib/learning/cart-experiment";
import { hasCompletedCartExam } from "@/lib/learning/cart-exam";
import { hasSufficientCartExplanation } from "@/lib/learning/cart-explain";
import { hasCompletedCartModel } from "@/lib/learning/cart-model";
import { hasSufficientCartObservation } from "@/lib/learning/cart-observe";
import { hasCommittedCartPrediction } from "@/lib/learning/cart-predict";
import { hasCompletedCartTransfer } from "@/lib/learning/cart-transfer";
import { emptyCartSceneData } from "@/lib/learning/cart-scene-data";
import { getCartTutorContext } from "@/lib/learning/cart-tutor-context";
import {
  CART_EXPERIMENT_A,
  CART_EXPERIMENT_ORDER,
  type CartExperimentId,
} from "@/lib/physics/horizontal-force-cart";
import { FORCE_CHANGES_MOTION_STATE_ID } from "@/lib/physics-models/canonical-ids";
import { defaultCartScenePhysics } from "@/lib/runtime/physics-state";
import type { SceneAdapter } from "@/lib/runtime/types";
import { CART_SCENE_ID, LearningStage } from "@/types/learning";

function isCartExperimentId(experimentId: string): experimentId is CartExperimentId {
  return (CART_EXPERIMENT_ORDER as readonly string[]).includes(experimentId);
}

export const horizontalForceCartAdapter: SceneAdapter = {
  sceneId: CART_SCENE_ID,
  primaryModelId: FORCE_CHANGES_MOTION_STATE_ID,

  getInitialPhysicsState: defaultCartScenePhysics,

  getInitialSceneData: emptyCartSceneData,

  getTutorContext: getCartTutorContext,

  looksLikeTutorLeak: looksLikeCartTutorLeak,

  completion: {
    [LearningStage.ENTRY]: () => true,
    [LearningStage.OBSERVE]: (session) =>
      hasSufficientCartObservation(session.observations),
    [LearningStage.DESCRIBE]: (session) =>
      hasSufficientCartDescription(session.descriptions),
    [LearningStage.PREDICT]: (session) =>
      hasCommittedCartPrediction(session.predictions, CART_EXPERIMENT_A),
    [LearningStage.EXPERIMENT]: (session) =>
      hasCompletedCartExperiments(session),
    [LearningStage.EXPLAIN]: (session) =>
      hasSufficientCartExplanation(session.explanations),
    [LearningStage.MODEL]: (session) =>
      hasCompletedCartModel(session.modelAttempts),
    [LearningStage.TRANSFER]: (session) =>
      hasCompletedCartTransfer(session.transferAttempts),
    [LearningStage.EXAM]: (session) => hasCompletedCartExam(session.examAttempts),
    [LearningStage.AI_OFF]: (session) => hasCompletedCartAiOff(session),
    [LearningStage.COMPLETE]: (session) => session.completed,
  },

  accumulateEvidence: accumulateCartSceneEvidence,

  assessmentOverlay: forceChangesMotionStateAssessmentOverlay,

  runExperiment: (experimentId) => {
    if (!isCartExperimentId(experimentId)) {
      throw new Error(`Unknown cart experiment: ${experimentId}`);
    }
    return {
      experimentId,
      result: runSceneCartExperiment(experimentId),
    };
  },
};
