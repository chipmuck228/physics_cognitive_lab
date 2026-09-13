import { describe, expect, it } from "vitest";

import {
  LENS_COPY,
  LENS_OBSERVE_REQUIRED_IDS,
} from "@/lib/content/convex-lens-optical-bench";
import {
  applyLensComparisonSave,
  applyLensDescriptionSave,
  applyLensExplanationSave,
  applyLensModelSubmit,
  applyLensObjectStationChange,
  applyLensObservationSave,
  applyLensObservedSave,
  applyLensScreenChange,
  applyLensPredictionCommit,
  applyLensReflectionSave,
  applyLensTransferSubmit,
  lensReflectionEligibility,
} from "@/lib/learning/lens-action";
import { presentLensActionResponse } from "@/lib/learning/lens-action-response";
import { completeLensExplainInput } from "@/lib/learning/lens-explain";
import { completeLensModelDraft } from "@/lib/learning/lens-model";
import { lensInteractionTraces } from "@/lib/learning/lens-interaction-trace";
import { applyLensGoBack, applyLensReturnToProgress } from "@/lib/learning/lens-revisit";
import {
  completeLensTransferDraft,
  emptyLensTransferDraft,
  LENS_TRANSFER_REQUIRED_IDS,
} from "@/lib/learning/lens-transfer";
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
    expect(result.outcome.message).toMatch(/实际结果|预测对照/);
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

function stageSession(stage: LearningStage): LearningSession {
  const session = createSession(() => "t0", () => `lens-${stage}`, CONVEX_LENS_SCENE_ID);
  return {
    ...session,
    stage,
    events: [
      ...session.events,
      { type: "stage_entered", timestamp: "t1", stage },
    ],
  };
}

const completeDescribe = {
  object: "optical-bench" as const,
  quantities: "object-f-image-screen" as const,
  change: "object-or-screen-changes-view" as const,
  studentDescription: "物体、透镜、F 和光屏不是同一件东西，刚才动的是物体。",
};

describe("Scene 07 authoritative stage actions", () => {
  it("DESCRIBE evaluates once and missing stays missing", () => {
    const result = applyLensDescriptionSave(stageSession(LearningStage.DESCRIBE), {
      ...completeDescribe,
      studentDescription: "变了",
    });
    expect(result.outcome.kind).toBe("missing");
    expect(result.session.descriptions[0]?.sufficient).toBe(false);
    expect(result.session.stage).toBe(LearningStage.DESCRIBE);
  });

  it("DESCRIBE sufficient commits from the Scene action", () => {
    const result = applyLensDescriptionSave(
      stageSession(LearningStage.DESCRIBE),
      completeDescribe,
    );
    expect(result.outcome.kind).toBe("committed");
    expect(result.session.descriptions[0]?.sufficient).toBe(true);
  });

  it("EXPLAIN missing is owned by the Scene action", () => {
    const result = applyLensExplanationSave(stageSession(LearningStage.EXPLAIN), {
      meetingFragment: "",
      screenFragment: "",
      studentExplanation: "变了",
    });
    expect(result.outcome.kind).toBe("missing");
    expect(result.session.stage).toBe(LearningStage.EXPLAIN);
  });

  it("EXPLAIN sufficient commits from the Scene action", () => {
    const result = applyLensExplanationSave(
      stageSession(LearningStage.EXPLAIN),
      completeLensExplainInput(),
    );
    expect(result.outcome.kind).toBe("committed");
    expect(result.session.explanations[0]?.sufficient).toBe(true);
  });

  it("OBSERVE incomplete is missing", () => {
    const result = applyLensObservationSave(stageSession(LearningStage.OBSERVE), [
      "screen-can-change",
    ]);
    expect(result.outcome.kind).toBe("missing");
    expect(result.outcome.kind === "missing" && result.outcome.message).toBe(
      LENS_COPY.observeNeedInteraction,
    );
    expect(result.session.observations[0]?.sufficient).toBe(false);
  });

  it("OBSERVE required selection commits from the Scene action", () => {
    const moved = applyLensObjectStationChange(
      stageSession(LearningStage.OBSERVE),
      "between-f-and-2f",
    ).session;
    const result = applyLensObservationSave(moved, [...LENS_OBSERVE_REQUIRED_IDS]);
    expect(result.outcome.kind).toBe("committed");
    expect(result.session.observations[0]?.sufficient).toBe(true);
    expect(result.session.observations[0]?.watchedFullCycle).toBe(true);
  });

  it("MODEL incomplete labels are missing, not accepted", () => {
    const result = applyLensModelSubmit(
      stageSession(LearningStage.MODEL),
      completeLensModelDraft(),
    );
    const incomplete = applyLensModelSubmit(stageSession(LearningStage.MODEL), {
      ...completeLensModelDraft(),
      studentReasoning: "",
      meetingMode: "",
    });
    expect(result.outcome.kind).toBe("committed");
    expect(result.outcome.kind === "committed" && result.outcome.message).toMatch(/新情境/);
    expect(result.session.stage).toBe(LearningStage.TRANSFER);
    expect(incomplete.outcome.kind).toBe("missing");
    expect(incomplete.session.modelAttempts[0]?.correctStructure).toBe(false);
    expect(incomplete.session.stage).toBe(LearningStage.MODEL);
  });

  it("MODEL complete-but-incorrect is rejected, not committed", () => {
    const draft = {
      ...completeLensModelDraft("beyond-2f"),
      meetingMode: "backward-extension",
    };
    const result = applyLensModelSubmit(stageSession(LearningStage.MODEL), draft);
    expect(result.session.modelAttempts[0]?.correctStructure).toBe(false);
    expect(result.outcome.kind).toBe("rejected");
    expect(result.outcome.kind === "rejected" && result.outcome.repairStep).toBe(4);
    expect(presentLensActionResponse(result.outcome)).toBe("rejected");
    expect(result.session.stage).toBe(LearningStage.MODEL);
    const sizeFail = applyLensModelSubmit(stageSession(LearningStage.MODEL), {
      ...completeLensModelDraft("beyond-2f"),
      size: "enlarged",
    });
    expect(sizeFail.outcome.kind).toBe("rejected");
    expect(sizeFail.outcome.kind === "rejected" && sizeFail.outcome.repairStep).toBe(5);
  });

  it("TRANSFER incomplete is missing", () => {
    const result = applyLensTransferSubmit(
      stageSession(LearningStage.TRANSFER),
      emptyLensTransferDraft(),
    );
    expect(result.outcome.kind).toBe("missing");
    expect(result.session.transferAttempts[0]?.accepted).not.toBe(true);
  });

  it("TRANSFER rejected is not presented as committed", () => {
    const accepted = completeLensTransferDraft(LENS_TRANSFER_REQUIRED_IDS[0]);
    const draft = {
      ...accepted,
      meetingMode:
        accepted.meetingMode === "actual-convergence"
          ? "backward-extension"
          : "actual-convergence",
    };
    const result = applyLensTransferSubmit(stageSession(LearningStage.TRANSFER), draft);
    expect(result.session.transferAttempts[0]?.accepted).toBe(false);
    expect(result.outcome.kind).toBe("rejected");
    expect(presentLensActionResponse(result.outcome)).toBe("rejected");
  });

  it("object-station change writes physics and process trace, not Evidence", () => {
    const session = stageSession(LearningStage.OBSERVE);
    const result = applyLensObjectStationChange(session, "between-f-and-2f");
    expect(result.outcome.kind).toBe("physics-applied");
    expect(result.session.observations).toEqual(session.observations);
    expect(result.session.stage).toBe(LearningStage.OBSERVE);
    expect(result.session.physicsState).not.toBe(session.physicsState);
    const traces = lensInteractionTraces(result.session);
    expect(traces.some((item) => item.action === "move-object" && item.to === "between-f-and-2f")).toBe(
      true,
    );
  });

  it("review object-station change does not write Evidence", () => {
    const viewing = applyLensGoBack({
      ...stageSession(LearningStage.DESCRIBE),
      observations: [
        {
          text: "看见光屏变了。",
          timestamp: "t2",
          selectedOptionIds: [...LENS_OBSERVE_REQUIRED_IDS],
          sufficient: true,
        },
      ],
    });
    const before = viewing.observations;
    const result = applyLensObjectStationChange(viewing, "inside-f");
    expect(result.outcome.kind).toBe("physics-applied");
    expect(result.session.observations).toEqual(before);
    expect(result.session.stage).toBe(LearningStage.DESCRIBE);
    expect(lensInteractionTraces(result.session).at(-1)?.mode).toBe("review");
  });

  it("screen change is a two-state Scene action", () => {
    const result = applyLensScreenChange(stageSession(LearningStage.OBSERVE), false);
    expect(result.outcome.kind).toBe("physics-applied");
    expect(lensInteractionTraces(result.session).some((item) => item.action === "move-screen")).toBe(
      true,
    );
  });
});
