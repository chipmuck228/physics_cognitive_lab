import { describe, expect, it } from "vitest";

import { createSession } from "@/lib/learning/session";
import {
  clearSession,
  loadSession,
  saveSession,
  SESSION_STORAGE_KEY,
} from "@/lib/learning/session-storage";
import { LearningStage } from "@/types/learning";

describe("session storage", () => {
  it("saves and restores a wrapped microwave physics state", () => {
    const session = createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "session-1",
    );

    saveSession(session);

    expect(loadSession()).toMatchObject({
      sessionId: "session-1",
      stage: LearningStage.ENTRY,
      sceneId: "microwave-bread",
      physicsState: { sceneId: "microwave-bread" },
      sceneData: { experimentHistory: [] },
    });
    expect(loadSession() && "experimentHistory" in loadSession()!).toBe(false);
  });

  it("returns null for corrupt data", () => {
    window.localStorage.setItem(SESSION_STORAGE_KEY, "{not-json");
    expect(loadSession()).toBeNull();
  });

  it("clears the stored session", () => {
    saveSession(createSession());
    clearSession();
    expect(loadSession()).toBeNull();
  });

  it("keeps Scene 02 Phase 3 evidence on a separate key", () => {
    const session = createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "engine-session",
      "four-stroke-engine",
    );
    const stored = {
      ...session,
      stage: LearningStage.DESCRIBE,
      observations: [
        {
          text: "活塞会上下运动；有时进气门打开",
          timestamp: "t",
          selectedOptionIds: ["piston-up-down", "intake-opens"],
          sufficient: true,
        },
      ],
      descriptions: [
        {
          text: "活塞向下运动，这里出现了燃烧。",
          timestamp: "t",
          sufficient: true,
        },
      ],
    };

    saveSession(stored);

    expect(loadSession("microwave-bread")).toBeNull();
    expect(loadSession("four-stroke-engine")).toMatchObject({
      sessionId: "engine-session",
      sceneId: "four-stroke-engine",
      stage: LearningStage.DESCRIBE,
      observations: [{ selectedOptionIds: ["piston-up-down", "intake-opens"] }],
      descriptions: [{ text: "活塞向下运动，这里出现了燃烧。" }],
      physicsState: { sceneId: "four-stroke-engine" },
    });
  });
});
