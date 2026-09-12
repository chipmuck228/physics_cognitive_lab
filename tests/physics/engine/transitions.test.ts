import { describe, expect, it } from "vitest";

import {
  DEFAULT_ENGINE_CONFIG,
  EngineStroke,
  advanceStroke,
  createInitialEngineState,
  getStrokeState,
  hasMainMechanicalOutput,
  nextStroke,
} from "@/lib/physics/engine";

describe("stroke transitions", () => {
  it("intake → compression", () => {
    const next = advanceStroke(
      getStrokeState(EngineStroke.INTAKE, DEFAULT_ENGINE_CONFIG),
    );

    expect(next.stroke).toBe(EngineStroke.COMPRESSION);
    expect(next.pistonDirection).toBe("up");
    expect(next.intakeValveOpen).toBe(false);
    expect(next.exhaustValveOpen).toBe(false);
    expect(next.mechanicalOutput).toBe("input-required");
  });

  it("compression → power", () => {
    const next = advanceStroke(
      getStrokeState(EngineStroke.COMPRESSION, DEFAULT_ENGINE_CONFIG),
    );

    expect(next.stroke).toBe(EngineStroke.POWER);
    expect(next.pistonDirection).toBe("down");
    expect(next.combustionOccurred).toBe(true);
    expect(next.workTransfer).toBe("gas-to-mechanical");
    expect(next.mechanicalOutput).toBe("main-output");
  });

  it("power → exhaust", () => {
    const next = advanceStroke(
      getStrokeState(EngineStroke.POWER, DEFAULT_ENGINE_CONFIG),
    );

    expect(next.stroke).toBe(EngineStroke.EXHAUST);
    expect(next.pistonDirection).toBe("up");
    expect(next.exhaustValveOpen).toBe(true);
    expect(next.intakeValveOpen).toBe(false);
    expect(next.mechanicalOutput).toBe("none");
  });

  it("exhaust → intake and resets combustionOccurred", () => {
    const exhaust = getStrokeState(EngineStroke.EXHAUST, DEFAULT_ENGINE_CONFIG);
    expect(exhaust.combustionOccurred).toBe(true);

    const intake = advanceStroke(exhaust);

    expect(intake.stroke).toBe(EngineStroke.INTAKE);
    expect(intake.combustionOccurred).toBe(false);
    expect(intake.workingGasState).toBe("fresh-mixture");
    expect(intake.energyState.chemicalToInternalConversion).toBe("not-started");
  });

  it("four advances return to intake", () => {
    let state = createInitialEngineState();
    const seen: string[] = [state.stroke];

    for (let step = 0; step < 4; step += 1) {
      state = advanceStroke(state);
      seen.push(state.stroke);
    }

    expect(seen).toEqual([
      EngineStroke.INTAKE,
      EngineStroke.COMPRESSION,
      EngineStroke.POWER,
      EngineStroke.EXHAUST,
      EngineStroke.INTAKE,
    ]);
    expect(nextStroke(EngineStroke.EXHAUST)).toBe(EngineStroke.INTAKE);
  });

  it("can lock the piston at the compression → power transition", () => {
    const compression = getStrokeState(
      EngineStroke.COMPRESSION,
      DEFAULT_ENGINE_CONFIG,
    );
    const power = advanceStroke(compression, {
      combustionEnabled: true,
      pistonCanMove: false,
    });

    expect(power.stroke).toBe(EngineStroke.POWER);
    expect(power.combustionOccurred).toBe(true);
    expect(power.pistonDirection).toBe("held");
    expect(power.workTransfer).toBe("blocked");
    expect(power.mechanicalOutput).toBe("blocked");
    expect(hasMainMechanicalOutput(power)).toBe(false);
  });

  it("is deterministic", () => {
    const start = createInitialEngineState();
    expect(advanceStroke(start)).toEqual(advanceStroke(start));
  });
});
