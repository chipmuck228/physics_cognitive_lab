import { describe, expect, it } from "vitest";

import {
  applyLensCoverLens,
  applyLensObjectStationChange,
  applyLensPredictionCommit,
  applyLensTrialIntervention,
} from "@/lib/learning/lens-action";
import { presentLensActionResponse } from "@/lib/learning/lens-action-response";
import { createSession } from "@/lib/learning/session";
import {
  isRequiredLensTrialAction,
  lensTrialStartState,
  LENS_TRIAL_SPECS,
} from "@/lib/learning/lens-trial-intervention";
import {
  createInitialConvexLensState,
  LENS_EXPERIMENT_A,
  LENS_EXPERIMENT_D,
} from "@/lib/physics/convex-lens-optical-bench";
import { getConvexLensPhysicsState } from "@/lib/runtime/physics-state";
import { CONVEX_LENS_SCENE_ID, LearningStage } from "@/types/learning";

function predictReady() {
  const session = createSession(() => "t0", () => "trial", CONVEX_LENS_SCENE_ID);
  return {
    ...session,
    stage: LearningStage.PREDICT,
  };
}

describe("Scene 07 bounded trial intervention", () => {
  it("uses official after-states and does not invent new experiment meaning", () => {
    expect(LENS_TRIAL_SPECS[LENS_EXPERIMENT_A].required).toEqual({
      kind: "move-object",
      station: "between-f-and-2f",
    });
    expect(
      isRequiredLensTrialAction(LENS_EXPERIMENT_A, {
        kind: "move-object",
        station: "at-f",
      }),
    ).toBe(false);
  });

  it("locks prediction then prepares the trial start state, not the after-state", () => {
    const result = applyLensPredictionCommit(
      predictReady(),
      LENS_EXPERIMENT_A,
      "real-larger-farther",
      "物体更靠近焦点，我预计像会更大。",
    );
    expect(result.session.stage).toBe(LearningStage.EXPERIMENT);
    expect(getConvexLensPhysicsState(result.session).objectStation).toBe("beyond-2f");
    expect(result.session.experimentEvidence).toHaveLength(0);
  });

  it("rejects a wrong station and does not apply official physics", () => {
    const locked = applyLensPredictionCommit(
      predictReady(),
      LENS_EXPERIMENT_A,
      "real-larger-farther",
      "物体更靠近焦点，我预计像会更大。",
    ).session;
    const blocked = applyLensObjectStationChange(locked, "at-f");
    expect(blocked.outcome.kind).toBe("blocked");
    expect(presentLensActionResponse(blocked.outcome)).toBe("blocked");
    expect(blocked.outcome.message).toMatch(/F 和 2F 之间/);
    expect(getConvexLensPhysicsState(blocked.session).objectStation).toBe("beyond-2f");
    expect(blocked.session.experimentEvidence).toHaveLength(0);
  });

  it("accepts the required move and writes intervention evidence", () => {
    const locked = applyLensPredictionCommit(
      predictReady(),
      LENS_EXPERIMENT_A,
      "real-larger-farther",
      "物体更靠近焦点，我预计像会更大。",
    ).session;
    const applied = applyLensTrialIntervention(locked, LENS_EXPERIMENT_A, {
      kind: "move-object",
      station: "between-f-and-2f",
    });
    expect(applied.outcome.kind).toBe("physics-applied");
    expect(getConvexLensPhysicsState(applied.session).objectStation).toBe("between-f-and-2f");
    expect(applied.session.experimentEvidence[0]?.interventionAt).toBeTruthy();
  });

  it("cover trial start is uncovered; only cover-lens is the intervention", () => {
    const start = lensTrialStartState(LENS_EXPERIMENT_D, createInitialConvexLensState());
    expect(start.lensPartiallyCovered).toBe(false);
    expect(
      isRequiredLensTrialAction(LENS_EXPERIMENT_D, { kind: "cover-lens" }),
    ).toBe(true);
    expect(
      isRequiredLensTrialAction(LENS_EXPERIMENT_D, {
        kind: "move-object",
        station: "beyond-2f",
      }),
    ).toBe(false);
  });

  it("cover action is blocked before the cover trial is ready", () => {
    const session = {
      ...createSession(() => "t0", () => "cover", CONVEX_LENS_SCENE_ID),
      stage: LearningStage.EXPERIMENT,
    };
    const result = applyLensCoverLens(session);
    expect(result.outcome.kind === "blocked" || result.outcome.kind === "missing").toBe(true);
  });
});
