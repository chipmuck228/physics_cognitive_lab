import { ENGINE_STROKE_ORDER, PISTON_BDC, PISTON_TDC } from "@/lib/physics/engine";
import type { EngineState } from "@/lib/physics/engine";

const STROKE_DURATION_MS = 1200;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function isPistonHeld(state: EngineState): boolean {
  return state.pistonDirection === "held" || !state.pistonCanMove;
}

/** Start of this stroke's visual travel. Derived from EngineState, not a second physics store. */
export function strokeMotionStartPosition(state: EngineState): number {
  if (isPistonHeld(state)) {
    return state.pistonPosition;
  }
  return state.pistonDirection === "down" ? PISTON_TDC : PISTON_BDC;
}

/** Display piston position in [0, 1]. EngineState.pistonPosition remains the snapshot. */
export function displayPistonPosition(
  state: EngineState,
  motionProgress: number,
): number {
  const start = strokeMotionStartPosition(state);
  const t = clamp01(motionProgress);
  return start + (state.pistonPosition - start) * t;
}

/**
 * Pedagogical crank angle. Continues forward through the four strokes.
 * Held pistons freeze the crank at the angle matching pistonPosition (TDC = 0).
 */
export function crankAngleRad(
  state: EngineState,
  motionProgress: number,
): number {
  if (isPistonHeld(state)) {
    return state.pistonPosition * Math.PI;
  }
  const index = ENGINE_STROKE_ORDER.indexOf(state.stroke);
  return (index + clamp01(motionProgress)) * Math.PI;
}

export function engineStrokeDurationMs(
  reduceMotion: boolean,
  pistonCanMove: boolean,
): number {
  if (reduceMotion || !pistonCanMove) {
    return 0;
  }
  return STROKE_DURATION_MS;
}
