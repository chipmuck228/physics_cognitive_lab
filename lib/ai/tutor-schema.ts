import { LearningStage } from "@/types/learning";
import { TutorAction } from "@/types/ai";
import { z } from "zod";

export const SAFE_TUTOR_FALLBACK = {
  action: TutorAction.ASK,
  message: "先别急着找答案。请告诉我，你刚才观察到了什么变化？",
  cognitiveGoal: "observation",
  revealsAnswer: false,
  misconceptionDetected: null,
  confidence: "low",
  suggestedNextStage: null,
} as const;

const learningStageSchema = z.enum([
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
]);

const tutorActionSchema = z.enum([
  TutorAction.ASK,
  TutorAction.HINT,
  TutorAction.CHALLENGE,
  TutorAction.ENCOURAGE,
  TutorAction.EXPLAIN,
]);

export const tutorRequestSchema = z.object({
  sessionId: z.string().min(1),
  stage: learningStageSchema,
  learningGoal: z.string().min(1),
  studentResponse: z.string(),
  currentPhysicsState: z.object({
    initialTemperatureC: z.number().finite(),
    currentTemperatureC: z.number().finite(),
    powerW: z.number().finite(),
    heatingTimeSec: z.number().finite(),
  }),
  knownMisconceptions: z.array(z.string()),
  allowedActions: z.array(tutorActionSchema),
});

export const tutorResponseSchema = z.object({
  action: tutorActionSchema,
  message: z.string().min(1),
  cognitiveGoal: z.string().min(1),
  revealsAnswer: z.boolean(),
  misconceptionDetected: z.string().nullable(),
  confidence: z.enum(["low", "medium", "high"]),
  suggestedNextStage: learningStageSchema.nullable(),
});

export type TutorRequestInput = z.infer<typeof tutorRequestSchema>;
export type TutorResponseParsed = z.infer<typeof tutorResponseSchema>;
