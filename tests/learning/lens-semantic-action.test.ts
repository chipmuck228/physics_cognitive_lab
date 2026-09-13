import { describe, expect, it } from "vitest";

import {
  interpretObjectMoveGesture,
  svgClientXToBenchX,
} from "@/lib/learning/lens-semantic-action";
import {
  createInitialConvexLensState,
  nearestObjectStationFromBenchX,
  OBJECT_BENCH_X,
  officialBenchDisplay,
} from "@/lib/physics/convex-lens-optical-bench";

describe("Scene 07 gesture → semantic station", () => {
  it("maps object-side bench units to a named station, not a pixel case", () => {
    expect(nearestObjectStationFromBenchX(-2.7)).toBe("beyond-2f");
    expect(nearestObjectStationFromBenchX(-2)).toBe("at-2f");
    expect(nearestObjectStationFromBenchX(-1.45)).toBe("between-f-and-2f");
    expect(nearestObjectStationFromBenchX(-1)).toBe("at-f");
    expect(nearestObjectStationFromBenchX(-0.55)).toBe("inside-f");
  });

  it("ignores clicks on the image side of the lens", () => {
    expect(nearestObjectStationFromBenchX(1.4)).toBeNull();
    expect(
      interpretObjectMoveGesture({ fromStation: "beyond-2f", benchX: 2 }),
    ).toBeNull();
  });

  it("converts SVG client x to bench units without storing pixels as physics", () => {
    const benchX = svgClientXToBenchX(320 - 2 * 72, 640);
    expect(benchX).toBeCloseTo(-2);
    const action = interpretObjectMoveGesture({
      fromStation: "beyond-2f",
      benchX,
    });
    expect(action?.toStation).toBe("at-2f");
    const official = officialBenchDisplay({
      ...createInitialConvexLensState(),
      objectStation: action!.toStation,
    });
    expect(official.station).toBe("at-2f");
    expect(official.geometry.objectX).not.toBe(320 - 2 * 72);
  });

  it("keeps SVG / bench coordinates as adapter units, not official physics values", () => {
    const benchX = svgClientXToBenchX(100, 640);
    const station = nearestObjectStationFromBenchX(benchX);
    expect(station).toBeTruthy();
    const official = officialBenchDisplay({
      ...createInitialConvexLensState(),
      objectStation: station!,
    });
    expect(official.geometry.objectX).toBe(OBJECT_BENCH_X[station!]);
    expect(official.geometry.objectX).not.toBe(100);
    expect(official.station).toBe(station);
  });
});
