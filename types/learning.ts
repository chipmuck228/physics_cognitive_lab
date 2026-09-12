import type { EngineState } from "@/lib/physics/engine/types";
import type { CartState } from "@/lib/physics/horizontal-force-cart";
import type { HeatSamplesSceneState } from "@/lib/physics/equal-mass-heated-samples";
import type { DensitySceneState } from "@/lib/physics/equal-volume-material-samples";
import type { TutorInteraction } from "@/types/ai";
import type { MicrowavePhysicsState } from "@/types/physics";

export const LearningStage = {
  ENTRY: "ENTRY",
  OBSERVE: "OBSERVE",
  DESCRIBE: "DESCRIBE",
  PREDICT: "PREDICT",
  EXPERIMENT: "EXPERIMENT",
  EXPLAIN: "EXPLAIN",
  MODEL: "MODEL",
  TRANSFER: "TRANSFER",
  EXAM: "EXAM",
  AI_OFF: "AI_OFF",
  COMPLETE: "COMPLETE",
} as const;

export type LearningStage =
  (typeof LearningStage)[keyof typeof LearningStage];

export const LEARNING_STAGE_ORDER: LearningStage[] = [
  LearningStage.ENTRY,
  LearningStage.OBSERVE,
  LearningStage.DESCRIBE,
  LearningStage.PREDICT,
  LearningStage.EXPERIMENT,
  LearningStage.EXPLAIN,
  LearningStage.MODEL,
  LearningStage.TRANSFER,
  LearningStage.EXAM,
  LearningStage.AI_OFF,
  LearningStage.COMPLETE,
];

export const MICROWAVE_SCENE_ID = "microwave-bread" as const;
export const ENGINE_SCENE_ID = "four-stroke-engine" as const;
export const CART_SCENE_ID = "horizontal-force-cart" as const;
export const SAMPLES_SCENE_ID = "equal-volume-material-samples" as const;
export const HEAT_SAMPLES_SCENE_ID = "equal-mass-heated-samples" as const;

export type ProductionSceneId =
  | typeof MICROWAVE_SCENE_ID
  | typeof ENGINE_SCENE_ID
  | typeof CART_SCENE_ID
  | typeof SAMPLES_SCENE_ID
  | typeof HEAT_SAMPLES_SCENE_ID;

/** Production IDs plus adapter-registered fixtures. Progression looks up adapters by this string. */
export type SceneId = string;

export type MicrowaveScenePhysicsState = {
  sceneId: typeof MICROWAVE_SCENE_ID;
  state: MicrowavePhysicsState;
};

export type EngineScenePhysicsState = {
  sceneId: typeof ENGINE_SCENE_ID;
  state: EngineState;
};

export type CartScenePhysicsState = {
  sceneId: typeof CART_SCENE_ID;
  state: CartState;
};

export type SamplesScenePhysicsState = {
  sceneId: typeof SAMPLES_SCENE_ID;
  state: DensitySceneState;
};

export type HeatSamplesScenePhysicsState = {
  sceneId: typeof HEAT_SAMPLES_SCENE_ID;
  state: HeatSamplesSceneState;
};

export type AdapterOwnedPhysicsState = {
  sceneId: string;
  state: Record<string, unknown>;
};

export type ScenePhysicsState =
  | MicrowaveScenePhysicsState
  | EngineScenePhysicsState
  | CartScenePhysicsState
  | SamplesScenePhysicsState
  | HeatSamplesScenePhysicsState
  | AdapterOwnedPhysicsState;

export interface ObservationEvidence {
  text: string;
  timestamp: string;
  selectedOptionIds?: string[];
  watchedFullCycle?: boolean;
  sufficient?: boolean;
}

export interface DescriptionEvidence {
  text: string;
  object?: string;
  quantity?: string;
  change?: string;
  sufficient?: boolean;
  timestamp: string;
  engineStroke?: "intake" | "compression" | "power" | "exhaust";
  pistonMotionCorrect?: boolean;
  intakeValveStateCorrect?: boolean;
  exhaustValveStateCorrect?: boolean;
  combustionStateCorrect?: boolean;
  distinguishesPowerEvent?: boolean;
  engineAnswers?: Array<{
    stroke: "intake" | "compression" | "power" | "exhaust";
    piston: "up" | "down" | "held" | "";
    intake: "open" | "closed" | "";
    exhaust: "open" | "closed" | "";
    combustion: "present" | "absent" | "";
  }>;
}

export interface PredictionEvidence {
  prediction: string;
  reasoning: string;
  timestamp: string;
  /** Scene/model code may narrow valid IDs locally. */
  experimentId?: string;
  committed?: boolean;
}

export interface EngineObservedResult {
  combustionOccurred: "" | "yes" | "no";
  mechanismMoving: "" | "yes" | "no";
  mainOutputOccurred: "" | "yes" | "no";
}

export interface EnginePhysicsSnapshot {
  combustionOccurred: boolean;
  mainOutputOccurred: boolean;
  workTransfer: string;
  mechanicalOutput: string;
  crankshaftMoving: boolean;
  workingGasState: string;
  pistonDirection: string;
}

export interface ExperimentEvidence {
  prediction: string;
  predictionReason: string;
  /** Scene 01 microwave snapshot. Other Scenes omit this. */
  actualResult?: {
    finalTemperatureC: number;
    energyInputJ: number;
    deltaTemperatureC: number;
  };
  predictionComparison: string;
  reflection: string;
  /** Scene 01 microwave parameters. Other Scenes omit this. */
  parameters?: {
    powerW: number;
    heatingTimeSec: number;
    initialTemperatureC: number;
  };
  timestamp: string;
  /** Scene/model code may narrow valid IDs locally. */
  experimentId?: string;
  committedAt?: string;
  interventionAt?: string;
  /**
   * Scene-owned structured payload. Universal code must not assume
   * microwave or engine field names. Scene/model code narrows locally.
   */
  intervention?: object;
  observedResult?: object;
  comparison?: "" | "same" | "different" | "partial";
  physicsResult?: object;
  authoredBeforeIntervention?: boolean;
  sufficient?: boolean;
}

export interface ExplanationEvidence {
  text: string;
  explanationLevel?: 0 | 1 | 2 | 3 | 4;
  timestamp: string;
  referencesCombustionOrEnergyRelease?: boolean;
  identifiesWorkingGasChange?: boolean;
  identifiesMechanicalInteraction?: boolean;
  identifiesWorkLikeCausalLink?: boolean;
  distinguishesCombustionFromDirectMechanicalOutput?: boolean;
  engineAnswers?: {
    firstChange: string;
    gasEffect: string;
    mechanicalGain: string;
  };
  distinguishesForceFromMotion?: boolean;
  connectsNonzeroForceToChange?: boolean;
  treatsZeroNetForceAsUnchanged?: boolean;
  doesNotRequireForwardForceToKeepMoving?: boolean;
  forceMotionAnswers?: {
    forceVsMotion: string;
    sameDirection: string;
    oppositeDirection: string;
    zeroNetForce: string;
  };
  distinguishesDensityFromMassOrSize?: boolean;
  usesMassVolumeRatio?: boolean;
  checksUniformCutCondition?: boolean;
  densityAnswers?: {
    densityVsMass: string;
    sameVolume: string;
    sameMass: string;
    uniformCut: string;
  };
  distinguishesHeatFromTemperature?: boolean;
  usesHeatMassTempRelation?: boolean;
  checksNoPhaseChangeOrTimeNotQ?: boolean;
  heatAnswers?: {
    heatVsTemperature: string;
    sameMassSameQ: string;
    sameCSameQ: string;
    timeAndPhase: string;
  };
  identifiesPartialEnergyRelation?: boolean;
  microwaveAnswers?: {
    energyTransfer: string;
    link: string;
  };
  sufficient?: boolean;
}

export interface ModelAttempt {
  nodes: string[];
  connections: Array<{
    from: string;
    to: string;
    kind?: "conversion" | "work" | "gains";
  }>;
  correctStructure: boolean;
  timestamp: string;
  enablingProcesses?: string[];
  conditions?: string[];
  failureKinds?: string[];
}

export interface TransferAttempt {
  scenarioId: string;
  response: string;
  identifiedSharedModel?: boolean;
  timestamp: string;
  targetId?: string;
  transferMode?: "full-model" | "partial-structure" | "boundary-contrast";
  selectedRelations?: string[];
  rejectedRelations?: string[];
  conditionReasoning?: string;
  accepted?: boolean;
  failureKinds?: string[];
  relationOrder?: string[];
  surfaceCueSelected?: boolean;
  judgments?: Record<string, "applies" | "not-necessarily" | "">;
  conditionChecks?: string[];
}

export interface ExamAttempt {
  questionId: string;
  representation?: string[];
  modelFocus?: string;
  modelRecognition?: string;
  selectedAnswer?: string;
  reasoning?: string;
  correct?: boolean;
  correctness?: boolean;
  reasoningQuality?: "weak" | "adequate" | "strong";
  timestamp: string;
  patternId?: string;
  cognitiveActions?: string[];
  selectedRelations?: string[];
  representationMatchesIntended?: boolean;
  modelMatchesIntended?: boolean;
  reasoningSignals?: {
    hasOwnWords: boolean;
    addressesRequiredReasoning: boolean;
  };
}

export interface IndependentReasoningSignals {
  identifiesWorkingSubstanceChange?: boolean;
  identifiesMechanicalInteraction?: boolean;
  identifiesWorkRelation?: boolean;
  identifiesConditionOrBoundary?: boolean;
  avoidsDirectCombustionToMotion?: boolean;
  identifiesCurrentMotionState?: boolean;
  identifiesNetForceCondition?: boolean;
  identifiesMotionStateChange?: boolean;
  distinguishesForceFromMotion?: boolean;
  checksZeroNetForceUnchangedCondition?: boolean;
  distinguishesBalancedFromAbsentForce?: boolean;
  avoidsForceMotionMisconception?: boolean;
  identifiesMass?: boolean;
  identifiesVolume?: boolean;
  usesMassVolumeRatio?: boolean;
  distinguishesDensityFromMassOrSize?: boolean;
  checksUniformMaterialCondition?: boolean;
  avoidsDensityMisconception?: boolean;
  usesProportionalInvariance?: boolean;
  considersMassAndVolumeTogether?: boolean;
  conclusionOnlyReasoning?: boolean;
  identifiesHeatEnergy?: boolean;
  identifiesTemperatureChange?: boolean;
  identifiesSpecificHeat?: boolean;
  usesHeatMassTempRelation?: boolean;
  distinguishesHeatFromTemperature?: boolean;
  checksNoPhaseChangeCondition?: boolean;
  considersQMassAndDeltaTTogether?: boolean;
  avoidsHeatMisconception?: boolean;
  preCommitBoundaryReasoning?: boolean;
  preCommitWorkRelation?: boolean;
  preCommitConditionOrBoundary?: boolean;
  preCommitCurrentMotionState?: boolean;
  preCommitNetForceCondition?: boolean;
  preCommitRelation?: boolean;
  identifiesEnergyTransfer?: boolean;
  identifiesInternalEnergyChange?: boolean;
  treatsHeatAsProcess?: boolean;
  preCommitEnergyTransfer?: boolean;
  preCommitInternalEnergyChange?: boolean;
  preCommitTemperatureRelation?: boolean;
  postCheckEnergyTransfer?: boolean;
  postCheckInternalEnergyChange?: boolean;
  postCheckWorkRelation?: boolean;
  postCheckConditionOrBoundary?: boolean;
  postCheckCurrentMotionState?: boolean;
  postCheckNetForceCondition?: boolean;
  hasOwnWords: boolean;
  postCheckMatchesRequired: boolean;
}

export interface IndependentChallengeAttempt {
  challengeId: string;
  selectedAnswer: string;
  studentReasoning: string;
  answerCorrect: boolean;
  reasoningSignals: IndependentReasoningSignals;
  postCheckIds: string[];
  preCommitEvidenceIds?: string[];
  timestamp: string;
  accepted: boolean;
  llmUsed: false;
  completedWithoutAI: true;
}

export interface IndependentAssessment {
  explanation: string;
  examResponses: Record<string, string>;
  completedWithoutAI: boolean;
  llmUsed?: boolean;
  challengeAttempts?: IndependentChallengeAttempt[];
}

export type LearningEventType =
  | "stage_entered"
  | "student_response"
  | "experiment_run"
  | "prediction_made"
  | "model_submitted"
  | "transfer_attempted"
  | "exam_answered"
  | "ai_interaction"
  | "ai_off_started"
  | "session_completed";

export interface LearningEvent {
  type: LearningEventType;
  timestamp: string;
  stage: LearningStage;
  metadata?: Record<string, unknown>;
}

export interface StudentCognitiveProfile {
  physicalDescription?: number;
  causalExplanation?: number;
  prediction?: number;
  modeling?: number;
  transfer?: number;
  independentProblemSolving?: number;
}

export interface LearningSession {
  version: 1;
  sessionId: string;
  sceneId: SceneId;
  stage: LearningStage;
  startedAt: string;

  physicsState: ScenePhysicsState;
  /**
   * Scene-owned extension bag.
   *
   * New Scenes MUST put Scene-specific data here.
   * Do not add scene03Answers / scene04Answers / experimentHistory-like
   * fields as new universal top-level LearningSession properties.
   */
  sceneData: Record<string, unknown>;

  observations: ObservationEvidence[];
  descriptions: DescriptionEvidence[];
  predictions: PredictionEvidence[];
  experimentEvidence: ExperimentEvidence[];
  explanations: ExplanationEvidence[];
  modelAttempts: ModelAttempt[];
  transferAttempts: TransferAttempt[];
  examAttempts: ExamAttempt[];

  aiInteractions: TutorInteraction[];
  events: LearningEvent[];

  independentAssessment?: IndependentAssessment;
  cognitiveProfile?: StudentCognitiveProfile;

  completed: boolean;
}
