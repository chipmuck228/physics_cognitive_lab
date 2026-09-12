import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { extractDensitySignals } from "@/content/physics-models/density-mass-volume/evaluator";
import { accumulateSamplesSceneEvidence } from "@/lib/learning/samples-evidence";
import {
  SAMPLES_AI_OFF_CHALLENGE_IDS,
  completeSamplesAiOffAttempt,
  completeSamplesAiOffInput,
  evaluateSamplesAiOffAttempt,
  hasMeaningfulSamplesIndependentReasoning,
  intendedSamplesAiOffAnswerId,
  intendedSamplesAiOffPostCheckIds,
} from "@/lib/learning/samples-ai-off";
import { isSamplesExperimentClosed } from "@/lib/learning/samples-experiment";
import {
  buildSamplesModelAttempt,
  completeSamplesModelInput,
  formulaOnlySamplesModelInput,
  hasRatioReasoningStructure,
  memorizedRulesSamplesModelInput,
} from "@/lib/learning/samples-model";
import {
  buildSamplesTransferAttempt,
  completeSamplesCupsTransferInput,
  completeSamplesHollowTransferInput,
} from "@/lib/learning/samples-transfer";
import { createSession } from "@/lib/learning/session";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import { LearningStage, SAMPLES_SCENE_ID } from "@/types/learning";
import type { ExperimentEvidence } from "@/types/learning";

const PACKAGES = SAMPLES_AI_OFF_CHALLENGE_IDS[0];
const CUT = SAMPLES_AI_OFF_CHALLENGE_IDS[1];

describe("Scene 04 ratio-model pedagogy", () => {
  it("does not grant valid MODEL evidence from the formula alone", () => {
    const attempt = buildSamplesModelAttempt(formulaOnlySamplesModelInput("t"));
    expect(attempt.correctStructure).toBe(false);
    expect(attempt.failureKinds).toContain("missing-same-volume-relation");
    expect(attempt.failureKinds).toContain("missing-proportional-invariance");
    expect(attempt.failureKinds).toContain("mass-increase-implies-density");

    const evidence = accumulateSamplesSceneEvidence({
      ...createSession(() => "t0", () => "formula-only", SAMPLES_SCENE_ID),
      modelAttempts: [attempt],
    });
    expect(evidence.constructedValidCausalModel).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).not.toBe("L4");
    expect(deriveModelEvidenceLevel(evidence)).toBe("L0");
  });

  it("does not grant valid MODEL evidence from the formula plus memorized isolated rules", () => {
    const attempt = buildSamplesModelAttempt(memorizedRulesSamplesModelInput("t"));
    expect(attempt.correctStructure).toBe(false);
    expect(attempt.failureKinds).toContain("missing-proportional-invariance");
    expect(attempt.failureKinds).toContain("mass-increase-implies-density");

    const evidence = accumulateSamplesSceneEvidence({
      ...createSession(() => "t0", () => "memorized-rules", SAMPLES_SCENE_ID),
      modelAttempts: [attempt],
    });
    expect(evidence.constructedValidCausalModel).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).not.toBe("L4");
  });

  it("grants valid MODEL evidence only from ratio reasoning", () => {
    const input = completeSamplesModelInput("t");
    expect(hasRatioReasoningStructure(input)).toBe(true);
    expect(buildSamplesModelAttempt(input).correctStructure).toBe(true);

    const evidence = accumulateSamplesSceneEvidence({
      ...createSession(() => "t0", () => "ratio-model", SAMPLES_SCENE_ID),
      modelAttempts: [buildSamplesModelAttempt(input)],
    });
    expect(evidence.constructedValidCausalModel).toBe(true);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L4");
    expect(JSON.stringify(evidence)).not.toMatch(/"L4"|"L5"|"L6"/);
  });

  it("does not close Experiment C without the before/after ratio comparison", () => {
    const missingTogether: ExperimentEvidence = {
      prediction: "density-unchanged",
      predictionReason: "我先记下自己的猜测。",
      predictionComparison: "不一样",
      reflection: "切开后质量和体积好像都变了。",
      timestamp: "t2",
      experimentId: "cut-uniform-sample",
      committedAt: "t1",
      interventionAt: "t2",
      intervention: { comparisonMode: "cut-uniform" },
      observedResult: {
        massChange: "half",
        volumeChange: "half",
        densityChange: "unchanged",
      },
      comparison: "different",
      physicsResult: { densityGPerCm3: 7.9 },
      authoredBeforeIntervention: true,
    };
    expect(isSamplesExperimentClosed(missingTogether)).toBe(false);

    const withTogether: ExperimentEvidence = {
      ...missingTogether,
      observedResult: {
        massChange: "half",
        volumeChange: "half",
        densityChange: "unchanged",
        togetherChange: "same-proportion",
      },
    };
    expect(isSamplesExperimentClosed(withTogether)).toBe(true);
  });

  it("requires uniform-cut proportional invariance, not same-material slogan", () => {
    const sameMaterial = buildSamplesModelAttempt({
      ...completeSamplesModelInput("t"),
      cutWhy: "same-material-alone",
    });
    expect(sameMaterial.correctStructure).toBe(false);
    expect(sameMaterial.failureKinds).toContain("same-material-without-proportion");

    const missingTogether = buildSamplesModelAttempt({
      ...completeSamplesModelInput("t"),
      cutMassChange: "",
      cutVolumeChange: "",
      cutRatioChange: "",
      cutWhy: "",
    });
    expect(missingTogether.correctStructure).toBe(false);
    expect(missingTogether.failureKinds).toContain("missing-proportional-invariance");
  });

  it("rejects mass-increased-therefore-density-increased when volume is unknown", () => {
    const signals = extractDensitySignals("质量变大，所以密度一定变大。");
    expect(signals.claimsHeavierMeansDenser).toBe(true);
    expect(signals.considersMassAndVolumeTogether).toBe(false);

    const attempt = buildSamplesModelAttempt({
      ...completeSamplesModelInput("t"),
      sufficiency: "mass-enough",
    });
    expect(attempt.correctStructure).toBe(false);
    expect(attempt.failureKinds).toContain("mass-increase-implies-density");
    expect(attempt.failureKinds).toContain("heavier-without-volume");
  });

  it("requires the student to treat mass and volume together", () => {
    const needBoth = completeSamplesModelInput("t");
    expect(needBoth.sufficiency).toBe("need-both");
    expect(hasRatioReasoningStructure(needBoth)).toBe(true);

    const volumeOnly = buildSamplesModelAttempt({
      ...needBoth,
      sufficiency: "volume-enough",
    });
    expect(volumeOnly.correctStructure).toBe(false);
  });

  it("does not let AI_OFF conclusion-only reasoning satisfy the strongest evidence", () => {
    const result = evaluateSamplesAiOffAttempt({
      challengeId: CUT,
      selectedAnswer: intendedSamplesAiOffAnswerId(CUT),
      studentReasoning: "因为是同一种物质，所以密度不变。",
      postCheckIds: intendedSamplesAiOffPostCheckIds(CUT),
      llmUsed: false,
    });
    expect(hasMeaningfulSamplesIndependentReasoning("因为是同一种物质，所以密度不变。")).toBe(
      true,
    );
    expect(result.answerCorrect).toBe(true);
    expect(result.reasoningSignals.conclusionOnlyReasoning).toBe(true);
    expect(result.accepted).toBe(false);
  });

  it("accepts AI_OFF model-based proportional reasoning", () => {
    const input = completeSamplesAiOffInput(CUT, "t");
    const result = evaluateSamplesAiOffAttempt({
      ...input,
      llmUsed: false,
    });
    expect(input.studentReasoning).toMatch(/比例|比值/);
    expect(result.accepted).toBe(true);
    expect(result.reasoningSignals.usesProportionalInvariance).toBe(true);
    expect(result.reasoningSignals.conclusionOnlyReasoning).toBe(false);
  });

  it("never treats eight Han characters as physics understanding", () => {
    const authorship = "我已经认真想过了这个问题。";
    expect(hasMeaningfulSamplesIndependentReasoning(authorship)).toBe(true);
    const withoutPostCheck = evaluateSamplesAiOffAttempt({
      challengeId: CUT,
      selectedAnswer: intendedSamplesAiOffAnswerId(CUT),
      studentReasoning: authorship,
      postCheckIds: [],
      llmUsed: false,
    });
    expect(withoutPostCheck.accepted).toBe(false);

    const withPostCheck = evaluateSamplesAiOffAttempt({
      challengeId: CUT,
      selectedAnswer: intendedSamplesAiOffAnswerId(CUT),
      studentReasoning: authorship,
      postCheckIds: intendedSamplesAiOffPostCheckIds(CUT),
      llmUsed: false,
    });
    expect(withPostCheck.accepted).toBe(false);
    expect(withPostCheck.reasoningSignals.hasOwnWords).toBe(true);
  });

  it("rejects package reasoning that uses mass increase alone", () => {
    const result = evaluateSamplesAiOffAttempt({
      challengeId: PACKAGES,
      selectedAnswer: intendedSamplesAiOffAnswerId(PACKAGES),
      studentReasoning: "质量变大，所以密度一定变大。我已经写够字了。",
      postCheckIds: intendedSamplesAiOffPostCheckIds(PACKAGES),
      llmUsed: false,
    });
    expect(result.accepted).toBe(false);
    expect(result.reasoningSignals.avoidsDensityMisconception).toBe(false);
  });

  it("still derives L4/L5/L6 only through the existing evidence system", () => {
    const session = {
      ...createSession(() => "t0", () => "samples-pedagogy", SAMPLES_SCENE_ID),
      stage: LearningStage.AI_OFF,
      modelAttempts: [buildSamplesModelAttempt(completeSamplesModelInput("t"))],
      transferAttempts: [
        buildSamplesTransferAttempt(completeSamplesCupsTransferInput("t1")),
        buildSamplesTransferAttempt(completeSamplesHollowTransferInput("t2")),
      ],
    };
    expect(deriveModelEvidenceLevel(accumulateSamplesSceneEvidence(session))).toBe("L5");

    const withIndependent = {
      ...session,
      independentAssessment: {
        explanation: "",
        examResponses: {},
        completedWithoutAI: true,
        llmUsed: false,
        challengeAttempts: [
          completeSamplesAiOffAttempt(PACKAGES, "t1"),
          completeSamplesAiOffAttempt(CUT, "t2"),
        ],
      },
    };
    expect(deriveModelEvidenceLevel(accumulateSamplesSceneEvidence(withIndependent))).toBe(
      "L6",
    );
    expect(JSON.stringify(withIndependent)).not.toMatch(/"L4"|"L5"|"L6"/);
    expect(readFileSync("lib/learning/samples-model.ts", "utf8")).not.toMatch(
      /["']L4["']/,
    );
    expect(readFileSync("lib/learning/samples-ai-off.ts", "utf8")).not.toMatch(
      /["']L6["']/,
    );
  });
});
