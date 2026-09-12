import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { MODEL_RELATION_IDS } from "@/content/physics-models/density-mass-volume/model";
import { evaluateSamplesDescription } from "@/lib/learning/samples-describe";
import { accumulateSamplesSceneEvidence } from "@/lib/learning/samples-evidence";
import {
  canRunSamplesExperiment,
  hasCompletedSamplesExperiments,
  isSamplesExperimentClosed,
} from "@/lib/learning/samples-experiment";
import {
  completeSamplesExplainInput,
  evaluateSamplesExplanation,
  hasSufficientSamplesExplanation,
} from "@/lib/learning/samples-explain";
import {
  buildSamplesModelAttempt,
  completeSamplesModelInput,
  emptySamplesModelDraft,
  hasCompletedSamplesModel,
} from "@/lib/learning/samples-model";
import { evaluateSamplesObservation } from "@/lib/learning/samples-observe";
import {
  evaluateSamplesPrediction,
  firstCommittedSamplesPrediction,
} from "@/lib/learning/samples-predict";
import {
  buildSamplesTransferAttempt,
  completeSamplesCupsTransferInput,
  completeSamplesHollowTransferInput,
  hasCompletedSamplesTransfer,
} from "@/lib/learning/samples-transfer";
import { createSession } from "@/lib/learning/session";
import { canLeaveStage } from "@/lib/learning/progression";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import {
  SAMPLES_EXPERIMENT_A,
  SAMPLES_EXPERIMENT_B,
  SAMPLES_EXPERIMENT_C,
} from "@/lib/physics/equal-volume-material-samples";
import { equalVolumeMaterialSamplesAdapter } from "@/lib/runtime/adapters/equal-volume-material-samples";
import { LearningStage, SAMPLES_SCENE_ID } from "@/types/learning";
import type { ExperimentEvidence, LearningSession } from "@/types/learning";

function samplesSession(overrides: Partial<LearningSession> = {}): LearningSession {
  return {
    ...createSession(() => "t0", () => "samples-session", SAMPLES_SCENE_ID),
    ...overrides,
  };
}

function closedSamplesEvidence(
  experimentId: string,
  timestamp = "t2",
): ExperimentEvidence {
  const cut = experimentId === SAMPLES_EXPERIMENT_C;
  return {
    prediction: cut ? "density-unchanged" : "heavier-denser",
    predictionReason: "我先记下自己的猜测。",
    predictionComparison: "不一样",
    reflection: "这次比较让我看清质量和体积要一起看。",
    timestamp,
    experimentId,
    committedAt: "t1",
    interventionAt: timestamp,
    intervention: { comparisonMode: cut ? "cut-uniform" : "same-volume" },
    observedResult: cut
      ? {
          massChange: "half",
          volumeChange: "half",
          densityChange: "unchanged",
          togetherChange: "same-proportion",
        }
      : {
          massComparison: "iron-heavier",
          volumeComparison: "same",
          densityComparison: "iron-denser",
        },
    comparison: "different",
    physicsResult: { densityGPerCm3: 7.9 },
    authoredBeforeIntervention: true,
  };
}

describe("samples observation and description", () => {
  it("does not pass OBSERVE from a distractor or any text", () => {
    expect(evaluateSamplesObservation([]).sufficient).toBe(false);
    expect(evaluateSamplesObservation(["two-blocks-on-screen"]).sufficient).toBe(
      false,
    );
    expect(evaluateSamplesObservation(["same-material-same-weight"]).sufficient).toBe(
      false,
    );
    expect(evaluateSamplesObservation(["same-size", "one-heavier"]).sufficient).toBe(
      true,
    );
  });

  it("requires structured DESCRIBE fields, not text length", () => {
    expect(
      evaluateSamplesDescription({
        object: "",
        sizeRelation: "",
        massRelation: "",
        studentDescription: "两块东西两块东西两块东西两块东西。",
      }).sufficient,
    ).toBe(false);
    expect(
      evaluateSamplesDescription({
        object: "samples",
        sizeRelation: "same",
        massRelation: "different",
        studentDescription: "两块看起来差不多大，但一块更沉。",
      }).sufficient,
    ).toBe(true);
  });
});

describe("samples prediction and experiment protocol", () => {
  it("accepts a wrong prediction as committed evidence", () => {
    expect(
      evaluateSamplesPrediction("same-density", "体积一样所以密度一样。").sufficient,
    ).toBe(true);
  });

  it("cannot run until a prediction is committed", () => {
    const session = samplesSession({ stage: LearningStage.EXPERIMENT });
    expect(canRunSamplesExperiment(session, SAMPLES_EXPERIMENT_A)).toBe(false);
  });

  it("keeps the first committed prediction and ignores a later rewrite", () => {
    const first = {
      prediction: "same-density",
      reasoning: "我猜密度一样。",
      timestamp: "t1",
      experimentId: SAMPLES_EXPERIMENT_A,
      committed: true as const,
    };
    const second = {
      prediction: "heavier-denser",
      reasoning: "我想改成更沉更密。",
      timestamp: "t2",
      experimentId: SAMPLES_EXPERIMENT_A,
      committed: true as const,
    };
    expect(
      firstCommittedSamplesPrediction([first, second], SAMPLES_EXPERIMENT_A)
        ?.prediction,
    ).toBe("same-density");
  });

  it("keeps experiment-local predictions inside EXPERIMENT", () => {
    const session = samplesSession({
      stage: LearningStage.EXPERIMENT,
      predictions: [
        {
          prediction: "heavier-denser",
          reasoning: "同样大时更沉应该更密。",
          timestamp: "t1",
          experimentId: SAMPLES_EXPERIMENT_A,
          committed: true,
        },
        {
          prediction: "larger-less-dense",
          reasoning: "同样重时更大应该更疏。",
          timestamp: "t2",
          experimentId: SAMPLES_EXPERIMENT_B,
          committed: true,
        },
      ],
    });
    expect(session.stage).toBe(LearningStage.EXPERIMENT);
    expect(canLeaveStage(session, LearningStage.EXPLAIN)).toBe(false);
    expect(
      firstCommittedSamplesPrediction(session.predictions, SAMPLES_EXPERIMENT_B)
        ?.experimentId,
    ).toBe(SAMPLES_EXPERIMENT_B);
  });

  it("closes only with five-part evidence and keeps experimentId as a string", () => {
    const evidence = closedSamplesEvidence(SAMPLES_EXPERIMENT_A);
    expect(isSamplesExperimentClosed(evidence)).toBe(true);
    expect(typeof evidence.experimentId).toBe("string");
  });

  it("does not treat observe playback as a closed experiment", () => {
    const session = samplesSession({
      stage: LearningStage.EXPERIMENT,
      sceneData: { watchedObserveDemo: true },
      experimentEvidence: [],
    });
    expect(hasCompletedSamplesExperiments(session)).toBe(false);
    expect(isSamplesExperimentClosed({
      prediction: "",
      predictionReason: "",
      predictionComparison: "",
      reflection: "看过演示。",
      timestamp: "t",
      experimentId: "observe-demo",
      authoredBeforeIntervention: false,
    })).toBe(false);
  });

  it("requires A then B then C", () => {
    const withA = samplesSession({
      stage: LearningStage.EXPERIMENT,
      predictions: [
        {
          prediction: "heavier-denser",
          reasoning: "同样大时更沉应该更密。",
          timestamp: "t1",
          experimentId: SAMPLES_EXPERIMENT_A,
          committed: true,
        },
        {
          prediction: "larger-less-dense",
          reasoning: "同样重时更大应该更疏。",
          timestamp: "t2",
          experimentId: SAMPLES_EXPERIMENT_B,
          committed: true,
        },
      ],
      experimentEvidence: [closedSamplesEvidence(SAMPLES_EXPERIMENT_A)],
    });
    expect(canRunSamplesExperiment(withA, SAMPLES_EXPERIMENT_B)).toBe(true);
    expect(canRunSamplesExperiment(withA, SAMPLES_EXPERIMENT_C)).toBe(false);
  });
});

describe("samples EXPLAIN", () => {
  it("rejects heavier-always-denser and related misconceptions", () => {
    expect(
      evaluateSamplesExplanation({
        ...completeSamplesExplainInput(),
        sameVolume: "heavier-always-denser",
      }).sufficient,
    ).toBe(false);
    expect(
      evaluateSamplesExplanation({
        ...completeSamplesExplainInput(),
        sameMass: "bigger-always-denser",
      }).sufficient,
    ).toBe(false);
    expect(
      evaluateSamplesExplanation({
        ...completeSamplesExplainInput(),
        uniformCut: "cut-lowers-density",
      }).sufficient,
    ).toBe(false);
    expect(evaluateSamplesExplanation(completeSamplesExplainInput()).sufficient).toBe(
      true,
    );
  });

  it("does not pass on text length", () => {
    expect(
      evaluateSamplesExplanation({
        densityVsMass: "",
        sameVolume: "",
        sameMass: "",
        uniformCut: "",
        studentExplanation: "密度密度密度密度密度密度密度密度。",
      }).sufficient,
    ).toBe(false);
  });

  it("does not grant L4 from EXPLAIN", () => {
    const session = samplesSession({
      explanations: [
        {
          text: completeSamplesExplainInput().studentExplanation,
          timestamp: "t",
          distinguishesDensityFromMassOrSize: true,
          usesMassVolumeRatio: true,
          checksUniformCutCondition: true,
          densityAnswers: completeSamplesExplainInput(),
          sufficient: true,
        },
      ],
    });
    const evidence = accumulateSamplesSceneEvidence(session);
    expect(hasSufficientSamplesExplanation(session.explanations)).toBe(true);
    expect(evidence.constructedValidCausalModel).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).not.toBe("L4");
    expect(deriveModelEvidenceLevel(evidence)).toBe("L3");
  });
});

describe("samples MODEL ratio board", () => {
  it("accepts a valid mass / volume ratio table", () => {
    const attempt = buildSamplesModelAttempt(completeSamplesModelInput("t"));
    expect(attempt.correctStructure).toBe(true);
    expect(attempt.conditions).toContain("volume-positive");
    expect(attempt.conditions).toContain("uniform-sample");
  });

  it("rejects an energy-chain-shaped fake model", () => {
    const attempt = buildSamplesModelAttempt({
      ...completeSamplesModelInput("t"),
      numerator: "chemical-energy",
      denominator: "internal-energy",
      result: "mechanical-energy",
      conditions: ["energy-conversion-chain"],
    });
    expect(attempt.correctStructure).toBe(false);
    expect(attempt.failureKinds).toContain("energy-chain-shape");
  });

  it("rejects a force-board-shaped fake model", () => {
    const attempt = buildSamplesModelAttempt({
      ...completeSamplesModelInput("t"),
      conditions: ["force-equals-motion"],
    });
    expect(attempt.correctStructure).toBe(false);
    expect(attempt.failureKinds).toContain("force-board-shape");
  });

  it("rejects heavier-without-volume and bigger-means-denser", () => {
    const heavier = buildSamplesModelAttempt({
      ...completeSamplesModelInput("t"),
      sameVolumeConclusion: "heavier-always-denser",
    });
    expect(heavier.failureKinds).toContain("heavier-without-volume");
    const bigger = buildSamplesModelAttempt({
      ...completeSamplesModelInput("t"),
      sameMassConclusion: "bigger-always-denser",
    });
    expect(bigger.failureKinds).toContain("bigger-means-denser");
  });

  it("keeps the first failed MODEL attempt when a later one succeeds", () => {
    const failed = buildSamplesModelAttempt({
      ...emptySamplesModelDraft(),
      timestamp: "t1",
    });
    const passed = buildSamplesModelAttempt(completeSamplesModelInput("t2"));
    expect(failed.correctStructure).toBe(false);
    expect(hasCompletedSamplesModel([failed, passed])).toBe(true);
    expect([failed, passed][0]?.timestamp).toBe("t1");
  });

  it("may contribute L4 only through the evaluator", () => {
    const session = samplesSession({
      modelAttempts: [buildSamplesModelAttempt(completeSamplesModelInput("t"))],
    });
    const evidence = accumulateSamplesSceneEvidence(session);
    expect(evidence.constructedValidCausalModel).toBe(true);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L4");
    expect(JSON.stringify(session.modelAttempts)).not.toMatch(/"L4"/);
  });
});

describe("samples TRANSFER", () => {
  it("accepts cups or stone plus hollow boundary, not surface similarity", () => {
    const accepted = buildSamplesTransferAttempt(
      completeSamplesCupsTransferInput("t"),
    );
    expect(accepted.accepted).toBe(true);
    const surface = buildSamplesTransferAttempt({
      targetId: "near-equal-cups-of-liquids",
      judgments: {
        [MODEL_RELATION_IDS.densityIsMassPerVolume]: "not-necessarily",
        [MODEL_RELATION_IDS.sameVolumeLargerMassLargerDensity]: "not-necessarily",
        [MODEL_RELATION_IDS.sameMassLargerVolumeSmallerDensity]: "not-necessarily",
        [MODEL_RELATION_IDS.uniformCutLeavesDensityUnchanged]: "not-necessarily",
        [MODEL_RELATION_IDS.densityAloneDoesNotExplainFloating]: "not-necessarily",
      },
      surfaceCueSelected: true,
      studentExplanation: "都是固体块，所以和刚才课堂上的样品是一回事。",
      timestamp: "t",
    });
    expect(surface.accepted).toBe(false);
    expect(surface.failureKinds).toContain("surface-similarity-only");
  });

  it("does not grant L5 from transfer without a valid model", () => {
    const session = samplesSession({
      transferAttempts: [
        buildSamplesTransferAttempt(completeSamplesCupsTransferInput("t1")),
        buildSamplesTransferAttempt(completeSamplesHollowTransferInput("t2")),
      ],
    });
    const evidence = accumulateSamplesSceneEvidence(session);
    expect(hasCompletedSamplesTransfer(session.transferAttempts)).toBe(true);
    expect(evidence.constructedValidCausalModel).toBeUndefined();
    expect(evidence.successfulTransfer).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).not.toBe("L5");
  });

  it("may derive L5 only after a valid model plus required transfer", () => {
    const session = samplesSession({
      modelAttempts: [buildSamplesModelAttempt(completeSamplesModelInput("t"))],
      transferAttempts: [
        buildSamplesTransferAttempt(completeSamplesCupsTransferInput("t1")),
        buildSamplesTransferAttempt(completeSamplesHollowTransferInput("t2")),
      ],
    });
    expect(hasCompletedSamplesTransfer(session.transferAttempts)).toBe(true);
    const evidence = accumulateSamplesSceneEvidence(session);
    expect(evidence.successfulTransfer).toBe(true);
    expect(deriveModelEvidenceLevel(evidence)).toBe("L5");
    expect(JSON.stringify(session)).not.toMatch(/"L4"|"L5"|"L6"/);
  });

  it("cannot set L6 from TRANSFER", () => {
    const session = samplesSession({
      modelAttempts: [buildSamplesModelAttempt(completeSamplesModelInput("t"))],
      transferAttempts: [
        buildSamplesTransferAttempt(completeSamplesCupsTransferInput("t1")),
        buildSamplesTransferAttempt(completeSamplesHollowTransferInput("t2")),
      ],
    });
    expect(deriveModelEvidenceLevel(accumulateSamplesSceneEvidence(session))).toBe(
      "L5",
    );
  });
});

describe("samples adapter architecture", () => {
  it("does not write L4/L5/L6 in Scene code or add a universal sceneId branch", () => {
    const sceneFiles = [
      "lib/learning/samples-evidence.ts",
      "lib/learning/samples-explain.ts",
      "lib/learning/samples-model.ts",
      "lib/learning/samples-transfer.ts",
      "lib/learning/samples-observe.ts",
      "lib/learning/samples-describe.ts",
      "lib/learning/samples-predict.ts",
      "lib/learning/samples-experiment.ts",
      "lib/runtime/adapters/equal-volume-material-samples.ts",
      "hooks/useSamplesLearningSession.ts",
    ];
    for (const file of sceneFiles) {
      expect(readFileSync(file, "utf8")).not.toMatch(
        /["']L4["']|["']L5["']|["']L6["']/,
      );
    }
    expect(readFileSync("lib/learning/progression.ts", "utf8")).not.toMatch(
      /equal-volume-material-samples/,
    );
    expect(readFileSync("lib/learning/tutor-request.ts", "utf8")).not.toMatch(
      /equal-volume-material-samples/,
    );
    const empty = samplesSession();
    expect(equalVolumeMaterialSamplesAdapter.completion.EXPLAIN(empty)).toBe(false);
    expect(equalVolumeMaterialSamplesAdapter.completion.MODEL(empty)).toBe(false);
    expect(equalVolumeMaterialSamplesAdapter.completion.TRANSFER(empty)).toBe(false);
  });
});
