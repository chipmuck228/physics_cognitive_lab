import { describe, expect, it } from "vitest";

import {
  officialImagingState,
  officialPartialCoverEffect,
  officialRealImageTrendTowardF,
  officialScreenReceive,
  OBJECT_STATIONS,
} from "@/content/physics-models/convex-lens-imaging/physics-boundary";
import {
  actualThroughNearFocusRay,
  isCanonicalRayGeometricallyCoherent,
  twoStandardRays,
} from "@/content/physics-models/convex-lens-imaging/construction";
import {
  createInitialConvexLensState,
  officialBenchDisplay,
  runConvexLensExperiment,
  screenDoesNotMoveImage,
} from "@/lib/physics/convex-lens-optical-bench";

describe("convex-lens-optical-bench physics", () => {
  it("covers all five official stations", () => {
    for (const station of OBJECT_STATIONS) {
      const display = officialBenchDisplay({
        ...createInitialConvexLensState(),
        objectStation: station,
      });
      expect(display.imaging).toEqual(officialImagingState(station));
    }
  });

  it("keeps screen behavior official and independent of image position", () => {
    expect(officialScreenReceive("beyond-2f", true)).toBe("clear");
    expect(officialScreenReceive("beyond-2f", false)).toBe("blurred-or-absent");
    expect(officialScreenReceive("inside-f", true)).toBe("never");
    expect(officialScreenReceive("at-f", false)).toBe("never");
    expect(screenDoesNotMoveImage("beyond-2f", true, false)).toBe(true);
    expect(screenDoesNotMoveImage("inside-f", true, false)).toBe(true);
    const at = officialBenchDisplay({
      ...createInitialConvexLensState(),
      objectStation: "beyond-2f",
      screenAtImagePlane: true,
    });
    const off = officialBenchDisplay({
      ...createInitialConvexLensState(),
      objectStation: "beyond-2f",
      screenAtImagePlane: false,
    });
    expect(at.geometry.imageX).toBe(off.geometry.imageX);
    expect(at.geometry.screenX).not.toBe(off.geometry.screenX);
  });

  it("keeps a partial cover as a complete dimmer image", () => {
    const cover = officialPartialCoverEffect();
    expect(cover.imageComplete).toBe(true);
    expect(cover.brightness).toBe("reduced");
    const result = runConvexLensExperiment("cover-part-of-lens");
    expect(result.cover.imageComplete).toBe(true);
    expect(result.cover.brightness).toBe("reduced");
    expect(result.after.lensPartiallyCovered).toBe(true);
  });

  it("records the real-image trend toward F", () => {
    const trend = officialRealImageTrendTowardF();
    expect(trend.imageMoves).toBe("farther-from-lens");
    expect(trend.imageSize).toBe("becomes-larger");
    const result = runConvexLensExperiment("compare-real-image-across-2f");
    expect(result.realImageTrend).toEqual(trend);
    expect(result.after.objectStation).toBe("between-f-and-2f");
  });

  it("requires the parallel-axis and through-center pair", () => {
    const [parallel, center] = twoStandardRays();
    expect(isCanonicalRayGeometricallyCoherent("beyond-2f", parallel!)).toBe(true);
    expect(isCanonicalRayGeometricallyCoherent("inside-f", center!)).toBe(true);
    expect(isCanonicalRayGeometricallyCoherent("at-f", parallel!)).toBe(true);
  });

  it("makes the optional focal ray station-aware", () => {
    const actual = actualThroughNearFocusRay();
    expect(isCanonicalRayGeometricallyCoherent("beyond-2f", actual)).toBe(true);
    expect(isCanonicalRayGeometricallyCoherent("inside-f", actual)).toBe(false);
    expect(isCanonicalRayGeometricallyCoherent("at-f", actual)).toBe(false);
  });

  it("has no finite image at u = f and rejects virtual images on screen", () => {
    const atF = officialBenchDisplay({
      ...createInitialConvexLensState(),
      objectStation: "at-f",
    });
    expect(atF.imaging.finiteImage).toBe(false);
    expect(atF.geometry.imageX).toBeNull();
    expect(atF.screenReceive).toBe("never");
    const inside = officialBenchDisplay({
      ...createInitialConvexLensState(),
      objectStation: "inside-f",
      screenAtImagePlane: true,
    });
    expect(inside.imaging.imageNature).toBe("virtual");
    expect(inside.screenReceive).toBe("never");
  });
});
