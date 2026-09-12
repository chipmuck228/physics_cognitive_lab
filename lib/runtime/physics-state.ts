import { createInitialEngineState } from "@/lib/physics/engine";
import {
  createInitialHeatState,
  isHeatSamplesSceneState,
} from "@/lib/physics/equal-mass-heated-samples";
import {
  createInitialDensityState,
  isDensitySceneState,
} from "@/lib/physics/equal-volume-material-samples";
import { createRestingCartState, isCartState } from "@/lib/physics/horizontal-force-cart";
import { createDefaultPhysicsState } from "@/lib/physics/microwave";
import type { EngineState } from "@/lib/physics/engine/types";
import type { DensitySceneState } from "@/lib/physics/equal-volume-material-samples";
import type { CartState } from "@/lib/physics/horizontal-force-cart";
import {
  CART_SCENE_ID,
  ENGINE_SCENE_ID,
  HEAT_SAMPLES_SCENE_ID,
  MICROWAVE_SCENE_ID,
  SAMPLES_SCENE_ID,
  type CartScenePhysicsState,
  type EngineScenePhysicsState,
  type HeatSamplesScenePhysicsState,
  type LearningSession,
  type MicrowaveScenePhysicsState,
  type SamplesScenePhysicsState,
  type ScenePhysicsState,
} from "@/types/learning";
import type { HeatSamplesSceneState } from "@/lib/physics/equal-mass-heated-samples";
import type { MicrowavePhysicsState } from "@/types/physics";

export function isMicrowaveScenePhysics(
  physics: ScenePhysicsState,
): physics is MicrowaveScenePhysicsState {
  return physics.sceneId === MICROWAVE_SCENE_ID;
}

export function isEngineScenePhysics(
  physics: ScenePhysicsState,
): physics is EngineScenePhysicsState {
  return physics.sceneId === ENGINE_SCENE_ID;
}

export function getMicrowavePhysicsState(
  session: LearningSession,
): MicrowavePhysicsState {
  if (!isMicrowaveScenePhysics(session.physicsState)) {
    throw new Error(
      `Expected microwave physics, got scene "${session.physicsState.sceneId}".`,
    );
  }
  return session.physicsState.state;
}

export function getEnginePhysicsState(session: LearningSession): EngineState {
  if (!isEngineScenePhysics(session.physicsState)) {
    throw new Error(
      `Expected engine physics, got scene "${session.physicsState.sceneId}".`,
    );
  }
  return session.physicsState.state;
}

export function isCartScenePhysics(
  physics: ScenePhysicsState,
): physics is CartScenePhysicsState {
  return physics.sceneId === CART_SCENE_ID && isCartState(physics.state);
}

export function getCartPhysicsState(session: LearningSession): CartState {
  if (!isCartScenePhysics(session.physicsState)) {
    throw new Error(
      `Expected cart physics, got scene "${session.physicsState.sceneId}".`,
    );
  }
  return session.physicsState.state;
}

export function wrapMicrowavePhysicsState(
  state: MicrowavePhysicsState,
): MicrowaveScenePhysicsState {
  return { sceneId: MICROWAVE_SCENE_ID, state };
}

export function wrapEnginePhysicsState(
  state: EngineState,
): EngineScenePhysicsState {
  return { sceneId: ENGINE_SCENE_ID, state };
}

export function wrapCartPhysicsState(state: CartState): CartScenePhysicsState {
  return { sceneId: CART_SCENE_ID, state };
}

export function isSamplesScenePhysics(
  physics: ScenePhysicsState,
): physics is SamplesScenePhysicsState {
  return physics.sceneId === SAMPLES_SCENE_ID && isDensitySceneState(physics.state);
}

export function getSamplesPhysicsState(session: LearningSession): DensitySceneState {
  if (!isSamplesScenePhysics(session.physicsState)) {
    throw new Error(
      `Expected samples physics, got scene "${session.physicsState.sceneId}".`,
    );
  }
  return session.physicsState.state;
}

export function wrapSamplesPhysicsState(
  state: DensitySceneState,
): SamplesScenePhysicsState {
  return { sceneId: SAMPLES_SCENE_ID, state };
}

export function defaultSamplesScenePhysics(): SamplesScenePhysicsState {
  return wrapSamplesPhysicsState(createInitialDensityState());
}

export function defaultMicrowaveScenePhysics(): MicrowaveScenePhysicsState {
  return wrapMicrowavePhysicsState(createDefaultPhysicsState());
}

export function defaultEngineScenePhysics(): EngineScenePhysicsState {
  return wrapEnginePhysicsState(createInitialEngineState());
}

export function defaultCartScenePhysics(): CartScenePhysicsState {
  return wrapCartPhysicsState(createRestingCartState());
}

export function isHeatSamplesScenePhysics(
  physics: ScenePhysicsState,
): physics is HeatSamplesScenePhysicsState {
  return (
    physics.sceneId === HEAT_SAMPLES_SCENE_ID &&
    isHeatSamplesSceneState(physics.state)
  );
}

export function getHeatSamplesPhysicsState(
  session: LearningSession,
): HeatSamplesSceneState {
  if (!isHeatSamplesScenePhysics(session.physicsState)) {
    throw new Error(
      `Expected heat-samples physics, got scene "${session.physicsState.sceneId}".`,
    );
  }
  return session.physicsState.state;
}

export function wrapHeatSamplesPhysicsState(
  state: HeatSamplesSceneState,
): HeatSamplesScenePhysicsState {
  return { sceneId: HEAT_SAMPLES_SCENE_ID, state };
}

export function defaultHeatSamplesScenePhysics(): HeatSamplesScenePhysicsState {
  return wrapHeatSamplesPhysicsState(createInitialHeatState());
}

export function isLegacyMicrowavePhysics(
  value: unknown,
): value is MicrowavePhysicsState {
  if (!value || typeof value !== "object" || "sceneId" in value) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.currentTemperatureC === "number" &&
    typeof record.powerW === "number" &&
    typeof record.heatingTimeSec === "number" &&
    typeof record.breadFactor === "number" &&
    typeof record.initialTemperatureC === "number"
  );
}

export function isUnwrappedEnginePhysics(value: unknown): value is EngineState {
  if (!value || typeof value !== "object" || "sceneId" in value) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.stroke === "string" &&
    typeof record.combustionEnabled === "boolean" &&
    typeof record.pistonCanMove === "boolean"
  );
}

export function isWrappedScenePhysics(
  value: unknown,
): value is ScenePhysicsState {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.sceneId === "string" && "state" in record;
}
