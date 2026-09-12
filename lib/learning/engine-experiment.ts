import {
  ENGINE_COMPARE_OPTIONS,
  ENGINE_EXPERIMENT_A,
  ENGINE_EXPERIMENT_B,
  ENGINE_EXPERIMENT_ORDER,
  type EngineSceneExperimentId,
} from "@/lib/content/four-stroke-engine";
import { hasOwnWords } from "@/lib/learning/engine-describe";
import { firstCommittedEnginePrediction } from "@/lib/learning/engine-predict";
import {
  runCombustionDisabledExperiment,
  runLockedMechanicalSystemExperiment,
  type EngineExperimentResult,
} from "@/lib/physics/engine";
import type {
  EngineObservedResult,
  EnginePhysicsSnapshot,
  ExperimentEvidence,
  LearningSession,
} from "@/types/learning";

export function isEngineSceneExperimentId(
  value: string | undefined,
): value is EngineSceneExperimentId {
  return value === ENGINE_EXPERIMENT_A || value === ENGINE_EXPERIMENT_B;
}

export function runSceneExperiment(
  experimentId: EngineSceneExperimentId,
): EngineExperimentResult {
  if (experimentId === ENGINE_EXPERIMENT_A) {
    return runCombustionDisabledExperiment();
  }
  return runLockedMechanicalSystemExperiment();
}

export function physicsSnapshotFrom(
  result: EngineExperimentResult,
): EnginePhysicsSnapshot {
  return {
    combustionOccurred: result.combustionOccurred,
    mainOutputOccurred: result.normalMechanicalOutputOccurred,
    workTransfer: result.powerStroke.workTransfer,
    mechanicalOutput: result.powerStroke.mechanicalOutput,
    crankshaftMoving: result.powerStroke.crankshaftMoving,
    workingGasState: result.powerStroke.workingGasState,
    pistonDirection: result.powerStroke.pistonDirection,
  };
}

export function emptyObservedResult(): EngineObservedResult {
  return {
    combustionOccurred: "",
    mechanismMoving: "",
    mainOutputOccurred: "",
  };
}

export function asEngineObservedResult(
  observed: object | undefined,
): EngineObservedResult {
  if (!observed || typeof observed !== "object") {
    return emptyObservedResult();
  }
  const record = observed as Record<string, unknown>;
  const yesNo = (value: unknown): "" | "yes" | "no" =>
    value === "yes" || value === "no" ? value : "";
  return {
    combustionOccurred: yesNo(record.combustionOccurred),
    mechanismMoving: yesNo(record.mechanismMoving),
    mainOutputOccurred: yesNo(record.mainOutputOccurred),
  };
}

export function hasCompleteObservedResult(
  observed: object | undefined,
): boolean {
  const result = asEngineObservedResult(observed);
  return (
    (result.combustionOccurred === "yes" || result.combustionOccurred === "no") &&
    (result.mechanismMoving === "yes" || result.mechanismMoving === "no") &&
    (result.mainOutputOccurred === "yes" || result.mainOutputOccurred === "no")
  );
}

export function isEngineComparison(
  value: string,
): value is "same" | "different" | "partial" {
  return ENGINE_COMPARE_OPTIONS.some((option) => option.value === value);
}

export function engineComparisonLabel(value: string): string {
  return (
    ENGINE_COMPARE_OPTIONS.find((option) => option.value === value)?.label ??
    value
  );
}

export function canRunEngineExperiment(
  session: LearningSession,
  experimentId: EngineSceneExperimentId,
): boolean {
  const prediction = firstCommittedEnginePrediction(
    session.predictions,
    experimentId,
  );
  if (!prediction) {
    return false;
  }
  if (experimentId === ENGINE_EXPERIMENT_B) {
    return hasClosedEngineExperiment(session, ENGINE_EXPERIMENT_A);
  }
  return true;
}

export function activeIncompleteEngineEvidence(
  session: LearningSession,
  experimentId: EngineSceneExperimentId,
): ExperimentEvidence | undefined {
  return [...session.experimentEvidence]
    .reverse()
    .find(
      (evidence) =>
        evidence.experimentId === experimentId && evidence.sufficient !== true,
    );
}

export function firstClosedEngineEvidence(
  session: LearningSession,
  experimentId: EngineSceneExperimentId,
): ExperimentEvidence | undefined {
  return session.experimentEvidence.find(
    (evidence) =>
      evidence.experimentId === experimentId &&
      isEngineExperimentClosed(evidence),
  );
}

export function isEngineExperimentClosed(evidence: ExperimentEvidence): boolean {
  if (evidence.sufficient === true) {
    return true;
  }
  if (!evidence.experimentId || !evidence.interventionAt || !evidence.physicsResult) {
    return false;
  }
  if (!evidence.authoredBeforeIntervention) {
    return false;
  }
  if (!hasCompleteObservedResult(evidence.observedResult)) {
    return false;
  }
  if (!evidence.comparison || !isEngineComparison(evidence.comparison)) {
    return false;
  }
  return hasOwnWords(evidence.reflection);
}

export function hasClosedEngineExperiment(
  session: LearningSession,
  experimentId: EngineSceneExperimentId,
): boolean {
  return session.experimentEvidence.some(
    (evidence) =>
      evidence.experimentId === experimentId &&
      isEngineExperimentClosed(evidence),
  );
}

export function hasCompletedEngineExperiments(session: LearningSession): boolean {
  return ENGINE_EXPERIMENT_ORDER.every((experimentId) =>
    hasClosedEngineExperiment(session, experimentId),
  );
}

export function activeEngineExperimentId(
  session: LearningSession,
): EngineSceneExperimentId | null {
  if (!hasClosedEngineExperiment(session, ENGINE_EXPERIMENT_A)) {
    return ENGINE_EXPERIMENT_A;
  }
  if (!hasClosedEngineExperiment(session, ENGINE_EXPERIMENT_B)) {
    return ENGINE_EXPERIMENT_B;
  }
  return null;
}

export function microwavePlaceholder() {
  return {
    actualResult: {
      finalTemperatureC: 0,
      energyInputJ: 0,
      deltaTemperatureC: 0,
    },
    parameters: {
      powerW: 0,
      heatingTimeSec: 0,
      initialTemperatureC: 0,
    },
  };
}

export function authoredBeforeIntervention(
  committedAt: string,
  interventionAt: string,
): boolean {
  return committedAt <= interventionAt;
}
