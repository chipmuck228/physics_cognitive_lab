import {
  officialCurrentA,
  officialResistanceOhm,
  officialVoltageAcrossResistorV,
  pairsForComparison,
  SOURCE_VOLTAGE_CATALOG,
  type OhmComparisonMode,
  type ResistorId,
  type SimpleResistorInputs,
  type SourceVoltageId,
} from "@/content/physics-models/ohms-law/physics-boundary";

export type { OhmComparisonMode, ResistorId, SimpleResistorInputs, SourceVoltageId };

export const OHMS_EXPERIMENT_A = "same-resistance-different-voltage" as const;
export const OHMS_EXPERIMENT_B = "same-voltage-different-resistance" as const;

export type OhmsExperimentId =
  | typeof OHMS_EXPERIMENT_A
  | typeof OHMS_EXPERIMENT_B;

export const OHMS_EXPERIMENT_ORDER: OhmsExperimentId[] = [
  OHMS_EXPERIMENT_A,
  OHMS_EXPERIMENT_B,
];

export interface OhmsBranchState extends SimpleResistorInputs {
  sourceVoltageV: number;
}

export interface OhmsSceneState {
  comparisonMode: OhmComparisonMode;
  left: SimpleResistorInputs;
  right: SimpleResistorInputs;
  circuitClosed: boolean;
  readingsRevealed: boolean;
}

export interface OhmsExperimentResult {
  experimentId: OhmsExperimentId;
  before: OhmsSceneState;
  after: OhmsSceneState;
}

export interface OhmsVisibleReadings {
  resistanceOhm: number;
  voltageAcrossResistorV: number;
  currentA: number;
  sourceVoltageV: number;
}

export function isResistorId(value: unknown): value is ResistorId {
  return value === "R-5" || value === "R-10";
}

export function isSourceVoltageId(value: unknown): value is SourceVoltageId {
  return value === "U-3" || value === "U-6";
}

export function isOhmComparisonMode(value: unknown): value is OhmComparisonMode {
  return (
    value === "observe" ||
    value === "same-resistance-different-voltage" ||
    value === "same-voltage-different-resistance"
  );
}

export function isOhmsSceneState(value: unknown): value is OhmsSceneState {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    isOhmComparisonMode(record.comparisonMode) &&
    isSimpleInputs(record.left) &&
    isSimpleInputs(record.right) &&
    typeof record.circuitClosed === "boolean" &&
    typeof record.readingsRevealed === "boolean"
  );
}

function isSimpleInputs(value: unknown): value is SimpleResistorInputs {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    isResistorId(record.resistorId) &&
    isSourceVoltageId(record.sourceVoltageId) &&
    typeof record.circuitClosed === "boolean"
  );
}

export function ohmsVisibleReadings(
  inputs: SimpleResistorInputs,
): OhmsVisibleReadings {
  return {
    resistanceOhm: officialResistanceOhm(inputs.resistorId),
    voltageAcrossResistorV: officialVoltageAcrossResistorV(
      inputs.sourceVoltageId,
      inputs.circuitClosed,
    ),
    currentA: officialCurrentA(inputs),
    sourceVoltageV: SOURCE_VOLTAGE_CATALOG[inputs.sourceVoltageId].voltageV,
  };
}

export function createInitialOhmsState(): OhmsSceneState {
  const pair = pairsForComparison("observe");
  return {
    comparisonMode: "observe",
    left: pair.left,
    right: pair.right,
    circuitClosed: true,
    readingsRevealed: false,
  };
}

export function prepareOhmsExperimentState(
  experimentId: OhmsExperimentId,
): OhmsSceneState {
  const pair = pairsForComparison(experimentId);
  return {
    comparisonMode: experimentId,
    left: pair.left,
    right: pair.right,
    circuitClosed: true,
    readingsRevealed: false,
  };
}

export function runOhmsExperiment(
  experimentId: OhmsExperimentId,
): OhmsExperimentResult {
  const before = prepareOhmsExperimentState(experimentId);
  return {
    experimentId,
    before,
    after: {
      ...before,
      readingsRevealed: true,
    },
  };
}

export function runOhmsObserveDemo(circuitClosed = true): OhmsSceneState {
  const pair = pairsForComparison("observe");
  return {
    comparisonMode: "observe",
    left: { ...pair.left, circuitClosed },
    right: { ...pair.right, circuitClosed },
    circuitClosed,
    readingsRevealed: true,
  };
}

export function ohmsPhysicsSnapshot(state: OhmsSceneState) {
  return {
    comparisonMode: state.comparisonMode,
    circuitClosed: state.circuitClosed,
    left: ohmsVisibleReadings({
      ...state.left,
      circuitClosed: state.circuitClosed && state.left.circuitClosed,
    }),
    right: ohmsVisibleReadings({
      ...state.right,
      circuitClosed: state.circuitClosed && state.right.circuitClosed,
    }),
  };
}
