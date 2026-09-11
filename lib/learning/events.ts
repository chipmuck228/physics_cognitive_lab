import type {
  LearningEvent,
  LearningEventType,
  LearningStage,
} from "@/types/learning";

export function createLearningEvent(
  type: LearningEventType,
  stage: LearningStage,
  metadata?: Record<string, unknown>,
  now: () => string = () => new Date().toISOString(),
): LearningEvent {
  return {
    type,
    timestamp: now(),
    stage,
    ...(metadata ? { metadata } : {}),
  };
}
