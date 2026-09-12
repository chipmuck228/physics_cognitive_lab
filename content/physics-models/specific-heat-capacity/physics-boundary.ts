/**
 * Official numerical boundary for the named engine
 * `deterministic-equal-mass-heat-samples`.
 *
 * Same inputs → same output. The LLM must never invent Q, m, c, or ΔT.
 * This module is the contract, not a registered production SceneAdapter.
 */

export type HeatedSampleId = "water-100g" | "sand-100g" | "water-200g";
export type HeatingEnergyId = "Q-same" | "Q-double";
export type HeatComparisonMode =
  | "observe"
  | "same-mass-same-heating"
  | "same-material-different-mass"
  | "same-sample-different-energy";
export type HeatedMaterialKind = "water" | "sand";

export interface HeatedSampleSpec {
  id: HeatedSampleId;
  materialKind: HeatedMaterialKind;
  materialLabel: string;
  massKg: number;
  specificHeatJPerKgC: number;
  initialTemperatureC: number;
}

export const OFFICIAL_HEATING_ENERGY_J: Record<HeatingEnergyId, number> = {
  "Q-same": 4200,
  "Q-double": 8400,
};

export const HEATED_SAMPLE_CATALOG: Record<HeatedSampleId, HeatedSampleSpec> = {
  "water-100g": {
    id: "water-100g",
    materialKind: "water",
    materialLabel: "水",
    massKg: 0.1,
    specificHeatJPerKgC: 4200,
    initialTemperatureC: 20,
  },
  "sand-100g": {
    id: "sand-100g",
    materialKind: "sand",
    materialLabel: "沙子",
    massKg: 0.1,
    specificHeatJPerKgC: 840,
    initialTemperatureC: 20,
  },
  "water-200g": {
    id: "water-200g",
    materialKind: "water",
    materialLabel: "水",
    massKg: 0.2,
    specificHeatJPerKgC: 4200,
    initialTemperatureC: 20,
  },
};

const WATER_BOILING_C = 100;

export function officialAbsorbedEnergyJ(heatingId: HeatingEnergyId): number {
  return OFFICIAL_HEATING_ENERGY_J[heatingId];
}

export function officialTemperatureChangeC(
  sample: HeatedSampleSpec,
  absorbedEnergyJ: number,
): number {
  if (sample.massKg <= 0) {
    throw new Error("Mass must be positive.");
  }
  if (sample.specificHeatJPerKgC <= 0) {
    throw new Error("Specific heat capacity must be positive.");
  }
  const deltaT = absorbedEnergyJ / (sample.specificHeatJPerKgC * sample.massKg);
  if (
    sample.materialKind === "water" &&
    sample.initialTemperatureC + deltaT > WATER_BOILING_C
  ) {
    throw new Error("Q = c m ΔT does not cover a phase-change interval.");
  }
  return deltaT;
}

export function officialFinalTemperatureC(
  sample: HeatedSampleSpec,
  absorbedEnergyJ: number,
): number {
  return sample.initialTemperatureC + officialTemperatureChangeC(sample, absorbedEnergyJ);
}

export function samplesForComparison(
  mode: HeatComparisonMode,
): { left: HeatedSampleId; right: HeatedSampleId; heating: HeatingEnergyId | "pair" } {
  switch (mode) {
    case "observe":
    case "same-mass-same-heating":
      return { left: "water-100g", right: "sand-100g", heating: "Q-same" };
    case "same-material-different-mass":
      return { left: "water-100g", right: "water-200g", heating: "Q-same" };
    case "same-sample-different-energy":
      return { left: "water-100g", right: "water-100g", heating: "pair" };
    default: {
      const exhaustive: never = mode;
      throw new Error(`Unknown comparison mode: ${String(exhaustive)}`);
    }
  }
}
