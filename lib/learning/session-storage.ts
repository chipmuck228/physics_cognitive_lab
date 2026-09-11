import { LearningStage } from "@/types/learning";
import type { LearningSession } from "@/types/learning";
import { z } from "zod";

export const SESSION_STORAGE_KEY = "physics-lab.session.microwave-bread.v1";

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

const physicsStateSchema = z.object({
  initialTemperatureC: z.number().finite(),
  currentTemperatureC: z.number().finite(),
  powerW: z.number().finite(),
  heatingTimeSec: z.number().finite(),
  breadFactor: z.number().finite(),
});

const sessionSchema = z
  .object({
    version: z.literal(1),
    sessionId: z.string().min(1),
    sceneId: z.literal("microwave-bread"),
    stage: learningStageSchema,
    startedAt: z.string().min(1),
    physicsState: physicsStateSchema,
    experimentHistory: z.array(z.unknown()).default([]),
    observations: z.array(z.unknown()).default([]),
    descriptions: z.array(z.unknown()).default([]),
    predictions: z.array(z.unknown()).default([]),
    experimentEvidence: z.array(z.unknown()).default([]),
    explanations: z.array(z.unknown()).default([]),
    modelAttempts: z.array(z.unknown()).default([]),
    transferAttempts: z.array(z.unknown()).default([]),
    examAttempts: z.array(z.unknown()).default([]),
    aiInteractions: z.array(z.unknown()).default([]),
    events: z.array(z.unknown()).default([]),
    completed: z.boolean(),
  })
  .passthrough();

export function saveSession(session: LearningSession): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function loadSession(): LearningSession | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const raw = storage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    const result = sessionSchema.safeParse(parsed);
    if (!result.success) {
      return null;
    }
    return result.data as LearningSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(SESSION_STORAGE_KEY);
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
