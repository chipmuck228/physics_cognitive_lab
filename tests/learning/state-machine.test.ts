import { describe, expect, it } from "vitest";

import { canCallTutor } from "@/lib/learning/stage-policy";
import {
  canReachComplete,
  canTransition,
  nextStage,
  previousStage,
} from "@/lib/learning/state-machine";
import { LearningStage } from "@/types/learning";

describe("learning state machine", () => {
  it("allows the expected forward path one stage at a time", () => {
    expect(canTransition(LearningStage.ENTRY, LearningStage.OBSERVE)).toBe(true);
    expect(canTransition(LearningStage.OBSERVE, LearningStage.DESCRIBE)).toBe(true);
    expect(canTransition(LearningStage.AI_OFF, LearningStage.COMPLETE)).toBe(true);
    expect(nextStage(LearningStage.ENTRY)).toBe(LearningStage.OBSERVE);
  });

  it("blocks skipped forward transitions", () => {
    expect(canTransition(LearningStage.ENTRY, LearningStage.DESCRIBE)).toBe(false);
    expect(canTransition(LearningStage.OBSERVE, LearningStage.EXPLAIN)).toBe(false);
    expect(canTransition(LearningStage.EXAM, LearningStage.COMPLETE)).toBe(false);
  });

  it("allows backward navigation to earlier stages", () => {
    expect(canTransition(LearningStage.OBSERVE, LearningStage.ENTRY)).toBe(true);
    expect(canTransition(LearningStage.EXPLAIN, LearningStage.OBSERVE)).toBe(true);
    expect(previousStage(LearningStage.OBSERVE)).toBe(LearningStage.ENTRY);
  });

  it("treats COMPLETE as terminal", () => {
    expect(canTransition(LearningStage.COMPLETE, LearningStage.AI_OFF)).toBe(false);
    expect(canTransition(LearningStage.COMPLETE, LearningStage.ENTRY)).toBe(false);
    expect(nextStage(LearningStage.COMPLETE)).toBeNull();
  });

  it("reaches COMPLETE only from AI_OFF", () => {
    expect(canReachComplete(LearningStage.AI_OFF)).toBe(true);
    expect(canReachComplete(LearningStage.EXAM)).toBe(false);
    expect(canReachComplete(LearningStage.EXPLAIN)).toBe(false);
  });

  it("does not allow the tutor API from AI_OFF or COMPLETE", () => {
    expect(canCallTutor(LearningStage.AI_OFF)).toBe(false);
    expect(canCallTutor(LearningStage.COMPLETE)).toBe(false);
    expect(canCallTutor(LearningStage.ENTRY)).toBe(false);
    expect(canCallTutor(LearningStage.EXPLAIN)).toBe(true);
  });
});
