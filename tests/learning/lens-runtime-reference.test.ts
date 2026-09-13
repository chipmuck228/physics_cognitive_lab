import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { evaluateConvexLensModelConstruction } from "@/content/physics-models/convex-lens-imaging/construction";
import { LENS_TASK_FRAMES } from "@/lib/content/convex-lens-optical-bench";
import { presentLensActionResponse } from "@/lib/learning/lens-action-response";
import { lensCognitiveTraceItems } from "@/lib/learning/lens-cognitive-trace";
import {
  lensFeedbackForFailureKind,
  lensBlockedFeedback,
  lensErrorFeedback,
} from "@/lib/learning/lens-feedback";
import {
  applyLensHelpIntent,
  availableLensHelpIntents,
  isLensHelpTextLegal,
  lensHelpAllowed,
  lensHelpLadder,
  lensHelpPrompts,
} from "@/lib/learning/lens-help-intents";
import {
  lensContextLookableReference,
  lensVisibleInteractionContext,
} from "@/lib/learning/lens-interaction-context";
import {
  completeLensModelDraft,
  draftToConvexLensAttempt,
  emptyLensModelDraft,
} from "@/lib/learning/lens-model";
import {
  applyLensGoBack,
  applyLensReturnToProgress,
  applyLensReviewPhysics,
  isLensRevisiting,
  LENS_REVIEW_PHYSICS_KEY,
  lensDisplayStage,
} from "@/lib/learning/lens-revisit";
import { createSession } from "@/lib/learning/session";
import {
  CONVEX_LENS_SCENE_ID,
  LearningStage,
  type LearningSession,
} from "@/types/learning";

function modelSession(): LearningSession {
  const session = createSession(() => "t0", () => "lens-ref", CONVEX_LENS_SCENE_ID);
  const draft = completeLensModelDraft();
  return {
    ...session,
    stage: LearningStage.MODEL,
    observations: [
      {
        text: "光屏有时清晰有时接不到。",
        timestamp: "t1",
        selectedOptionIds: ["screen-can-change"],
        sufficient: true,
      },
    ],
    explanations: [
      {
        text: "有的位置光线真正会聚。",
        timestamp: "t5",
        sufficient: true,
      },
    ],
    modelAttempts: [],
    sceneData: { ...session.sceneData, modelDraft: draft },
    events: [
      ...session.events,
      { type: "stage_entered", timestamp: "t6", stage: LearningStage.MODEL },
    ],
  };
}

function evidenceSnapshot(session: LearningSession) {
  return {
    stage: session.stage,
    observations: session.observations,
    descriptions: session.descriptions,
    predictions: session.predictions,
    experimentEvidence: session.experimentEvidence,
    explanations: session.explanations,
    modelAttempts: session.modelAttempts,
    entered: session.events.filter((event) => event.type === "stage_entered"),
    physics: session.physicsState,
  };
}

describe("Scene 07 reference state split", () => {
  it("1-2. Back never changes session.stage or appends official stage_entered", () => {
    const session = modelSession();
    const before = evidenceSnapshot(session);
    const viewing = applyLensGoBack(session);
    expect(viewing.stage).toBe(LearningStage.MODEL);
    expect(isLensRevisiting(viewing)).toBe(true);
    expect(lensDisplayStage(viewing)).toBe(LearningStage.EXPLAIN);
    expect(viewing.events.filter((event) => event.type === "stage_entered")).toEqual(
      before.entered,
    );
  });

  it("3-5. Review preview never writes physics or Evidence; Return restores progress view", () => {
    const session = modelSession();
    const before = evidenceSnapshot(session);
    let viewing = session;
    while (lensDisplayStage(viewing) !== LearningStage.OBSERVE) {
      viewing = applyLensGoBack(viewing);
    }
    const previewed = applyLensReviewPhysics(viewing, (state) => ({
      ...state,
      screenAtImagePlane: !state.screenAtImagePlane,
    }));
    expect(previewed.physicsState).toEqual(before.physics);
    expect(previewed.observations).toEqual(before.observations);
    expect(previewed.explanations).toEqual(before.explanations);
    expect(previewed.modelAttempts).toEqual(before.modelAttempts);
    const restored = applyLensReturnToProgress(previewed);
    expect(restored.stage).toBe(LearningStage.MODEL);
    expect(isLensRevisiting(restored)).toBe(false);
    expect(lensDisplayStage(restored)).toBe(LearningStage.MODEL);
    expect(restored.sceneData[LENS_REVIEW_PHYSICS_KEY]).toBeUndefined();
    expect(restored.physicsState).toEqual(before.physics);
  });

  it("6. Help cannot wipe uncommitted draft keys", () => {
    const base = modelSession();
    const session: LearningSession = {
      ...base,
      stage: LearningStage.OBSERVE,
      sceneData: {
        ...base.sceneData,
        observeDraft: ["screen-can-change"],
        predictDraft: { experimentId: "A", outcome: "unsure", reason: "先写着" },
      },
    };
    const helped = applyLensHelpIntent(session, LearningStage.OBSERVE, "what-now");
    expect(helped.sceneData.observeDraft).toEqual(["screen-can-change"]);
    expect(helped.sceneData.predictDraft).toEqual({
      experimentId: "A",
      outcome: "unsure",
      reason: "先写着",
    });
    expect(helped.sceneData.modelDraft).toEqual(session.sceneData.modelDraft);
    expect(helped.observations).toEqual(session.observations);
  });
});

describe("Scene 07 VisibleInteractionContext help binding", () => {
  const lookAtRays = "先看两条光线过透镜以后是聚到一起，还是散开。";

  it("7-9. OBSERVE cannot discuss rays; MODEL editor may mention rays textually", () => {
    const observe = lensVisibleInteractionContext(LearningStage.OBSERVE);
    expect(observe.references.map((item) => item.id)).not.toContain("ray");
    expect(availableLensHelpIntents(LearningStage.OBSERVE, { interaction: observe })).toEqual([
      "what-now",
      "where-look",
    ]);
    expect(availableLensHelpIntents(LearningStage.OBSERVE)).not.toContain("how-rays");
    for (const line of lensHelpPrompts("where-look", 4, observe)) {
      expect(isLensHelpTextLegal(line, observe)).toBe(true);
      expect(line).not.toMatch(/光线/);
    }

    const station = lensVisibleInteractionContext(LearningStage.MODEL, {
      constructionStep: 1,
      modelDraft: emptyLensModelDraft(),
    });
    expect(station.references.some((item) => item.id === "ray")).toBe(false);
    expect(availableLensHelpIntents(LearningStage.MODEL, { constructionStep: 1 })).toEqual([
      "what-now",
    ]);

    const editor = lensVisibleInteractionContext(LearningStage.MODEL, {
      constructionStep: 2,
      modelDraft: { ...emptyLensModelDraft(), constructionStep: 2 },
    });
    expect(editor.references).toContainEqual({ id: "ray", kind: "textual" });
    expect(lensContextLookableReference(editor, "ray")).toBe(false);
    expect(
      availableLensHelpIntents(LearningStage.MODEL, { constructionStep: 2, interaction: editor }),
    ).toContain("how-rays");
    expect(isLensHelpTextLegal("先选一条你能说清楚的光线。", editor)).toBe(true);
    expect(isLensHelpTextLegal(lookAtRays, editor)).toBe(false);
    expect(isLensHelpTextLegal("先选一条你能说清楚的光线。", observe)).toBe(false);
  });

  it("EXPLAIN cannot use a look-at-two-rays hint when no rays render", () => {
    const explain = lensVisibleInteractionContext(LearningStage.EXPLAIN);
    expect(explain.references.find((item) => item.id === "ray")?.kind).toBe("textual");
    expect(lensContextLookableReference(explain, "ray")).toBe(false);
    expect(isLensHelpTextLegal(lookAtRays, explain)).toBe(false);
    expect(lensHelpLadder("how-meeting", explain).join("\n")).not.toMatch(/先看两条光线/);
  });

  it("TRANSFER cannot use a rendered-ray observation hint", () => {
    const transfer = lensVisibleInteractionContext(LearningStage.TRANSFER);
    expect(transfer.references.find((item) => item.id === "ray")?.kind).toBe("textual");
    expect(lensContextLookableReference(transfer, "ray")).toBe(false);
    expect(isLensHelpTextLegal(lookAtRays, transfer)).toBe(false);
    expect(lensHelpLadder("how-image", transfer).join("\n")).not.toMatch(/先看两条光线/);
    expect(lensHelpLadder("how-say", transfer).join("\n")).toMatch(/光线关系/);
    expect(lensHelpLadder("how-say", transfer).join("\n")).not.toMatch(/光屏位置/);
  });

  it("MODEL look-at-ray help is legal only when learner rays are constructed", () => {
    const withRays = lensVisibleInteractionContext(LearningStage.MODEL, {
      constructionStep: 4,
      modelDraft: { ...completeLensModelDraft(), constructionStep: 4 },
    });
    expect(lensContextLookableReference(withRays, "ray")).toBe(true);
    expect(isLensHelpTextLegal(lookAtRays, withRays)).toBe(true);
    expect(lensHelpLadder("how-meeting", withRays)[0]).toMatch(/先看两条光线/);
  });

  it("11. AI_OFF has zero help", () => {
    expect(lensHelpAllowed(LearningStage.AI_OFF)).toBe(false);
    expect(availableLensHelpIntents(LearningStage.AI_OFF)).toEqual([]);
    const session = { ...modelSession(), stage: LearningStage.AI_OFF };
    expect(applyLensHelpIntent(session, LearningStage.AI_OFF, "what-now")).toBe(session);
  });
});

describe("Scene 07 action-response presentation ownership", () => {
  it("10. maps Scene/evaluator outcomes without deciding them", () => {
    expect(presentLensActionResponse({ kind: "physics-applied", review: false })).toBe("applied");
    expect(presentLensActionResponse({ kind: "physics-applied", review: true })).toBe(
      "review-applied",
    );
    expect(presentLensActionResponse({ kind: "committed", advanced: true })).toBe("advanced");
    expect(presentLensActionResponse({ kind: "missing" })).toBe("missing");
    expect(presentLensActionResponse({ kind: "rejected" })).toBe("rejected");
    expect(presentLensActionResponse({ kind: "blocked" })).toBe("blocked");
    expect(presentLensActionResponse({ kind: "system-error" })).toBe("system-error");
    expect(presentLensActionResponse({ kind: "preview-discarded" })).toBe("discarded");
  });

  it("maps failureKind to learner-facing kinds without leaking official answers", () => {
    expect(lensFeedbackForFailureKind(undefined, ["会聚方式"]).kind).toBe("missing");
    expect(lensFeedbackForFailureKind("image-conflicts-meeting-mode", []).kind).toBe(
      "inconsistent",
    );
    expect(lensFeedbackForFailureKind("table-row-only", []).kind).toBe("think_again");
    expect(lensBlockedFeedback("现在不能提交。").kind).toBe("blocked");
    expect(lensErrorFeedback("请再试一次。").kind).toBe("error");
    expect(lensFeedbackForFailureKind("image-conflicts-meeting-mode", []).message).not.toMatch(
      /倒立缩小实像/,
    );
  });
});

describe("Scene 07 framing and trace", () => {
  it("12. Task frames expose context/goal/focus/action", () => {
    for (const stage of [
      LearningStage.OBSERVE,
      LearningStage.DESCRIBE,
      LearningStage.PREDICT,
      LearningStage.EXPERIMENT,
      LearningStage.EXPLAIN,
      LearningStage.MODEL,
      LearningStage.TRANSFER,
      LearningStage.EXAM,
    ]) {
      const frame = LENS_TASK_FRAMES[stage];
      expect(frame?.context && frame.goal && frame.focus && frame.action).toBeTruthy();
    }
  });

  it("13. Cognitive trace reads Evidence and does not mutate it", () => {
    const session = modelSession();
    const before = JSON.stringify(evidenceSnapshot(session));
    const items = lensCognitiveTraceItems(session);
    expect(items.map((item) => item.label)).toEqual([
      "观察",
      "描述",
      "预测",
      "验证",
      "解释",
      "建模",
      "新情境",
      "考试",
      "独立",
    ]);
    expect(items.find((item) => item.id === "observe")?.summary).toMatch(/光屏/);
    expect(JSON.stringify(evidenceSnapshot(session))).toBe(before);
  });

  it("presentation must not re-evaluate Scene-owned action results", () => {
    const lab = readFileSync("components/learning/ConvexLensOpticalBenchLab.tsx", "utf8");
    expect(lab).not.toMatch(/evaluateLensObservation\(/);
    expect(lab).not.toMatch(/evaluateLensDescription\(/);
    expect(lab).not.toMatch(/evaluateLensExplanation\(/);
    expect(lab).not.toMatch(/buildLensExamAttempt\(/);
    expect(lab).not.toMatch(/canCommitLensExamAttempt\(/);
    expect(lab).not.toMatch(/canCommitLensAiOffResponse\(/);
    expect(lab).not.toMatch(/if \(missing\.length === 0\)/);
    expect(lab).toMatch(/presentAction\(outcome\)/);
  });

  it("14. Official MODEL evaluator is unchanged", () => {
    const attempt = draftToConvexLensAttempt(completeLensModelDraft());
    expect(attempt).not.toBeNull();
    expect(evaluateConvexLensModelConstruction(attempt!).ok).toBe(true);
  });
});
