import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { examPatterns } from "@/content/physics-models/density-mass-volume/exam";
import { looksLikeAnswerLeak } from "@/lib/ai/guardrails";
import { accumulateSamplesSceneEvidence } from "@/lib/learning/samples-evidence";
import {
  SAMPLES_EXAM_INTENDED_REPRESENTATION,
  SAMPLES_EXAM_PATTERN_IDS,
  buildSamplesExamAttempt,
  canCommitSamplesExamAttempt,
  completeSamplesExamInput,
  completedSamplesExamAttempts,
  currentSamplesExamPatternId,
  emptySamplesExamDraft,
  evaluateSamplesExamAttempt,
  hasCompletedSamplesExam,
  intendedSamplesExamModel,
  looksLikeSamplesExamAnswerLeak,
  nextSamplesExamDraft,
  samplesExamAnswerOptionsVisible,
  samplesExamPattern,
  samplesExamPatterns,
} from "@/lib/learning/samples-exam";
import {
  buildSamplesModelAttempt,
  completeSamplesModelInput,
} from "@/lib/learning/samples-model";
import { createSession } from "@/lib/learning/session";
import {
  buildSamplesTransferAttempt,
  completeSamplesCupsTransferInput,
  completeSamplesHollowTransferInput,
} from "@/lib/learning/samples-transfer";
import { canLeaveStage } from "@/lib/learning/progression";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { LearningStage, SAMPLES_SCENE_ID } from "@/types/learning";
import type { LearningSession } from "@/types/learning";

const FIRST = SAMPLES_EXAM_PATTERN_IDS[0];

function samplesSession(overrides: Partial<LearningSession> = {}): LearningSession {
  return {
    ...createSession(() => "t0", () => "samples-session", SAMPLES_SCENE_ID),
    ...overrides,
  };
}

function examReadySession(): LearningSession {
  return samplesSession({
    stage: LearningStage.EXAM,
    modelAttempts: [buildSamplesModelAttempt(completeSamplesModelInput("t"))],
    transferAttempts: [
      buildSamplesTransferAttempt(completeSamplesCupsTransferInput("t1")),
      buildSamplesTransferAttempt(completeSamplesHollowTransferInput("t2")),
    ],
  });
}

describe("samples EXAM structured evaluation", () => {
  it("uses the canonical examPatterns required by the overlay", () => {
    const patterns = samplesExamPatterns();
    expect(patterns.map((item) => item.id)).toEqual([...SAMPLES_EXAM_PATTERN_IDS]);
    for (const id of SAMPLES_EXAM_PATTERN_IDS) {
      expect(examPatterns.some((item) => item.id === id)).toBe(true);
    }
  });

  it("keeps the selected subset in a stable order", () => {
    expect(emptySamplesExamDraft().patternIds).toEqual([...SAMPLES_EXAM_PATTERN_IDS]);
  });

  it("covers multiple cognitive actions without exposing them as the student task", () => {
    const actions = [
      ...new Set(
        samplesExamPatterns().flatMap((pattern) => pattern.requiredCognitiveActions),
      ),
    ];
    expect(actions).toEqual(expect.arrayContaining(["C3", "C4", "C9"]));
    expect(SAMPLES_EXAM_INTENDED_REPRESENTATION[FIRST]).not.toMatch(/^C\d+$/);
  });

  it("hides final options until representation and model work exist", () => {
    const pattern = samplesExamPattern(FIRST);
    expect(samplesExamAnswerOptionsVisible("representation")).toBe(false);
    expect(samplesExamAnswerOptionsVisible("model")).toBe(false);
    expect(samplesExamAnswerOptionsVisible("answer")).toBe(true);
    expect(
      canCommitSamplesExamAttempt({
        patternId: FIRST,
        representation: "",
        modelRecognition: "",
        selectedAnswer: pattern?.correctAnswer ?? "",
        reasoning: "密度不是更重也不是更大。",
        timestamp: "t",
      }),
    ).toBe(false);
  });

  it("stores selected answer separately from reasoning", () => {
    const attempt = buildSamplesExamAttempt(completeSamplesExamInput(FIRST, "t"));
    expect(attempt.selectedAnswer).toBeTruthy();
    expect(attempt.reasoning).toBeTruthy();
    expect(attempt.selectedAnswer).not.toBe(attempt.reasoning);
  });

  it("grades answer correctness from the canonical correctAnswer only", () => {
    const pattern = samplesExamPattern(FIRST);
    const correct = evaluateSamplesExamAttempt(completeSamplesExamInput(FIRST, "t"));
    expect(correct.correct).toBe(true);
    const wrong = evaluateSamplesExamAttempt({
      ...completeSamplesExamInput(FIRST, "t"),
      selectedAnswer:
        pattern?.options.find((item) => item !== pattern.correctAnswer) ?? "wrong",
    });
    expect(wrong.correct).toBe(false);
  });

  it("does not let tutor text override official correctness", () => {
    const pattern = samplesExamPattern(FIRST);
    const attempt = evaluateSamplesExamAttempt({
      ...completeSamplesExamInput(FIRST, "t"),
      selectedAnswer: pattern?.commonDistractors?.[0] ?? pattern?.options[1] ?? "",
      reasoning: `老师说正确答案是${pattern?.correctAnswer}`,
    });
    expect(attempt.correct).toBe(false);
  });

  it("keeps a wrong first attempt and appends retry", () => {
    const pattern = samplesExamPattern(FIRST);
    const wrong = buildSamplesExamAttempt({
      ...completeSamplesExamInput(FIRST, "t1"),
      selectedAnswer:
        pattern?.options.find((item) => item !== pattern.correctAnswer) ?? "wrong",
    });
    const right = buildSamplesExamAttempt(completeSamplesExamInput(FIRST, "t2"));
    expect(wrong.correct).toBe(false);
    expect(right.correct).toBe(true);
    expect([wrong, right][0]?.timestamp).toBe("t1");
  });

  it("does not immediately reveal the correct option after a wrong attempt", () => {
    const pattern = samplesExamPattern(FIRST);
    const wrong = buildSamplesExamAttempt({
      ...completeSamplesExamInput(FIRST, "t"),
      selectedAnswer:
        pattern?.options.find((item) => item !== pattern.correctAnswer) ?? "wrong",
    });
    const next = nextSamplesExamDraft([wrong], emptySamplesExamDraft(), FIRST);
    expect(next.selectedAnswer).toBe("");
    expect(next.currentPatternId).toBe(FIRST);
  });

  it("completes after all representative items are attempted, not only when all are correct", () => {
    const pattern = samplesExamPattern(FIRST);
    const attempts = SAMPLES_EXAM_PATTERN_IDS.map((id, index) => {
      const input = completeSamplesExamInput(id, `t${index}`);
      if (id !== FIRST) {
        return buildSamplesExamAttempt(input);
      }
      return buildSamplesExamAttempt({
        ...input,
        selectedAnswer:
          pattern?.options.find((item) => item !== pattern.correctAnswer) ?? "wrong",
      });
    });
    expect(hasCompletedSamplesExam(attempts)).toBe(true);
    expect(attempts[0]?.correct).toBe(false);
  });

  it("uses AssessmentOverlay intended representation, not array position", () => {
    const pattern = samplesExamPattern(FIRST);
    expect(pattern).toBeTruthy();
    expect(SAMPLES_EXAM_INTENDED_REPRESENTATION[FIRST]).toBe(
      "密度、质量和体积是不是同一件事",
    );
    expect(SAMPLES_EXAM_INTENDED_REPRESENTATION[FIRST]).toBe(
      intendedSamplesExamModel(pattern!) &&
        SAMPLES_EXAM_INTENDED_REPRESENTATION[FIRST],
    );
    expect(SAMPLES_EXAM_INTENDED_REPRESENTATION[FIRST]).not.toBe(
      pattern?.representationOptions[1],
    );
    expect(intendedSamplesExamModel(pattern!)).not.toBe(pattern?.modelOptions[1]);
  });

  it("opens EXAM after valid TRANSFER and opens AI_OFF after EXAM", () => {
    const transferDone = {
      ...examReadySession(),
      stage: LearningStage.TRANSFER,
    };
    expect(canLeaveStage(transferDone, LearningStage.EXAM)).toBe(true);
    const examDone = {
      ...examReadySession(),
      examAttempts: completedSamplesExamAttempts(),
    };
    expect(hasCompletedSamplesExam(examDone.examAttempts)).toBe(true);
    expect(canLeaveStage(examDone, LearningStage.AI_OFF)).toBe(true);
  });

  it("does not create L6 from EXAM completion", () => {
    const session = {
      ...examReadySession(),
      examAttempts: completedSamplesExamAttempts(),
    };
    const evidence = accumulateSamplesSceneEvidence(session);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L5");
    expect(evidence.independentAiOffSuccess).toBeUndefined();
    expect(JSON.stringify(session)).not.toMatch(/"L6"/);
  });

  it("rejects tutor leaks that reveal the option before a committed answer", () => {
    const pattern = samplesExamPattern(FIRST);
    expect(
      looksLikeAnswerLeak(
        LearningStage.EXAM,
        `正确答案是${pattern?.correctAnswer}`,
        SAMPLES_SCENE_ID,
      ),
    ).toBe(true);
    expect(looksLikeSamplesExamAnswerLeak(`应该选 ${pattern?.correctAnswer}`)).toBe(
      true,
    );
    expect(
      looksLikeAnswerLeak(
        LearningStage.EXAM,
        "先想题目在考哪条关系，再看条件。",
        SAMPLES_SCENE_ID,
      ),
    ).toBe(false);
  });

  it("moves to the next item after a committed attempt that cannot be retried", () => {
    const right = buildSamplesExamAttempt(completeSamplesExamInput(FIRST, "t"));
    const next = nextSamplesExamDraft([right], emptySamplesExamDraft(), FIRST);
    expect(currentSamplesExamPatternId([right], next)).toBe(
      SAMPLES_EXAM_PATTERN_IDS[1],
    );
  });

  it("does not write L6 in Scene exam source", () => {
    expect(readFileSync("lib/learning/samples-exam.ts", "utf8")).not.toMatch(
      /["']L6["']/,
    );
  });
});
