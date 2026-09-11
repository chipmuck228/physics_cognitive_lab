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
  it("saves and restores a session", () => {
    const session = createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "session-1",
    );

    saveSession(session);

    expect(loadSession()).toMatchObject({
      sessionId: "session-1",
      stage: LearningStage.ENTRY,
      sceneId: "microwave-bread",
    });
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
});
