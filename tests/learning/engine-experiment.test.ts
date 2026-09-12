import { describe, expect, it } from "vitest";

import {
  ENGINE_EXPERIMENT_A,
  ENGINE_EXPERIMENT_B,
} from "@/lib/content/four-stroke-engine";
import {
  canRunEngineExperiment,
  emptyObservedResult,
  hasClosedEngineExperiment,
  hasCompletedEngineExperiments,
  isEngineExperimentClosed,
  microwavePlaceholder,
  physicsSnapshotFrom,
  runSceneExperiment,
} from "@/lib/learning/engine-experiment";
import { createSession } from "@/lib/learning/session";
import {
  runCombustionDisabledExperiment,
  runLockedMechanicalSystemExperiment,
} from "@/lib/physics/engine";
import { LearningStage, type ExperimentEvidence, type LearningSession } from "@/types/learning";

function engineSession(
  extras: Partial<LearningSession> = {},
): LearningSession {
  return {
    ...createSession(
      () => "2026-09-11T00:00:00.000Z",
      () => "engine-session",
      "four-stroke-engine",
    ),
    stage: LearningStage.EXPERIMENT,
    ...extras,
  };
}

function prediction(experimentId: typeof ENGINE_EXPERIMENT_A | typeof ENGINE_EXPERIMENT_B) {
  return {
    prediction: "no-main-output" as const,
    reasoning: "我猜这样就不会有主要动力。",
    timestamp: "2026-09-11T00:01:00.000Z",
    experimentId,
    committed: true as const,
  };
}

function evidenceFor(
  experimentId: typeof ENGINE_EXPERIMENT_A | typeof ENGINE_EXPERIMENT_B,
  overrides: Partial<ExperimentEvidence> = {},
): ExperimentEvidence {
  const physics = physicsSnapshotFrom(runSceneExperiment(experimentId));
  const isA = experimentId === ENGINE_EXPERIMENT_A;
  return {
    ...microwavePlaceholder(),
    prediction: "no-main-output",
    predictionReason: "我猜这样就不会有主要动力。",
    predictionComparison: "",
    reflection: "",
    timestamp: "2026-09-11T00:02:00.000Z",
    experimentId,
    committedAt: "2026-09-11T00:01:00.000Z",
    interventionAt: "2026-09-11T00:02:00.000Z",
    intervention: isA
      ? { combustionEnabled: false, pistonCanMove: true }
      : { combustionEnabled: true, pistonCanMove: false },
    observedResult: emptyObservedResult(),
    comparison: "",
    physicsResult: physics,
    authoredBeforeIntervention: true,
    sufficient: false,
    ...overrides,
  };
}

function closedEvidence(
  experimentId: typeof ENGINE_EXPERIMENT_A | typeof ENGINE_EXPERIMENT_B,
): ExperimentEvidence {
  const isA = experimentId === ENGINE_EXPERIMENT_A;
  return evidenceFor(experimentId, {
    observedResult: {
      combustionOccurred: isA ? "no" : "yes",
      mechanismMoving: isA ? "yes" : "no",
      mainOutputOccurred: "no",
    },
    comparison: "different",
    predictionComparison: "不一样",
    reflection: isA
      ? "燃烧对产生动力好像很重要。"
      : "燃烧发生了，但活塞不能动，所以没有正常输出。",
    sufficient: true,
  });
}

describe("engine EXPERIMENT physics mapping", () => {
  it("uses the deterministic physics engine for experiment A", () => {
    const physics = runCombustionDisabledExperiment();
    const mapped = runSceneExperiment(ENGINE_EXPERIMENT_A);
    const snapshot = physicsSnapshotFrom(mapped);

    expect(mapped).toEqual(physics);
    expect(snapshot.combustionOccurred).toBe(false);
    expect(snapshot.workingGasState).toBe("compressed-unburned");
    expect(snapshot.workTransfer).not.toBe("gas-to-mechanical");
    expect(snapshot.mechanicalOutput).not.toBe("main-output");
    expect(snapshot.crankshaftMoving).toBe(true);
  });

  it("keeps combustion while blocking output for experiment B", () => {
    const physics = runLockedMechanicalSystemExperiment();
    const mapped = runSceneExperiment(ENGINE_EXPERIMENT_B);
    const snapshot = physicsSnapshotFrom(mapped);

    expect(mapped).toEqual(physics);
    expect(snapshot.combustionOccurred).toBe(true);
    expect(snapshot.workingGasState).toBe("combusted-hot");
    expect(snapshot.pistonDirection).toBe("held");
    expect(snapshot.workTransfer).toBe("blocked");
    expect(snapshot.mechanicalOutput).toBe("blocked");
    expect(snapshot.mainOutputOccurred).toBe(false);
  });
});

describe("engine EXPERIMENT run gate", () => {
  it("cannot run before a committed prediction", () => {
    const session = engineSession();
    expect(canRunEngineExperiment(session, ENGINE_EXPERIMENT_A)).toBe(false);
  });

  it("unlocks experiment A after a committed prediction", () => {
    const session = engineSession({
      predictions: [prediction(ENGINE_EXPERIMENT_A)],
    });
    expect(canRunEngineExperiment(session, ENGINE_EXPERIMENT_A)).toBe(true);
    expect(canRunEngineExperiment(session, ENGINE_EXPERIMENT_B)).toBe(false);
  });

  it("does not unlock experiment B until experiment A is closed", () => {
    const session = engineSession({
      predictions: [
        prediction(ENGINE_EXPERIMENT_A),
        { ...prediction(ENGINE_EXPERIMENT_B), timestamp: "2026-09-11T00:05:00.000Z" },
      ],
      experimentEvidence: [evidenceFor(ENGINE_EXPERIMENT_A)],
    });
    expect(canRunEngineExperiment(session, ENGINE_EXPERIMENT_B)).toBe(false);
    expect(
      canRunEngineExperiment(
        {
          ...session,
          experimentEvidence: [closedEvidence(ENGINE_EXPERIMENT_A)],
        },
        ENGINE_EXPERIMENT_B,
      ),
    ).toBe(true);
  });
});

describe("engine EXPERIMENT evidence closure", () => {
  it("does not close experiment A from running the intervention alone", () => {
    const record = evidenceFor(ENGINE_EXPERIMENT_A);
    expect(isEngineExperimentClosed(record)).toBe(false);
    expect(
      hasClosedEngineExperiment(
        engineSession({ experimentEvidence: [record] }),
        ENGINE_EXPERIMENT_A,
      ),
    ).toBe(false);
  });

  it("blocks closure when comparison is missing", () => {
    const record = evidenceFor(ENGINE_EXPERIMENT_A, {
      observedResult: {
        combustionOccurred: "no",
        mechanismMoving: "yes",
        mainOutputOccurred: "no",
      },
      reflection: "燃烧好像很重要。",
    });
    expect(isEngineExperimentClosed(record)).toBe(false);
  });

  it("blocks closure when reflection is missing", () => {
    const record = evidenceFor(ENGINE_EXPERIMENT_A, {
      observedResult: {
        combustionOccurred: "no",
        mechanismMoving: "yes",
        mainOutputOccurred: "no",
      },
      comparison: "different",
      predictionComparison: "不一样",
    });
    expect(isEngineExperimentClosed(record)).toBe(false);
  });

  it("requires all five parts for each experiment", () => {
    const onlyA = engineSession({
      predictions: [prediction(ENGINE_EXPERIMENT_A)],
      experimentEvidence: [closedEvidence(ENGINE_EXPERIMENT_A)],
    });
    expect(hasClosedEngineExperiment(onlyA, ENGINE_EXPERIMENT_A)).toBe(true);
    expect(hasCompletedEngineExperiments(onlyA)).toBe(false);

    const both = {
      ...onlyA,
      predictions: [
        prediction(ENGINE_EXPERIMENT_A),
        { ...prediction(ENGINE_EXPERIMENT_B), timestamp: "2026-09-11T00:05:00.000Z" },
      ],
      experimentEvidence: [
        closedEvidence(ENGINE_EXPERIMENT_A),
        closedEvidence(ENGINE_EXPERIMENT_B),
      ],
    };
    expect(hasClosedEngineExperiment(both, ENGINE_EXPERIMENT_B)).toBe(true);
    expect(hasCompletedEngineExperiments(both)).toBe(true);
  });

  it("requires the student to record combustion, motion, and output separately", () => {
    const missingOutput = evidenceFor(ENGINE_EXPERIMENT_B, {
      observedResult: {
        combustionOccurred: "yes",
        mechanismMoving: "no",
        mainOutputOccurred: "",
      },
      comparison: "different",
      reflection: "燃烧有了，但没有输出。",
    });
    expect(isEngineExperimentClosed(missingOutput)).toBe(false);
  });

  it("does not rewrite the first prediction after a later edit", () => {
    const first = closedEvidence(ENGINE_EXPERIMENT_A);
    const session = engineSession({
      predictions: [
        prediction(ENGINE_EXPERIMENT_A),
        {
          prediction: "main-output",
          reasoning: "后来改口了。",
          timestamp: "2026-09-11T00:08:00.000Z",
          experimentId: ENGINE_EXPERIMENT_A,
          committed: true,
        },
      ],
      experimentEvidence: [first],
    });

    expect(session.experimentEvidence[0].prediction).toBe("no-main-output");
    expect(session.predictions[0].prediction).toBe("no-main-output");
    expect(session.predictions[1].prediction).toBe("main-output");
  });

  it("rejects a result authored after the intervention", () => {
    const record = evidenceFor(ENGINE_EXPERIMENT_A, {
      authoredBeforeIntervention: false,
      observedResult: {
        combustionOccurred: "no",
        mechanismMoving: "yes",
        mainOutputOccurred: "no",
      },
      comparison: "different",
      reflection: "燃烧好像很重要。",
    });
    expect(isEngineExperimentClosed(record)).toBe(false);
  });
});
