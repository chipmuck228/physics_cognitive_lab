import type { CanonicalRayChoice } from "@/content/physics-models/convex-lens-imaging/construction";
import type { ObjectStation } from "@/content/physics-models/convex-lens-imaging/physics-boundary";
import {
  nearestObjectStationFromBenchX,
  officialBenchDisplay,
  type ConvexLensSceneState,
} from "@/lib/physics/convex-lens-optical-bench";
import type { LensRayDraft } from "@/lib/learning/lens-model";
import { asCompletedLensRay } from "@/lib/learning/lens-model";

export const LENS_BENCH_VIEW_WIDTH = 640;
export const LENS_BENCH_CENTER_X = 320;
export const LENS_BENCH_UNIT = 72;

export type LensSemanticAction =
  | {
      kind: "move-object";
      fromStation: ObjectStation;
      toStation: ObjectStation;
    }
  | {
      kind: "move-screen";
      fromAtImagePlane: boolean;
      toAtImagePlane: boolean;
    }
  | {
      kind: "choose-object-station";
      station: ObjectStation;
    }
  | {
      kind: "construct-ray";
      slot: "rayA" | "rayB" | "optionalFocal";
      ray: CanonicalRayChoice | null;
    };

export function svgClientXToBenchX(
  clientX: number,
  svgWidth: number,
): number {
  if (svgWidth <= 0) {
    return 0;
  }
  const svgX = (clientX / svgWidth) * LENS_BENCH_VIEW_WIDTH;
  return (svgX - LENS_BENCH_CENTER_X) / LENS_BENCH_UNIT;
}

export function interpretObjectMoveGesture(input: {
  fromStation: ObjectStation;
  benchX: number;
}): Extract<LensSemanticAction, { kind: "move-object" }> | null {
  const toStation = nearestObjectStationFromBenchX(input.benchX);
  if (!toStation) {
    return null;
  }
  return {
    kind: "move-object",
    fromStation: input.fromStation,
    toStation,
  };
}

export function interpretScreenToggleGesture(input: {
  currentAtImagePlane: boolean;
}): Extract<LensSemanticAction, { kind: "move-screen" }> {
  return {
    kind: "move-screen",
    fromAtImagePlane: input.currentAtImagePlane,
    toAtImagePlane: !input.currentAtImagePlane,
  };
}

export function interpretConstructedRay(
  slot: "rayA" | "rayB" | "optionalFocal",
  draft: LensRayDraft,
): Extract<LensSemanticAction, { kind: "construct-ray" }> {
  return {
    kind: "construct-ray",
    slot,
    ray: asCompletedLensRay(draft),
  };
}

export function benchUnitsAreNotPhysicsTruth(
  state: ConvexLensSceneState,
  benchX: number,
): boolean {
  const official = officialBenchDisplay(state);
  return official.geometry.objectX !== benchX || official.station === state.objectStation;
}
