import { describe, expect, it } from "vitest";

import { LENS_COPY, LENS_OBSERVE_REQUIRED_IDS } from "@/lib/content/convex-lens-optical-bench";
import {
  applyLensDescriptionSave,
  applyLensObjectStationChange,
  applyLensObservationSave,
} from "@/lib/learning/lens-action";
import { accumulateConvexLensSceneEvidence } from "@/lib/learning/lens-evidence";
import {
  evaluateLensObservationEligibility,
  hasSufficientLensObservation,
} from "@/lib/learning/lens-observe";
import { lensInteractionTraces } from "@/lib/learning/lens-interaction-trace";
import { createSession } from "@/lib/learning/session";
import {
  LENS_TRANSFER_REQUIRED_IDS,
  lensTransferProgress,
} from "@/lib/learning/lens-transfer";
import { CONVEX_LENS_SCENE_ID, LearningStage, type LearningSession } from "@/types/learning";

function observeSession(): LearningSession {
  const session = createSession(() => "t0", () => "lens-observe", CONVEX_LENS_SCENE_ID);
  return {
    ...session,
    stage: LearningStage.OBSERVE,
    events: [...session.events, { type: "stage_entered", timestamp: "t1", stage: LearningStage.OBSERVE }],
  };
}

const completeDescribe = {
  object: "optical-bench" as const,
  quantities: "object-f-image-screen" as const,
  change: "object-or-screen-changes-view" as const,
  studentDescription: "物体、透镜、F 和光屏不是同一件东西，刚才动的是物体。",
};

describe("Scene 07 OBSERVE provenance", () => {
  it("A: checkboxes without bench interaction cannot be accepted or set L1", () => {
    const result = applyLensObservationSave(observeSession(), [...LENS_OBSERVE_REQUIRED_IDS]);
    expect(result.outcome.kind).toBe("missing");
    expect(result.outcome.kind === "missing" && result.outcome.message).toBe(
      LENS_COPY.observeNeedInteraction,
    );
    expect(result.session.stage).toBe(LearningStage.OBSERVE);
    expect(result.session.observations[0]?.sufficient).toBe(false);
    expect(result.session.observations[0]?.watchedFullCycle).toBe(false);
    expect(hasSufficientLensObservation(result.session.observations)).toBe(false);
    const withDescribe = {
      ...result.session,
      descriptions: [
        {
          text: completeDescribe.studentDescription,
          timestamp: "t2",
          sufficient: true,
        },
      ],
    };
    expect(accumulateConvexLensSceneEvidence(withDescribe).observedPhenomenon).toBeUndefined();
  });

  it("B: interaction without a complete record stays on OBSERVE with record reason", () => {
    const moved = applyLensObjectStationChange(observeSession(), "between-f-and-2f").session;
    const result = applyLensObservationSave(moved, ["screen-can-change"]);
    expect(result.outcome.kind).toBe("missing");
    expect(result.outcome.kind === "missing" && result.outcome.message).toBe(
      LENS_COPY.observeNeedRecord,
    );
    expect(result.session.stage).toBe(LearningStage.OBSERVE);
    expect(result.session.observations[0]?.sufficient).toBe(false);
    expect(hasSufficientLensObservation(result.session.observations)).toBe(false);
  });

  it("C: interaction plus record accepts OBSERVE and can later accumulate L1", () => {
    const moved = applyLensObjectStationChange(observeSession(), "between-f-and-2f").session;
    const observed = applyLensObservationSave(moved, [...LENS_OBSERVE_REQUIRED_IDS]);
    expect(observed.outcome.kind).toBe("committed");
    expect(observed.session.stage).toBe(LearningStage.DESCRIBE);
    expect(hasSufficientLensObservation(observed.session.observations)).toBe(true);
    expect(accumulateConvexLensSceneEvidence(observed.session).observedPhenomenon).toBeUndefined();
    const described = applyLensDescriptionSave(observed.session, completeDescribe);
    expect(described.session.stage).toBe(LearningStage.PREDICT);
    expect(accumulateConvexLensSceneEvidence(described.session).observedPhenomenon).toBe(true);
  });

  it("D: interaction trace alone does not produce observedPhenomenon", () => {
    const moved = applyLensObjectStationChange(observeSession(), "between-f-and-2f").session;
    expect(lensInteractionTraces(moved).some((item) => item.action === "move-object")).toBe(true);
    expect(moved.observations).toHaveLength(0);
    expect(hasSufficientLensObservation(moved.observations)).toBe(false);
    expect(accumulateConvexLensSceneEvidence(moved).observedPhenomenon).toBeUndefined();
  });

  it("eligibility is interaction plus record, not either alone", () => {
    expect(
      evaluateLensObservationEligibility([...LENS_OBSERVE_REQUIRED_IDS], false).sufficient,
    ).toBe(false);
    expect(evaluateLensObservationEligibility(["screen-can-change"], true).sufficient).toBe(false);
    expect(
      evaluateLensObservationEligibility([...LENS_OBSERVE_REQUIRED_IDS], true).sufficient,
    ).toBe(true);
  });
});

describe("Scene 07 TRANSFER progress", () => {
  it("E/F: empty attempts show 1/2; one accepted required target shows 2/2", () => {
    expect(lensTransferProgress([]).current).toBe(1);
    expect(lensTransferProgress([]).total).toBe(2);
    expect(lensTransferProgress([]).firstComplete).toBe(false);
    const firstDone = lensTransferProgress([
      {
        scenarioId: LENS_TRANSFER_REQUIRED_IDS[0],
        targetId: LENS_TRANSFER_REQUIRED_IDS[0],
        accepted: true,
        response: "投影仪。",
        timestamp: "t1",
      },
    ]);
    expect(firstDone.current).toBe(2);
    expect(firstDone.total).toBe(2);
    expect(firstDone.firstComplete).toBe(true);
  });
});
