import {
  DEFAULT_BREAD_FACTOR,
  DEFAULT_HEATING_TIME_SEC,
  DEFAULT_POWER_W,
  EFFECTIVE_HEAT_CAPACITY_J_PER_C,
  MAX_BREAD_FACTOR,
  MAX_HEATING_TIME_SEC,
  MAX_POWER_W,
  MAX_TEMPERATURE_C,
  MIN_BREAD_FACTOR,
  MIN_HEATING_TIME_SEC,
  MIN_POWER_W,
  MIN_TEMPERATURE_C,
  ROOM_TEMPERATURE_C,
} from "@/lib/physics/constants";
import type {
  MicrowaveExperimentInput,
  MicrowaveExperimentResult,
  MicrowavePhysicsState,
} from "@/types/physics";

/**
 * Pedagogical approximation for MVP.
 * This is not a real microwave oven simulation.
 *
 * Model:
 *   energyInputJ      = powerW × heatingTimeSec
 *   deltaTemperatureC = (energyInputJ × breadFactor) / EFFECTIVE_HEAT_CAPACITY_J_PER_C
 *   finalTemperatureC = clamp(initialTemperatureC + deltaTemperatureC)
 *
 * Assumptions (intentionally simple):
 * - Electrical energy is treated as fully absorbed by the bread.
 * - Heat capacity is a constant classroom parameter, not a measured food property.
 * - No evaporative cooling, standing-wave pattern, or microwave engineering.
 */
export function simulateHeating(
  input: MicrowaveExperimentInput,
): MicrowaveExperimentResult {
  const initialTemperatureC = sanitizeTemperature(input.initialTemperatureC);
  const powerW = sanitizePower(input.powerW);
  const heatingTimeSec = sanitizeHeatingTime(input.heatingTimeSec);
  const breadFactor = sanitizeBreadFactor(input.breadFactor);

  const energyInputJ = powerW * heatingTimeSec;
  const rawDelta =
    (energyInputJ * breadFactor) / EFFECTIVE_HEAT_CAPACITY_J_PER_C;
  const unclampedFinal = initialTemperatureC + rawDelta;
  const finalTemperatureC = clamp(
    unclampedFinal,
    MIN_TEMPERATURE_C,
    MAX_TEMPERATURE_C,
  );
  const deltaTemperatureC = finalTemperatureC - initialTemperatureC;

  return {
    finalTemperatureC,
    energyInputJ,
    deltaTemperatureC,
  };
}

export function createDefaultPhysicsState(): MicrowavePhysicsState {
  return {
    initialTemperatureC: ROOM_TEMPERATURE_C,
    currentTemperatureC: ROOM_TEMPERATURE_C,
    powerW: DEFAULT_POWER_W,
    heatingTimeSec: DEFAULT_HEATING_TIME_SEC,
    breadFactor: DEFAULT_BREAD_FACTOR,
  };
}

export function applyHeatingResult(
  state: MicrowavePhysicsState,
  result: MicrowaveExperimentResult,
): MicrowavePhysicsState {
  return {
    ...state,
    currentTemperatureC: result.finalTemperatureC,
  };
}

export function resetBreadTemperature(
  state: MicrowavePhysicsState,
): MicrowavePhysicsState {
  return {
    ...state,
    currentTemperatureC: state.initialTemperatureC,
  };
}

export function toExperimentInput(
  state: MicrowavePhysicsState,
): MicrowaveExperimentInput {
  return {
    initialTemperatureC: state.currentTemperatureC,
    powerW: state.powerW,
    heatingTimeSec: state.heatingTimeSec,
    breadFactor: state.breadFactor,
  };
}

export function updateMicrowavePhysicsState(
  state: MicrowavePhysicsState,
  updates: Partial<Pick<MicrowavePhysicsState, "powerW" | "heatingTimeSec">>,
): MicrowavePhysicsState {
  return {
    ...state,
    powerW:
      updates.powerW === undefined ? state.powerW : sanitizePower(updates.powerW),
    heatingTimeSec:
      updates.heatingTimeSec === undefined
        ? state.heatingTimeSec
        : sanitizeHeatingTime(updates.heatingTimeSec),
  };
}

export function sanitizeTemperature(value: number): number {
  return clamp(finiteOr(value, ROOM_TEMPERATURE_C), MIN_TEMPERATURE_C, MAX_TEMPERATURE_C);
}

export function sanitizePower(value: number): number {
  return clamp(finiteOr(value, 0), MIN_POWER_W, MAX_POWER_W);
}

export function sanitizeHeatingTime(value: number): number {
  return clamp(finiteOr(value, 0), MIN_HEATING_TIME_SEC, MAX_HEATING_TIME_SEC);
}

export function sanitizeBreadFactor(value: number): number {
  return clamp(finiteOr(value, 0), MIN_BREAD_FACTOR, MAX_BREAD_FACTOR);
}

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
