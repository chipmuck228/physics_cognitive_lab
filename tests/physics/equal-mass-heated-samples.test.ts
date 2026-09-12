import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  officialAbsorbedEnergyJ,
  officialTemperatureChangeC,
  HEATED_SAMPLE_CATALOG,
} from "@/content/physics-models/specific-heat-capacity/physics-boundary";
import {
  createInitialHeatState,
  HEAT_EXPERIMENT_A,
  HEAT_EXPERIMENT_B,
  HEAT_EXPERIMENT_C,
  isHeatSamplesSceneState,
  runHeatExperiment,
  runHeatObserveDemo,
  temperatureChangeC,
} from "@/lib/physics/equal-mass-heated-samples";

describe("equal-mass-heated-samples physics", () => {
  it("returns the same official outcomes for the same experiment", () => {
    const first = runHeatExperiment(HEAT_EXPERIMENT_A);
    const second = runHeatExperiment(HEAT_EXPERIMENT_A);
    expect(first.after).toEqual(second.after);
    expect(temperatureChangeC(first.after.samples[0]!)).toBe(10);
    expect(temperatureChangeC(first.after.samples[1]!)).toBe(50);
  });

  it("keeps official Q as a table, not clock time", () => {
    expect(officialAbsorbedEnergyJ("Q-same")).toBe(4200);
    expect(
      officialTemperatureChangeC(HEATED_SAMPLE_CATALOG["water-200g"], 4200),
    ).toBe(5);
    const differentEnergy = runHeatExperiment(HEAT_EXPERIMENT_C);
    expect(temperatureChangeC(differentEnergy.after.samples[0]!)).toBe(10);
    expect(temperatureChangeC(differentEnergy.after.samples[1]!)).toBe(20);
    expect(runHeatExperiment(HEAT_EXPERIMENT_B).after.samples[1]?.massKg).toBe(0.2);
  });

  it("does not put an LLM on the physics path", () => {
    const source = readFileSync(
      resolve("lib/physics/equal-mass-heated-samples/types.ts"),
      "utf8",
    );
    expect(source).not.toMatch(/fetch\(|openai|anthropic|tutor/i);
    expect(isHeatSamplesSceneState(createInitialHeatState())).toBe(true);
    expect(runHeatObserveDemo()).toHaveLength(2);
  });
});
