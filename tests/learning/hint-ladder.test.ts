import { describe, expect, it } from "vitest";

import { nextEngineHint, revealedEngineHints } from "@/lib/learning/hint-ladder";
import { LearningStage } from "@/types/learning";

describe("engine app-side hint ladder", () => {
  it("does not reveal the full energy chain on the first hint", () => {
    const first = nextEngineHint([], LearningStage.EXPLAIN);
    expect(first).not.toBeNull();
    expect(first?.id).toBe("H1");
    expect(first?.prompt).not.toMatch(/化学能.{0,8}内能.{0,8}做功.{0,8}机械能/);
    expect(first?.prompt).not.toMatch(/化学能\s*→\s*内能/);
  });

  it("reveals the Physics Model ladder one step at a time", () => {
    const events = [
      {
        type: "ai_interaction" as const,
        timestamp: "t",
        stage: LearningStage.EXPLAIN,
        metadata: { source: "hint-ladder" },
      },
    ];
    expect(revealedEngineHints(events, LearningStage.EXPLAIN)).toHaveLength(1);
    const second = nextEngineHint(events, LearningStage.EXPLAIN);
    expect(second?.id).toBe("H2");
  });
});
