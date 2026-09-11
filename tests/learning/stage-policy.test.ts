import { describe, expect, it } from "vitest";

import {
  isActionAllowed,
  isRevealProtected,
  isTutorAllowed,
} from "@/lib/learning/stage-policy";
import { TutorAction } from "@/types/ai";
import { LearningStage } from "@/types/learning";

describe("stage tutor policy", () => {
  it("keeps OBSERVE to questions and encouragement", () => {
    expect(isActionAllowed(LearningStage.OBSERVE, TutorAction.ASK)).toBe(true);
    expect(isActionAllowed(LearningStage.OBSERVE, TutorAction.ENCOURAGE)).toBe(true);
    expect(isActionAllowed(LearningStage.OBSERVE, TutorAction.EXPLAIN)).toBe(false);
  });

  it("does not let the model construct itself in MODEL", () => {
    expect(isActionAllowed(LearningStage.MODEL, TutorAction.EXPLAIN)).toBe(false);
    expect(isActionAllowed(LearningStage.MODEL, TutorAction.ASK)).toBe(true);
  });

  it("silences the tutor during EXPERIMENT and AI_OFF", () => {
    expect(isTutorAllowed(LearningStage.EXPERIMENT)).toBe(false);
    expect(isTutorAllowed(LearningStage.AI_OFF)).toBe(false);
  });

  it("protects answer-revealing stages", () => {
    expect(isRevealProtected(LearningStage.PREDICT)).toBe(true);
    expect(isRevealProtected(LearningStage.MODEL)).toBe(true);
    expect(isRevealProtected(LearningStage.EXPLAIN)).toBe(false);
  });
});
