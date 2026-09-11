import { applyTutorGuardrails, looksLikeAnswerLeak } from "@/lib/ai/guardrails";
import { SAFE_TUTOR_FALLBACK } from "@/lib/ai/tutor-schema";
import { LearningStage } from "@/types/learning";
import { describe, expect, it } from "vitest";

describe("tutor guardrails", () => {
  it("blocks tutor output during AI_OFF", () => {
    const result = applyTutorGuardrails(
      {
        action: "HINT",
        message: "Think about energy entering the spoon.",
        cognitiveGoal: "independent",
        revealsAnswer: false,
        misconceptionDetected: null,
        confidence: "high",
        suggestedNextStage: null,
      },
      LearningStage.AI_OFF,
    );

    expect(result).toEqual(SAFE_TUTOR_FALLBACK);
  });

  it("detects model construction leaks", () => {
    expect(
      looksLikeAnswerLeak(
        LearningStage.MODEL,
        "Put internal energy changes in the middle box.",
      ),
    ).toBe(true);
  });

  it("coerces a forbidden action to an allowed one", () => {
    const result = applyTutorGuardrails(
      {
        action: "EXPLAIN",
        message: "What changed that you can measure?",
        cognitiveGoal: "description",
        revealsAnswer: false,
        misconceptionDetected: null,
        confidence: "medium",
        suggestedNextStage: null,
      },
      LearningStage.DESCRIBE,
    );

    expect(result.action).toBe("ASK");
  });
});
