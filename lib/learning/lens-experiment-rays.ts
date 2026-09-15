import {
  backwardExtensionThroughNearFocusRay,
  twoStandardRays,
  type CanonicalRayChoice,
} from "@/content/physics-models/convex-lens-imaging/construction";
import {
  LENS_EXPERIMENT_B,
  LENS_EXPERIMENT_C,
  type LensExperimentId,
} from "@/lib/physics/convex-lens-optical-bench";

/**
 * Pedagogical outgoing paths after the learner has recorded a screen result.
 * Not a completed MODEL grade and not official-ray leakage before the anomaly.
 */
export function lensExperimentPedagogicalRays(input: {
  experimentId: LensExperimentId;
  observedSaved: boolean;
  revealBackwardExtension: boolean;
}): CanonicalRayChoice[] {
  if (!input.observedSaved) {
    return [];
  }
  if (input.experimentId === LENS_EXPERIMENT_B) {
    return twoStandardRays();
  }
  if (input.experimentId === LENS_EXPERIMENT_C) {
    const rays = twoStandardRays();
    if (input.revealBackwardExtension) {
      return [...rays, backwardExtensionThroughNearFocusRay()];
    }
    return rays;
  }
  return [];
}

export function lensExperimentShowsLightPaths(experimentId: LensExperimentId): boolean {
  return experimentId === LENS_EXPERIMENT_B || experimentId === LENS_EXPERIMENT_C;
}
