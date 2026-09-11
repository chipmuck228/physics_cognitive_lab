import type { LearningStage } from "@/types/learning";

export const TutorAction = {
  ASK: "ASK",
  HINT: "HINT",
  CHALLENGE: "CHALLENGE",
  ENCOURAGE: "ENCOURAGE",
  EXPLAIN: "EXPLAIN",
} as const;

export type TutorAction = (typeof TutorAction)[keyof typeof TutorAction];

export interface TutorInteraction {
  id: string;
  stage: LearningStage;
  action: TutorAction;
  message: string;
  timestamp: string;
}

export interface TutorRequest {
  sessionId: string;
  stage: LearningStage;
  learningGoal: string;
  studentResponse: string;
  currentPhysicsState: {
    initialTemperatureC: number;
    currentTemperatureC: number;
    powerW: number;
    heatingTimeSec: number;
  };
  knownMisconceptions: string[];
  allowedActions: TutorAction[];
}

export interface TutorResponse {
  action: TutorAction;
  message: string;
  cognitiveGoal: string;
  revealsAnswer: boolean;
  misconceptionDetected: string | null;
  confidence: "low" | "medium" | "high";
  suggestedNextStage: LearningStage | null;
}
