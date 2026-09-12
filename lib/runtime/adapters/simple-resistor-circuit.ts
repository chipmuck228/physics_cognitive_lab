import { looksLikeOhmsTutorLeak } from "@/lib/ai/scene-tutor-leaks";
import { ohmsLawAssessmentOverlay } from "@/content/physics-models/ohms-law/assessment-overlay";
import { hasCompletedOhmsAiOff } from "@/lib/learning/ohms-ai-off";
import { hasSufficientOhmsDescription } from "@/lib/learning/ohms-describe";
import { accumulateOhmsSceneEvidence } from "@/lib/learning/ohms-evidence";
import {
  hasCompletedOhmsExperiments,
  runSceneOhmsExperiment,
} from "@/lib/learning/ohms-experiment";
import { hasCompletedOhmsExam } from "@/lib/learning/ohms-exam";
import { hasSufficientOhmsExplanation } from "@/lib/learning/ohms-explain";
import { hasCompletedOhmsModel } from "@/lib/learning/ohms-model";
import { hasSufficientOhmsObservation } from "@/lib/learning/ohms-observe";
import { hasCommittedOhmsPrediction } from "@/lib/learning/ohms-predict";
import { emptyOhmsSceneData } from "@/lib/learning/ohms-scene-data";
import { hasCompletedOhmsTransfer } from "@/lib/learning/ohms-transfer";
import { getOhmsTutorContext } from "@/lib/learning/ohms-tutor-context";
import {
  OHMS_EXPERIMENT_A,
  OHMS_EXPERIMENT_ORDER,
  type OhmsExperimentId,
} from "@/lib/physics/simple-resistor-circuit";
import { OHMS_LAW_ID } from "@/lib/physics-models/canonical-ids";
import { defaultOhmsScenePhysics } from "@/lib/runtime/physics-state";
import type { SceneAdapter } from "@/lib/runtime/types";
import { LearningStage, OHMS_SCENE_ID } from "@/types/learning";

function isOhmsExperimentId(experimentId: string): experimentId is OhmsExperimentId {
  return (OHMS_EXPERIMENT_ORDER as readonly string[]).includes(experimentId);
}

export const simpleResistorCircuitAdapter: SceneAdapter = {
  sceneId: OHMS_SCENE_ID,
  primaryModelId: OHMS_LAW_ID,

  getInitialPhysicsState: defaultOhmsScenePhysics,
  getInitialSceneData: emptyOhmsSceneData,
  getTutorContext: getOhmsTutorContext,
  looksLikeTutorLeak: looksLikeOhmsTutorLeak,

  completion: {
    [LearningStage.ENTRY]: () => true,
    [LearningStage.OBSERVE]: (session) =>
      hasSufficientOhmsObservation(session.observations),
    [LearningStage.DESCRIBE]: (session) =>
      hasSufficientOhmsDescription(session.descriptions),
    [LearningStage.PREDICT]: (session) =>
      hasCommittedOhmsPrediction(session.predictions, OHMS_EXPERIMENT_A),
    [LearningStage.EXPERIMENT]: (session) => hasCompletedOhmsExperiments(session),
    [LearningStage.EXPLAIN]: (session) =>
      hasSufficientOhmsExplanation(session.explanations),
    [LearningStage.MODEL]: (session) => hasCompletedOhmsModel(session.modelAttempts),
    [LearningStage.TRANSFER]: (session) =>
      hasCompletedOhmsTransfer(session.transferAttempts),
    [LearningStage.EXAM]: (session) => hasCompletedOhmsExam(session.examAttempts),
    [LearningStage.AI_OFF]: (session) => hasCompletedOhmsAiOff(session),
    [LearningStage.COMPLETE]: (session) => session.completed,
  },

  accumulateEvidence: accumulateOhmsSceneEvidence,
  assessmentOverlay: ohmsLawAssessmentOverlay,

  runExperiment: (experimentId) => {
    if (!isOhmsExperimentId(experimentId)) {
      throw new Error(`Unknown ohms experiment: ${experimentId}`);
    }
    return {
      experimentId,
      result: runSceneOhmsExperiment(experimentId),
    };
  },
};
