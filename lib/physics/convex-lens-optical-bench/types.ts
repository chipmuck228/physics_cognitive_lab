import {
  OBJECT_STATIONS,
  officialImagingState,
  officialPartialCoverEffect,
  officialRealImageTrendTowardF,
  officialScreenReceive,
  type ObjectStation,
  type OfficialImagingState,
  type ScreenReceiveResult,
} from "@/content/physics-models/convex-lens-imaging/physics-boundary";
import type {
  CanonicalRayChoice,
} from "@/content/physics-models/convex-lens-imaging/construction";

export const LENS_EXPERIMENT_A = "compare-real-image-across-2f" as const;
export const LENS_EXPERIMENT_B = "probe-object-at-f" as const;
export const LENS_EXPERIMENT_C = "probe-object-inside-f" as const;
export const LENS_EXPERIMENT_D = "cover-part-of-lens" as const;

export type LensExperimentId =
  | typeof LENS_EXPERIMENT_A
  | typeof LENS_EXPERIMENT_B
  | typeof LENS_EXPERIMENT_C
  | typeof LENS_EXPERIMENT_D;

export const LENS_EXPERIMENT_ORDER: LensExperimentId[] = [
  LENS_EXPERIMENT_A,
  LENS_EXPERIMENT_B,
  LENS_EXPERIMENT_C,
  LENS_EXPERIMENT_D,
];

export const LENS_OBSERVE_DEMO_STATIONS: ObjectStation[] = [
  "beyond-2f",
  "between-f-and-2f",
  "at-f",
  "inside-f",
];

export interface ConvexLensSceneState {
  objectStation: ObjectStation;
  screenAtImagePlane: boolean;
  lensPartiallyCovered: boolean;
  demoStationIndex: number;
}

export interface ConvexLensExperimentResult {
  experimentId: LensExperimentId;
  before: ConvexLensSceneState;
  after: ConvexLensSceneState;
  official: OfficialImagingState;
  screenReceive: ScreenReceiveResult;
  cover: { imageComplete: true; brightness: "reduced" | "normal" };
  realImageTrend?: ReturnType<typeof officialRealImageTrendTowardF>;
}

export interface BenchGeometry {
  objectX: number;
  imageX: number | null;
  screenX: number;
  objectHeight: number;
  imageHeight: number;
  imageInverted: boolean;
}

export interface OfficialBenchDisplay {
  station: ObjectStation;
  imaging: OfficialImagingState;
  screenReceive: ScreenReceiveResult;
  cover: { imageComplete: true; brightness: "reduced" | "normal" };
  geometry: BenchGeometry;
}

const OBJECT_X: Record<ObjectStation, number> = {
  "beyond-2f": -2.7,
  "at-2f": -2,
  "between-f-and-2f": -1.45,
  "at-f": -1,
  "inside-f": -0.55,
};

const IMAGE_X: Record<ObjectStation, number | null> = {
  "beyond-2f": 1.45,
  "at-2f": 2,
  "between-f-and-2f": 2.7,
  "at-f": null,
  "inside-f": -3.2,
};

const OBJECT_HEIGHT = 44;
const IMAGE_HEIGHT: Record<ObjectStation, number> = {
  "beyond-2f": 28,
  "at-2f": 44,
  "between-f-and-2f": 68,
  "at-f": 0,
  "inside-f": 68,
};

/** Bench units, not SVG pixels. Used only to snap a gesture to a named station. */
export const OBJECT_BENCH_X: Record<ObjectStation, number> = OBJECT_X;

export function nearestObjectStationFromBenchX(benchX: number): ObjectStation | null {
  if (benchX > -0.2) {
    return null;
  }
  let best: ObjectStation = "beyond-2f";
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const station of OBJECT_STATIONS) {
    const distance = Math.abs(benchX - OBJECT_X[station]);
    if (distance < bestDistance) {
      best = station;
      bestDistance = distance;
    }
  }
  return best;
}

export function isObjectStation(value: unknown): value is ObjectStation {
  return (OBJECT_STATIONS as readonly string[]).includes(value as string);
}

export function isLensExperimentId(value: string): value is LensExperimentId {
  return (LENS_EXPERIMENT_ORDER as readonly string[]).includes(value);
}

export function isConvexLensSceneState(value: unknown): value is ConvexLensSceneState {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    isObjectStation(record.objectStation) &&
    typeof record.screenAtImagePlane === "boolean" &&
    typeof record.lensPartiallyCovered === "boolean" &&
    typeof record.demoStationIndex === "number"
  );
}

export function createInitialConvexLensState(): ConvexLensSceneState {
  return {
    objectStation: "beyond-2f",
    screenAtImagePlane: true,
    lensPartiallyCovered: false,
    demoStationIndex: 0,
  };
}

export function officialBenchDisplay(
  state: ConvexLensSceneState,
): OfficialBenchDisplay {
  const imaging = officialImagingState(state.objectStation);
  const screenReceive = officialScreenReceive(
    state.objectStation,
    state.screenAtImagePlane,
  );
  const covered = state.lensPartiallyCovered
    ? officialPartialCoverEffect()
    : { imageComplete: true as const, brightness: "normal" as const };
  const imageX = IMAGE_X[state.objectStation];
  const screenX = screenXFor(state.objectStation, state.screenAtImagePlane, imageX);
  return {
    station: state.objectStation,
    imaging,
    screenReceive,
    cover: covered,
    geometry: {
      objectX: OBJECT_X[state.objectStation],
      imageX,
      screenX,
      objectHeight: OBJECT_HEIGHT,
      imageHeight: IMAGE_HEIGHT[state.objectStation],
      imageInverted: imaging.imageOrientation === "inverted",
    },
  };
}

export function convexLensPhysicsSnapshot(state: ConvexLensSceneState) {
  const display = officialBenchDisplay(state);
  return {
    objectStation: state.objectStation,
    screenAtImagePlane: state.screenAtImagePlane,
    lensPartiallyCovered: state.lensPartiallyCovered,
    rayMeetingMode: display.imaging.rayMeetingMode,
    imageNature: display.imaging.imageNature,
    imageSide: display.imaging.imageSide,
    imageSizeRelation: display.imaging.imageSizeRelation,
    finiteImage: display.imaging.finiteImage,
    screenReceive: display.screenReceive,
    imageX: display.geometry.imageX,
    screenX: display.geometry.screenX,
  };
}

export function runObserveDemo(index: number): ConvexLensSceneState {
  const station =
    LENS_OBSERVE_DEMO_STATIONS[index % LENS_OBSERVE_DEMO_STATIONS.length] ??
    "beyond-2f";
  return {
    objectStation: station,
    screenAtImagePlane: station === "beyond-2f" || station === "between-f-and-2f",
    lensPartiallyCovered: false,
    demoStationIndex: index % LENS_OBSERVE_DEMO_STATIONS.length,
  };
}

export function prepareLensExperimentState(
  experimentId: LensExperimentId,
  current: ConvexLensSceneState,
): ConvexLensSceneState {
  if (experimentId === LENS_EXPERIMENT_A) {
    return {
      ...current,
      objectStation: "between-f-and-2f",
      screenAtImagePlane: true,
      lensPartiallyCovered: false,
    };
  }
  if (experimentId === LENS_EXPERIMENT_B) {
    return {
      ...current,
      objectStation: "at-f",
      screenAtImagePlane: false,
      lensPartiallyCovered: false,
    };
  }
  if (experimentId === LENS_EXPERIMENT_C) {
    return {
      ...current,
      objectStation: "inside-f",
      screenAtImagePlane: false,
      lensPartiallyCovered: false,
    };
  }
  return {
    ...current,
    objectStation: "beyond-2f",
    screenAtImagePlane: true,
    lensPartiallyCovered: true,
  };
}

export function runConvexLensExperiment(
  experimentId: LensExperimentId,
  current: ConvexLensSceneState = createInitialConvexLensState(),
): ConvexLensExperimentResult {
  const after = prepareLensExperimentState(experimentId, current);
  const display = officialBenchDisplay(after);
  return {
    experimentId,
    before: current,
    after,
    official: display.imaging,
    screenReceive: display.screenReceive,
    cover: display.cover,
    realImageTrend:
      experimentId === LENS_EXPERIMENT_A
        ? officialRealImageTrendTowardF()
        : undefined,
  };
}

export function screenDoesNotMoveImage(
  station: ObjectStation,
  atPlane: boolean,
  offPlane: boolean,
): boolean {
  const at = officialBenchDisplay({
    objectStation: station,
    screenAtImagePlane: atPlane,
    lensPartiallyCovered: false,
    demoStationIndex: 0,
  });
  const off = officialBenchDisplay({
    objectStation: station,
    screenAtImagePlane: offPlane,
    lensPartiallyCovered: false,
    demoStationIndex: 0,
  });
  return at.geometry.imageX === off.geometry.imageX;
}

function screenXFor(
  station: ObjectStation,
  screenAtImagePlane: boolean,
  imageX: number | null,
): number {
  const imaging = officialImagingState(station);
  if (imaging.imageNature === "real" && imageX !== null) {
    return screenAtImagePlane ? imageX : imageX + 0.85;
  }
  return screenAtImagePlane ? 1.8 : 2.5;
}

export function raysAreStudentOwned(
  rays: CanonicalRayChoice[] | undefined,
): boolean {
  return Array.isArray(rays) && rays.length > 0;
}
