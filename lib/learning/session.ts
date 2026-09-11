import { createLearningEvent } from "@/lib/learning/events";
import { createDefaultPhysicsState } from "@/lib/physics/microwave";
import { LearningStage, type LearningSession } from "@/types/learning";

export function createSession(
  now: () => string = () => new Date().toISOString(),
  createId: () => string = () => crypto.randomUUID(),
): LearningSession {
  const startedAt = now();

  return {
    version: 1,
    sessionId: createId(),
    sceneId: "microwave-bread",
    stage: LearningStage.ENTRY,
    startedAt,
    physicsState: createDefaultPhysicsState(),
    experimentHistory: [],
    observations: [],
    descriptions: [],
    predictions: [],
    experimentEvidence: [],
    explanations: [],
    modelAttempts: [],
    transferAttempts: [],
    examAttempts: [],
    aiInteractions: [],
    events: [
      createLearningEvent("stage_entered", LearningStage.ENTRY, undefined, now),
    ],
    completed: false,
  };
}
