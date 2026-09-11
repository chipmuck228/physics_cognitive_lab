import type { TutorInteraction } from "@/types/ai";
import type {
  MicrowaveExperimentResult,
  MicrowavePhysicsState,
} from "@/types/physics";

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

export type SceneId = "microwave-bread";

export interface ObservationEvidence {
  text: string;
  timestamp: string;
}

export interface DescriptionEvidence {
  text: string;
  object?: string;
  quantity?: string;
  change?: string;
  sufficient?: boolean;
  timestamp: string;
}

export interface PredictionEvidence {
  prediction: string;
  reasoning: string;
  timestamp: string;
}

export interface ExperimentEvidence {
  prediction: string;
  predictionReason: string;
  actualResult: {
    finalTemperatureC: number;
    energyInputJ: number;
    deltaTemperatureC: number;
  };
  predictionComparison: string;
  reflection: string;
  parameters: {
    powerW: number;
    heatingTimeSec: number;
    initialTemperatureC: number;
  };
  timestamp: string;
}

export interface ExplanationEvidence {
  text: string;
  explanationLevel?: 0 | 1 | 2 | 3 | 4;
  timestamp: string;
}

export interface ModelAttempt {
  nodes: string[];
  connections: Array<{
    from: string;
    to: string;
  }>;
  correctStructure: boolean;
  timestamp: string;
}

export interface TransferAttempt {
  scenarioId: string;
  response: string;
  identifiedSharedModel?: boolean;
  timestamp: string;
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
}

export interface IndependentAssessment {
  explanation: string;
  examResponses: Record<string, string>;
  completedWithoutAI: boolean;
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

  physicsState: MicrowavePhysicsState;
  experimentHistory: MicrowaveExperimentResult[];

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
