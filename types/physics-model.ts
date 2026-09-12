import type { TutorAction } from "@/types/ai";
import type { LearningStage } from "@/types/learning";

/**
 * Canonical PhysicsModel contract from spec/physics-model-schema.md.
 * Do not redefine this type inside a Scene or a concrete model folder.
 */

export type PhysicsDomain =
  | "mechanics"
  | "energy"
  | "thermal"
  | "electricity"
  | "magnetism"
  | "optics"
  | "sound"
  | "pressure"
  | "matter"
  | "measurement";

export interface CurriculumMapping {
  grade: number[];
  units: string[];
  concepts: string[];
  formulas?: string[];
  requiredExperiments?: string[];
  examFrequency?: "low" | "medium" | "high";
}

export interface PhysicalQuantity {
  id: string;
  name: string;
  symbol?: string;
  unit?: string;
  role: "input" | "state" | "observable" | "controlled" | "derived";
  studentLanguage: string[];
  misconceptions?: string[];
}

export interface CausalRelation {
  from: string;
  to: string;
  relation: "causes" | "changes" | "transfers" | "converts" | "depends-on";
  direction?: "increase" | "decrease" | "bidirectional";
  conditions?: string[];
}

export interface EnergyRelation {
  source: string;
  destination: string;
  mechanism: "heat-transfer" | "work" | "conversion" | "mixed";
  description: string;
  conditions?: string[];
}

export interface Condition {
  id: string;
  description: string;
  importance: "essential" | "important" | "contextual";
}

export interface Counterexample {
  scenario: string;
  whyModelFails: string;
  requiredNewModel?: string;
}

export const HintLevelId = {
  H1: "H1",
  H2: "H2",
  H3: "H3",
  H4: "H4",
  H5: "H5",
} as const;

export type HintLevelId = (typeof HintLevelId)[keyof typeof HintLevelId];

export interface TutorIntervention {
  hintLevel: HintLevelId;
  action: TutorAction;
  prompt: string;
}

export interface Misconception {
  id: string;
  statement: string;
  diagnosticSignals: string[];
  severity: "low" | "medium" | "high";
  recommendedInterventions: TutorIntervention[];
}

export interface Phenomenon {
  id: string;
  title: string;
  description: string;
  modelRole: "anchor" | "supporting" | "transfer";
  observableChanges: string[];
  relatedVariables: string[];
}

export interface ExperimentOperation {
  id: string;
  description: string;
  variable?: string;
  values?: Array<string | number | boolean>;
}

export const ExperimentEvidenceKind = {
  PREDICTION: "prediction",
  INTERVENTION: "intervention",
  OBSERVED_RESULT: "observed-result",
  PREDICTION_VS_RESULT: "prediction-vs-result",
  REFLECTION: "reflection",
} as const;

export type ExperimentEvidenceKind =
  (typeof ExperimentEvidenceKind)[keyof typeof ExperimentEvidenceKind];

export interface ExperimentEvidenceSpec {
  kind: ExperimentEvidenceKind;
  required: boolean;
  notes?: string;
}

export interface EvidenceRequirement {
  id: string;
  description: string;
}

export interface SceneDefinition {
  id: string;
  primaryModel: string;
  secondaryModels?: string[];
  phenomenonId: string;
  visualType: "interactive" | "simulation" | "observation" | "exam";
  controllableVariables: string[];
  observableVariables: string[];
  experimentOperations: ExperimentOperation[];
  physicsEngine: string;
  targetEvidence: EvidenceRequirement[];
}

export interface ExperimentDefinition {
  id: string;
  question: string;
  controllableVariables: string[];
  fixedVariables: string[];
  predictedVariables: string[];
  allowedOperations: ExperimentOperation[];
  expectedEvidence: ExperimentEvidenceSpec[];
  informationGain: "low" | "medium" | "high";
}

export const TransferMode = {
  FULL_MODEL: "full-model",
  PARTIAL_STRUCTURE: "partial-structure",
  BOUNDARY_CONTRAST: "boundary-contrast",
} as const;

export type TransferMode = (typeof TransferMode)[keyof typeof TransferMode];

export interface TransferTarget {
  id: string;
  level: "near" | "medium" | "far" | "exam";
  scenario: string;
  surfaceFeatures: string[];
  deepStructure: string[];
  transferMode: TransferMode;
  expectedModelId?: string;
  transferableRelations?: string[];
  nonTransferableRelations?: string[];
  requiresConditionCheck?: boolean;
}

export interface ExamPattern {
  id: string;
  format:
    | "multiple-choice"
    | "fill-blank"
    | "short-answer"
    | "calculation"
    | "diagram"
    | "experimental";
  representation: string;
  testedModel: string;
  commonDistractors?: string[];
  requiredReasoning: string[];
  difficulty: "basic" | "medium" | "advanced";
  requiredCognitiveActions: string[];
  stem: string;
  representationOptions: string[];
  modelOptions: string[];
  options: string[];
  correctAnswer: string;
  reasoningPrompt: string;
}

export interface HintLevelContent {
  id: HintLevelId;
  prompt: string;
}

export interface MisconceptionStrategy {
  misconceptionId: string;
  approach: string;
}

export interface TutorPolicy {
  allowedActionsByStage: Record<LearningStage, TutorAction[]>;
  answerLeakageRules: string[];
  hintLadder: HintLevelContent[];
  misconceptionStrategies: MisconceptionStrategy[];
  maxExplanationLength?: number;
}

export interface IndependentChallenge {
  id: string;
  scenario: string;
  unfamiliarity: "low" | "medium" | "high";
  question: string;
  expectedModelId: string;
  requiredEvidence: EvidenceRequirement[];
  llmAllowed: false;
}

export const ModelEvidenceLevel = {
  L1: "L1",
  L2: "L2",
  L3: "L3",
  L4: "L4",
  L5: "L5",
  L6: "L6",
} as const;

export type ModelEvidenceLevel =
  (typeof ModelEvidenceLevel)[keyof typeof ModelEvidenceLevel];

/**
 * Required MODEL components are owned by each Physics Model's
 * deep structure. They are not a universal energy-conversion checklist.
 */
export interface ModelEvaluatorSpec {
  requiredComponents: Record<string, string>;
  evidenceLevels: Record<ModelEvidenceLevel, string>;
}

/** Lifecycle semantics: spec/physics-model-schema.md §20. */
export interface PhysicsModelMetadata {
  version: string;
  author?: string;
  status: "draft" | "prototype" | "validated" | "production";
  sourceReferences: string[];
  lastReviewedAt?: string;
  notes?: string[];
}

export interface PhysicsModel {
  id: string;
  title: string;
  coreIdea: string;
  domain: PhysicsDomain[];
  curriculum: CurriculumMapping;
  quantities: PhysicalQuantity[];
  causalRelations: CausalRelation[];
  energyRelations?: EnergyRelation[];
  conditions: Condition[];
  counterexamples: Counterexample[];
  misconceptions: Misconception[];
  phenomena: Phenomenon[];
  scenes: SceneDefinition[];
  experiments: ExperimentDefinition[];
  transferTargets: TransferTarget[];
  examPatterns: ExamPattern[];
  tutorPolicy: TutorPolicy;
  independentChallenges: IndependentChallenge[];
  modelEvaluator: ModelEvaluatorSpec;
  metadata: PhysicsModelMetadata;
}
