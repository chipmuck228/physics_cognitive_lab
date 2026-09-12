import { describe, expect, it } from "vitest";

import {
  EngineStroke,
  PISTON_BDC,
  PISTON_TDC,
  getStrokeState,
} from "@/lib/physics/engine";
import {
  crankAngleRad,
  displayPistonPosition,
  engineStrokeDurationMs,
  isPistonHeld,
  strokeMotionStartPosition,
} from "@/lib/physics/engine-visual";

const moving = { combustionEnabled: true, pistonCanMove: true };
const locked = { combustionEnabled: true, pistonCanMove: false };

describe("engine visual mapping", () => {
  it("interpolates piston travel from EngineState, without a second physics store", () => {
    const intake = getStrokeState(EngineStroke.INTAKE, moving);

    expect(strokeMotionStartPosition(intake)).toBe(PISTON_TDC);
    expect(displayPistonPosition(intake, 0)).toBe(PISTON_TDC);
    expect(displayPistonPosition(intake, 1)).toBe(intake.pistonPosition);
    expect(displayPistonPosition(intake, 0.5)).toBeCloseTo(
      (PISTON_TDC + PISTON_BDC) / 2,
    );
  });

  it("does not move a held piston when motionProgress changes", () => {
    const power = getStrokeState(EngineStroke.POWER, locked);

    expect(isPistonHeld(power)).toBe(true);
    expect(displayPistonPosition(power, 0)).toBe(PISTON_TDC);
    expect(displayPistonPosition(power, 0.8)).toBe(PISTON_TDC);
    expect(displayPistonPosition(power, 1)).toBe(power.pistonPosition);
    expect(crankAngleRad(power, 0)).toBe(crankAngleRad(power, 1));
  });

  it("keeps crank rotation forward across strokes", () => {
    const intakeEnd = crankAngleRad(getStrokeState(EngineStroke.INTAKE, moving), 1);
    const compressionStart = crankAngleRad(
      getStrokeState(EngineStroke.COMPRESSION, moving),
      0,
    );

    expect(intakeEnd).toBeCloseTo(Math.PI);
    expect(compressionStart).toBeCloseTo(Math.PI);
  });

  it("snaps motion when reduced-motion or the piston cannot move", () => {
    expect(engineStrokeDurationMs(true, true)).toBe(0);
    expect(engineStrokeDurationMs(false, false)).toBe(0);
    expect(engineStrokeDurationMs(false, true)).toBeGreaterThan(0);
  });
});
