import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { MODEL_RELATION_IDS } from "@/content/physics-models/force-changes-motion-state/model";
import {
  completeCartExplainInput,
  evaluateCartExplanation,
  hasSufficientCartExplanation,
} from "@/lib/learning/cart-explain";
import { accumulateCartSceneEvidence } from "@/lib/learning/cart-evidence";
import {
  buildCartModelAttempt,
  completeCartModelInput,
  emptyCartModelCases,
  hasCompletedCartModel,
} from "@/lib/learning/cart-model";
import { createSession } from "@/lib/learning/session";
import {
  buildCartTransferAttempt,
  completeCartBallTransferInput,
  completeCartBicycleTransferInput,
  completeCartHoverTransferInput,
  hasCompletedCartTransfer,
} from "@/lib/learning/cart-transfer";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { horizontalForceCartAdapter } from "@/lib/runtime/adapters/horizontal-force-cart";
import { CART_SCENE_ID } from "@/types/learning";
import type { LearningSession } from "@/types/learning";

function cartSession(
  overrides: Partial<LearningSession> = {},
): LearningSession {
  return {
    ...createSession(() => "t0", () => "cart-session", CART_SCENE_ID),
    ...overrides,
  };
}

describe("cart EXPLAIN", () => {
  it("rejects force-means-motion and related misconceptions", () => {
    expect(
      evaluateCartExplanation({
        forceVsMotion: "force-means-motion",
        sameDirection: "sped-up",
        oppositeDirection: "slowed-down",
        zeroNetForce: "unchanged",
        studentExplanation: "有力就一定运动，所以小车才会动。",
      }).sufficient,
    ).toBe(false);
    expect(
      evaluateCartExplanation({
        ...completeCartExplainInput(),
        zeroNetForce: "must-stop",
      }).sufficient,
    ).toBe(false);
    expect(
      evaluateCartExplanation({
        ...completeCartExplainInput(),
        zeroNetForce: "balanced-means-no-force",
      }).sufficient,
    ).toBe(false);
    expect(
      evaluateCartExplanation({
        ...completeCartExplainInput(),
        forceVsMotion: "needs-forward-force",
      }).sufficient,
    ).toBe(false);
  });

  it("does not pass on text length or the textbook slogan", () => {
    expect(
      evaluateCartExplanation({
        forceVsMotion: "",
        sameDirection: "",
        oppositeDirection: "",
        zeroNetForce: "",
        studentExplanation: "力能改变物体运动状态力能改变物体运动状态。",
      }).sufficient,
    ).toBe(false);
    expect(evaluateCartExplanation(completeCartExplainInput()).sufficient).toBe(true);
  });

  it("does not grant L4 from EXPLAIN", () => {
    const session = cartSession({
      explanations: [
        {
          text: completeCartExplainInput().studentExplanation,
          timestamp: "t",
          distinguishesForceFromMotion: true,
          connectsNonzeroForceToChange: true,
          treatsZeroNetForceAsUnchanged: true,
          doesNotRequireForwardForceToKeepMoving: true,
          forceMotionAnswers: completeCartExplainInput(),
          sufficient: true,
        },
      ],
    });
    const evidence = accumulateCartSceneEvidence(session);
    expect(hasSufficientCartExplanation(session.explanations)).toBe(true);
    expect(evidence.constructedValidCausalModel).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).not.toBe("L4");
    expect(deriveModelEvidenceLevel(evidence)).toBe("L3");
  });
});

describe("cart MODEL relation board", () => {
  it("accepts a valid three-case relation board", () => {
    const attempt = buildCartModelAttempt(completeCartModelInput("t"));
    expect(attempt.correctStructure).toBe(true);
    expect(attempt.conditions).toContain("net-force-zero-unchanged");
    expect(attempt.conditions).toContain("friction-omitted");
  });

  it("rejects an energy-chain-shaped fake model", () => {
    const cases = emptyCartModelCases();
    cases.same = {
      currentMotionState: "chemical-energy",
      netForceCondition: "internal-energy",
      resultingChange: "mechanical-energy",
    };
    const attempt = buildCartModelAttempt({
      cases,
      conditions: ["energy-conversion-chain"],
      timestamp: "t",
    });
    expect(attempt.correctStructure).toBe(false);
    expect(attempt.failureKinds).toContain("energy-chain-shape");
  });

  it("requires the zero-net-force unchanged condition", () => {
    const input = completeCartModelInput("t");
    input.cases.zero.resultingChange = "must-stop";
    input.conditions = ["friction-omitted"];
    const attempt = buildCartModelAttempt(input);
    expect(attempt.correctStructure).toBe(false);
    expect(attempt.failureKinds).toContain("zero-net-force-must-stop");
    expect(attempt.failureKinds).toContain("missing-zero-net-force-unchanged");
    expect(attempt.failureKinds).toContain("missing-zero-net-force-condition");
  });

  it("keeps the first failed MODEL attempt when a later one succeeds", () => {
    const failed = buildCartModelAttempt({
      cases: emptyCartModelCases(),
      conditions: [],
      timestamp: "t1",
    });
    const passed = buildCartModelAttempt(completeCartModelInput("t2"));
    expect(failed.correctStructure).toBe(false);
    expect(hasCompletedCartModel([failed, passed])).toBe(true);
    expect([failed, passed][0]?.timestamp).toBe("t1");
  });

  it("may contribute L4 only through the evaluator", () => {
    const session = cartSession({
      modelAttempts: [buildCartModelAttempt(completeCartModelInput("t"))],
    });
    const evidence = accumulateCartSceneEvidence(session);
    expect(evidence.constructedValidCausalModel).toBe(true);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L4");
    expect(JSON.stringify(session.modelAttempts)).not.toMatch(/"L4"/);
  });
});

describe("cart TRANSFER", () => {
  it("accepts relation and condition judgments, not surface similarity", () => {
    const accepted = buildCartTransferAttempt(completeCartBicycleTransferInput("t"));
    expect(accepted.accepted).toBe(true);
    const surface = buildCartTransferAttempt({
      targetId: "near-bicycle-speeding-up",
      judgments: {
        [MODEL_RELATION_IDS.netForceChangesMotionState]: "not-necessarily",
        [MODEL_RELATION_IDS.sameDirectionIncreasesSpeed]: "not-necessarily",
        [MODEL_RELATION_IDS.oppositeDirectionDecreasesSpeed]: "not-necessarily",
        [MODEL_RELATION_IDS.zeroNetForceLeavesMotionUnchanged]: "not-necessarily",
      },
      surfaceCueSelected: true,
      studentExplanation: "都有轮子，所以和刚才的小车是一回事。",
      timestamp: "t",
    });
    expect(surface.accepted).toBe(false);
    expect(surface.failureKinds).toContain("surface-similarity-only");
  });

  it("accepts the opposite-force slowing context as a full-model transfer", () => {
    const attempt = buildCartTransferAttempt(completeCartBallTransferInput("t"));
    expect(attempt.accepted).toBe(true);
    expect(attempt.targetId).toBe("medium-ball-opposite-force");
  });

  it("does not grant L5 from transfer without a valid model", () => {
    const session = cartSession({
      transferAttempts: [
        buildCartTransferAttempt(completeCartBicycleTransferInput("t1")),
        buildCartTransferAttempt(completeCartHoverTransferInput("t2")),
      ],
    });
    const evidence = accumulateCartSceneEvidence(session);
    expect(hasCompletedCartTransfer(session.transferAttempts)).toBe(true);
    expect(evidence.constructedValidCausalModel).toBeUndefined();
    expect(evidence.successfulTransfer).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).not.toBe("L5");
  });

  it("may derive L5 only after a valid model plus required transfer", () => {
    const session = cartSession({
      modelAttempts: [buildCartModelAttempt(completeCartModelInput("t"))],
      transferAttempts: [
        buildCartTransferAttempt(completeCartBicycleTransferInput("t1")),
        buildCartTransferAttempt(completeCartHoverTransferInput("t2")),
      ],
    });
    expect(hasCompletedCartTransfer(session.transferAttempts)).toBe(true);
    const evidence = accumulateCartSceneEvidence(session);
    expect(evidence.successfulTransfer).toBe(true);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L5");
    expect(JSON.stringify(session)).not.toMatch(/"L4"|"L5"/);
  });
});

describe("cart adapter Phase 2", () => {
  it("does not write L4/L5 in Scene code or add a universal sceneId branch", () => {
    const sceneFiles = [
      "lib/learning/cart-evidence.ts",
      "lib/learning/cart-explain.ts",
      "lib/learning/cart-model.ts",
      "lib/learning/cart-transfer.ts",
      "lib/runtime/adapters/horizontal-force-cart.ts",
      "hooks/useCartLearningSession.ts",
    ];
    for (const file of sceneFiles) {
      expect(readFileSync(file, "utf8")).not.toMatch(/["']L4["']|["']L5["']/);
    }
    expect(readFileSync("lib/learning/progression.ts", "utf8")).not.toMatch(
      /horizontal-force-cart/,
    );
    expect(readFileSync("lib/learning/tutor-request.ts", "utf8")).not.toMatch(
      /horizontal-force-cart/,
    );
    const empty = cartSession();
    expect(horizontalForceCartAdapter.completion.EXPLAIN(empty)).toBe(false);
    expect(horizontalForceCartAdapter.completion.MODEL(empty)).toBe(false);
    expect(horizontalForceCartAdapter.completion.TRANSFER(empty)).toBe(false);
  });
});
