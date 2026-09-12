/**
 * Official imaging-case contract for the named engine
 * `deterministic-convex-lens-imaging`.
 *
 * Same object station → same official state. The LLM must never invent
 * image position, real/virtual, or screen-receivability.
 *
 * This is Grade-9 discrete Physics Truth, not a ray-trace simulator
 * and not the thin-lens equation. Do not compute cases from
 * 1/f = 1/u + 1/v. Do not treat these rows as the student MODEL.
 */

export const OBJECT_STATIONS = [
  "beyond-2f",
  "at-2f",
  "between-f-and-2f",
  "at-f",
  "inside-f",
] as const;

export type ObjectStation = (typeof OBJECT_STATIONS)[number];

export type RayMeetingMode =
  | "actual-convergence"
  | "backward-extension"
  | "no-finite-meeting";

export type ImageNature = "real" | "virtual" | "none";
export type ImageOrientation = "inverted" | "upright" | "none";
export type ImageSizeRelation = "reduced" | "same-size" | "enlarged" | "none";
export type ImageSide = "other-side" | "same-side" | "none";
export type ImageDistanceRegion =
  | "between-f-and-2f"
  | "at-2f"
  | "beyond-2f"
  | "same-side-enlarged"
  | "none";

export type ScreenReceiveResult = "clear" | "blurred-or-absent" | "never";

export interface OfficialImagingState {
  station: ObjectStation;
  rayMeetingMode: RayMeetingMode;
  imageNature: ImageNature;
  imageOrientation: ImageOrientation;
  imageSizeRelation: ImageSizeRelation;
  imageSide: ImageSide;
  imageDistanceRegion: ImageDistanceRegion;
  finiteImage: boolean;
  screenReceivableIfAtImagePlane: boolean;
}

const OFFICIAL_IMAGING_BY_STATION: Record<ObjectStation, OfficialImagingState> =
  {
    "beyond-2f": {
      station: "beyond-2f",
      rayMeetingMode: "actual-convergence",
      imageNature: "real",
      imageOrientation: "inverted",
      imageSizeRelation: "reduced",
      imageSide: "other-side",
      imageDistanceRegion: "between-f-and-2f",
      finiteImage: true,
      screenReceivableIfAtImagePlane: true,
    },
    "at-2f": {
      station: "at-2f",
      rayMeetingMode: "actual-convergence",
      imageNature: "real",
      imageOrientation: "inverted",
      imageSizeRelation: "same-size",
      imageSide: "other-side",
      imageDistanceRegion: "at-2f",
      finiteImage: true,
      screenReceivableIfAtImagePlane: true,
    },
    "between-f-and-2f": {
      station: "between-f-and-2f",
      rayMeetingMode: "actual-convergence",
      imageNature: "real",
      imageOrientation: "inverted",
      imageSizeRelation: "enlarged",
      imageSide: "other-side",
      imageDistanceRegion: "beyond-2f",
      finiteImage: true,
      screenReceivableIfAtImagePlane: true,
    },
    "at-f": {
      station: "at-f",
      rayMeetingMode: "no-finite-meeting",
      imageNature: "none",
      imageOrientation: "none",
      imageSizeRelation: "none",
      imageSide: "none",
      imageDistanceRegion: "none",
      finiteImage: false,
      screenReceivableIfAtImagePlane: false,
    },
    "inside-f": {
      station: "inside-f",
      rayMeetingMode: "backward-extension",
      imageNature: "virtual",
      imageOrientation: "upright",
      imageSizeRelation: "enlarged",
      imageSide: "same-side",
      imageDistanceRegion: "same-side-enlarged",
      finiteImage: true,
      screenReceivableIfAtImagePlane: false,
    },
  };

export function officialImagingState(
  station: ObjectStation,
): OfficialImagingState {
  return OFFICIAL_IMAGING_BY_STATION[station];
}

/**
 * Moving the screen does not move the optical image.
 * A real image is clear only if the screen is at the image plane.
 * A virtual image or a no-finite-image case cannot be received.
 */
export function officialScreenReceive(
  station: ObjectStation,
  screenAtImagePlane: boolean,
): ScreenReceiveResult {
  const state = officialImagingState(station);
  if (!state.finiteImage || state.imageNature === "virtual") {
    return "never";
  }
  return screenAtImagePlane ? "clear" : "blurred-or-absent";
}

export function officialPartialCoverEffect(): {
  imageComplete: true;
  brightness: "reduced";
} {
  return { imageComplete: true, brightness: "reduced" };
}

/**
 * Real-image trend when the object moves closer to the lens while
 * remaining outside F. Not a student-facing slogan.
 */
export function officialRealImageTrendTowardF(): {
  imageMoves: "farther-from-lens";
  imageSize: "becomes-larger";
} {
  return {
    imageMoves: "farther-from-lens",
    imageSize: "becomes-larger",
  };
}
