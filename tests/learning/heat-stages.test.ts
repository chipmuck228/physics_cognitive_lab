import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { accumulateHeatSceneEvidence } from "@/lib/learning/heat-evidence";
import {
  canRunHeatExperiment,
  hasCompletedHeatExperiments,
  isHeatExperimentClosed,
} from "@/lib/learning/heat-experiment";
import {
  completeHeatExplainInput,
  evaluateHeatExplanation,
  hasSufficientHeatExplanation,
} from "@/lib/learning/heat-explain";
import {
  buildHeatModelAttempt,
  completeHeatModelInput,
  formulaOnlyHeatModelInput,
  hasCompletedHeatModel,
  sloganOnlyHeatModelInput,
} from "@/lib/learning/heat-model";
import { evaluateHeatDescription } from "@/lib/learning/heat-describe";
import { evaluateHeatObservation } from "@/lib/learning/heat-observe";
import { evaluateHeatPrediction } from "@/lib/learning/heat-predict";
import {
  buildHeatTransferAttempt,
  completeHeatIceTransferInput,
  completeHeatPotsTransferInput,
  hasCompletedHeatTransfer,
} from "@/lib/learning/heat-transfer";
import { createSession } from "@/lib/learning/session";
import { canLeaveStage } from "@/lib/learning/progression";
import { deriveModelEvidenceLevel } from "@/lib/physics-models/evidence";
import {
  HEAT_EXPERIMENT_A,
  HEAT_EXPERIMENT_B,
  HEAT_EXPERIMENT_C,
} from "@/lib/physics/equal-mass-heated-samples";
import { LearningStage, HEAT_SAMPLES_SCENE_ID } from "@/types/learning";
import type { ExperimentEvidence, LearningSession } from "@/types/learning";

function heatSession(overrides: Partial<LearningSession> = {}): LearningSession {
  return {
    ...createSession(() => "t0", () => "heat-session", HEAT_SAMPLES_SCENE_ID),
    ...overrides,
  };
}

function closedHeatEvidence(
  experimentId: string,
  timestamp = "t2",
): ExperimentEvidence {
  return {
    prediction: "sand-hotter",
    predictionReason: "我先记下自己的猜测。",
    predictionComparison: "不一样",
    reflection: "这次比较让我看清能量、质量和温度变化要一起看。",
    timestamp,
    experimentId,
    committedAt: "t1",
    interventionAt: timestamp,
    intervention: { comparisonMode: "same-mass-same-heating" },
    observedResult: {
      massComparison: "same",
      energyComparison: "similar",
      deltaTComparison: "sand-larger",
    },
    comparison: "different",
    physicsResult: { temperatureChangeC: 10 },
    authoredBeforeIntervention: true,
  };
}

describe("heat observation and description", () => {
  it("does not pass OBSERVE from a distractor or any text", () => {
    expect(evaluateHeatObservation([]).sufficient).toBe(false);
    expect(evaluateHeatObservation(["two-dishes-on-screen"]).sufficient).toBe(false);
    expect(evaluateHeatObservation(["same-time-same-rise"]).sufficient).toBe(false);
    expect(evaluateHeatObservation(["same-mass", "different-rise"]).sufficient).toBe(
      true,
    );
  });

  it("requires structured DESCRIBE fields, not text length", () => {
    expect(
      evaluateHeatDescription({
        object: "",
        massRelation: "",
        temperatureRelation: "",
        studentDescription: "两份样品两份样品两份样品两份样品。",
      }).sufficient,
    ).toBe(false);
    expect(
      evaluateHeatDescription({
        object: "samples",
        massRelation: "same",
        temperatureRelation: "different",
        studentDescription: "两份差不多一样多，但沙子升得更快。",
      }).sufficient,
    ).toBe(true);
  });
});

describe("heat prediction and experiment protocol", () => {
  it("requires an outcome and own-words reason before running", () => {
    expect(evaluateHeatPrediction("", "因为看起来像。").sufficient).toBe(false);
    expect(evaluateHeatPrediction("sand-hotter", "").sufficient).toBe(false);
    expect(
      evaluateHeatPrediction("sand-hotter", "质量相同，沙子可能升得更快。").sufficient,
    ).toBe(true);
  });

  it("blocks later experiments until earlier ones close the five-part loop", () => {
    const session = heatSession({
      stage: LearningStage.EXPERIMENT,
      predictions: [
        {
          prediction: "sand-hotter",
          reasoning: "质量相同，沙子可能升得更快。",
          timestamp: "t1",
          experimentId: HEAT_EXPERIMENT_A,
          committed: true,
        },
      ],
    });
    expect(canRunHeatExperiment(session, HEAT_EXPERIMENT_A)).toBe(true);
    expect(canRunHeatExperiment(session, HEAT_EXPERIMENT_B)).toBe(false);
    const withA = {
      ...session,
      experimentEvidence: [closedHeatEvidence(HEAT_EXPERIMENT_A)],
      predictions: [
        ...session.predictions,
        {
          prediction: "smaller-mass-hotter",
          reasoning: "质量小的可能升得更多。",
          timestamp: "t3",
          experimentId: HEAT_EXPERIMENT_B,
          committed: true,
        },
      ],
    };
    expect(canRunHeatExperiment(withA, HEAT_EXPERIMENT_B)).toBe(true);
    expect(canRunHeatExperiment(withA, HEAT_EXPERIMENT_C)).toBe(false);
    expect(
      hasCompletedHeatExperiments({
        ...withA,
        experimentEvidence: [
          closedHeatEvidence(HEAT_EXPERIMENT_A),
          closedHeatEvidence(HEAT_EXPERIMENT_B),
          closedHeatEvidence(HEAT_EXPERIMENT_C),
        ],
      }),
    ).toBe(true);
  });

  it("does not close an experiment without authored-before-intervention evidence", () => {
    expect(
      isHeatExperimentClosed({
        ...closedHeatEvidence(HEAT_EXPERIMENT_A),
        authoredBeforeIntervention: false,
      }),
    ).toBe(false);
  });
});

describe("heat MODEL and evidence floors", () => {
  it("does not treat EXPLAIN as L4", () => {
    const explanation = completeHeatExplainInput();
    expect(evaluateHeatExplanation(explanation).sufficient).toBe(true);
    const session = heatSession({
      explanations: [
        {
          text: explanation.studentExplanation,
          timestamp: "t",
          sufficient: true,
          distinguishesHeatFromTemperature: true,
          usesHeatMassTempRelation: true,
          checksNoPhaseChangeOrTimeNotQ: true,
          heatAnswers: explanation,
        },
      ],
    });
    expect(hasSufficientHeatExplanation(session.explanations)).toBe(true);
    const evidence = accumulateHeatSceneEvidence(session);
    expect(evidence.identifiedRelations).toBe(true);
    expect(evidence.constructedValidCausalModel).toBeUndefined();
    expect(deriveModelEvidenceLevel(evidence)).toBe("L3");
  });

  it("rejects formula-only and slogan-only MODEL attempts", () => {
    expect(
      buildHeatModelAttempt(formulaOnlyHeatModelInput("t")).correctStructure,
    ).toBe(false);
    expect(
      buildHeatModelAttempt(sloganOnlyHeatModelInput("t")).correctStructure,
    ).toBe(false);
    expect(
      buildHeatModelAttempt(completeHeatModelInput("t")).correctStructure,
    ).toBe(true);
  });

  it("derives L4 from valid MODEL and L5 from MODEL plus required transfer pair", () => {
    const model = buildHeatModelAttempt(completeHeatModelInput("t"));
    expect(hasCompletedHeatModel([model])).toBe(true);
    const withModel = heatSession({ modelAttempts: [model] });
    expect(deriveModelEvidenceLevel(accumulateHeatSceneEvidence(withModel))).toBe(
      "L4",
    );
    const withTransfer = heatSession({
      modelAttempts: [model],
      transferAttempts: [
        buildHeatTransferAttempt(completeHeatPotsTransferInput("t1")),
        buildHeatTransferAttempt(completeHeatIceTransferInput("t2")),
      ],
    });
    expect(hasCompletedHeatTransfer(withTransfer.transferAttempts)).toBe(true);
    expect(deriveModelEvidenceLevel(accumulateHeatSceneEvidence(withTransfer))).toBe(
      "L5",
    );
    expect(canLeaveStage(withTransfer, LearningStage.EXAM)).toBe(false);
  });

  it("never writes L4 L5 or L6 in Scene learning modules", () => {
    const source = readFileSync("lib/learning/heat-evidence.ts", "utf8");
    expect(source).not.toMatch(/"L4"|"L5"|"L6"/);
  });
});
