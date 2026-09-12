import {
  DEFAULT_ENGINE_CONFIG,
  ENGINE_STROKE_ORDER,
  EngineStroke,
  PISTON_BDC,
  PISTON_TDC,
  type ChemicalConversion,
  type EnergyState,
  type EngineExperimentConfig,
  type EngineState,
  type EngineStroke as EngineStrokeType,
  type MechanicalOutput,
  type WorkTransfer,
  type WorkingGasState,
} from "./types";

function energyState(input: {
  chemicalEnergyAvailable: boolean;
  chemicalToInternalConversion: ChemicalConversion;
  workTransfer: WorkTransfer;
  mechanicalOutput: MechanicalOutput;
}): EnergyState {
  return {
    chemicalEnergyAvailable: input.chemicalEnergyAvailable,
    chemicalToInternalConversion: input.chemicalToInternalConversion,
    workTransfer: input.workTransfer,
    mechanicalEnergyOutput: input.mechanicalOutput,
  };
}

function valvesFor(stroke: EngineStrokeType): {
  intakeValveOpen: boolean;
  exhaustValveOpen: boolean;
} {
  return {
    intakeValveOpen: stroke === EngineStroke.INTAKE,
    exhaustValveOpen: stroke === EngineStroke.EXHAUST,
  };
}

function kinematicsFor(
  stroke: EngineStrokeType,
  pistonCanMove: boolean,
): Pick<
  EngineState,
  "pistonPosition" | "pistonDirection" | "crankshaftMoving"
> {
  if (!pistonCanMove) {
    return {
      pistonPosition: PISTON_TDC,
      pistonDirection: "held",
      crankshaftMoving: false,
    };
  }

  switch (stroke) {
    case EngineStroke.INTAKE:
      return {
        pistonPosition: PISTON_BDC,
        pistonDirection: "down",
        crankshaftMoving: true,
      };
    case EngineStroke.COMPRESSION:
      return {
        pistonPosition: PISTON_TDC,
        pistonDirection: "up",
        crankshaftMoving: true,
      };
    case EngineStroke.POWER:
      return {
        pistonPosition: PISTON_BDC,
        pistonDirection: "down",
        crankshaftMoving: true,
      };
    case EngineStroke.EXHAUST:
      return {
        pistonPosition: PISTON_TDC,
        pistonDirection: "up",
        crankshaftMoving: true,
      };
  }
}

function combustionOnPower(config: EngineExperimentConfig): boolean {
  return config.combustionEnabled;
}

function powerStrokeOverlay(config: EngineExperimentConfig): {
  combustionEventActive: boolean;
  combustionOccurred: boolean;
  workingGasState: WorkingGasState;
  workTransfer: WorkTransfer;
  mechanicalOutput: MechanicalOutput;
  chemicalEnergyAvailable: boolean;
  chemicalToInternalConversion: ChemicalConversion;
} {
  const combusted = combustionOnPower(config);

  if (!combusted) {
    return {
      combustionEventActive: false,
      combustionOccurred: false,
      workingGasState: "compressed-unburned",
      workTransfer: config.pistonCanMove ? "none" : "blocked",
      mechanicalOutput: config.pistonCanMove ? "none" : "blocked",
      chemicalEnergyAvailable: true,
      chemicalToInternalConversion: "skipped",
    };
  }

  if (!config.pistonCanMove) {
    return {
      combustionEventActive: true,
      combustionOccurred: true,
      workingGasState: "combusted-hot",
      workTransfer: "blocked",
      mechanicalOutput: "blocked",
      chemicalEnergyAvailable: false,
      chemicalToInternalConversion: "occurred",
    };
  }

  return {
    combustionEventActive: true,
    combustionOccurred: true,
    workingGasState: "expanding",
    workTransfer: "gas-to-mechanical",
    mechanicalOutput: "main-output",
    chemicalEnergyAvailable: false,
    chemicalToInternalConversion: "occurred",
  };
}

function strokeOverlay(
  stroke: EngineStrokeType,
  config: EngineExperimentConfig,
): {
  combustionEventActive: boolean;
  combustionOccurred: boolean;
  workingGasState: WorkingGasState;
  workTransfer: WorkTransfer;
  mechanicalOutput: MechanicalOutput;
  chemicalEnergyAvailable: boolean;
  chemicalToInternalConversion: ChemicalConversion;
} {
  const combustedThisCycle = combustionOnPower(config);

  switch (stroke) {
    case EngineStroke.INTAKE:
      return {
        combustionEventActive: false,
        combustionOccurred: false,
        workingGasState: "fresh-mixture",
        workTransfer: "none",
        mechanicalOutput: "none",
        chemicalEnergyAvailable: true,
        chemicalToInternalConversion: "not-started",
      };
    case EngineStroke.COMPRESSION:
      return {
        combustionEventActive: false,
        combustionOccurred: false,
        workingGasState: config.pistonCanMove ? "compressed" : "fresh-mixture",
        workTransfer: config.pistonCanMove ? "mechanical-to-gas" : "blocked",
        mechanicalOutput: config.pistonCanMove ? "input-required" : "blocked",
        chemicalEnergyAvailable: true,
        chemicalToInternalConversion: "not-started",
      };
    case EngineStroke.POWER:
      return powerStrokeOverlay(config);
    case EngineStroke.EXHAUST:
      return {
        combustionEventActive: false,
        combustionOccurred: combustedThisCycle,
        workingGasState: combustedThisCycle ? "exhaust" : "compressed-unburned",
        workTransfer: "none",
        mechanicalOutput: "none",
        chemicalEnergyAvailable: !combustedThisCycle,
        chemicalToInternalConversion: combustedThisCycle ? "occurred" : "skipped",
      };
  }
}

/**
 * Canonical pedagogical snapshot for one stroke + intervention config.
 * Pure: same arguments always return a deep-equal state.
 */
export function getStrokeState(
  stroke: EngineStrokeType,
  config: EngineExperimentConfig = DEFAULT_ENGINE_CONFIG,
): EngineState {
  const kinematics = kinematicsFor(stroke, config.pistonCanMove);
  const overlay = strokeOverlay(stroke, config);
  const valves = valvesFor(stroke);

  return {
    stroke,
    combustionEnabled: config.combustionEnabled,
    pistonCanMove: config.pistonCanMove,
    ...kinematics,
    ...valves,
    combustionEventActive: overlay.combustionEventActive,
    combustionOccurred: overlay.combustionOccurred,
    workingGasState: overlay.workingGasState,
    mechanicalOutput: overlay.mechanicalOutput,
    workTransfer: overlay.workTransfer,
    energyState: energyState({
      chemicalEnergyAvailable: overlay.chemicalEnergyAvailable,
      chemicalToInternalConversion: overlay.chemicalToInternalConversion,
      workTransfer: overlay.workTransfer,
      mechanicalOutput: overlay.mechanicalOutput,
    }),
  };
}

/** One snapshot per stroke, in cycle order. */
export function runEngineCycle(
  config: EngineExperimentConfig = DEFAULT_ENGINE_CONFIG,
): EngineState[] {
  return ENGINE_STROKE_ORDER.map((stroke) => getStrokeState(stroke, config));
}

export function createInitialEngineState(
  config: EngineExperimentConfig = DEFAULT_ENGINE_CONFIG,
): EngineState {
  return getStrokeState(EngineStroke.INTAKE, config);
}

export function hasMainMechanicalOutput(state: EngineState): boolean {
  return state.mechanicalOutput === "main-output";
}

export function hasValveOverlap(state: EngineState): boolean {
  return state.intakeValveOpen && state.exhaustValveOpen;
}
