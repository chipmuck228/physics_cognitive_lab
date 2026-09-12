import { describe, expect, it } from "vitest";

import { MODEL_RELATION_IDS } from "@/content/physics-models/force-changes-motion-state/model";
import {
  applyCartAiOffPostCheck,
  buildCartAiOffAssessment,
  buildCartAiOffAttempt,
  completeCartAiOffAttempt,
  completeCartAiOffInput,
  evaluateCartAiOffAttempt,
  intendedCartAiOffAnswerId,
  intendedCartAiOffPostCheckIds,
} from "@/lib/learning/cart-ai-off";
import { accumulateCartSceneEvidence } from "@/lib/learning/cart-evidence";
import {
  buildCartModelAttempt,
  completeCartModelInput,
} from "@/lib/learning/cart-model";
import {
  CART_TRANSFER_TARGET_IDS,
  buildCartTransferAttempt,
  completeCartBallTransferInput,
  completeCartBicycleTransferInput,
  completeCartHoverTransferInput,
  emptyCartTransferJudgments,
  evaluateCartTransfer,
} from "@/lib/learning/cart-transfer";
import { createSession } from "@/lib/learning/session";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { CART_SCENE_ID, LearningStage } from "@/types/learning";

const CORE = MODEL_RELATION_IDS.netForceChangesMotionState;
const SAME = MODEL_RELATION_IDS.sameDirectionIncreasesSpeed;
const OPPOSITE = MODEL_RELATION_IDS.oppositeDirectionDecreasesSpeed;
const ZERO = MODEL_RELATION_IDS.zeroNetForceLeavesMotionUnchanged;
const HOVER = "ai-off-unfamiliar-hover-sled";
const CRATE = "ai-off-condition-tug-moving-crate";

function bicycle(explanation: string, extra?: Partial<Parameters<typeof evaluateCartTransfer>[0]>) {
  return evaluateCartTransfer({
    targetId: CART_TRANSFER_TARGET_IDS.bicycle,
    judgments: {
      ...emptyCartTransferJudgments(),
      [CORE]: "applies",
      [SAME]: "applies",
    },
    surfaceCueSelected: false,
    studentExplanation: explanation,
    timestamp: "t",
    ...extra,
  });
}

describe("Scene 03 Gate B evidence repair", () => {
  describe("TRANSFER full-model target-specific evidence", () => {
    it("rejects 合力 alone", () => {
      const result = bicycle("合力");
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("generic-boundary-talk");
    });

    it("rejects a noun sandwich", () => {
      const result = bicycle("合力运动速度方向");
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("keyword-sandwich");
    });

    it("rejects 好好", () => {
      expect(bicycle("好好").accepted).toBe(false);
    });

    it("rejects 情况不一样", () => {
      expect(bicycle("情况不一样").accepted).toBe(false);
    });

    it("rejects a correct relation for the wrong target", () => {
      const result = evaluateCartTransfer({
        targetId: CART_TRANSFER_TARGET_IDS.bicycle,
        judgments: {
          ...emptyCartTransferJudgments(),
          [OPPOSITE]: "applies",
        },
        surfaceCueSelected: false,
        studentExplanation: "球原来在动，迎面的力顶着运动方向，所以会减慢。",
        timestamp: "t",
      });
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("wrong-target-relation");
    });

    it("rejects surface similarity alone", () => {
      const result = evaluateCartTransfer({
        targetId: CART_TRANSFER_TARGET_IDS.bicycle,
        judgments: emptyCartTransferJudgments(),
        surfaceCueSelected: true,
        studentExplanation: "都有轮子，所以和刚才的小车是一回事。",
        timestamp: "t",
      });
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("surface-similarity-only");
    });

    it("rejects 有力就一定运动", () => {
      const result = evaluateCartTransfer({
        ...completeCartBicycleTransferInput("t"),
        studentExplanation: "有力就一定运动。",
      });
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("force-motion-conflation");
    });

    it("rejects 没力就停", () => {
      const result = evaluateCartTransfer({
        ...completeCartHoverTransferInput("t"),
        studentExplanation: "没力就停。",
      });
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("zero-net-force-misread");
    });

    it("rejects 合力为零就一定静止", () => {
      const result = evaluateCartTransfer({
        ...completeCartHoverTransferInput("t"),
        studentExplanation: "合力为零就一定静止。",
      });
      expect(result.accepted).toBe(false);
    });

    it("accepts the valid same-direction bicycle case", () => {
      const result = evaluateCartTransfer(completeCartBicycleTransferInput("t"));
      expect(result.accepted).toBe(true);
      expect(result.failureKinds).toEqual([]);
    });

    it("accepts the valid opposite-direction ball case", () => {
      const result = evaluateCartTransfer(completeCartBallTransferInput("t"));
      expect(result.accepted).toBe(true);
      expect(result.failureKinds).toEqual([]);
    });
  });

  describe("TRANSFER hover boundary", () => {
    it("rejects generic hover text", () => {
      const result = evaluateCartTransfer({
        ...completeCartHoverTransferInput("t"),
        studentExplanation: "情况不一样",
      });
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("generic-boundary-talk");
    });

    it("rejects hover condition without consequence", () => {
      const result = evaluateCartTransfer({
        ...completeCartHoverTransferInput("t"),
        studentExplanation: "这时水平合力接近零。",
      });
      expect(result.accepted).toBe(false);
      expect(result.failureKinds).toContain("missing-authored-consequence");
    });

    it("accepts hover condition plus unchanged-while-moving consequence", () => {
      const result = evaluateCartTransfer(completeCartHoverTransferInput("t"));
      expect(result.accepted).toBe(true);
      expect(result.failureKinds).toEqual([]);
    });
  });

  describe("AI_OFF provenance", () => {
    const hoverChecks = intendedCartAiOffPostCheckIds(HOVER);
    const crateChecks = intendedCartAiOffPostCheckIds(CRATE);

    it("rejects generic hover text plus correct post-checks", () => {
      const result = evaluateCartAiOffAttempt({
        challengeId: HOVER,
        selectedAnswer: intendedCartAiOffAnswerId(HOVER),
        studentReasoning: "我觉得这样不太对吧。",
        postCheckIds: hoverChecks,
        llmUsed: false,
      });
      expect(result.accepted).toBe(false);
      expect(result.reasoningSignals.preCommitCurrentMotionState).toBe(false);
      expect(result.reasoningSignals.identifiesCurrentMotionState).toBe(false);
      expect(result.reasoningSignals.postCheckCurrentMotionState).toBe(true);
    });

    it("rejects generic crate text plus correct post-checks", () => {
      const result = evaluateCartAiOffAttempt({
        challengeId: CRATE,
        selectedAnswer: intendedCartAiOffAnswerId(CRATE),
        studentReasoning: "装置看起来和平时不太一样。",
        postCheckIds: crateChecks,
        llmUsed: false,
      });
      expect(result.accepted).toBe(false);
      expect(result.reasoningSignals.identifiesConditionOrBoundary).toBe(false);
      expect(result.reasoningSignals.postCheckConditionOrBoundary).toBe(true);
    });

    it("rejects generic 8 Han plus correct post-checks", () => {
      const result = evaluateCartAiOffAttempt({
        challengeId: HOVER,
        selectedAnswer: intendedCartAiOffAnswerId(HOVER),
        studentReasoning: "我觉得这样不太对吧。",
        postCheckIds: hoverChecks,
        llmUsed: false,
      });
      expect(result.accepted).toBe(false);
    });

    it("rejects a noun sandwich plus post-checks", () => {
      const result = evaluateCartAiOffAttempt({
        challengeId: HOVER,
        selectedAnswer: intendedCartAiOffAnswerId(HOVER),
        studentReasoning: "合力运动速度方向都有。",
        postCheckIds: hoverChecks,
        llmUsed: false,
      });
      expect(result.accepted).toBe(false);
    });

    it("rejects answer-only", () => {
      const result = evaluateCartAiOffAttempt({
        challengeId: HOVER,
        selectedAnswer: intendedCartAiOffAnswerId(HOVER),
        studentReasoning: "",
        postCheckIds: hoverChecks,
        llmUsed: false,
      });
      expect(result.accepted).toBe(false);
      expect(result.reasoningSignals.hasOwnWords).toBe(false);
    });

    it("rejects post-check-only current-motion evidence", () => {
      const result = evaluateCartAiOffAttempt({
        challengeId: HOVER,
        selectedAnswer: intendedCartAiOffAnswerId(HOVER),
        studentReasoning: "我觉得这样不太对吧。",
        postCheckIds: hoverChecks,
        llmUsed: false,
      });
      expect(result.reasoningSignals.postCheckCurrentMotionState).toBe(true);
      expect(result.reasoningSignals.identifiesCurrentMotionState).toBe(false);
      expect(result.accepted).toBe(false);
    });

    it("rejects post-check-only net-force evidence", () => {
      const result = evaluateCartAiOffAttempt({
        challengeId: HOVER,
        selectedAnswer: intendedCartAiOffAnswerId(HOVER),
        studentReasoning: "我觉得这样不太对吧。",
        postCheckIds: hoverChecks,
        llmUsed: false,
      });
      expect(result.reasoningSignals.postCheckNetForceCondition).toBe(true);
      expect(result.reasoningSignals.identifiesNetForceCondition).toBe(false);
      expect(result.accepted).toBe(false);
    });

    it("rejects post-check-only boundary evidence", () => {
      const result = evaluateCartAiOffAttempt({
        challengeId: CRATE,
        selectedAnswer: intendedCartAiOffAnswerId(CRATE),
        studentReasoning: "装置看起来和平时不太一样。",
        postCheckIds: crateChecks,
        llmUsed: false,
      });
      expect(result.reasoningSignals.postCheckConditionOrBoundary).toBe(true);
      expect(result.reasoningSignals.identifiesConditionOrBoundary).toBe(false);
      expect(result.accepted).toBe(false);
    });

    it("does not let post-checks manufacture missing pre-commit reasoning", () => {
      const committed = buildCartAiOffAttempt(
        {
          challengeId: HOVER,
          selectedAnswer: intendedCartAiOffAnswerId(HOVER),
          studentReasoning: "我觉得这样不太对吧。",
          timestamp: "t",
        },
        [],
        false,
      );
      const after = applyCartAiOffPostCheck(committed, hoverChecks, false);
      expect(after.studentReasoning).toBe(committed.studentReasoning);
      expect(after.accepted).toBe(false);
      expect(after.reasoningSignals.identifiesCurrentMotionState).toBe(false);
      expect(after.reasoningSignals.identifiesNetForceCondition).toBe(false);
      expect(after.reasoningSignals.postCheckCurrentMotionState).toBe(true);
    });

    it("accepts genuine pre-commit hover state + condition + relation", () => {
      const result = evaluateCartAiOffAttempt({
        ...completeCartAiOffInput(HOVER, "t"),
        llmUsed: false,
      });
      expect(result.accepted).toBe(true);
      expect(result.reasoningSignals.preCommitCurrentMotionState).toBe(true);
      expect(result.reasoningSignals.preCommitNetForceCondition).toBe(true);
      expect(result.reasoningSignals.preCommitRelation).toBe(true);
    });

    it("accepts genuine pre-commit crate boundary reasoning", () => {
      const result = evaluateCartAiOffAttempt({
        ...completeCartAiOffInput(CRATE, "t"),
        llmUsed: false,
      });
      expect(result.accepted).toBe(true);
      expect(result.reasoningSignals.preCommitConditionOrBoundary).toBe(true);
      expect(result.reasoningSignals.identifiesConditionOrBoundary).toBe(true);
    });

    it("still requires post-check confirmation", () => {
      const result = evaluateCartAiOffAttempt({
        ...completeCartAiOffInput(HOVER, "t"),
        postCheckIds: [],
        llmUsed: false,
      });
      expect(result.reasoningSignals.preCommitRelation).toBe(true);
      expect(result.reasoningSignals.postCheckMatchesRequired).toBe(false);
      expect(result.accepted).toBe(false);
    });

    it("fails when llmUsed is not false", () => {
      const result = evaluateCartAiOffAttempt({
        ...completeCartAiOffInput(HOVER, "t"),
        llmUsed: true,
      });
      expect(result.accepted).toBe(false);
    });
  });

  describe("L-level path after repair", () => {
    it("does not derive L5 from token-level transfer", () => {
      const session = {
        ...createSession(() => "t0", () => "cart-gate-b", CART_SCENE_ID),
        stage: LearningStage.TRANSFER,
        modelAttempts: [buildCartModelAttempt(completeCartModelInput("t"))],
        transferAttempts: [
          buildCartTransferAttempt({
            ...completeCartBicycleTransferInput("t1"),
            studentExplanation: "合力",
          }),
          buildCartTransferAttempt({
            ...completeCartHoverTransferInput("t2"),
            studentExplanation: "好好",
          }),
        ],
      };
      const accumulated = accumulateCartSceneEvidence(session);
      expect(accumulated.successfulTransfer).toBeUndefined();
      expect(deriveModelEvidenceLevel(accumulated)).toBe("L4");
    });

    it("does not derive L6 from generic AI_OFF plus post-checks", () => {
      const session = {
        ...createSession(() => "t0", () => "cart-gate-b", CART_SCENE_ID),
        stage: LearningStage.AI_OFF,
        modelAttempts: [buildCartModelAttempt(completeCartModelInput("t"))],
        transferAttempts: [
          buildCartTransferAttempt(completeCartBicycleTransferInput("t1")),
          buildCartTransferAttempt(completeCartHoverTransferInput("t2")),
        ],
        independentAssessment: buildCartAiOffAssessment(
          [
            applyCartAiOffPostCheck(
              buildCartAiOffAttempt(
                {
                  challengeId: HOVER,
                  selectedAnswer: intendedCartAiOffAnswerId(HOVER),
                  studentReasoning: "我觉得这样不太对吧。",
                  timestamp: "t1",
                },
                [],
                false,
              ),
              intendedCartAiOffPostCheckIds(HOVER),
              false,
            ),
            applyCartAiOffPostCheck(
              buildCartAiOffAttempt(
                {
                  challengeId: CRATE,
                  selectedAnswer: intendedCartAiOffAnswerId(CRATE),
                  studentReasoning: "装置看起来和平时不太一样。",
                  timestamp: "t2",
                },
                [],
                false,
              ),
              intendedCartAiOffPostCheckIds(CRATE),
              false,
            ),
          ],
          false,
        ),
      };
      const accumulated = accumulateCartSceneEvidence(session);
      expect(accumulated.independentAiOffSuccess).toBeUndefined();
      expect(deriveModelEvidenceLevel(accumulated)).toBe("L5");
    });

    it("may derive L6 from genuine L5 plus genuine AI_OFF", () => {
      const session = {
        ...createSession(() => "t0", () => "cart-gate-b", CART_SCENE_ID),
        stage: LearningStage.AI_OFF,
        modelAttempts: [buildCartModelAttempt(completeCartModelInput("t"))],
        transferAttempts: [
          buildCartTransferAttempt(completeCartBicycleTransferInput("t1")),
          buildCartTransferAttempt(completeCartHoverTransferInput("t2")),
        ],
        independentAssessment: buildCartAiOffAssessment(
          [completeCartAiOffAttempt(HOVER, "t1"), completeCartAiOffAttempt(CRATE, "t2")],
          false,
        ),
      };
      const accumulated = accumulateCartSceneEvidence(session);
      expect(accumulated.independentAiOffSuccess).toBe(true);
      expect(deriveModelEvidenceLevel(accumulated)).toBe("L6");
    });
  });
});
