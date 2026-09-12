import { looksLikeSamplesTutorLeak } from "@/lib/ai/scene-tutor-leaks";
import { densityMassVolumeAssessmentOverlay } from "@/content/physics-models/density-mass-volume/assessment-overlay";
import { hasCompletedSamplesAiOff } from "@/lib/learning/samples-ai-off";
import { hasSufficientSamplesDescription } from "@/lib/learning/samples-describe";
import { accumulateSamplesSceneEvidence } from "@/lib/learning/samples-evidence";
import {
  hasCompletedSamplesExperiments,
  runSceneSamplesExperiment,
} from "@/lib/learning/samples-experiment";
import { hasCompletedSamplesExam } from "@/lib/learning/samples-exam";
import { hasSufficientSamplesExplanation } from "@/lib/learning/samples-explain";
import { hasCompletedSamplesModel } from "@/lib/learning/samples-model";
import { hasSufficientSamplesObservation } from "@/lib/learning/samples-observe";
import { hasCommittedSamplesPrediction } from "@/lib/learning/samples-predict";
import { emptySamplesSceneData } from "@/lib/learning/samples-scene-data";
import { hasCompletedSamplesTransfer } from "@/lib/learning/samples-transfer";
import { getSamplesTutorContext } from "@/lib/learning/samples-tutor-context";
import {
  SAMPLES_EXPERIMENT_A,
  SAMPLES_EXPERIMENT_ORDER,
  type SamplesExperimentId,
} from "@/lib/physics/equal-volume-material-samples";
import { DENSITY_MASS_VOLUME_ID } from "@/lib/physics-models/canonical-ids";
import { defaultSamplesScenePhysics } from "@/lib/runtime/physics-state";
import type { SceneAdapter } from "@/lib/runtime/types";
import { LearningStage, SAMPLES_SCENE_ID } from "@/types/learning";

function isSamplesExperimentId(
  experimentId: string,
): experimentId is SamplesExperimentId {
  return (SAMPLES_EXPERIMENT_ORDER as readonly string[]).includes(experimentId);
}

export const equalVolumeMaterialSamplesAdapter: SceneAdapter = {
  sceneId: SAMPLES_SCENE_ID,
  primaryModelId: DENSITY_MASS_VOLUME_ID,

  getInitialPhysicsState: defaultSamplesScenePhysics,

  getInitialSceneData: emptySamplesSceneData,

  getTutorContext: getSamplesTutorContext,

  looksLikeTutorLeak: looksLikeSamplesTutorLeak,

  completion: {
    [LearningStage.ENTRY]: () => true,
    [LearningStage.OBSERVE]: (session) =>
      hasSufficientSamplesObservation(session.observations),
    [LearningStage.DESCRIBE]: (session) =>
      hasSufficientSamplesDescription(session.descriptions),
    [LearningStage.PREDICT]: (session) =>
      hasCommittedSamplesPrediction(session.predictions, SAMPLES_EXPERIMENT_A),
    [LearningStage.EXPERIMENT]: (session) =>
      hasCompletedSamplesExperiments(session),
    [LearningStage.EXPLAIN]: (session) =>
      hasSufficientSamplesExplanation(session.explanations),
    [LearningStage.MODEL]: (session) =>
      hasCompletedSamplesModel(session.modelAttempts),
    [LearningStage.TRANSFER]: (session) =>
      hasCompletedSamplesTransfer(session.transferAttempts),
    [LearningStage.EXAM]: (session) => hasCompletedSamplesExam(session.examAttempts),
    [LearningStage.AI_OFF]: (session) => hasCompletedSamplesAiOff(session),
    [LearningStage.COMPLETE]: (session) => session.completed,
  },

  accumulateEvidence: accumulateSamplesSceneEvidence,

  assessmentOverlay: densityMassVolumeAssessmentOverlay,

  runExperiment: (experimentId) => {
    if (!isSamplesExperimentId(experimentId)) {
      throw new Error(`Unknown samples experiment: ${experimentId}`);
    }
    return {
      experimentId,
      result: runSceneSamplesExperiment(experimentId),
    };
  },
};
