import { describe, expect, it } from "vitest";

import {
  buildModelAttempt,
  isCorrectModelStructure,
  summarizeModelAttempt,
} from "@/lib/learning/model-evaluation";

describe("model evaluation", () => {
  it("recognizes the correct model structure", () => {
    expect(
      isCorrectModelStructure("internal energy changes", true, true),
    ).toBe(true);
    expect(isCorrectModelStructure("mass changes", true, true)).toBe(false);
  });

  it("builds a correct model attempt", () => {
    const attempt = buildModelAttempt({
      middleNode: "internal energy changes",
      connectSourceToMiddle: true,
      connectMiddleToTarget: true,
      timestamp: "2026-09-11T00:00:00.000Z",
    });

    expect(attempt.correctStructure).toBe(true);
    expect(attempt.connections).toHaveLength(2);
    expect(summarizeModelAttempt(attempt)).toContain("core relationship");
  });

  it("keeps incorrect attempts for revision", () => {
    const attempt = buildModelAttempt({
      middleNode: "mass changes",
      connectSourceToMiddle: true,
      connectMiddleToTarget: false,
      timestamp: "2026-09-11T00:00:00.000Z",
    });

    expect(attempt.correctStructure).toBe(false);
    expect(summarizeModelAttempt(attempt)).toContain("Reconsider");
  });
});
