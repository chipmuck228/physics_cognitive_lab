import { looksLikeHeatTutorLeak } from "@/lib/ai/scene-tutor-leaks";
import { specificHeatCapacityAssessmentOverlay } from "@/content/physics-models/specific-heat-capacity/assessment-overlay";
import { hasCompletedHeatAiOff } from "@/lib/learning/heat-ai-off";
import { hasSufficientHeatDescription } from "@/lib/learning/heat-describe";
import { accumulateHeatSceneEvidence } from "@/lib/learning/heat-evidence";
import {
  hasCompletedHeatExperiments,
  runSceneHeatExperiment,
} from "@/lib/learning/heat-experiment";
import { hasCompletedHeatExam } from "@/lib/learning/heat-exam";
import { hasSufficientHeatExplanation } from "@/lib/learning/heat-explain";
import { hasCompletedHeatModel } from "@/lib/learning/heat-model";
import { hasSufficientHeatObservation } from "@/lib/learning/heat-observe";
import { hasCommittedHeatPrediction } from "@/lib/learning/heat-predict";
import { emptyHeatSceneData } from "@/lib/learning/heat-scene-data";
import { hasCompletedHeatTransfer } from "@/lib/learning/heat-transfer";
import { getHeatTutorContext } from "@/lib/learning/heat-tutor-context";
import {
  HEAT_EXPERIMENT_A,
  HEAT_EXPERIMENT_ORDER,
  type HeatExperimentId,
} from "@/lib/physics/equal-mass-heated-samples";
import { SPECIFIC_HEAT_CAPACITY_ID } from "@/lib/physics-models/canonical-ids";
import { defaultHeatSamplesScenePhysics } from "@/lib/runtime/physics-state";
import type { SceneAdapter } from "@/lib/runtime/types";
import { HEAT_SAMPLES_SCENE_ID, LearningStage } from "@/types/learning";

function isHeatExperimentId(experimentId: string): experimentId is HeatExperimentId {
  return (HEAT_EXPERIMENT_ORDER as readonly string[]).includes(experimentId);
}

export const equalMassHeatedSamplesAdapter: SceneAdapter = {
  sceneId: HEAT_SAMPLES_SCENE_ID,
  primaryModelId: SPECIFIC_HEAT_CAPACITY_ID,

  getInitialPhysicsState: defaultHeatSamplesScenePhysics,

  getInitialSceneData: emptyHeatSceneData,

  getTutorContext: getHeatTutorContext,

  looksLikeTutorLeak: looksLikeHeatTutorLeak,

  completion: {
    [LearningStage.ENTRY]: () => true,
    [LearningStage.OBSERVE]: (session) =>
      hasSufficientHeatObservation(session.observations),
    [LearningStage.DESCRIBE]: (session) =>
      hasSufficientHeatDescription(session.descriptions),
    [LearningStage.PREDICT]: (session) =>
      hasCommittedHeatPrediction(session.predictions, HEAT_EXPERIMENT_A),
    [LearningStage.EXPERIMENT]: (session) => hasCompletedHeatExperiments(session),
    [LearningStage.EXPLAIN]: (session) =>
      hasSufficientHeatExplanation(session.explanations),
    [LearningStage.MODEL]: (session) => hasCompletedHeatModel(session.modelAttempts),
    [LearningStage.TRANSFER]: (session) =>
      hasCompletedHeatTransfer(session.transferAttempts),
    [LearningStage.EXAM]: (session) => hasCompletedHeatExam(session.examAttempts),
    [LearningStage.AI_OFF]: (session) => hasCompletedHeatAiOff(session),
    [LearningStage.COMPLETE]: (session) => session.completed,
  },

  accumulateEvidence: accumulateHeatSceneEvidence,

  assessmentOverlay: specificHeatCapacityAssessmentOverlay,

  runExperiment: (experimentId) => {
    if (!isHeatExperimentId(experimentId)) {
      throw new Error(`Unknown heat-samples experiment: ${experimentId}`);
    }
    return {
      experimentId,
      result: runSceneHeatExperiment(experimentId),
    };
  },
};
