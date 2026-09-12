import { createInitialEngineState } from "@/lib/physics/engine";
import { isHeatSamplesSceneState } from "@/lib/physics/equal-mass-heated-samples";
import { isOhmsSceneState } from "@/lib/physics/simple-resistor-circuit";
import { isDensitySceneState } from "@/lib/physics/equal-volume-material-samples";
import { isCartState } from "@/lib/physics/horizontal-force-cart";
import { createDefaultPhysicsState } from "@/lib/physics/microwave";
import {
  defaultCartScenePhysics,
  defaultHeatSamplesScenePhysics,
  defaultSamplesScenePhysics,
  isLegacyMicrowavePhysics,
  isUnwrappedEnginePhysics,
  isWrappedScenePhysics,
  wrapCartPhysicsState,
  wrapEnginePhysicsState,
  wrapMicrowavePhysicsState,
  defaultOhmsScenePhysics,
  wrapHeatSamplesPhysicsState,
  wrapOhmsPhysicsState,
  wrapSamplesPhysicsState,
} from "@/lib/runtime/physics-state";
import {
  CART_SCENE_ID,
  ENGINE_SCENE_ID,
  HEAT_SAMPLES_SCENE_ID,
  LearningStage,
  MICROWAVE_SCENE_ID,
  OHMS_SCENE_ID,
  SAMPLES_SCENE_ID,
  type LearningSession,
  type ProductionSceneId,
  type SceneId,
  type ScenePhysicsState,
} from "@/types/learning";
import { MICROWAVE_EXPERIMENT_HISTORY_KEY } from "@/lib/learning/microwave-scene-data";
import { z } from "zod";

export const SESSION_STORAGE_KEYS: Record<ProductionSceneId, string> = {
  [MICROWAVE_SCENE_ID]: "physics-lab.session.microwave-bread.v1",
  [ENGINE_SCENE_ID]: "physics-lab.session.four-stroke-engine.v1",
  [CART_SCENE_ID]: "physics-lab.session.horizontal-force-cart.v1",
  [SAMPLES_SCENE_ID]: "physics-lab.session.equal-volume-material-samples.v1",
  [HEAT_SAMPLES_SCENE_ID]: "physics-lab.session.equal-mass-heated-samples.v1",
  [OHMS_SCENE_ID]: "physics-lab.session.simple-resistor-circuit.v1",
};

export const SESSION_STORAGE_KEY = SESSION_STORAGE_KEYS[MICROWAVE_SCENE_ID];

export function sessionStorageKey(sceneId: SceneId): string {
  if (
    sceneId === MICROWAVE_SCENE_ID ||
    sceneId === ENGINE_SCENE_ID ||
    sceneId === CART_SCENE_ID ||
    sceneId === SAMPLES_SCENE_ID ||
    sceneId === HEAT_SAMPLES_SCENE_ID ||
    sceneId === OHMS_SCENE_ID
  ) {
    return SESSION_STORAGE_KEYS[sceneId];
  }
  return `physics-lab.session.${sceneId}.v1`;
}

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

const sessionSchema = z
  .object({
    version: z.literal(1),
    sessionId: z.string().min(1),
    sceneId: z.string().min(1),
    stage: learningStageSchema,
    startedAt: z.string().min(1),
    physicsState: z.unknown(),
    sceneData: z.record(z.string(), z.unknown()).optional(),
    experimentHistory: z.array(z.unknown()).optional(),
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

  storage.setItem(sessionStorageKey(session.sceneId), JSON.stringify(session));
}

export function loadSession(
  sceneId: SceneId = MICROWAVE_SCENE_ID,
): LearningSession | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const raw = storage.getItem(sessionStorageKey(sceneId));
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return hydratePersistedSession(parsed, sceneId);
  } catch {
    return null;
  }
}

export function clearSession(sceneId: SceneId = MICROWAVE_SCENE_ID): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(sessionStorageKey(sceneId));
}

export function hydratePersistedSession(
  parsed: unknown,
  expectedSceneId?: SceneId,
): LearningSession | null {
  const result = sessionSchema.safeParse(parsed);
  if (!result.success) {
    return null;
  }
  if (expectedSceneId && result.data.sceneId !== expectedSceneId) {
    return null;
  }

  const migrated = migratePersistedPhysicsState(result.data);
  if (!migrated) {
    return null;
  }
  return migratePersistedSceneData(migrated) as unknown as LearningSession;
}

export function migratePersistedSceneData(
  parsed: Record<string, unknown>,
): Record<string, unknown> {
  const sceneData =
    parsed.sceneData &&
    typeof parsed.sceneData === "object" &&
    !Array.isArray(parsed.sceneData)
      ? { ...(parsed.sceneData as Record<string, unknown>) }
      : {};

  if (Array.isArray(parsed.experimentHistory) && parsed.experimentHistory.length > 0) {
    const existing = sceneData[MICROWAVE_EXPERIMENT_HISTORY_KEY];
    if (!Array.isArray(existing) || existing.length === 0) {
      sceneData[MICROWAVE_EXPERIMENT_HISTORY_KEY] = parsed.experimentHistory;
    }
  }

  if (
    parsed.sceneId === MICROWAVE_SCENE_ID &&
    !Array.isArray(sceneData[MICROWAVE_EXPERIMENT_HISTORY_KEY])
  ) {
    sceneData[MICROWAVE_EXPERIMENT_HISTORY_KEY] = [];
  }

  const { experimentHistory: _legacyHistory, ...rest } = parsed;
  return {
    ...rest,
    sceneData,
  };
}

export function migratePersistedPhysicsState(
  parsed: Record<string, unknown>,
): Record<string, unknown> | null {
  const sceneId = parsed.sceneId;
  if (typeof sceneId !== "string" || sceneId.length === 0) {
    return null;
  }

  const physicsState = wrapPersistedPhysicsState(sceneId, parsed.physicsState);
  if (!physicsState) {
    return null;
  }

  return {
    ...parsed,
    physicsState,
  };
}

function wrapPersistedPhysicsState(
  sceneId: string,
  physics: unknown,
): ScenePhysicsState | null {
  if (isWrappedScenePhysics(physics)) {
    if (sceneId === ENGINE_SCENE_ID && isLegacyMicrowavePhysics(physics.state)) {
      return wrapEnginePhysicsState(createInitialEngineState());
    }
    if (sceneId === MICROWAVE_SCENE_ID && physics.sceneId !== MICROWAVE_SCENE_ID) {
      return null;
    }
    return physics;
  }

  if (sceneId === ENGINE_SCENE_ID) {
    if (isUnwrappedEnginePhysics(physics)) {
      return wrapEnginePhysicsState(physics);
    }
    if (isLegacyMicrowavePhysics(physics) || physics == null) {
      return wrapEnginePhysicsState(createInitialEngineState());
    }
    return null;
  }

  if (sceneId === MICROWAVE_SCENE_ID) {
    if (isLegacyMicrowavePhysics(physics)) {
      return wrapMicrowavePhysicsState(physics);
    }
    return wrapMicrowavePhysicsState(createDefaultPhysicsState());
  }

  if (sceneId === CART_SCENE_ID) {
    if (isCartState(physics)) {
      return wrapCartPhysicsState(physics);
    }
    return defaultCartScenePhysics();
  }

  if (sceneId === SAMPLES_SCENE_ID) {
    if (isDensitySceneState(physics)) {
      return wrapSamplesPhysicsState(physics);
    }
    return defaultSamplesScenePhysics();
  }

  if (sceneId === HEAT_SAMPLES_SCENE_ID) {
    if (isHeatSamplesSceneState(physics)) {
      return wrapHeatSamplesPhysicsState(physics);
    }
    return defaultHeatSamplesScenePhysics();
  }

  if (sceneId === OHMS_SCENE_ID) {
    if (isOhmsSceneState(physics)) {
      return wrapOhmsPhysicsState(physics);
    }
    return defaultOhmsScenePhysics();
  }

  return {
    sceneId,
    state: {},
  };
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
