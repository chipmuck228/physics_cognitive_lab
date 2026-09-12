import { describe, expect, it } from "vitest";

import {
  canCallTutor,
  isActionAllowed,
  isRevealProtected,
  isTutorAllowed,
  isTutorHardBlocked,
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
    expect(canCallTutor(LearningStage.EXPERIMENT)).toBe(false);
    expect(isTutorAllowed(LearningStage.AI_OFF)).toBe(false);
    expect(canCallTutor(LearningStage.AI_OFF)).toBe(false);
    expect(isTutorHardBlocked(LearningStage.AI_OFF)).toBe(true);
    expect(isTutorHardBlocked(LearningStage.COMPLETE)).toBe(true);
    expect(isTutorHardBlocked(LearningStage.EXPLAIN)).toBe(false);
  });

  it("protects answer-revealing stages", () => {
    expect(isRevealProtected(LearningStage.PREDICT)).toBe(true);
    expect(isRevealProtected(LearningStage.MODEL)).toBe(true);
    expect(isRevealProtected(LearningStage.EXPLAIN)).toBe(true);
  });
});
