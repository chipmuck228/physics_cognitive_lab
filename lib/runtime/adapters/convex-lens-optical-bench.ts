import { looksLikeLensTutorLeak } from "@/lib/ai/scene-tutor-leaks";
import { convexLensImagingAssessmentOverlay } from "@/content/physics-models/convex-lens-imaging/assessment-overlay";
import { hasCompletedLensAiOff } from "@/lib/learning/lens-ai-off";
import { hasSufficientLensDescription } from "@/lib/learning/lens-describe";
import { accumulateConvexLensSceneEvidence } from "@/lib/learning/lens-evidence";
import {
  hasCompletedLensExperiments,
  runSceneLensExperiment,
} from "@/lib/learning/lens-experiment";
import { hasCompletedLensExam } from "@/lib/learning/lens-exam";
import { hasSufficientLensExplanation } from "@/lib/learning/lens-explain";
import { hasCompletedLensModel } from "@/lib/learning/lens-model";
import { hasSufficientLensObservation } from "@/lib/learning/lens-observe";
import { hasCommittedLensPrediction } from "@/lib/learning/lens-predict";
import { emptyLensSceneData } from "@/lib/learning/lens-scene-data";
import { hasCompletedLensTransfer } from "@/lib/learning/lens-transfer";
import { getConvexLensTutorContext } from "@/lib/learning/lens-tutor-context";
import {
  LENS_EXPERIMENT_A,
  LENS_EXPERIMENT_ORDER,
  type LensExperimentId,
} from "@/lib/physics/convex-lens-optical-bench";
import { CONVEX_LENS_IMAGING_ID } from "@/lib/physics-models/canonical-ids";
import { defaultConvexLensScenePhysics } from "@/lib/runtime/physics-state";
import type { SceneAdapter } from "@/lib/runtime/types";
import { CONVEX_LENS_SCENE_ID, LearningStage } from "@/types/learning";

function isLensExperimentId(experimentId: string): experimentId is LensExperimentId {
  return (LENS_EXPERIMENT_ORDER as readonly string[]).includes(experimentId);
}

export const convexLensOpticalBenchAdapter: SceneAdapter = {
  sceneId: CONVEX_LENS_SCENE_ID,
  primaryModelId: CONVEX_LENS_IMAGING_ID,

  getInitialPhysicsState: defaultConvexLensScenePhysics,
  getInitialSceneData: emptyLensSceneData,
  getTutorContext: getConvexLensTutorContext,
  looksLikeTutorLeak: looksLikeLensTutorLeak,

  completion: {
    [LearningStage.ENTRY]: () => true,
    [LearningStage.OBSERVE]: (session) =>
      hasSufficientLensObservation(session.observations),
    [LearningStage.DESCRIBE]: (session) =>
      hasSufficientLensDescription(session.descriptions),
    [LearningStage.PREDICT]: (session) =>
      hasCommittedLensPrediction(session.predictions, LENS_EXPERIMENT_A),
    [LearningStage.EXPERIMENT]: (session) => hasCompletedLensExperiments(session),
    [LearningStage.EXPLAIN]: (session) =>
      hasSufficientLensExplanation(session.explanations),
    [LearningStage.MODEL]: (session) => hasCompletedLensModel(session.modelAttempts),
    [LearningStage.TRANSFER]: (session) =>
      hasCompletedLensTransfer(session.transferAttempts),
    [LearningStage.EXAM]: (session) => hasCompletedLensExam(session.examAttempts),
    [LearningStage.AI_OFF]: (session) => hasCompletedLensAiOff(session),
    [LearningStage.COMPLETE]: (session) => session.completed,
  },

  accumulateEvidence: accumulateConvexLensSceneEvidence,
  assessmentOverlay: convexLensImagingAssessmentOverlay,

  runExperiment: (experimentId) => {
    if (!isLensExperimentId(experimentId)) {
      throw new Error(`Unknown convex-lens experiment: ${experimentId}`);
    }
    return {
      experimentId,
      result: runSceneLensExperiment(experimentId),
    };
  },
};
