import { getStrokeState, runEngineCycle } from "./cycle";
import {
  EngineExperimentId,
  EngineStroke,
  type EngineBlockedReason,
  type EngineExperimentConfig,
  type EngineExperimentResult,
  type EngineState,
} from "./types";

function powerStrokeOf(states: EngineState[]): EngineState {
  const powerStroke = states.find((state) => state.stroke === EngineStroke.POWER);
  if (!powerStroke) {
    throw new Error("Engine cycle is missing a power stroke.");
  }
  return powerStroke;
}

function blockedReasonFor(
  intervention: EngineExperimentConfig,
  normalMechanicalOutputOccurred: boolean,
): EngineBlockedReason | undefined {
  if (normalMechanicalOutputOccurred) {
    return undefined;
  }
  if (!intervention.combustionEnabled) {
    return "combustion-disabled";
  }
  if (!intervention.pistonCanMove) {
    return "mechanical-system-locked";
  }
  return undefined;
}

function toExperimentResult(input: {
  experimentId: EngineExperimentResult["experimentId"];
  intervention: EngineExperimentConfig;
  states: EngineState[];
}): EngineExperimentResult {
  const powerStroke = powerStrokeOf(input.states);
  const workOccurred = powerStroke.workTransfer === "gas-to-mechanical";
  const normalMechanicalOutputOccurred =
    powerStroke.mechanicalOutput === "main-output";

  return {
    experimentId: input.experimentId,
    intervention: input.intervention,
    states: input.states,
    powerStroke,
    combustionOccurred: powerStroke.combustionOccurred,
    workOccurred,
    normalMechanicalOutputOccurred,
    blockedReason: blockedReasonFor(
      input.intervention,
      normalMechanicalOutputOccurred,
    ),
  };
}

/**
 * Experiment A: interrupt the upper causal chain.
 * combustionEnabled = false for the whole cycle.
 * Motion may continue; that is not main mechanical output.
 */
export function runCombustionDisabledExperiment(): EngineExperimentResult {
  const intervention: EngineExperimentConfig = {
    combustionEnabled: false,
    pistonCanMove: true,
  };

  return toExperimentResult({
    experimentId: EngineExperimentId.COMBUSTION_DISABLED,
    intervention,
    states: runEngineCycle(intervention),
  });
}

/**
 * Experiment B: interrupt work / output.
 * Intake and compression run normally so the mixture is compressed.
 * The piston is locked for the intended power event.
 */
export function runLockedMechanicalSystemExperiment(): EngineExperimentResult {
  const moving: EngineExperimentConfig = {
    combustionEnabled: true,
    pistonCanMove: true,
  };
  const locked: EngineExperimentConfig = {
    combustionEnabled: true,
    pistonCanMove: false,
  };

  const states = [
    getStrokeState(EngineStroke.INTAKE, moving),
    getStrokeState(EngineStroke.COMPRESSION, moving),
    getStrokeState(EngineStroke.POWER, locked),
    getStrokeState(EngineStroke.EXHAUST, locked),
  ];

  return toExperimentResult({
    experimentId: EngineExperimentId.LOCKED_MECHANICAL_SYSTEM,
    intervention: locked,
    states,
  });
}
