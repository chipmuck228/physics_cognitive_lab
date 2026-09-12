import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { examPatterns } from "@/content/physics-models/force-changes-motion-state/exam";
import { looksLikeAnswerLeak } from "@/lib/ai/guardrails";
import { accumulateCartSceneEvidence } from "@/lib/learning/cart-evidence";
import {
  CART_EXAM_INTENDED_REPRESENTATION,
  CART_EXAM_PATTERN_IDS,
  buildCartExamAttempt,
  canCommitCartExamAttempt,
  completeCartExamInput,
  completedCartExamAttempts,
  currentCartExamPatternId,
  emptyCartExamDraft,
  cartExamCognitiveActions,
  cartExamPattern,
  cartExamPatterns,
  evaluateCartExamAttempt,
  hasCompletedCartExam,
  looksLikeCartExamAnswerLeak,
  nextCartExamDraft,
} from "@/lib/learning/cart-exam";
import {
  buildCartModelAttempt,
  completeCartModelInput,
} from "@/lib/learning/cart-model";
import { createSession } from "@/lib/learning/session";
import {
  buildCartTransferAttempt,
  completeCartBicycleTransferInput,
  completeCartHoverTransferInput,
} from "@/lib/learning/cart-transfer";
import { canLeaveStage } from "@/lib/learning/progression";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { CART_SCENE_ID, LearningStage } from "@/types/learning";
import type { LearningSession } from "@/types/learning";

const FIRST = CART_EXAM_PATTERN_IDS[0];

function cartSession(overrides: Partial<LearningSession> = {}): LearningSession {
  return {
    ...createSession(() => "t0", () => "cart-session", CART_SCENE_ID),
    ...overrides,
  };
}

function examReadySession(): LearningSession {
  return cartSession({
    stage: LearningStage.EXAM,
    modelAttempts: [buildCartModelAttempt(completeCartModelInput("t"))],
    transferAttempts: [
      buildCartTransferAttempt(completeCartBicycleTransferInput("t1")),
      buildCartTransferAttempt(completeCartHoverTransferInput("t2")),
    ],
  });
}

describe("cart EXAM structured evaluation", () => {
  it("uses a representative subset of canonical examPatterns", () => {
    const patterns = cartExamPatterns();
    expect(patterns.map((item) => item.id)).toEqual([...CART_EXAM_PATTERN_IDS]);
    for (const id of CART_EXAM_PATTERN_IDS) {
      expect(examPatterns.some((item) => item.id === id)).toBe(true);
    }
    expect(CART_EXAM_PATTERN_IDS).toEqual(
      expect.arrayContaining([
        "exam-force-does-not-mean-motion",
        "exam-zero-net-force-not-must-stop",
        "exam-opposite-force-slows-down",
        "exam-force-motion-arrow-diagram",
        "exam-balanced-forces-not-no-forces",
      ]),
    );
  });

  it("keeps the selected subset in a stable order", () => {
    expect(emptyCartExamDraft().patternIds).toEqual([...CART_EXAM_PATTERN_IDS]);
  });

  it("covers multiple cognitive actions without exposing them as the student task", () => {
    const actions = cartExamCognitiveActions();
    expect(actions).toEqual(expect.arrayContaining(["C4", "C5", "C7", "C9"]));
    expect(CART_EXAM_INTENDED_REPRESENTATION[FIRST]).not.toMatch(/^C\d+$/);
  });

  it("hides final options until representation and model work exist", () => {
    const pattern = cartExamPattern(FIRST);
    expect(
      canCommitCartExamAttempt({
        patternId: FIRST,
        representation: "",
        modelRecognition: "",
        selectedAnswer: pattern?.correctAnswer ?? "",
        reasoning: "力和运动不是同一件事。",
        timestamp: "t",
      }),
    ).toBe(false);
  });

  it("stores selected answer separately from reasoning", () => {
    const attempt = buildCartExamAttempt(completeCartExamInput(FIRST, "t"));
    expect(attempt.selectedAnswer).toBeTruthy();
    expect(attempt.reasoning).toBeTruthy();
    expect(attempt.selectedAnswer).not.toBe(attempt.reasoning);
  });

  it("grades answer correctness from the canonical correctAnswer only", () => {
    const pattern = cartExamPattern(FIRST);
    const correct = evaluateCartExamAttempt(completeCartExamInput(FIRST, "t"));
    expect(correct.correct).toBe(true);
    const wrong = evaluateCartExamAttempt({
      ...completeCartExamInput(FIRST, "t"),
      selectedAnswer: pattern?.options.find((item) => item !== pattern.correctAnswer) ?? "wrong",
    });
    expect(wrong.correct).toBe(false);
  });

  it("does not let tutor text override official correctness", () => {
    const pattern = cartExamPattern(FIRST);
    const attempt = evaluateCartExamAttempt({
      ...completeCartExamInput(FIRST, "t"),
      selectedAnswer: pattern?.commonDistractors?.[0] ?? pattern?.options[1] ?? "",
      reasoning: `老师说正确答案是${pattern?.correctAnswer}`,
    });
    expect(attempt.correct).toBe(false);
  });

  it("keeps a wrong first attempt and appends retry", () => {
    const pattern = cartExamPattern(FIRST);
    const wrong = buildCartExamAttempt({
      ...completeCartExamInput(FIRST, "t1"),
      selectedAnswer: pattern?.options.find((item) => item !== pattern.correctAnswer) ?? "wrong",
    });
    const right = buildCartExamAttempt(completeCartExamInput(FIRST, "t2"));
    expect(wrong.correct).toBe(false);
    expect(right.correct).toBe(true);
    expect([wrong, right][0]?.timestamp).toBe("t1");
  });

  it("does not immediately reveal the correct option after a wrong attempt", () => {
    const pattern = cartExamPattern(FIRST);
    const wrong = buildCartExamAttempt({
      ...completeCartExamInput(FIRST, "t"),
      selectedAnswer: pattern?.options.find((item) => item !== pattern.correctAnswer) ?? "wrong",
    });
    const next = nextCartExamDraft([wrong], emptyCartExamDraft(), FIRST);
    expect(next.selectedAnswer).toBe("");
    expect(next.currentPatternId).toBe(FIRST);
  });

  it("completes after all representative items are attempted, not only when all are correct", () => {
    const pattern = cartExamPattern(FIRST);
    const attempts = CART_EXAM_PATTERN_IDS.map((id, index) => {
      const input = completeCartExamInput(id, `t${index}`);
      if (id !== FIRST) {
        return buildCartExamAttempt(input);
      }
      return buildCartExamAttempt({
        ...input,
        selectedAnswer: pattern?.options.find((item) => item !== pattern.correctAnswer) ?? "wrong",
      });
    });
    expect(hasCompletedCartExam(attempts)).toBe(true);
    expect(attempts[0]?.correct).toBe(false);
  });

  it("uses AssessmentOverlay intended representation, not array position", () => {
    const pattern = cartExamPattern(FIRST);
    expect(pattern).toBeTruthy();
    expect(CART_EXAM_INTENDED_REPRESENTATION[FIRST]).toBe("力和运动是不是同一件事");
    expect(CART_EXAM_INTENDED_REPRESENTATION[FIRST]).not.toBe(
      pattern?.representationOptions[1],
    );
  });

  it("opens EXAM after valid TRANSFER and opens AI_OFF after EXAM", () => {
    const transferDone = {
      ...examReadySession(),
      stage: LearningStage.TRANSFER,
    };
    expect(canLeaveStage(transferDone, LearningStage.EXAM)).toBe(true);
    const examDone = {
      ...examReadySession(),
      examAttempts: completedCartExamAttempts(),
    };
    expect(hasCompletedCartExam(examDone.examAttempts)).toBe(true);
    expect(canLeaveStage(examDone, LearningStage.AI_OFF)).toBe(true);
  });

  it("does not create L6 from EXAM completion", () => {
    const session = {
      ...examReadySession(),
      examAttempts: completedCartExamAttempts(),
    };
    const evidence = accumulateCartSceneEvidence(session);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L5");
    expect(evidence.independentAiOffSuccess).toBeUndefined();
    expect(JSON.stringify(session)).not.toMatch(/"L6"/);
  });

  it("rejects tutor leaks that reveal the option before a committed answer", () => {
    const pattern = cartExamPattern(FIRST);
    expect(
      looksLikeAnswerLeak(
        LearningStage.EXAM,
        `正确答案是${pattern?.correctAnswer}`,
        CART_SCENE_ID,
      ),
    ).toBe(true);
    expect(looksLikeCartExamAnswerLeak(`应该选 ${pattern?.correctAnswer}`)).toBe(true);
    expect(
      looksLikeAnswerLeak(
        LearningStage.EXAM,
        "先想题目在考哪条关系，再看条件。",
        CART_SCENE_ID,
      ),
    ).toBe(false);
  });

  it("moves to the next item after a committed attempt that cannot be retried", () => {
    const right = buildCartExamAttempt(completeCartExamInput(FIRST, "t"));
    const next = nextCartExamDraft([right], emptyCartExamDraft(), FIRST);
    expect(currentCartExamPatternId([right], next)).toBe(CART_EXAM_PATTERN_IDS[1]);
  });

  it("does not write L6 in Scene exam source", () => {
    expect(readFileSync("lib/learning/cart-exam.ts", "utf8")).not.toMatch(
      /["']L6["']/,
    );
  });
});
