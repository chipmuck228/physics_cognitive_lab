/**
 * Deterministic four-stroke engine state.
 *
 * Pedagogical Grade 9 model. Not an engineering simulation:
 * no p–V curves, efficiency, torque, valve overlap, or chemistry.
 *
 * Combustion is a process/event, not a PhysicalQuantity.
 * Pressure is intentionally absent.
 *
 * This module owns physical state only. It does not own learning
 * stages, evidence, tutor actions, or mastery.
 */

export const EngineStroke = {
  INTAKE: "intake",
  COMPRESSION: "compression",
  POWER: "power",
  EXHAUST: "exhaust",
} as const;

export type EngineStroke = (typeof EngineStroke)[keyof typeof EngineStroke];

export const ENGINE_STROKE_ORDER: EngineStroke[] = [
  EngineStroke.INTAKE,
  EngineStroke.COMPRESSION,
  EngineStroke.POWER,
  EngineStroke.EXHAUST,
];

/** 0 = top dead center (上止点). */
export const PISTON_TDC = 0;
/** 1 = bottom dead center (下止点). */
export const PISTON_BDC = 1;

export type PistonDirection = "up" | "down" | "held";

export type WorkingGasState =
  | "fresh-mixture"
  | "compressed"
  | "combusted-hot"
  | "expanding"
  | "exhaust"
  | "compressed-unburned";

export type MechanicalOutput =
  | "none"
  | "input-required"
  | "main-output"
  | "blocked";

export type WorkTransfer =
  | "none"
  | "mechanical-to-gas"
  | "gas-to-mechanical"
  | "blocked";

export type ChemicalConversion =
  | "not-started"
  | "occurring"
  | "occurred"
  | "skipped";

export interface EnergyState {
  chemicalEnergyAvailable: boolean;
  chemicalToInternalConversion: ChemicalConversion;
  workTransfer: WorkTransfer;
  mechanicalEnergyOutput: MechanicalOutput;
}

export interface EngineExperimentConfig {
  combustionEnabled: boolean;
  pistonCanMove: boolean;
}

export const DEFAULT_ENGINE_CONFIG: EngineExperimentConfig = {
  combustionEnabled: true,
  pistonCanMove: true,
};

export interface EngineState extends EngineExperimentConfig {
  stroke: EngineStroke;
  /** 0 = TDC, 1 = BDC. */
  pistonPosition: number;
  pistonDirection: PistonDirection;
  intakeValveOpen: boolean;
  exhaustValveOpen: boolean;
  /** Event flag for the current stroke snapshot. */
  combustionEventActive: boolean;
  /** True after a combustion event in this cycle, until intake reset. */
  combustionOccurred: boolean;
  workingGasState: WorkingGasState;
  /**
   * Visual / kinematic continuity. Must not be treated as useful power.
   * crankshaftMoving does not imply mechanicalOutput === "main-output".
   */
  crankshaftMoving: boolean;
  mechanicalOutput: MechanicalOutput;
  workTransfer: WorkTransfer;
  energyState: EnergyState;
}

export const EngineExperimentId = {
  COMBUSTION_DISABLED: "combustion-disabled",
  LOCKED_MECHANICAL_SYSTEM: "mechanical-system-locked",
} as const;

export type EngineExperimentId =
  (typeof EngineExperimentId)[keyof typeof EngineExperimentId];

export type EngineBlockedReason =
  | "combustion-disabled"
  | "mechanical-system-locked";

export interface EngineExperimentResult {
  experimentId: EngineExperimentId;
  intervention: EngineExperimentConfig;
  states: EngineState[];
  powerStroke: EngineState;
  combustionOccurred: boolean;
  /** True only if gas-to-mechanical work occurred on the power stroke. */
  workOccurred: boolean;
  normalMechanicalOutputOccurred: boolean;
  blockedReason?: EngineBlockedReason;
}
