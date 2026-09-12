import { describe, expect, it } from "vitest";

import {
  DEFAULT_ENGINE_CONFIG,
  ENGINE_STROKE_ORDER,
  EngineStroke,
  PISTON_BDC,
  PISTON_TDC,
  getStrokeState,
  hasMainMechanicalOutput,
  hasValveOverlap,
  runEngineCycle,
} from "@/lib/physics/engine";

const normal = DEFAULT_ENGINE_CONFIG;

describe("normal four-stroke cycle", () => {
  it("intake: intake valve open, exhaust closed, piston down", () => {
    const state = getStrokeState(EngineStroke.INTAKE, normal);

    expect(state.intakeValveOpen).toBe(true);
    expect(state.exhaustValveOpen).toBe(false);
    expect(state.pistonDirection).toBe("down");
    expect(state.pistonPosition).toBe(PISTON_BDC);
    expect(state.combustionOccurred).toBe(false);
    expect(state.combustionEventActive).toBe(false);
    expect(state.workingGasState).toBe("fresh-mixture");
    expect(state.mechanicalOutput).toBe("none");
    expect(state.workTransfer).toBe("none");
  });

  it("compression: both valves closed, piston up, input-required, mechanical-to-gas", () => {
    const state = getStrokeState(EngineStroke.COMPRESSION, normal);

    expect(state.intakeValveOpen).toBe(false);
    expect(state.exhaustValveOpen).toBe(false);
    expect(state.pistonDirection).toBe("up");
    expect(state.pistonPosition).toBe(PISTON_TDC);
    expect(state.combustionOccurred).toBe(false);
    expect(state.workingGasState).toBe("compressed");
    expect(state.mechanicalOutput).toBe("input-required");
    expect(state.workTransfer).toBe("mechanical-to-gas");
  });

  it("power: valves closed, combustion, piston down, gas-to-mechanical, main-output", () => {
    const state = getStrokeState(EngineStroke.POWER, normal);

    expect(state.intakeValveOpen).toBe(false);
    expect(state.exhaustValveOpen).toBe(false);
    expect(state.pistonDirection).toBe("down");
    expect(state.pistonPosition).toBe(PISTON_BDC);
    expect(state.combustionEnabled).toBe(true);
    expect(state.combustionEventActive).toBe(true);
    expect(state.combustionOccurred).toBe(true);
    expect(state.workingGasState).toBe("expanding");
    expect(state.workTransfer).toBe("gas-to-mechanical");
    expect(state.mechanicalOutput).toBe("main-output");
    expect(hasMainMechanicalOutput(state)).toBe(true);
  });

  it("exhaust: exhaust open, intake closed, piston up", () => {
    const state = getStrokeState(EngineStroke.EXHAUST, normal);

    expect(state.intakeValveOpen).toBe(false);
    expect(state.exhaustValveOpen).toBe(true);
    expect(state.pistonDirection).toBe("up");
    expect(state.pistonPosition).toBe(PISTON_TDC);
    expect(state.combustionEventActive).toBe(false);
    expect(state.combustionOccurred).toBe(true);
    expect(state.workingGasState).toBe("exhaust");
    expect(state.mechanicalOutput).toBe("none");
    expect(state.workTransfer).toBe("none");
  });

  it("never opens both valves in the pedagogical cycle", () => {
    for (const stroke of ENGINE_STROKE_ORDER) {
      for (const combustionEnabled of [true, false]) {
        for (const pistonCanMove of [true, false]) {
          const state = getStrokeState(stroke, {
            combustionEnabled,
            pistonCanMove,
          });
          expect(hasValveOverlap(state)).toBe(false);
        }
      }
    }
  });

  it("does not treat every stroke as main mechanical output", () => {
    const cycle = runEngineCycle(normal);
    const mainOutputStrokes = cycle.filter(hasMainMechanicalOutput);

    expect(mainOutputStrokes).toHaveLength(1);
    expect(mainOutputStrokes[0]?.stroke).toBe(EngineStroke.POWER);
  });

  it("does not encode pressure or thermodynamic numbers", () => {
    const power = getStrokeState(EngineStroke.POWER, normal);

    expect(power).not.toHaveProperty("pressure");
    expect(power).not.toHaveProperty("temperatureK");
    expect(power).not.toHaveProperty("volume");
    expect(power).not.toHaveProperty("efficiency");
  });

  it("is deterministic: same input → same output", () => {
    const first = runEngineCycle(normal);
    const second = runEngineCycle(normal);

    expect(first).toEqual(second);
    expect(getStrokeState(EngineStroke.POWER, normal)).toEqual(
      getStrokeState(EngineStroke.POWER, normal),
    );
  });
});
