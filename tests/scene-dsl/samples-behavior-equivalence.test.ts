import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { densityMassVolumeModel } from "@/content/physics-models/density-mass-volume";
import {
  SAMPLES_AI_OFF_CHALLENGE_IDS,
  SAMPLES_COMPLETE_COPY,
  SAMPLES_COPY,
  SAMPLES_EXAM_PATTERN_IDS,
  SAMPLES_OBSERVE_REQUIRED_IDS,
  SAMPLES_STAGE_PROMPTS,
  samplesSceneDsl,
} from "@/lib/content/equal-volume-material-samples";
import {
  completeSamplesExplainInput,
  evaluateSamplesExplanation,
} from "@/lib/learning/samples-explain";
import { accumulateSamplesSceneEvidence } from "@/lib/learning/samples-evidence";
import {
  buildSamplesModelAttempt,
  completeSamplesModelInput,
} from "@/lib/learning/samples-model";
import { evaluateSamplesObservation } from "@/lib/learning/samples-observe";
import { evaluateSamplesPrediction } from "@/lib/learning/samples-predict";
import { samplesHintLadder } from "@/lib/learning/samples-hint-ladder";
import { samplesTutorConstraint } from "@/lib/learning/samples-tutor-context";
import {
  completeSamplesCupsTransferInput,
  completeSamplesHollowTransferInput,
} from "@/lib/learning/samples-transfer";
import { createSession } from "@/lib/learning/session";
import { STAGE_TUTOR_POLICY, isTutorHardBlocked } from "@/lib/learning/stage-policy";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import {
  densityGPerCm3,
  SAMPLE_CATALOG,
} from "@/lib/physics/equal-volume-material-samples";
import { LearningStage, SAMPLES_SCENE_ID } from "@/types/learning";

function read(path: string): string {
  return readFileSync(path, "utf8");
}

describe("Scene 04 hybrid DSL behavior equivalence", () => {
  it("keeps stage prompts and complete copy identical to the pre-pilot strings", () => {
    expect(SAMPLES_STAGE_PROMPTS[LearningStage.OBSERVE]).toBe(
      "先不要下结论。仔细看看：它们看起来一样大吗？谁更沉？",
    );
    expect(SAMPLES_STAGE_PROMPTS[LearningStage.MODEL]).toBe(
      "把质量和体积怎样得到密度写清楚。不要排成能量链，也不要排成力的关系板。",
    );
    expect(SAMPLES_COPY.landingCta).toBe("开始探索");
    expect(SAMPLES_COPY.observeSubmit).toBe("记下看到的");
    expect(SAMPLES_COPY.predictSubmit).toBe("记下猜测");
    expect(SAMPLES_COPY.massUnit).toBe("g");
    expect(SAMPLES_COPY.volumeUnit).toBe("cm³");
    expect(SAMPLES_COPY.densityUnit).toBe("g/cm³");
    expect(SAMPLES_COMPLETE_COPY.title).toBe(
      "你已经完成了这次学习循环和独立挑战。",
    );
    expect(samplesSceneDsl.copy.observeSubmit).toBe(SAMPLES_COPY.observeSubmit);
  });

  it("keeps observe required IDs and prediction sufficiency rules", () => {
    expect(SAMPLES_OBSERVE_REQUIRED_IDS).toEqual(["same-size", "one-heavier"]);
    expect(evaluateSamplesObservation(["same-size", "one-heavier"]).sufficient).toBe(
      true,
    );
    expect(evaluateSamplesObservation(["same-size"]).sufficient).toBe(false);
    expect(
      evaluateSamplesPrediction("heavier-denser", "体积相同，更沉的更密。").sufficient,
    ).toBe(true);
    expect(evaluateSamplesPrediction("heavier-denser", "").sufficient).toBe(false);
  });

  it("keeps MODEL / transfer / explain contracts that existing tests rely on", () => {
    expect(buildSamplesModelAttempt(completeSamplesModelInput("t")).correctStructure).toBe(
      true,
    );
    expect(evaluateSamplesExplanation(completeSamplesExplainInput()).sufficient).toBe(
      true,
    );
    expect(completeSamplesCupsTransferInput("t").targetId).toBe(
      "near-equal-cups-of-liquids",
    );
    expect(completeSamplesHollowTransferInput("t").targetId).toBe(
      "far-hollow-same-outer-size",
    );
  });

  it("keeps exam sequence and AI_OFF hard boundary", () => {
    expect([...SAMPLES_EXAM_PATTERN_IDS]).toEqual([
      "exam-density-is-not-mass-or-size",
      "exam-same-volume-larger-mass",
      "exam-cut-uniform-density-unchanged",
      "exam-calculate-density-ratio",
      "exam-mass-volume-density-table",
    ]);
    expect([...SAMPLES_AI_OFF_CHALLENGE_IDS]).toEqual([
      "ai-off-unfamiliar-sealed-packages",
      "ai-off-condition-cut-uniform-bar",
    ]);
    expect(samplesSceneDsl.aiOff.tutorEnabled).toBe(false);
    expect(isTutorHardBlocked(LearningStage.AI_OFF)).toBe(true);
    expect(STAGE_TUTOR_POLICY[LearningStage.AI_OFF]).toEqual([]);
    expect(
      densityMassVolumeModel.independentChallenges.every(
        (challenge) => challenge.llmAllowed === false,
      ),
    ).toBe(true);
  });

  it("keeps official density physics and PRI units", () => {
    const iron = SAMPLE_CATALOG["iron-cube"];
    expect(iron).toBeDefined();
    expect(densityGPerCm3(iron)).toBe(iron.massG / iron.volumeCm3);
    expect(samplesSceneDsl.copy.massUnit).toBe("g");
    expect(samplesSceneDsl.copy.volumeUnit).toBe("cm³");
    expect(samplesSceneDsl.copy.densityUnit).toBe("g/cm³");
  });

  it("keeps hint ladder owned by the Physics Model", () => {
    expect(samplesSceneDsl.hintLadder.source).toBe("physics-model");
    expect(samplesHintLadder()).toBe(densityMassVolumeModel.tutorPolicy.hintLadder);
  });

  it("keeps tutor leak constraints in code, not in a formula string DSL", () => {
    expect(samplesTutorConstraint(LearningStage.PREDICT)).toContain(
      "不要说出实验结果",
    );
    expect(samplesTutorConstraint(LearningStage.MODEL)).toContain("ρ = m / V");
  });

  it("does not add sceneId branches to universal runtime", () => {
    const progression = read("lib/learning/progression.ts");
    const tutorRequest = read("lib/learning/tutor-request.ts");
    const tutorHook = read("hooks/useTutor.ts");
    expect(progression).not.toMatch(/equal-volume-material-samples/);
    expect(progression).not.toMatch(/density-mass-volume/);
    expect(tutorRequest).not.toMatch(/equal-volume-material-samples/);
    expect(tutorHook).not.toMatch(/equal-volume-material-samples/);
  });

  it("still derives L-levels only from accumulateSamplesSceneEvidence flags", () => {
    const empty = accumulateSamplesSceneEvidence(
      createSession(() => "t0", () => "samples-session", SAMPLES_SCENE_ID),
    );
    expect(deriveModelEvidenceLevel(empty)).toBe("L0");
    expect(empty.constructedValidCausalModel).toBeUndefined();
  });
});
