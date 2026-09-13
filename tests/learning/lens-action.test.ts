import { describe, expect, it } from "vitest";

import {
  applyLensComparisonSave,
  applyLensObservedSave,
  applyLensPredictionCommit,
  applyLensReflectionSave,
  lensReflectionEligibility,
} from "@/lib/learning/lens-action";
import { presentLensActionResponse } from "@/lib/learning/lens-action-response";
import { applyLensGoBack, applyLensReturnToProgress } from "@/lib/learning/lens-revisit";
import { createSession } from "@/lib/learning/session";
import { CONVEX_LENS_SCENE_ID, LearningStage, type LearningSession } from "@/types/learning";
import { LENS_EXPERIMENT_A } from "@/lib/physics/convex-lens-optical-bench";

function openTrial(reflection = ""): LearningSession {
  const session = createSession(() => "t0", () => "lens-action", CONVEX_LENS_SCENE_ID);
  return {
    ...session,
    stage: LearningStage.EXPERIMENT,
    predictions: [
      {
        prediction: "real-larger-farther",
        reasoning: "物体更靠近焦点。",
        timestamp: "t3",
        experimentId: LENS_EXPERIMENT_A,
        committed: true,
      },
    ],
    experimentEvidence: [
      {
        prediction: "real-larger-farther",
        predictionReason: "物体更靠近焦点。",
        predictionComparison: "",
        reflection,
        timestamp: "t4",
        experimentId: LENS_EXPERIMENT_A,
        committedAt: "t3",
        interventionAt: "t4",
        observedResult: { screen: "", sizeOrCover: "" },
        comparison: "",
        physicsResult: { objectStation: "between-f-2f" },
        authoredBeforeIntervention: true,
        sufficient: false,
      },
    ],
    events: [
      ...session.events,
      { type: "stage_entered", timestamp: "t4", stage: LearningStage.EXPERIMENT },
    ],
  };
}

const completeForm = {
  observed: { screen: "clear" as const, sizeOrCover: "larger" as const },
  comparison: "same" as const,
  reflection: "像变大是因为物体更靠近焦点。",
};

describe("Scene 07 experiment action eligibility", () => {
  it("empty reflection is missing, not a silent no-op", () => {
    const session = openTrial();
    const result = applyLensReflectionSave(session, LENS_EXPERIMENT_A, {
      ...completeForm,
      reflection: "",
    });
    expect(result.session).toBe(session);
    expect(result.outcome.kind).toBe("missing");
    expect(presentLensActionResponse(result.outcome)).toBe("missing");
    expect(result.outcome.message).toMatch(/中文字/);
  });

  it("latin-only reflection used to look valid but cannot close the trial", () => {
    const session = openTrial();
    const result = applyLensReflectionSave(session, LENS_EXPERIMENT_A, {
      ...completeForm,
      reflection: "the image got bigger",
    });
    expect(result.session.experimentEvidence[0]?.reflection).toBe("");
    expect(result.outcome.kind).toBe("missing");
    expect(presentLensActionResponse(result.outcome)).toBe("missing");
  });

  it("visible form without observed/comparison is missing", () => {
    const session = openTrial("像变大是因为物体更靠近焦点。");
    const result = applyLensReflectionSave(session, LENS_EXPERIMENT_A, {
      observed: { screen: "", sizeOrCover: "" },
      comparison: "",
      reflection: "像变大是因为物体更靠近焦点。",
    });
    expect(result.session).toBe(session);
    expect(result.outcome.kind).toBe("missing");
    expect(result.outcome.message).toMatch(/光屏/);
  });

  it("valid visible form commits observed, comparison, and reflection together", () => {
    const session = openTrial();
    const result = applyLensReflectionSave(session, LENS_EXPERIMENT_A, completeForm);
    expect(result.outcome.kind).toBe("committed");
    expect(result.session.experimentEvidence[0]?.reflection).toBe(completeForm.reflection);
    expect(result.session.experimentEvidence[0]?.comparison).toBe("same");
    expect(result.session.experimentEvidence[0]?.sufficient).toBe(true);
  });

  it("repeated save after close is blocked, not silent", () => {
    const closed = applyLensReflectionSave(openTrial(), LENS_EXPERIMENT_A, completeForm).session;
    expect(lensReflectionEligibility(closed, LENS_EXPERIMENT_A).enabled).toBe(false);
    const again = applyLensReflectionSave(closed, LENS_EXPERIMENT_A, completeForm);
    expect(again.outcome.kind).toBe("blocked");
    expect(presentLensActionResponse(again.outcome)).toBe("blocked");
  });

  it("review mode blocks reflection save", () => {
    const viewing = applyLensGoBack(openTrial());
    const result = applyLensReflectionSave(viewing, LENS_EXPERIMENT_A, completeForm);
    expect(result.outcome.kind).toBe("blocked");
    expect(result.session.experimentEvidence).toEqual(viewing.experimentEvidence);
  });

  it("return from review restores a working-path save", () => {
    const restored = applyLensReturnToProgress(applyLensGoBack(openTrial()));
    expect(lensReflectionEligibility(restored, LENS_EXPERIMENT_A).enabled).toBe(true);
    const result = applyLensReflectionSave(restored, LENS_EXPERIMENT_A, completeForm);
    expect(result.outcome.kind).toBe("committed");
  });

  it("empty comparison save is missing, not a silent return", () => {
    const result = applyLensComparisonSave(openTrial(), LENS_EXPERIMENT_A, "");
    expect(result.outcome.kind).toBe("missing");
    expect(presentLensActionResponse(result.outcome)).toBe("missing");
  });

  it("incomplete observed save is missing", () => {
    const result = applyLensObservedSave(openTrial(), LENS_EXPERIMENT_A, {
      screen: "clear",
      sizeOrCover: "",
    });
    expect(result.outcome.kind).toBe("missing");
  });

  it("latin-only prediction is missing instead of silent", () => {
    const session = {
      ...createSession(() => "t0", () => "pred", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.PREDICT,
    };
    const result = applyLensPredictionCommit(
      session,
      LENS_EXPERIMENT_A,
      "real-larger-farther",
      "ok",
    );
    expect(result.session).toBe(session);
    expect(result.outcome.kind).toBe("missing");
  });
});
