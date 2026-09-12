import { parseTutorResponse } from "@/lib/ai/tutor";
import { SAFE_TUTOR_FALLBACK, tutorRequestSchema } from "@/lib/ai/tutor-schema";
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

  it("accepts an engine observable physics snapshot", () => {
    const parsed = tutorRequestSchema.safeParse({
      sessionId: "engine-1",
      stage: LearningStage.OBSERVE,
      learningGoal: "帮学生先看清哪些东西在变化",
      studentResponse: "活塞在动",
      currentPhysicsState: {
        scene: "four-stroke-engine",
        stroke: "intake",
        pistonDirection: "down",
        intakeValveOpen: true,
        exhaustValveOpen: false,
        combustionEventActive: false,
      },
      knownMisconceptions: [],
      allowedActions: ["ASK", "ENCOURAGE"],
    });

    expect(parsed.success).toBe(true);
  });

  it("accepts Scene-owned tutor physics that is not microwave or engine-shaped", () => {
    const parsed = tutorRequestSchema.safeParse({
      sessionId: "density-1",
      sceneId: "runtime-density-fixture",
      stage: LearningStage.OBSERVE,
      learningGoal: "Help the student compare mass and volume.",
      studentResponse: "the block is heavier",
      currentPhysicsState: { massG: 50, volumeCm3: 25 },
      physicsSummary: "Physics state: mass 50 g, volume 25 cm3",
      promptConstraint: "Ask about mass and volume.",
      knownMisconceptions: [],
      allowedActions: ["ASK", "ENCOURAGE"],
    });
    expect(parsed.success).toBe(true);
  });
});
