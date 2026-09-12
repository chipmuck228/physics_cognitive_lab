import { looksLikeEngineTutorLeak } from "@/lib/ai/scene-tutor-leaks";
import { chemicalEnergyMechanicalAssessmentOverlay } from "@/content/physics-models/chemical-energy-internal-energy-mechanical-energy/assessment-overlay";
import {
  ENGINE_EXPERIMENT_A,
  type EngineSceneExperimentId,
} from "@/lib/content/four-stroke-engine";
import { hasCompletedEngineAiOff } from "@/lib/learning/engine-ai-off";
import { hasSufficientEngineDescription } from "@/lib/learning/engine-describe";
import { accumulateEngineSceneEvidence } from "@/lib/learning/engine-evidence";
import { hasCompletedEngineExam } from "@/lib/learning/engine-exam";
import {
  hasCompletedEngineExperiments,
  runSceneExperiment,
} from "@/lib/learning/engine-experiment";
import { hasSufficientEngineExplanation } from "@/lib/learning/engine-explain";
import { hasCompletedEngineModel } from "@/lib/learning/engine-model";
import { hasSufficientEngineObservation } from "@/lib/learning/engine-observe";
import { hasCommittedEnginePrediction } from "@/lib/learning/engine-predict";
import { hasCompletedEngineTransfer } from "@/lib/learning/engine-transfer";
import { getEngineTutorContext } from "@/lib/learning/engine-tutor-context";
import { CHEMICAL_ENERGY_INTERNAL_ENERGY_MECHANICAL_ENERGY_ID } from "@/lib/physics-models/canonical-ids";
import { defaultEngineScenePhysics } from "@/lib/runtime/physics-state";
import type { SceneAdapter } from "@/lib/runtime/types";
import { ENGINE_SCENE_ID, LearningStage } from "@/types/learning";

function isEngineSceneExperimentId(
  experimentId: string,
): experimentId is EngineSceneExperimentId {
  return (
    experimentId === "ignition-energy-release" ||
    experimentId === "immovable-mechanical-system"
  );
}

export const fourStrokeEngineAdapter: SceneAdapter = {
  sceneId: ENGINE_SCENE_ID,
  primaryModelId: CHEMICAL_ENERGY_INTERNAL_ENERGY_MECHANICAL_ENERGY_ID,

  getInitialPhysicsState: defaultEngineScenePhysics,

  getInitialSceneData: () => ({}),

  getTutorContext: getEngineTutorContext,

  looksLikeTutorLeak: looksLikeEngineTutorLeak,

  completion: {
    [LearningStage.ENTRY]: () => true,
    [LearningStage.OBSERVE]: (session) =>
      hasSufficientEngineObservation(session.observations),
    [LearningStage.DESCRIBE]: (session) =>
      hasSufficientEngineDescription(session.descriptions),
    [LearningStage.PREDICT]: (session) =>
      hasCommittedEnginePrediction(session.predictions, ENGINE_EXPERIMENT_A),
    [LearningStage.EXPERIMENT]: (session) =>
      hasCompletedEngineExperiments(session),
    [LearningStage.EXPLAIN]: (session) =>
      hasSufficientEngineExplanation(session.explanations),
    [LearningStage.MODEL]: (session) =>
      hasCompletedEngineModel(session.modelAttempts),
    [LearningStage.TRANSFER]: (session) =>
      hasCompletedEngineTransfer(session.transferAttempts),
    [LearningStage.EXAM]: (session) => hasCompletedEngineExam(session.examAttempts),
    [LearningStage.AI_OFF]: (session) => hasCompletedEngineAiOff(session),
    [LearningStage.COMPLETE]: (session) => session.completed,
  },

  accumulateEvidence: accumulateEngineSceneEvidence,

  assessmentOverlay: chemicalEnergyMechanicalAssessmentOverlay,

  runExperiment: (experimentId) => {
    if (!isEngineSceneExperimentId(experimentId)) {
      throw new Error(`Unknown engine experiment: ${experimentId}`);
    }
    return {
      experimentId,
      result: runSceneExperiment(experimentId),
    };
  },
};
