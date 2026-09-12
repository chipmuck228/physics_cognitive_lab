import {
  HEATED_SAMPLE_CATALOG,
  officialAbsorbedEnergyJ,
  officialFinalTemperatureC,
  officialTemperatureChangeC,
  type HeatComparisonMode,
  type HeatedSampleId,
  type HeatedSampleSpec,
  type HeatingEnergyId,
} from "@/content/physics-models/specific-heat-capacity/physics-boundary";

export type { HeatComparisonMode, HeatedSampleId, HeatingEnergyId };

export const HEAT_EXPERIMENT_A =
  "same-mass-same-heating-different-material" as const;
export const HEAT_EXPERIMENT_B =
  "same-material-same-heating-different-mass" as const;
export const HEAT_EXPERIMENT_C =
  "same-material-same-mass-different-energy" as const;

export type HeatExperimentId =
  | typeof HEAT_EXPERIMENT_A
  | typeof HEAT_EXPERIMENT_B
  | typeof HEAT_EXPERIMENT_C;

export const HEAT_EXPERIMENT_ORDER: HeatExperimentId[] = [
  HEAT_EXPERIMENT_A,
  HEAT_EXPERIMENT_B,
  HEAT_EXPERIMENT_C,
];

export interface HeatSampleState {
  slotId: string;
  sampleId: HeatedSampleId;
  materialLabel: string;
  massKg: number;
  specificHeatJPerKgC: number;
  initialTemperatureC: number;
  absorbedEnergyJ: number;
  heated: boolean;
}

export interface HeatSamplesSceneState {
  samples: HeatSampleState[];
  comparisonMode: HeatComparisonMode;
  heatingEnergy: HeatingEnergyId;
  temperaturesRevealed: boolean;
}

export interface HeatExperimentResult {
  experimentId: HeatExperimentId;
  before: HeatSamplesSceneState;
  after: HeatSamplesSceneState;
  intervention: {
    comparisonMode: HeatComparisonMode;
    heatingEnergy: HeatingEnergyId | "pair";
  };
}

export function heatSampleFromSpec(
  spec: HeatedSampleSpec,
  slotId: string,
  absorbedEnergyJ = 0,
  heated = false,
): HeatSampleState {
  return {
    slotId,
    sampleId: spec.id,
    materialLabel: spec.materialLabel,
    massKg: spec.massKg,
    specificHeatJPerKgC: spec.specificHeatJPerKgC,
    initialTemperatureC: spec.initialTemperatureC,
    absorbedEnergyJ,
    heated,
  };
}

export function temperatureChangeC(sample: HeatSampleState): number {
  if (!sample.heated) {
    return 0;
  }
  return officialTemperatureChangeC(
    HEATED_SAMPLE_CATALOG[sample.sampleId],
    sample.absorbedEnergyJ,
  );
}

export function finalTemperatureC(sample: HeatSampleState): number {
  if (!sample.heated) {
    return sample.initialTemperatureC;
  }
  return officialFinalTemperatureC(
    HEATED_SAMPLE_CATALOG[sample.sampleId],
    sample.absorbedEnergyJ,
  );
}

export function createInitialHeatState(): HeatSamplesSceneState {
  return {
    samples: [
      heatSampleFromSpec(HEATED_SAMPLE_CATALOG["water-100g"], "left"),
      heatSampleFromSpec(HEATED_SAMPLE_CATALOG["sand-100g"], "right"),
    ],
    comparisonMode: "observe",
    heatingEnergy: "Q-same",
    temperaturesRevealed: false,
  };
}

export function isHeatSamplesSceneState(
  value: unknown,
): value is HeatSamplesSceneState {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    Array.isArray(record.samples) &&
    record.samples.length >= 2 &&
    record.samples.every(isHeatSampleState) &&
    (record.comparisonMode === "observe" ||
      record.comparisonMode === "same-mass-same-heating" ||
      record.comparisonMode === "same-material-different-mass" ||
      record.comparisonMode === "same-sample-different-energy") &&
    (record.heatingEnergy === "Q-same" || record.heatingEnergy === "Q-double") &&
    typeof record.temperaturesRevealed === "boolean"
  );
}

export function isHeatSampleState(value: unknown): value is HeatSampleState {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.slotId === "string" &&
    typeof record.sampleId === "string" &&
    typeof record.materialLabel === "string" &&
    typeof record.massKg === "number" &&
    typeof record.specificHeatJPerKgC === "number" &&
    typeof record.initialTemperatureC === "number" &&
    typeof record.absorbedEnergyJ === "number" &&
    typeof record.heated === "boolean"
  );
}

export function heatPhysicsSnapshot(state: HeatSamplesSceneState): {
  comparisonMode: HeatComparisonMode;
  heatingEnergy: HeatingEnergyId;
  temperaturesRevealed: boolean;
  samples: Array<{
    slotId: string;
    sampleId: HeatedSampleId;
    massKg: number;
    absorbedEnergyJ: number;
    temperatureChangeC: number;
    finalTemperatureC: number;
  }>;
} {
  return {
    comparisonMode: state.comparisonMode,
    heatingEnergy: state.heatingEnergy,
    temperaturesRevealed: state.temperaturesRevealed,
    samples: state.samples.map((sample) => ({
      slotId: sample.slotId,
      sampleId: sample.sampleId,
      massKg: sample.massKg,
      absorbedEnergyJ: sample.absorbedEnergyJ,
      temperatureChangeC: temperatureChangeC(sample),
      finalTemperatureC: finalTemperatureC(sample),
    })),
  };
}

export function runHeatObserveDemo(): HeatSamplesSceneState[] {
  const hidden = createInitialHeatState();
  const q = officialAbsorbedEnergyJ("Q-same");
  return [
    hidden,
    {
      ...hidden,
      comparisonMode: "same-mass-same-heating",
      temperaturesRevealed: true,
      samples: hidden.samples.map((sample) => ({
        ...sample,
        absorbedEnergyJ: q,
        heated: true,
      })),
    },
  ];
}

export function prepareHeatExperimentState(
  experimentId: HeatExperimentId,
): HeatSamplesSceneState {
  if (experimentId === HEAT_EXPERIMENT_A) {
    return {
      samples: [
        heatSampleFromSpec(HEATED_SAMPLE_CATALOG["water-100g"], "left"),
        heatSampleFromSpec(HEATED_SAMPLE_CATALOG["sand-100g"], "right"),
      ],
      comparisonMode: "same-mass-same-heating",
      heatingEnergy: "Q-same",
      temperaturesRevealed: false,
    };
  }
  if (experimentId === HEAT_EXPERIMENT_B) {
    return {
      samples: [
        heatSampleFromSpec(HEATED_SAMPLE_CATALOG["water-100g"], "left"),
        heatSampleFromSpec(HEATED_SAMPLE_CATALOG["water-200g"], "right"),
      ],
      comparisonMode: "same-material-different-mass",
      heatingEnergy: "Q-same",
      temperaturesRevealed: false,
    };
  }
  return {
    samples: [
      heatSampleFromSpec(HEATED_SAMPLE_CATALOG["water-100g"], "left"),
      heatSampleFromSpec(HEATED_SAMPLE_CATALOG["water-100g"], "right"),
    ],
    comparisonMode: "same-sample-different-energy",
    heatingEnergy: "Q-same",
    temperaturesRevealed: false,
  };
}

export function runHeatExperiment(
  experimentId: HeatExperimentId,
): HeatExperimentResult {
  const before = prepareHeatExperimentState(experimentId);
  if (experimentId === HEAT_EXPERIMENT_C) {
    const after: HeatSamplesSceneState = {
      ...before,
      temperaturesRevealed: true,
      samples: [
        {
          ...before.samples[0]!,
          absorbedEnergyJ: officialAbsorbedEnergyJ("Q-same"),
          heated: true,
        },
        {
          ...before.samples[1]!,
          absorbedEnergyJ: officialAbsorbedEnergyJ("Q-double"),
          heated: true,
        },
      ],
    };
    return {
      experimentId,
      before,
      after,
      intervention: {
        comparisonMode: "same-sample-different-energy",
        heatingEnergy: "pair",
      },
    };
  }

  const q = officialAbsorbedEnergyJ("Q-same");
  const after: HeatSamplesSceneState = {
    ...before,
    temperaturesRevealed: true,
    samples: before.samples.map((sample) => ({
      ...sample,
      absorbedEnergyJ: q,
      heated: true,
    })),
  };
  return {
    experimentId,
    before,
    after,
    intervention: {
      comparisonMode: before.comparisonMode,
      heatingEnergy: "Q-same",
    },
  };
}
