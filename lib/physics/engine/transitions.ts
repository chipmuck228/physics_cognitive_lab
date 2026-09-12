import { getStrokeState } from "./cycle";
import {
  ENGINE_STROKE_ORDER,
  type EngineExperimentConfig,
  type EngineState,
  type EngineStroke,
} from "./types";

export function nextStroke(stroke: EngineStroke): EngineStroke {
  const index = ENGINE_STROKE_ORDER.indexOf(stroke);
  return ENGINE_STROKE_ORDER[(index + 1) % ENGINE_STROKE_ORDER.length];
}

function configFrom(state: EngineState): EngineExperimentConfig {
  return {
    combustionEnabled: state.combustionEnabled,
    pistonCanMove: state.pistonCanMove,
  };
}

/**
 * Advance one pedagogical stroke. Optional config overlay lets a caller
 * lock the piston or disable combustion at a chosen transition
 * (for example: compress normally, then lock on power).
 */
export function advanceStroke(
  state: EngineState,
  config: EngineExperimentConfig = configFrom(state),
): EngineState {
  return getStrokeState(nextStroke(state.stroke), config);
}
