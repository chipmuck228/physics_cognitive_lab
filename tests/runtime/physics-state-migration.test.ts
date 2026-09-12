import { describe, expect, it } from "vitest";

import { createDefaultPhysicsState } from "@/lib/physics/microwave";
import { createSession } from "@/lib/learning/session";
import {
  hydratePersistedSession,
  loadSession,
  SESSION_STORAGE_KEYS,
} from "@/lib/learning/session-storage";
import { isEngineScenePhysics, isMicrowaveScenePhysics } from "@/lib/runtime/physics-state";
import { ENGINE_SCENE_ID, LearningStage, MICROWAVE_SCENE_ID } from "@/types/learning";

describe("persisted physicsState migration", () => {
  it("re-wraps a legacy microwave physics blob without dropping evidence", () => {
    const current = createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "microwave-1",
    );
    const legacy = {
      ...current,
      stage: LearningStage.OBSERVE,
      observations: [{ text: "The bread looked warmer.", timestamp: "t" }],
      physicsState: createDefaultPhysicsState(),
    };

    const restored = hydratePersistedSession(legacy, MICROWAVE_SCENE_ID);
    expect(restored).toBeTruthy();
    expect(restored?.sessionId).toBe("microwave-1");
    expect(restored?.observations).toEqual(legacy.observations);
    expect(isMicrowaveScenePhysics(restored!.physicsState)).toBe(true);
    if (restored && isMicrowaveScenePhysics(restored.physicsState)) {
      expect(restored.physicsState.state.currentTemperatureC).toBe(
        legacy.physicsState.currentTemperatureC,
      );
    }
  });

  it("replaces leftover microwave physics on an engine session without dropping learning evidence", () => {
    const current = createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "engine-1",
      ENGINE_SCENE_ID,
    );
    const legacy = {
      ...current,
      stage: LearningStage.DESCRIBE,
      observations: [
        {
          text: "活塞会上下运动；有时进气门打开",
          timestamp: "t",
          selectedOptionIds: ["piston-up-down", "intake-opens"],
          sufficient: true,
        },
      ],
      physicsState: createDefaultPhysicsState(),
    };

    window.localStorage.setItem(
      SESSION_STORAGE_KEYS[ENGINE_SCENE_ID],
      JSON.stringify(legacy),
    );

    const restored = loadSession(ENGINE_SCENE_ID);
    expect(restored).toBeTruthy();
    expect(restored?.sessionId).toBe("engine-1");
    expect(restored?.stage).toBe(LearningStage.DESCRIBE);
    expect(restored?.observations).toEqual(legacy.observations);
    expect(isEngineScenePhysics(restored!.physicsState)).toBe(true);
    if (restored && isEngineScenePhysics(restored.physicsState)) {
      expect(restored.physicsState.state.stroke).toBe("intake");
      expect("currentTemperatureC" in restored.physicsState.state).toBe(false);
    }
  });
});
