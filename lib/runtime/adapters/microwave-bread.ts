import { energyInternalEnergyTemperatureAssessmentOverlay } from "@/content/physics-models/energy-internal-energy-temperature";
import { looksLikeMicrowaveTutorLeak } from "@/lib/ai/scene-tutor-leaks";
import { hasCompletedMicrowaveAiOff } from "@/lib/learning/microwave-ai-off";
import { hasSufficientMicrowaveDescription } from "@/lib/learning/microwave-describe";
import { accumulateMicrowaveSceneEvidence } from "@/lib/learning/microwave-evidence";
import { hasCompletedMicrowaveExam } from "@/lib/learning/microwave-exam";
import { hasCompletedMicrowaveExperiment } from "@/lib/learning/microwave-experiment";
import { hasSufficientMicrowaveExplanation } from "@/lib/learning/microwave-explain";
import { hasCompletedMicrowaveModel } from "@/lib/learning/microwave-model";
import { hasSufficientMicrowaveObservation } from "@/lib/learning/microwave-observe";
import { hasCommittedMicrowavePrediction } from "@/lib/learning/microwave-predict";
import { emptyMicrowaveSceneData } from "@/lib/learning/microwave-scene-data";
import { hasCompletedMicrowaveTransfer } from "@/lib/learning/microwave-transfer";
import { getMicrowaveTutorContext } from "@/lib/learning/microwave-tutor-context";
import { defaultMicrowaveScenePhysics } from "@/lib/runtime/physics-state";
import type { SceneAdapter } from "@/lib/runtime/types";
import { LearningStage, MICROWAVE_SCENE_ID } from "@/types/learning";

export const microwaveBreadAdapter: SceneAdapter = {
  sceneId: MICROWAVE_SCENE_ID,
  primaryModelId: "energy-internal-energy-temperature",

  getInitialPhysicsState: defaultMicrowaveScenePhysics,

  getInitialSceneData: emptyMicrowaveSceneData,

  getTutorContext: getMicrowaveTutorContext,

  looksLikeTutorLeak: looksLikeMicrowaveTutorLeak,

  completion: {
    [LearningStage.ENTRY]: () => true,
    [LearningStage.OBSERVE]: (session) =>
      hasSufficientMicrowaveObservation(session.observations),
    [LearningStage.DESCRIBE]: (session) =>
      hasSufficientMicrowaveDescription(session.descriptions),
    [LearningStage.PREDICT]: (session) =>
      hasCommittedMicrowavePrediction(session.predictions),
    [LearningStage.EXPERIMENT]: (session) =>
      hasCompletedMicrowaveExperiment(session),
    [LearningStage.EXPLAIN]: (session) =>
      hasSufficientMicrowaveExplanation(session.explanations),
    [LearningStage.MODEL]: (session) =>
      hasCompletedMicrowaveModel(session.modelAttempts),
    [LearningStage.TRANSFER]: (session) =>
      hasCompletedMicrowaveTransfer(session.transferAttempts),
    [LearningStage.EXAM]: (session) => hasCompletedMicrowaveExam(session.examAttempts),
    [LearningStage.AI_OFF]: (session) => hasCompletedMicrowaveAiOff(session),
    [LearningStage.COMPLETE]: (session) => session.completed,
  },

  accumulateEvidence: accumulateMicrowaveSceneEvidence,

  assessmentOverlay: energyInternalEnergyTemperatureAssessmentOverlay,
};
