import { describe, expect, it } from "vitest";

import { evaluateCartDescription } from "@/lib/learning/cart-describe";
import {
  canRunCartExperiment,
  hasCompletedCartExperiments,
  isCartExperimentClosed,
} from "@/lib/learning/cart-experiment";
import { accumulateCartSceneEvidence } from "@/lib/learning/cart-evidence";
import { evaluateCartObservation } from "@/lib/learning/cart-observe";
import {
  evaluateCartPrediction,
  firstCommittedCartPrediction,
} from "@/lib/learning/cart-predict";
import { createSession } from "@/lib/learning/session";
import { canLeaveStage } from "@/lib/learning/progression";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { CART_EXPERIMENT_A, CART_EXPERIMENT_B } from "@/lib/physics/horizontal-force-cart";
import { horizontalForceCartAdapter } from "@/lib/runtime/adapters/horizontal-force-cart";
import { CART_SCENE_ID, LearningStage } from "@/types/learning";
import type { ExperimentEvidence, LearningSession } from "@/types/learning";

function cartSession(
  overrides: Partial<LearningSession> = {},
): LearningSession {
  return {
    ...createSession(() => "t0", () => "cart-session", CART_SCENE_ID),
    ...overrides,
  };
}

describe("cart observation and description", () => {
  it("does not pass OBSERVE from playback-only or a cart-on-screen distractor", () => {
    expect(evaluateCartObservation([]).sufficient).toBe(false);
    expect(evaluateCartObservation(["cart-is-on-screen"]).sufficient).toBe(false);
    expect(evaluateCartObservation(["has-wheels-so-must-speed-up"]).sufficient).toBe(
      false,
    );
    expect(
      evaluateCartObservation(["initially-still", "started-moving"]).sufficient,
    ).toBe(true);
  });

  it("requires structured DESCRIBE fields, not text length", () => {
    expect(
      evaluateCartDescription({
        object: "",
        initialMotionState: "",
        forceDirection: "",
        observedChange: "",
        studentDescription: "小车动了小车动了小车动了小车动了。",
      }).sufficient,
    ).toBe(false);
    expect(
      evaluateCartDescription({
        object: "cart",
        initialMotionState: "still",
        forceDirection: "right",
        observedChange: "started-moving",
        studentDescription: "小车先停着，后来动了。",
      }).sufficient,
    ).toBe(true);
  });
});

describe("cart prediction and experiment protocol", () => {
  it("accepts a wrong prediction as committed evidence", () => {
    const evaluation = evaluateCartPrediction("slowed-down", "我觉得会变慢。");
    expect(evaluation.sufficient).toBe(true);
  });

  it("cannot run until a prediction is committed", () => {
    const session = cartSession({ stage: LearningStage.EXPERIMENT });
    expect(canRunCartExperiment(session, CART_EXPERIMENT_A)).toBe(false);
  });

  it("keeps the first committed prediction and ignores a later rewrite", () => {
    const first = {
      prediction: "slowed-down",
      reasoning: "我猜会变慢。",
      timestamp: "t1",
      experimentId: CART_EXPERIMENT_A,
      committed: true as const,
    };
    const second = {
      prediction: "sped-up",
      reasoning: "我想改成会变快。",
      timestamp: "t2",
      experimentId: CART_EXPERIMENT_A,
      committed: true as const,
    };
    expect(firstCommittedCartPrediction([first, second], CART_EXPERIMENT_A)?.prediction).toBe(
      "slowed-down",
    );
  });

  it("keeps experiment-local predictions inside EXPERIMENT", () => {
    const session = cartSession({
      stage: LearningStage.EXPERIMENT,
      predictions: [
        {
          prediction: "sped-up",
          reasoning: "顺着推应该更快。",
          timestamp: "t1",
          experimentId: CART_EXPERIMENT_A,
          committed: true,
        },
        {
          prediction: "reversed",
          reasoning: "顶着推会掉头。",
          timestamp: "t2",
          experimentId: CART_EXPERIMENT_B,
          committed: true,
        },
      ],
    });
    expect(session.stage).toBe(LearningStage.EXPERIMENT);
    expect(canLeaveStage(session, LearningStage.EXPLAIN)).toBe(false);
    expect(firstCommittedCartPrediction(session.predictions, CART_EXPERIMENT_B)?.experimentId).toBe(
      CART_EXPERIMENT_B,
    );
  });

  it("closes only with five-part evidence and keeps experimentId as a string", () => {
    const evidence: ExperimentEvidence = {
      prediction: "sped-up",
      predictionReason: "顺着推应该更快。",
      predictionComparison: "不一样",
      reflection: "顺着推，小车更快了。",
      timestamp: "t2",
      experimentId: "force-with-motion",
      committedAt: "t1",
      interventionAt: "t2",
      intervention: { netForce: "right" },
      observedResult: {
        speedChange: "up",
        directionChanged: "no",
        motionStateChange: "sped-up",
      },
      comparison: "different",
      physicsResult: { lastChange: "sped-up", speedTick: 3 },
      authoredBeforeIntervention: true,
    };
    expect(isCartExperimentClosed(evidence)).toBe(true);
    expect(typeof evidence.experimentId).toBe("string");
  });

  it("does not treat observe playback as a closed experiment", () => {
    const session = cartSession({
      stage: LearningStage.EXPERIMENT,
      observations: [
        {
          text: "开始运动",
          timestamp: "t",
          selectedOptionIds: ["initially-still", "started-moving"],
          watchedFullCycle: true,
          sufficient: true,
        },
      ],
    });
    expect(hasCompletedCartExperiments(session)).toBe(false);
  });
});

describe("cart adapter progression", () => {
  it("leaves ENTRY without a sceneId branch in universal progression", () => {
    const session = cartSession({ stage: LearningStage.ENTRY });
    expect(canLeaveStage(session, LearningStage.OBSERVE)).toBe(true);
    expect(session.sceneId).toBe(CART_SCENE_ID);
    expect(session.physicsState.sceneId).toBe(CART_SCENE_ID);
  });

  it("does not open EXPLAIN from Phase 1 completion flags", () => {
    expect(horizontalForceCartAdapter.completion.EXPLAIN(cartSession())).toBe(
      false,
    );
  });

  it("does not assign L4 from Phase 1 experiment closure", () => {
    const session = cartSession();
    const evidence = accumulateCartSceneEvidence(session);
    expect(deriveModelEvidenceLevel(evidence)).not.toBe("L4");
    expect(evidence.constructedValidCausalModel).toBeUndefined();
  });
});
