import { describe, expect, it } from "vitest";

import { LENS_COPY } from "@/lib/content/convex-lens-optical-bench";
import { applyLensPredictionCommit } from "@/lib/learning/lens-action";
import {
  evaluateLensPrediction,
  lensPredictReasonForCommit,
} from "@/lib/learning/lens-predict";
import { createSession } from "@/lib/learning/session";
import { LENS_EXPERIMENT_A } from "@/lib/physics/convex-lens-optical-bench";
import { CONVEX_LENS_SCENE_ID, LearningStage } from "@/types/learning";

function predictSession() {
  return {
    ...createSession(() => "t0", () => "lens-predict", CONVEX_LENS_SCENE_ID),
    stage: LearningStage.PREDICT,
  };
}

describe("Scene 07 PREDICT honest unknown", () => {
  it("does not require causal text when the learner says they do not know why", () => {
    const evaluation = evaluateLensPrediction(
      "virtual-or-none",
      LENS_COPY.reasonUnknown,
    );
    expect(evaluation.hasOutcome).toBe(true);
    expect(evaluation.honestUnknown).toBe(true);
    expect(evaluation.sufficient).toBe(true);
  });

  it("lets a wrong guess plus 我还不知道为什么 proceed to EXPERIMENT", () => {
    const result = applyLensPredictionCommit(
      predictSession(),
      LENS_EXPERIMENT_A,
      "virtual-or-none",
      lensPredictReasonForCommit("unknown", ""),
    );
    expect(result.outcome.kind).toBe("committed");
    expect(result.session.stage).toBe(LearningStage.EXPERIMENT);
    expect(result.session.predictions[0]?.prediction).toBe("virtual-or-none");
    expect(result.session.predictions[0]?.reasoning).toBe(LENS_COPY.reasonUnknown);
  });

  it("lets 我只是先猜的 proceed without fabricating a reason", () => {
    const result = applyLensPredictionCommit(
      predictSession(),
      LENS_EXPERIMENT_A,
      "unsure",
      lensPredictReasonForCommit("guess-only", ""),
    );
    expect(result.outcome.kind).toBe("committed");
    expect(result.session.stage).toBe(LearningStage.EXPERIMENT);
  });

  it("still requires an authored sentence when the learner claims to have an idea", () => {
    const result = applyLensPredictionCommit(
      predictSession(),
      LENS_EXPERIMENT_A,
      "real-larger-farther",
      lensPredictReasonForCommit("has-idea", "ok"),
    );
    expect(result.outcome.kind).toBe("missing");
    expect(result.session.stage).toBe(LearningStage.PREDICT);
  });
});
