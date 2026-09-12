import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  SAMPLE_CATALOG,
  SAMPLES_EXPERIMENT_A,
  SAMPLES_EXPERIMENT_B,
  SAMPLES_EXPERIMENT_C,
  applyCutFactor,
  createInitialDensityState,
  densityGPerCm3,
  expectedDensityFor,
  runObserveDemo,
  runSamplesExperiment,
} from "@/lib/physics/equal-volume-material-samples";

describe("equal-volume material samples physics", () => {
  it("computes catalog densities from mass / volume only", () => {
    expect(densityGPerCm3(SAMPLE_CATALOG["iron-cube"])).toBe(7.9);
    expect(densityGPerCm3(SAMPLE_CATALOG["wood-cube"])).toBe(0.6);
    expect(densityGPerCm3(SAMPLE_CATALOG["compact-metal"])).toBe(8);
    expect(densityGPerCm3(SAMPLE_CATALOG["large-plastic"])).toBe(1);
  });

  it("keeps same-volume samples at 10 cm³ and different masses", () => {
    const result = runSamplesExperiment(SAMPLES_EXPERIMENT_A);
    const iron = result.after.samples.find((sample) => sample.id === "iron-cube");
    const wood = result.after.samples.find((sample) => sample.id === "wood-cube");
    expect(iron?.volumeCm3).toBe(10);
    expect(wood?.volumeCm3).toBe(10);
    expect(iron?.massG).toBe(79);
    expect(wood?.massG).toBe(6);
    expect(result.after.highlightedIds).toEqual(["iron-cube", "wood-cube"]);
  });

  it("keeps same-mass samples at 20 g and different volumes", () => {
    const result = runSamplesExperiment(SAMPLES_EXPERIMENT_B);
    const metal = result.after.samples.find((sample) => sample.id === "compact-metal");
    const plastic = result.after.samples.find((sample) => sample.id === "large-plastic");
    expect(metal?.massG).toBe(20);
    expect(plastic?.massG).toBe(20);
    expect(metal?.volumeCm3).toBe(2.5);
    expect(plastic?.volumeCm3).toBe(20);
  });

  it("preserves density when a uniform sample is cut in half", () => {
    const before = SAMPLE_CATALOG["iron-cube"];
    const after = applyCutFactor(before, 0.5);
    expect(after.massG).toBe(39.5);
    expect(after.volumeCm3).toBe(5);
    expect(densityGPerCm3(after)).toBe(densityGPerCm3(before));
    expect(expectedDensityFor("iron-cube", 0.5)).toBe(7.9);

    const result = runSamplesExperiment(SAMPLES_EXPERIMENT_C);
    expect(result.after.cutFactor).toBe(0.5);
    expect(result.intervention.cutFactor).toBe(0.5);
  });

  it("returns the same next state for the same inputs", () => {
    expect(runSamplesExperiment(SAMPLES_EXPERIMENT_A)).toEqual(
      runSamplesExperiment(SAMPLES_EXPERIMENT_A),
    );
    expect(runSamplesExperiment(SAMPLES_EXPERIMENT_C)).toEqual(
      runSamplesExperiment(SAMPLES_EXPERIMENT_C),
    );
    expect(createInitialDensityState()).toEqual(createInitialDensityState());
  });

  it("reveals masses in the observe demo without changing volumes", () => {
    const demo = runObserveDemo();
    expect(demo[0]?.massesRevealed).toBe(false);
    expect(demo[1]?.massesRevealed).toBe(true);
    expect(demo[0]?.samples[0]?.volumeCm3).toBe(demo[1]?.samples[0]?.volumeCm3);
  });

  it("does not put an LLM on the physics path", () => {
    const source = readFileSync(
      "lib/physics/equal-volume-material-samples/types.ts",
      "utf8",
    );
    expect(source).not.toMatch(/openai|anthropic|tutor|llm|generateText/i);
  });
});
