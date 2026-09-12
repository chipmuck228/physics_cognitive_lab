import { describe, expect, it } from "vitest";

import { examPatterns } from "@/content/physics-models/specific-heat-capacity/exam";
import { accumulateHeatSceneEvidence } from "@/lib/learning/heat-evidence";
import {
  HEAT_EXAM_PATTERN_IDS,
  buildHeatExamAttempt,
  canCommitHeatExamAttempt,
  completeHeatExamInput,
  completedHeatExamAttempts,
  emptyHeatExamDraft,
  evaluateHeatExamAttempt,
  hasCompletedHeatExam,
  heatExamAnswerOptionsVisible,
  heatExamPatterns,
  intendedHeatExamModel,
  intendedHeatExamRepresentation,
  looksLikeHeatExamAnswerLeak,
} from "@/lib/learning/heat-exam";
import {
  buildHeatModelAttempt,
  completeHeatModelInput,
} from "@/lib/learning/heat-model";
import {
  buildHeatTransferAttempt,
  completeHeatIceTransferInput,
  completeHeatPotsTransferInput,
} from "@/lib/learning/heat-transfer";
import { createSession } from "@/lib/learning/session";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { HEAT_SAMPLES_SCENE_ID, LearningStage } from "@/types/learning";

describe("heat EXAM structured evaluation", () => {
  it("uses the canonical examPatterns required by the overlay", () => {
    const patterns = heatExamPatterns();
    expect(patterns.map((item) => item.id)).toEqual([...HEAT_EXAM_PATTERN_IDS]);
    for (const id of HEAT_EXAM_PATTERN_IDS) {
      expect(examPatterns.some((item) => item.id === id)).toBe(true);
    }
  });

  it("hides final options until the answer step", () => {
    expect(heatExamAnswerOptionsVisible("representation")).toBe(false);
    expect(heatExamAnswerOptionsVisible("model")).toBe(false);
    expect(heatExamAnswerOptionsVisible("answer")).toBe(true);
  });

  it("stores answer and reasoning separately and does not create L6", () => {
    const pattern = heatExamPatterns()[0]!;
    const input = completeHeatExamInput(pattern.id, "t");
    expect(canCommitHeatExamAttempt(input)).toBe(true);
    const attempt = buildHeatExamAttempt(input);
    expect(attempt.selectedAnswer).toBe(pattern.correctAnswer);
    expect(attempt.reasoning).not.toBe(attempt.selectedAnswer);
    expect(attempt.representationMatchesIntended).toBe(true);
    expect(attempt.modelMatchesIntended).toBe(true);
    expect(evaluateHeatExamAttempt(input).correct).toBe(true);
    expect(intendedHeatExamRepresentation(pattern).length).toBeGreaterThan(0);
    expect(intendedHeatExamModel(pattern).length).toBeGreaterThan(0);

    const session = {
      ...createSession(() => "t0", () => "heat-exam", HEAT_SAMPLES_SCENE_ID),
      stage: LearningStage.EXAM,
      modelAttempts: [buildHeatModelAttempt(completeHeatModelInput("t"))],
      transferAttempts: [
        buildHeatTransferAttempt(completeHeatPotsTransferInput("t1")),
        buildHeatTransferAttempt(completeHeatIceTransferInput("t2")),
      ],
      examAttempts: completedHeatExamAttempts(),
    };
    expect(hasCompletedHeatExam(session.examAttempts)).toBe(true);
    expect(emptyHeatExamDraft().patternIds).toEqual([...HEAT_EXAM_PATTERN_IDS]);
    expect(deriveModelEvidenceLevel(accumulateHeatSceneEvidence(session))).toBe("L5");
    expect(looksLikeHeatExamAnswerLeak(`正确答案是${pattern.correctAnswer}`)).toBe(
      true,
    );
  });
});
