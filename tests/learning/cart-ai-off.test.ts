import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { independentChallenges } from "@/content/physics-models/force-changes-motion-state/independent-challenges";
import { accumulateCartSceneEvidence } from "@/lib/learning/cart-evidence";
import {
  CART_AI_OFF_CHALLENGE_IDS,
  applyCartAiOffPostCheck,
  buildCartAiOffAttempt,
  buildCartAiOffAssessment,
  cartAiOffChallenge,
  cartAiOffChallenges,
  completeCartAiOffAttempt,
  completeCartAiOffInput,
  evaluateCartAiOffAttempt,
  hasAcceptedCartAiOffChallenges,
  hasCompletedCartAiOff,
  hasMeaningfulCartIndependentReasoning,
  intendedCartAiOffAnswerId,
  intendedCartAiOffPostCheckIds,
} from "@/lib/learning/cart-ai-off";
import { completedCartExamAttempts } from "@/lib/learning/cart-exam";
import {
  buildCartModelAttempt,
  completeCartModelInput,
} from "@/lib/learning/cart-model";
import { createLearningEvent } from "@/lib/learning/events";
import { createSession } from "@/lib/learning/session";
import {
  buildCartTransferAttempt,
  completeCartBicycleTransferInput,
  completeCartHoverTransferInput,
} from "@/lib/learning/cart-transfer";
import { canLeaveStage } from "@/lib/learning/progression";
import { canTransition, nextStage } from "@/lib/learning/state-machine";
import { isTutorHardBlocked } from "@/lib/learning/stage-policy";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { CART_SCENE_ID, LearningStage } from "@/types/learning";
import type { LearningSession } from "@/types/learning";

const HOVER = CART_AI_OFF_CHALLENGE_IDS[0];
const CRATE = CART_AI_OFF_CHALLENGE_IDS[1];

function cartSession(overrides: Partial<LearningSession> = {}): LearningSession {
  return {
    ...createSession(() => "t0", () => "cart-session", CART_SCENE_ID),
    ...overrides,
  };
}

function l5Session(overrides: Partial<LearningSession> = {}): LearningSession {
  return cartSession({
    stage: LearningStage.AI_OFF,
    modelAttempts: [buildCartModelAttempt(completeCartModelInput("t"))],
    transferAttempts: [
      buildCartTransferAttempt(completeCartBicycleTransferInput("t1")),
      buildCartTransferAttempt(completeCartHoverTransferInput("t2")),
    ],
    examAttempts: completedCartExamAttempts(),
    ...overrides,
  });
}

describe("Scene 03 AI_OFF evaluation", () => {
  it("loads both challenges from the canonical Physics Model", () => {
    expect(cartAiOffChallenges().map((item) => item.id)).toEqual([
      ...CART_AI_OFF_CHALLENGE_IDS,
    ]);
    expect(independentChallenges.map((item) => item.id)).toEqual([
      ...CART_AI_OFF_CHALLENGE_IDS,
    ]);
    expect(cartAiOffChallenge(HOVER).llmAllowed).toBe(false);
    expect(cartAiOffChallenge(CRATE).llmAllowed).toBe(false);
  });

  it("does not treat short or empty reasoning as independent evidence", () => {
    expect(hasMeaningfulCartIndependentReasoning("")).toBe(false);
    expect(hasMeaningfulCartIndependentReasoning("因为")).toBe(false);
    expect(
      hasMeaningfulCartIndependentReasoning(
        "滑板原来已经在向右运动，这时水平合力可以看成零。",
      ),
    ).toBe(true);
  });

  it("cannot pass on a correct answer alone", () => {
    const result = evaluateCartAiOffAttempt({
      challengeId: HOVER,
      selectedAnswer: intendedCartAiOffAnswerId(HOVER),
      studentReasoning: "",
      postCheckIds: [],
      llmUsed: false,
    });
    expect(result.answerCorrect).toBe(true);
    expect(result.accepted).toBe(false);
  });

  it("accepts valid independent reasoning for the hover sled", () => {
    const input = completeCartAiOffInput(HOVER, "t");
    const result = evaluateCartAiOffAttempt({
      ...input,
      llmUsed: false,
    });
    expect(result.accepted).toBe(true);
  });

  it("rejects misconception-containing reasoning", () => {
    const result = evaluateCartAiOffAttempt({
      challengeId: HOVER,
      selectedAnswer: intendedCartAiOffAnswerId(HOVER),
      studentReasoning: "合力为零就一定静止，没有向前的力就会停下。",
      postCheckIds: intendedCartAiOffPostCheckIds(HOVER),
      llmUsed: false,
    });
    expect(result.accepted).toBe(false);
    expect(result.reasoningSignals.avoidsForceMotionMisconception).toBe(false);
  });

  it("rejects surface-only wheels reasoning", () => {
    const result = evaluateCartAiOffAttempt({
      challengeId: HOVER,
      selectedAnswer: intendedCartAiOffAnswerId(HOVER),
      studentReasoning: "因为它没有轮子，所以和课堂上不是一回事。",
      postCheckIds: intendedCartAiOffPostCheckIds(HOVER),
      llmUsed: false,
    });
    expect(result.accepted).toBe(false);
  });

  it("accepts balanced-force condition reasoning for the crate", () => {
    const input = completeCartAiOffInput(CRATE, "t");
    expect(
      evaluateCartAiOffAttempt({
        ...input,
        llmUsed: false,
      }).accepted,
    ).toBe(true);
  });

  it("rejects treating balanced forces as no forces", () => {
    const result = evaluateCartAiOffAttempt({
      challengeId: CRATE,
      selectedAnswer: intendedCartAiOffAnswerId(CRATE),
      studentReasoning: "平衡力就是没有力，所以木箱一定静止。",
      postCheckIds: intendedCartAiOffPostCheckIds(CRATE),
      llmUsed: false,
    });
    expect(result.accepted).toBe(false);
  });

  it("keeps the original committed response when a post-check is attached", () => {
    const input = completeCartAiOffInput(HOVER, "t");
    const first = buildCartAiOffAttempt(input, [], false);
    const updated = applyCartAiOffPostCheck(first, input.postCheckIds, false);
    expect(updated.selectedAnswer).toBe(first.selectedAnswer);
    expect(updated.studentReasoning).toBe(first.studentReasoning);
    expect(updated.accepted).toBe(true);
  });

  it("retains the original attempt after a later retry", () => {
    const failed = buildCartAiOffAttempt(
      {
        challengeId: HOVER,
        selectedAnswer: "must-stop",
        studentReasoning: "没有向前的力就会停下。",
        timestamp: "t1",
      },
      [],
      false,
    );
    const passed = completeCartAiOffAttempt(HOVER, "t2");
    expect(failed.accepted).toBe(false);
    expect([failed, passed][0]?.timestamp).toBe("t1");
    expect(passed.studentReasoning).not.toBe(failed.studentReasoning);
  });

  it("blocks independent success when llmUsed is not false", () => {
    const input = completeCartAiOffInput(HOVER, "t");
    expect(
      evaluateCartAiOffAttempt({
        ...input,
        llmUsed: true,
      }).accepted,
    ).toBe(false);
  });

  it("requires both challenges", () => {
    const assessment = buildCartAiOffAssessment(
      [completeCartAiOffAttempt(HOVER, "t")],
      false,
    );
    expect(hasAcceptedCartAiOffChallenges(assessment)).toBe(false);
  });

  it("does not derive L6 from EXAM completion alone", () => {
    const session = l5Session({
      stage: LearningStage.EXAM,
      independentAssessment: undefined,
    });
    expect(deriveModelEvidenceLevel(accumulateCartSceneEvidence(session))).toBe("L5");
  });

  it("does not derive L6 from AI_OFF answer correctness alone", () => {
    const session = l5Session({
      independentAssessment: buildCartAiOffAssessment(
        [
          buildCartAiOffAttempt(completeCartAiOffInput(HOVER, "t1"), [], false),
          buildCartAiOffAttempt(completeCartAiOffInput(CRATE, "t2"), [], false),
        ],
        false,
      ),
    });
    const evidence = accumulateCartSceneEvidence(session);
    expect(evidence.independentAiOffSuccess).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).toBe("L5");
  });

  it("may derive L6 from valid prior L5 plus accepted AI_OFF evidence", () => {
    const session = l5Session({
      independentAssessment: buildCartAiOffAssessment(
        [
          completeCartAiOffAttempt(HOVER, "t1"),
          completeCartAiOffAttempt(CRATE, "t2"),
        ],
        false,
      ),
    });
    expect(hasCompletedCartAiOff(session)).toBe(true);
    const evidence = accumulateCartSceneEvidence(session);
    expect(evidence.independentAiOffSuccess).toBe(true);
    expect(evidence.llmDisabledDuringIndependent).toBe(true);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L6");
    expect(JSON.stringify(session)).not.toMatch(/"L6"/);
  });

  it("never writes L6 in Scene AI_OFF or evidence accumulation source", () => {
    expect(readFileSync("lib/learning/cart-ai-off.ts", "utf8")).not.toMatch(
      /["']L6["']/,
    );
    expect(readFileSync("lib/learning/cart-evidence.ts", "utf8")).not.toMatch(
      /["']L6["']/,
    );
  });

  it("opens AI_OFF after EXAM and waits for independent evidence before COMPLETE", () => {
    const examDone = l5Session({
      stage: LearningStage.EXAM,
      independentAssessment: undefined,
    });
    expect(canLeaveStage(examDone, LearningStage.AI_OFF)).toBe(true);
    const aiOff = l5Session();
    expect(canLeaveStage(aiOff, LearningStage.COMPLETE)).toBe(false);
    const ready = l5Session({
      independentAssessment: buildCartAiOffAssessment(
        [
          completeCartAiOffAttempt(HOVER, "t1"),
          completeCartAiOffAttempt(CRATE, "t2"),
        ],
        false,
      ),
    });
    expect(canLeaveStage(ready, LearningStage.COMPLETE)).toBe(true);
  });

  it("treats tutor events during AI_OFF as independent-success blockers", () => {
    const session = l5Session({
      independentAssessment: buildCartAiOffAssessment(
        [
          completeCartAiOffAttempt(HOVER, "t1"),
          completeCartAiOffAttempt(CRATE, "t2"),
        ],
        false,
      ),
      events: [
        createLearningEvent("ai_interaction", LearningStage.AI_OFF, {
          source: "tutor",
        }),
      ],
    });
    expect(hasCompletedCartAiOff(session)).toBe(false);
    expect(accumulateCartSceneEvidence(session).independentAiOffSuccess).toBeUndefined();
  });

  it("makes COMPLETE terminal with no tutor", () => {
    expect(nextStage(LearningStage.COMPLETE)).toBeNull();
    expect(canTransition(LearningStage.COMPLETE, LearningStage.AI_OFF)).toBe(false);
    expect(isTutorHardBlocked(LearningStage.AI_OFF)).toBe(true);
    expect(isTutorHardBlocked(LearningStage.COMPLETE)).toBe(true);
  });
});
