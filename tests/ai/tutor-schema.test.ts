import { parseTutorResponse } from "@/lib/ai/tutor";
import { SAFE_TUTOR_FALLBACK } from "@/lib/ai/tutor-schema";
import { LearningStage } from "@/types/learning";
import { describe, expect, it } from "vitest";

describe("tutor schema", () => {
  it("parses a valid response", () => {
    const parsed = parseTutorResponse(
      {
        action: "ASK",
        message: "What quantity changed?",
        cognitiveGoal: "description",
        revealsAnswer: false,
        misconceptionDetected: null,
        confidence: "medium",
        suggestedNextStage: null,
      },
      LearningStage.DESCRIBE,
    );

    expect(parsed.action).toBe("ASK");
    expect(parsed.message).toBe("What quantity changed?");
    expect(parsed.suggestedNextStage).toBeNull();
  });

  it("falls back when the response is malformed", () => {
    expect(parseTutorResponse({ action: "WANDER" }, LearningStage.OBSERVE)).toEqual(
      SAFE_TUTOR_FALLBACK,
    );
  });

  it("suppresses answer reveals in protected stages", () => {
    const parsed = parseTutorResponse(
      {
        action: "EXPLAIN",
        message: "The temperature will increase. That is the correct prediction.",
        cognitiveGoal: "prediction",
        revealsAnswer: true,
        misconceptionDetected: null,
        confidence: "high",
        suggestedNextStage: "EXPERIMENT",
      },
      LearningStage.PREDICT,
    );

    expect(parsed.revealsAnswer).toBe(false);
    expect(parsed.message).toBe(SAFE_TUTOR_FALLBACK.message);
    expect(parsed.suggestedNextStage).toBeNull();
  });
});
