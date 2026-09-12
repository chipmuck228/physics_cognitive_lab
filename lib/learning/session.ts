import { createLearningEvent } from "@/lib/learning/events";
import { registerProductionSceneAdapters } from "@/lib/runtime/register-production-adapters";
import { getSceneAdapter } from "@/lib/runtime/registry";
import {
  LearningStage,
  MICROWAVE_SCENE_ID,
  type LearningSession,
  type SceneId,
} from "@/types/learning";

registerProductionSceneAdapters();

export function createSession(
  now: () => string = () => new Date().toISOString(),
  createId: () => string = () => crypto.randomUUID(),
  sceneId: SceneId = MICROWAVE_SCENE_ID,
): LearningSession {
  const startedAt = now();
  const adapter = getSceneAdapter(sceneId);

  return {
    version: 1,
    sessionId: createId(),
    sceneId: adapter.sceneId,
    stage: LearningStage.ENTRY,
    startedAt,
    physicsState: adapter.getInitialPhysicsState(),
    sceneData: adapter.getInitialSceneData?.() ?? {},
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
