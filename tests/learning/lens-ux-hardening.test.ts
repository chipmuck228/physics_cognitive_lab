import { describe, expect, it } from "vitest";

import { evaluateConvexLensModelConstruction } from "@/content/physics-models/convex-lens-imaging/construction";
import {
  LENS_COPY,
  LENS_OBSERVE_OPTIONS,
  LENS_OBSERVE_REQUIRED_IDS,
  LENS_TASK_FRAMES,
} from "@/lib/content/convex-lens-optical-bench";
import { lensFeedbackForFailureKind } from "@/lib/learning/lens-feedback";
import {
  applyLensHelpIntent,
  applyLensHelpNext,
  availableLensHelpIntents,
  lensHelpAllowed,
} from "@/lib/learning/lens-help-intents";
import {
  buildLensModelAttempt,
  completeLensModelDraft,
  draftToConvexLensAttempt,
  emptyLensModelDraft,
  LENS_MODEL_STEP_COUNT,
  lensModelStepComplete,
} from "@/lib/learning/lens-model";
import { evaluateLensObservation } from "@/lib/learning/lens-observe";
import {
  applyLensGoBack,
  applyLensReturnToProgress,
  applyLensReviewPhysics,
  authoritativeLensPhysics,
  isLensRevisiting,
  LENS_REVIEW_PHYSICS_KEY,
  LENS_VIEWING_STAGE_KEY,
  lensDisplayStage,
  lensPreviewPhysics,
  lensReviewPhysics,
} from "@/lib/learning/lens-revisit";
import { createSession } from "@/lib/learning/session";
import {
  hydratePersistedSession,
} from "@/lib/learning/session-storage";
import {
  CONVEX_LENS_SCENE_ID,
  LearningStage,
  type LearningSession,
} from "@/types/learning";

function lensSession(stage: LearningStage): LearningSession {
  const session = createSession(() => "t0", () => "lens-ux", CONVEX_LENS_SCENE_ID);
  const draft = completeLensModelDraft();
  return {
    ...session,
    stage,
    observations: [
      {
        text: "光屏有时清晰有时接不到。",
        timestamp: "t1",
        selectedOptionIds: [...LENS_OBSERVE_REQUIRED_IDS],
        sufficient: true,
      },
    ],
    descriptions: [
      {
        text: "物体、透镜、像和光屏不是同一个东西。",
        timestamp: "t2",
        object: "optical-bench",
        quantity: "object-f-image-screen",
        change: "object-or-screen-changes-view",
        sufficient: true,
      },
    ],
    predictions: [
      {
        prediction: "real-larger-farther",
        reasoning: "物体更靠近焦点。",
        timestamp: "t3",
        experimentId: "A",
        committed: true,
      },
    ],
    experimentEvidence: [
      {
        prediction: "real-larger-farther",
        predictionReason: "物体更靠近焦点。",
        predictionComparison: "same",
        reflection: "像变大是因为物体更靠近焦点。",
        timestamp: "t4",
        experimentId: "A",
        interventionAt: "t4",
        comparison: "same",
        sufficient: true,
      },
    ],
    explanations: [
      {
        text: "有的位置光线真正会聚，光屏才能接到。",
        timestamp: "t5",
        sufficient: true,
        lensAnswers: {
          meetingFragment: "actual-convergence",
          screenFragment: "virtual-not-on-screen",
        },
      },
    ],
    modelAttempts: [buildLensModelAttempt(draft, "t6")],
    sceneData: {
      ...session.sceneData,
      modelDraft: draft,
    },
    events: [
      ...session.events,
      { type: "stage_entered", timestamp: "t1", stage: LearningStage.OBSERVE },
      { type: "stage_entered", timestamp: "t2", stage: LearningStage.DESCRIBE },
      { type: "stage_entered", timestamp: "t3", stage: LearningStage.PREDICT },
      { type: "stage_entered", timestamp: "t4", stage: LearningStage.EXPERIMENT },
      { type: "stage_entered", timestamp: "t5", stage: LearningStage.EXPLAIN },
      { type: "stage_entered", timestamp: "t6", stage: LearningStage.MODEL },
      ...(stage === LearningStage.TRANSFER
        ? [{ type: "stage_entered" as const, timestamp: "t7", stage: LearningStage.TRANSFER }]
        : []),
    ],
  };
}

function snapshotEvidence(session: LearningSession) {
  return {
    stage: session.stage,
    observations: session.observations,
    descriptions: session.descriptions,
    predictions: session.predictions,
    experimentEvidence: session.experimentEvidence,
    explanations: session.explanations,
    modelAttempts: session.modelAttempts,
    transferAttempts: session.transferAttempts,
    examAttempts: session.examAttempts,
    independentAssessment: session.independentAssessment,
    draft: session.sceneData.modelDraft,
    entered: session.events.filter((event) => event.type === "stage_entered"),
  };
}

describe("Scene 07 revisit navigation", () => {
  it("MODEL → back EXPLAIN → return MODEL without regressing progress", () => {
    const model = lensSession(LearningStage.MODEL);
    const before = snapshotEvidence(model);
    const viewing = applyLensGoBack(model);
    expect(viewing.stage).toBe(LearningStage.MODEL);
    expect(isLensRevisiting(viewing)).toBe(true);
    expect(lensDisplayStage(viewing)).toBe(LearningStage.EXPLAIN);
    expect(snapshotEvidence(viewing)).toEqual({
      ...before,
      draft: viewing.sceneData.modelDraft,
    });
    expect(viewing.events.filter((event) => event.type === "stage_entered")).toEqual(
      before.entered,
    );
    const back = applyLensReturnToProgress(viewing);
    expect(back.stage).toBe(LearningStage.MODEL);
    expect(isLensRevisiting(back)).toBe(false);
    expect(lensDisplayStage(back)).toBe(LearningStage.MODEL);
    expect(snapshotEvidence(back)).toEqual(before);
  });

  it("TRANSFER → back MODEL → return TRANSFER without regressing progress", () => {
    const transfer = lensSession(LearningStage.TRANSFER);
    const before = snapshotEvidence(transfer);
    const viewing = applyLensGoBack(transfer);
    expect(viewing.stage).toBe(LearningStage.TRANSFER);
    expect(lensDisplayStage(viewing)).toBe(LearningStage.MODEL);
    expect(snapshotEvidence(viewing)).toEqual({
      ...before,
      draft: viewing.sceneData.modelDraft,
    });
    const back = applyLensReturnToProgress(viewing);
    expect(back.stage).toBe(LearningStage.TRANSFER);
    expect(snapshotEvidence(back)).toEqual(before);
  });

  it("keeps viewingStage across persistence refresh", () => {
    const viewing = applyLensGoBack(lensSession(LearningStage.MODEL));
    const loaded = hydratePersistedSession(
      JSON.parse(JSON.stringify(viewing)),
      CONVEX_LENS_SCENE_ID,
    );
    expect(loaded).not.toBeNull();
    expect(loaded!.stage).toBe(LearningStage.MODEL);
    expect(loaded!.sceneData[LENS_VIEWING_STAGE_KEY]).toBe(LearningStage.EXPLAIN);
    expect(lensDisplayStage(loaded!)).toBe(LearningStage.EXPLAIN);
    expect(loaded!.explanations).toEqual(viewing.explanations);
    expect(loaded!.modelAttempts).toEqual(viewing.modelAttempts);
  });

  it("MODEL → revisit OBSERVE keeps preview physics off the authoritative state", () => {
    const model = lensSession(LearningStage.MODEL);
    const beforePhysics = JSON.parse(JSON.stringify(model.physicsState));
    const beforeEvidence = snapshotEvidence(model);
    let viewing = model;
    while (lensDisplayStage(viewing) !== LearningStage.OBSERVE) {
      viewing = applyLensGoBack(viewing);
    }
    expect(viewing.stage).toBe(LearningStage.MODEL);
    expect(lensDisplayStage(viewing)).toBe(LearningStage.OBSERVE);
    const previewBefore = lensPreviewPhysics(viewing);
    const moved = applyLensReviewPhysics(viewing, (state) => ({
      ...state,
      screenAtImagePlane: !state.screenAtImagePlane,
    }));
    const cycled = applyLensReviewPhysics(moved, (state) => ({
      ...state,
      objectStation: state.objectStation === "beyond-2f" ? "inside-f" : "beyond-2f",
    }));
    expect(cycled.physicsState).toEqual(beforePhysics);
    expect(lensReviewPhysics(cycled)?.screenAtImagePlane).not.toBe(
      previewBefore.screenAtImagePlane,
    );
    expect(lensReviewPhysics(cycled)?.objectStation).not.toBe(previewBefore.objectStation);
    expect(snapshotEvidence(cycled)).toEqual({
      ...beforeEvidence,
      draft: cycled.sceneData.modelDraft,
    });
    const restored = applyLensReturnToProgress(cycled);
    expect(restored.stage).toBe(LearningStage.MODEL);
    expect(restored.physicsState).toEqual(beforePhysics);
    expect(authoritativeLensPhysics(restored)).toEqual(authoritativeLensPhysics(model));
    expect(restored.sceneData[LENS_REVIEW_PHYSICS_KEY]).toBeUndefined();
    expect(snapshotEvidence(restored)).toEqual(beforeEvidence);
  });

  it("does not add evidence or stage_entered while revisiting", () => {
    const viewing = applyLensGoBack(lensSession(LearningStage.MODEL));
    const again = applyLensGoBack(viewing);
    expect(again.observations).toHaveLength(1);
    expect(again.explanations).toHaveLength(1);
    expect(again.modelAttempts).toHaveLength(1);
    expect(again.events.filter((event) => event.type === "stage_entered")).toHaveLength(7);
  });
});

describe("Scene 07 Observe and framing contracts", () => {
  it("does not tell the student to select all visible Observe options", () => {
    expect(LENS_COPY.observeNeedMore).not.toMatch(/都要勾/);
    expect(LENS_COPY.observePrompt).not.toMatch(/三项都/);
    expect(LENS_OBSERVE_OPTIONS.map((option) => option.id)).toEqual([
      "screen-can-change",
      "size-can-change",
      "screen-moves-image",
      "screen-not-always",
    ]);
    expect(evaluateLensObservation([...LENS_OBSERVE_REQUIRED_IDS]).sufficient).toBe(true);
    expect(
      evaluateLensObservation(["screen-can-change", "size-can-change", "screen-moves-image"])
        .sufficient,
    ).toBe(false);
  });

  it("defines context / goal / focus / action for OBSERVE through EXAM", () => {
    const stages = [
      LearningStage.OBSERVE,
      LearningStage.DESCRIBE,
      LearningStage.PREDICT,
      LearningStage.EXPERIMENT,
      LearningStage.EXPLAIN,
      LearningStage.MODEL,
      LearningStage.TRANSFER,
      LearningStage.EXAM,
    ];
    for (const stage of stages) {
      const frame = LENS_TASK_FRAMES[stage];
      expect(frame?.context).toBeTruthy();
      expect(frame?.goal).toBeTruthy();
      expect(frame?.focus).toBeTruthy();
      expect(frame?.action).toBeTruthy();
    }
  });
});

describe("Scene 07 MODEL progressive disclosure still uses one L4 evaluator", () => {
  it("keeps seven construction steps and one official evaluator on submit", () => {
    expect(LENS_MODEL_STEP_COUNT).toBe(7);
    const empty = emptyLensModelDraft();
    expect(lensModelStepComplete(empty, 1)).toBe(false);
    expect(buildLensModelAttempt(empty, "t").correctStructure).toBe(false);
    const draft = completeLensModelDraft();
    expect(draft.constructionStep).toBe(7);
    expect(lensModelStepComplete(draft, 7)).toBe(true);
    const attempt = draftToConvexLensAttempt(draft);
    expect(attempt).not.toBeNull();
    expect(evaluateConvexLensModelConstruction(attempt!).ok).toBe(true);
    expect(buildLensModelAttempt(draft, "t").correctStructure).toBe(true);
  });
});

describe("Scene 07 feedback and help", () => {
  it("maps failureKind to actionable non-answer feedback", () => {
    const missing = lensFeedbackForFailureKind(undefined, ["会聚方式"]);
    expect(missing.kind).toBe("missing");
    const conflict = lensFeedbackForFailureKind("image-conflicts-meeting-mode", []);
    expect(conflict.kind).toBe("inconsistent");
    expect(conflict.message).toMatch(/冲突/);
    expect(conflict.message).not.toMatch(/倒立缩小实像/);
    expect(conflict.message).not.toMatch(/正确答案/);
    const think = lensFeedbackForFailureKind("table-row-only", []);
    expect(think.kind).toBe("think_again");
    expect(think.message).not.toMatch(/选实际会聚/);
  });

  it("shows only task-visible help intents", () => {
    expect(availableLensHelpIntents(LearningStage.OBSERVE)).toEqual([
      "what-now",
      "where-look",
    ]);
    expect(availableLensHelpIntents(LearningStage.OBSERVE)).not.toContain("how-rays");
    expect(
      availableLensHelpIntents(LearningStage.MODEL, { constructionStep: 2 }),
    ).toContain("how-rays");
    expect(
      availableLensHelpIntents(LearningStage.MODEL, { constructionStep: 5 }),
    ).toEqual(["how-image"]);
    expect(availableLensHelpIntents(LearningStage.AI_OFF)).toEqual([]);
    const observe = lensSession(LearningStage.OBSERVE);
    observe.stage = LearningStage.OBSERVE;
    expect(applyLensHelpIntent(observe, LearningStage.OBSERVE, "how-rays")).toBe(observe);
  });

  it("blocks help intents on AI_OFF", () => {
    expect(lensHelpAllowed(LearningStage.AI_OFF)).toBe(false);
    const session = {
      ...lensSession(LearningStage.AI_OFF),
      stage: LearningStage.AI_OFF,
    };
    expect(applyLensHelpIntent(session, LearningStage.AI_OFF, "what-now")).toBe(session);
    expect(applyLensHelpNext(session, LearningStage.AI_OFF)).toBe(session);
  });
});
