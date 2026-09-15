import { describe, expect, it } from "vitest";

import {
  evaluateConvexLensModelConstruction,
} from "@/content/physics-models/convex-lens-imaging/construction";
import {
  LENS_COPY,
  LENS_EXPLAIN_MEETING,
  LENS_EXPLAIN_SCREEN,
  LENS_MEETING_OPTIONS,
  LENS_OBSERVED_FIELDS,
  LENS_STAGE_PROMPTS,
  lensLightPathNeedCopy,
  lensObservedSizeOptions,
  lensPredictQuestion,
  lensReflectionPrompt,
} from "@/lib/content/convex-lens-optical-bench";
import { evaluateLensExplanation } from "@/lib/learning/lens-explain";
import { lensExperimentPedagogicalRays } from "@/lib/learning/lens-experiment-rays";
import {
  buildLensModelAttempt,
  completeLensModelDraft,
  draftToConvexLensAttempt,
  emptyLensModelDraft,
} from "@/lib/learning/lens-model";
import { lensExperimentCurrentAction } from "@/lib/learning/lens-now-do";
import { lensTrialSpec } from "@/lib/learning/lens-trial-intervention";
import { accumulateConvexLensSceneEvidence } from "@/lib/learning/lens-evidence";
import { createSession } from "@/lib/learning/session";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import {
  LENS_EXPERIMENT_A,
  LENS_EXPERIMENT_B,
  LENS_EXPERIMENT_C,
  LENS_EXPERIMENT_D,
} from "@/lib/physics/convex-lens-optical-bench";
import { CONVEX_LENS_SCENE_ID, LearningStage } from "@/types/learning";

function primaryFlowCopy(): string {
  return [
    LENS_COPY.landingBody,
    LENS_COPY.observeCaption,
    LENS_COPY.describeInstruction,
    LENS_COPY.predictInstruction,
    LENS_COPY.explainMeeting,
    LENS_COPY.explainScreen,
    LENS_COPY.explainOwnWords,
    LENS_STAGE_PROMPTS[LearningStage.ENTRY],
    LENS_STAGE_PROMPTS[LearningStage.OBSERVE],
    LENS_STAGE_PROMPTS[LearningStage.DESCRIBE],
    LENS_STAGE_PROMPTS[LearningStage.PREDICT],
    LENS_STAGE_PROMPTS[LearningStage.EXPERIMENT],
    LENS_STAGE_PROMPTS[LearningStage.EXPLAIN],
    ...LENS_EXPLAIN_MEETING.map((option) => option.label),
    ...LENS_EXPLAIN_SCREEN.map((option) => option.label),
    ...LENS_OBSERVED_FIELDS.screen.map((option) => option.label),
    ...LENS_OBSERVED_FIELDS.sizeOrCover.map((option) => option.label),
    lensPredictQuestion(LENS_EXPERIMENT_A),
    lensPredictQuestion(LENS_EXPERIMENT_B),
    lensPredictQuestion(LENS_EXPERIMENT_C),
    lensPredictQuestion(LENS_EXPERIMENT_D),
    lensReflectionPrompt(LENS_EXPERIMENT_A),
    lensReflectionPrompt(LENS_EXPERIMENT_B),
    lensReflectionPrompt(LENS_EXPERIMENT_C),
    lensReflectionPrompt(LENS_EXPERIMENT_D),
    lensTrialSpec(LENS_EXPERIMENT_A).instruction,
    lensTrialSpec(LENS_EXPERIMENT_B).instruction,
    lensTrialSpec(LENS_EXPERIMENT_C).instruction,
    lensTrialSpec(LENS_EXPERIMENT_D).instruction,
    lensTrialSpec(LENS_EXPERIMENT_B).nextAfterIntervene,
    lensExperimentCurrentAction(LENS_EXPERIMENT_B, "inspect").nowDo,
    lensExperimentCurrentAction(LENS_EXPERIMENT_B, "record").nowDo,
    lensLightPathNeedCopy(LENS_EXPERIMENT_B) ?? "",
  ].join("\n");
}

describe("Scene 07 Learner Experience v1.1", () => {
  it("does not require 会聚, 平行 as a premise, or 像在无限远 in primary flow copy", () => {
    const copy = primaryFlowCopy();
    expect(copy).not.toMatch(/会聚/);
    expect(copy).not.toMatch(/像在无限远/);
    expect(copy).not.toMatch(/不要把它说成又一种普通成像/);
    expect(copy).not.toMatch(/折射后的光线还彼此平行/);
    expect(copy).not.toMatch(/有限远处有没有交点/);
    expect(lensTrialSpec(LENS_EXPERIMENT_B).instruction).not.toMatch(/平行/);
    expect(lensExperimentCurrentAction(LENS_EXPERIMENT_B, "inspect").nowDo).not.toMatch(/平行/);
    expect(lensExperimentCurrentAction(LENS_EXPERIMENT_B, "record").nowDo).not.toMatch(/平行/);
  });

  it("u = f shows screen failure language before light-path language", () => {
    expect(lensTrialSpec(LENS_EXPERIMENT_B).nextAfterIntervene).toMatch(/移动光屏/);
    expect(lensTrialSpec(LENS_EXPERIMENT_B).nextAfterIntervene).not.toMatch(/光线/);
    expect(lensExperimentPedagogicalRays({
      experimentId: LENS_EXPERIMENT_B,
      observedSaved: false,
      revealBackwardExtension: false,
    })).toEqual([]);
    expect(lensExperimentPedagogicalRays({
      experimentId: LENS_EXPERIMENT_B,
      observedSaved: true,
      revealBackwardExtension: false,
    }).length).toBeGreaterThan(0);
    expect(lensReflectionPrompt(LENS_EXPERIMENT_B)).toMatch(/碰到一起/);
    expect(lensReflectionPrompt(LENS_EXPERIMENT_B)).toMatch(/光屏/);
    expect(lensReflectionPrompt(LENS_EXPERIMENT_B)).not.toMatch(/像在无限远/);
  });

  it("u < f introduces backward extension only after actual rays are shown", () => {
    expect(lensTrialSpec(LENS_EXPERIMENT_C).instruction).not.toMatch(/反向延长/);
    expect(lensExperimentPedagogicalRays({
      experimentId: LENS_EXPERIMENT_C,
      observedSaved: true,
      revealBackwardExtension: false,
    }).every((ray) => ray.incidentPath === "actual")).toBe(true);
    expect(lensExperimentPedagogicalRays({
      experimentId: LENS_EXPERIMENT_C,
      observedSaved: true,
      revealBackwardExtension: true,
    }).some((ray) => ray.incidentPath === "backward-extension")).toBe(true);
    expect(lensReflectionPrompt(LENS_EXPERIMENT_C)).toMatch(/碰到一起/);
    expect(lensReflectionPrompt(LENS_EXPERIMENT_C)).not.toMatch(/反向延长线相交，所以是虚像/);
  });

  it("EXPLAIN single-select groups are mutually exclusive observations", () => {
    expect(LENS_EXPLAIN_MEETING.map((option) => option.value)).toEqual([
      "sometimes-receives",
      "always-receives",
      "never-receives",
      "slogan-only",
    ]);
    expect(LENS_EXPLAIN_SCREEN.map((option) => option.value)).toEqual([
      "visible-not-same",
      "same-as-screen",
      "no-image-if-no-screen",
    ]);
    expect(LENS_EXPLAIN_MEETING.map((option) => option.label).join("\n")).not.toMatch(
      /有的位置上，光线会真正交在一起/,
    );
    expect(evaluateLensExplanation({
      meetingFragment: "sometimes-receives",
      screenFragment: "visible-not-same",
      studentExplanation: "有的位置接得到，有的位置接不到。看见不等于接到。",
    }).sufficient).toBe(true);
    expect(evaluateLensExplanation({
      meetingFragment: "always-receives",
      screenFragment: "visible-not-same",
      studentExplanation: "有的位置接得到，有的位置接不到。看见不等于接到。",
    }).sufficient).toBe(false);
  });

  it("MODEL meeting options are exclusive station-scoped relations, not whole-model slogans", () => {
    const labels = LENS_MEETING_OPTIONS.map((option) => option.label).join("\n");
    expect(labels).not.toMatch(/有的位置上/);
    expect(new Set(LENS_MEETING_OPTIONS.map((option) => option.value)).size).toBe(3);
  });

  it("authored summary alone cannot manufacture MODEL construction evidence", () => {
    const draft = {
      ...emptyLensModelDraft(),
      studentReasoning:
        "物体位置决定光线会不会碰到一起，碰到一起光屏才能接到。",
    };
    const attempt = buildLensModelAttempt(draft, "t1");
    expect(attempt.correctStructure).toBe(false);
    const evidence = accumulateConvexLensSceneEvidence({
      ...createSession(() => "t0", () => "lx-v11", CONVEX_LENS_SCENE_ID),
      modelAttempts: [attempt],
    });
    expect(evidence.constructedValidCausalModel).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).not.toBe("L4");
  });

  it("selecting complete construction still yields L4 and Physics Truth evaluator is unchanged", () => {
    const draft = completeLensModelDraft("beyond-2f");
    const attempt = buildLensModelAttempt(draft, "t1");
    expect(attempt.correctStructure).toBe(true);
    const official = evaluateConvexLensModelConstruction(draftToConvexLensAttempt(draft)!);
    expect(official.ok).toBe(true);
  });

  it("trial B observed size options do not leak parallel-ray language", () => {
    expect(lensObservedSizeOptions(LENS_EXPERIMENT_B).map((option) => option.label).join("\n")).not.toMatch(
      /平行/,
    );
  });
});
