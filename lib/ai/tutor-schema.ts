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

export const DEFAULT_TUTOR_CONSTRAINT =
  "用简体中文只问一个有用的问题，或给出一步小提示。不要说出目标答案。不要使用教育学术语。";

export const tutorRequestSchema = z.object({
  sessionId: z.string().min(1),
  sceneId: z.string().min(1).optional(),
  stage: learningStageSchema,
  learningGoal: z.string().min(1),
  studentResponse: z.string(),
  currentPhysicsState: z.record(z.string(), z.unknown()),
  physicsSummary: z.string().min(1).optional(),
  promptConstraint: z.string().min(1).optional(),
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
