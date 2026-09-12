export type SampleId =
  | "iron-cube"
  | "wood-cube"
  | "compact-metal"
  | "large-plastic";

export type ComparisonMode =
  | "observe"
  | "same-volume"
  | "same-mass"
  | "cut-uniform";

export const SAMPLES_EXPERIMENT_A = "same-volume-different-mass" as const;
export const SAMPLES_EXPERIMENT_B = "same-mass-different-volume" as const;
export const SAMPLES_EXPERIMENT_C = "cut-uniform-sample" as const;

export type SamplesExperimentId =
  | typeof SAMPLES_EXPERIMENT_A
  | typeof SAMPLES_EXPERIMENT_B
  | typeof SAMPLES_EXPERIMENT_C;

export const SAMPLES_EXPERIMENT_ORDER: SamplesExperimentId[] = [
  SAMPLES_EXPERIMENT_A,
  SAMPLES_EXPERIMENT_B,
  SAMPLES_EXPERIMENT_C,
];

export interface SampleState {
  id: SampleId;
  materialLabel: string;
  massG: number;
  volumeCm3: number;
  hollow: boolean;
}

export interface DensitySceneState {
  samples: SampleState[];
  comparisonMode: ComparisonMode;
  cutFactor: 1 | 0.5;
  highlightedIds: SampleId[];
  massesRevealed: boolean;
}

export interface SamplesExperimentResult {
  experimentId: SamplesExperimentId;
  before: DensitySceneState;
  after: DensitySceneState;
  intervention: {
    comparisonMode: ComparisonMode;
    cutFactor: 1 | 0.5;
  };
}

export const SAMPLE_CATALOG: Record<SampleId, SampleState> = {
  "iron-cube": {
    id: "iron-cube",
    materialLabel: "铁",
    massG: 79,
    volumeCm3: 10,
    hollow: false,
  },
  "wood-cube": {
    id: "wood-cube",
    materialLabel: "木",
    massG: 6,
    volumeCm3: 10,
    hollow: false,
  },
  "compact-metal": {
    id: "compact-metal",
    materialLabel: "金属小块",
    massG: 20,
    volumeCm3: 2.5,
    hollow: false,
  },
  "large-plastic": {
    id: "large-plastic",
    materialLabel: "塑料块",
    massG: 20,
    volumeCm3: 20,
    hollow: false,
  },
};

export const SAMPLE_IDS = Object.keys(SAMPLE_CATALOG) as SampleId[];

export function densityGPerCm3(sample: Pick<SampleState, "massG" | "volumeCm3">): number {
  if (sample.volumeCm3 <= 0) {
    throw new Error("Volume must be positive.");
  }
  return sample.massG / sample.volumeCm3;
}

export function applyCutFactor(
  sample: SampleState,
  cutFactor: 1 | 0.5,
): SampleState {
  if (cutFactor === 1) {
    return { ...sample };
  }
  return {
    ...sample,
    massG: sample.massG * cutFactor,
    volumeCm3: sample.volumeCm3 * cutFactor,
  };
}

export function createInitialDensityState(): DensitySceneState {
  return {
    samples: SAMPLE_IDS.map((id) => ({ ...SAMPLE_CATALOG[id] })),
    comparisonMode: "observe",
    cutFactor: 1,
    highlightedIds: ["iron-cube", "wood-cube"],
    massesRevealed: false,
  };
}

export function isSampleId(value: unknown): value is SampleId {
  return (
    value === "iron-cube" ||
    value === "wood-cube" ||
    value === "compact-metal" ||
    value === "large-plastic"
  );
}

export function isDensitySceneState(value: unknown): value is DensitySceneState {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    Array.isArray(record.samples) &&
    record.samples.length === 4 &&
    record.samples.every(isSampleState) &&
    (record.comparisonMode === "observe" ||
      record.comparisonMode === "same-volume" ||
      record.comparisonMode === "same-mass" ||
      record.comparisonMode === "cut-uniform") &&
    (record.cutFactor === 1 || record.cutFactor === 0.5) &&
    Array.isArray(record.highlightedIds) &&
    typeof record.massesRevealed === "boolean"
  );
}

export function isSampleState(value: unknown): value is SampleState {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    isSampleId(record.id) &&
    typeof record.materialLabel === "string" &&
    typeof record.massG === "number" &&
    typeof record.volumeCm3 === "number" &&
    record.volumeCm3 > 0 &&
    typeof record.hollow === "boolean"
  );
}

export function visibleSamples(state: DensitySceneState): SampleState[] {
  const byId = new Map(state.samples.map((sample) => [sample.id, sample]));
  return state.highlightedIds
    .map((id) => byId.get(id))
    .filter((sample): sample is SampleState => Boolean(sample))
    .map((sample) =>
      state.comparisonMode === "cut-uniform"
        ? applyCutFactor(sample, state.cutFactor)
        : sample,
    );
}

export function samplesPhysicsSnapshot(state: DensitySceneState): {
  comparisonMode: ComparisonMode;
  cutFactor: 1 | 0.5;
  massesRevealed: boolean;
  samples: Array<{
    id: SampleId;
    massG: number;
    volumeCm3: number;
    densityGPerCm3: number;
  }>;
} {
  return {
    comparisonMode: state.comparisonMode,
    cutFactor: state.cutFactor,
    massesRevealed: state.massesRevealed,
    samples: visibleSamples(state).map((sample) => ({
      id: sample.id,
      massG: sample.massG,
      volumeCm3: sample.volumeCm3,
      densityGPerCm3: densityGPerCm3(sample),
    })),
  };
}

export function runObserveDemo(): DensitySceneState[] {
  const hidden = createInitialDensityState();
  return [
    hidden,
    {
      ...hidden,
      massesRevealed: true,
    },
  ];
}

export function prepareExperimentState(
  experimentId: SamplesExperimentId,
): DensitySceneState {
  const base = createInitialDensityState();
  if (experimentId === SAMPLES_EXPERIMENT_A) {
    return {
      ...base,
      comparisonMode: "same-volume",
      highlightedIds: ["iron-cube", "wood-cube"],
      massesRevealed: true,
      cutFactor: 1,
    };
  }
  if (experimentId === SAMPLES_EXPERIMENT_B) {
    return {
      ...base,
      comparisonMode: "same-mass",
      highlightedIds: ["compact-metal", "large-plastic"],
      massesRevealed: true,
      cutFactor: 1,
    };
  }
  return {
    ...base,
    comparisonMode: "cut-uniform",
    highlightedIds: ["iron-cube"],
    massesRevealed: true,
    cutFactor: 1,
  };
}

export function runSamplesExperiment(
  experimentId: SamplesExperimentId,
): SamplesExperimentResult {
  const before = prepareExperimentState(experimentId);
  if (experimentId === SAMPLES_EXPERIMENT_C) {
    const after: DensitySceneState = {
      ...before,
      cutFactor: 0.5,
    };
    return {
      experimentId,
      before,
      after,
      intervention: {
        comparisonMode: "cut-uniform",
        cutFactor: 0.5,
      },
    };
  }
  return {
    experimentId,
    before,
    after: before,
    intervention: {
      comparisonMode: before.comparisonMode,
      cutFactor: 1,
    },
  };
}

export function expectedDensityFor(
  sampleId: SampleId,
  cutFactor: 1 | 0.5 = 1,
): number {
  return densityGPerCm3(applyCutFactor(SAMPLE_CATALOG[sampleId], cutFactor));
}
