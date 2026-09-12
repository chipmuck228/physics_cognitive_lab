import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EqualMassHeatedSamples } from "@/components/physics/heat/EqualMassHeatedSamples";
import { HEAT_COPY } from "@/lib/content/equal-mass-heated-samples";
import {
  finalTemperatureC,
  HEAT_EXPERIMENT_A,
  runHeatExperiment,
  temperatureChangeC,
} from "@/lib/physics/equal-mass-heated-samples";

const COMPONENT_SOURCE = readFileSync(
  resolve("components/physics/heat/EqualMassHeatedSamples.tsx"),
  "utf8",
);

describe("Scene 05 temperature representation (PRI-05-01)", () => {
  it("shows water T0 → Tfinal and a separate rise, from runtime functions", () => {
    const after = runHeatExperiment(HEAT_EXPERIMENT_A).after;
    const water = after.samples[0]!;
    const t0 = water.initialTemperatureC;
    const deltaT = temperatureChangeC(water);
    const tFinal = finalTemperatureC(water);

    render(<EqualMassHeatedSamples state={after} />);

    const stateLine = screen.getByTestId("heat-sample-left-temperature-state");
    const riseLine = screen.getByTestId("heat-sample-left-temperature-change");

    expect(stateLine).toHaveTextContent(
      `${HEAT_COPY.temperatureStateLabel}：${t0}${HEAT_COPY.tempUnit} → ${tFinal}${HEAT_COPY.tempUnit}`,
    );
    expect(riseLine).toHaveTextContent(
      `${HEAT_COPY.temperatureRiseLabel}：${deltaT}${HEAT_COPY.tempUnit}`,
    );
    expect(stateLine).toHaveAttribute("data-temp-initial", String(t0));
    expect(stateLine).toHaveAttribute("data-temp-final", String(tFinal));
    expect(riseLine).toHaveAttribute("data-temp-delta", String(deltaT));
    expect(stateLine.textContent).not.toMatch(/ΔT/);
    expect(document.body.textContent).not.toMatch(/ΔT\s*10℃\s*→\s*30℃/);
  });

  it("shows sand T0 → Tfinal and a separate rise, from runtime functions", () => {
    const after = runHeatExperiment(HEAT_EXPERIMENT_A).after;
    const sand = after.samples[1]!;
    const t0 = sand.initialTemperatureC;
    const deltaT = temperatureChangeC(sand);
    const tFinal = finalTemperatureC(sand);

    render(<EqualMassHeatedSamples state={after} />);

    const stateLine = screen.getByTestId("heat-sample-right-temperature-state");
    const riseLine = screen.getByTestId("heat-sample-right-temperature-change");

    expect(stateLine).toHaveTextContent(
      `${HEAT_COPY.temperatureStateLabel}：${t0}${HEAT_COPY.tempUnit} → ${tFinal}${HEAT_COPY.tempUnit}`,
    );
    expect(riseLine).toHaveTextContent(
      `${HEAT_COPY.temperatureRiseLabel}：${deltaT}${HEAT_COPY.tempUnit}`,
    );
    expect(document.body.textContent).not.toMatch(/ΔT\s*50℃\s*→\s*70℃/);
  });

  it("keeps arrow endpoints as temperature state, not ΔT → T", () => {
    const after = runHeatExperiment(HEAT_EXPERIMENT_A).after;
    render(<EqualMassHeatedSamples state={after} />);

    for (const slot of ["left", "right"] as const) {
      const sample = after.samples.find((item) => item.slotId === slot)!;
      const stateLine = screen.getByTestId(`heat-sample-${slot}-temperature-state`);
      expect(stateLine.getAttribute("data-temp-initial")).toBe(
        String(sample.initialTemperatureC),
      );
      expect(stateLine.getAttribute("data-temp-final")).toBe(
        String(finalTemperatureC(sample)),
      );
      expect(stateLine.getAttribute("data-temp-initial")).not.toBe(
        String(temperatureChangeC(sample)),
      );
    }
  });

  it("does not introduce UI-side physics literals", () => {
    expect(COMPONENT_SOURCE).toContain("sample.initialTemperatureC");
    expect(COMPONENT_SOURCE).toContain("temperatureChangeC");
    expect(COMPONENT_SOURCE).toContain("finalTemperatureC");
    expect(COMPONENT_SOURCE).not.toMatch(/\bconst\s+(initial|final|delta)\s*=\s*\d+/);
    expect(COMPONENT_SOURCE).not.toMatch(/ΔT \{temperatureChangeC/);
  });
});
