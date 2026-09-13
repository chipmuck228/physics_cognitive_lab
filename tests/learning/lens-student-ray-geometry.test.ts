import { describe, expect, it } from "vitest";

import {
  actualThroughNearFocusRay,
  backwardExtensionThroughNearFocusRay,
  twoStandardRays,
  type CanonicalRayChoice,
} from "@/content/physics-models/convex-lens-imaging/construction";
import {
  intersectProjectedLines,
  LENS_FAR_F_X,
  LENS_NEAR_F_X,
  LENS_PLANE_X,
  objectTipBench,
  projectedSegmentPassesThrough,
  projectLearnerRay,
} from "@/lib/learning/lens-student-ray-geometry";

const [parallel, center] = twoStandardRays();
const focalActual = actualThroughNearFocusRay();
const focalBackward = backwardExtensionThroughNearFocusRay();

function segment(
  projection: ReturnType<typeof projectLearnerRay>,
  role: "incident" | "outgoing-actual" | "backward-extension",
) {
  return projection.segments.find((item) => item.role === role);
}

function allSegments(
  projection: ReturnType<typeof projectLearnerRay>,
  role: "incident" | "outgoing-actual" | "backward-extension",
) {
  return projection.segments.filter((item) => item.role === role);
}

describe("Scene 07 learner ray geometry projection", () => {
  it("draws parallel-axis from the before/after segments, not from kind defaults", () => {
    const drawn = projectLearnerRay(parallel!, "beyond-2f");
    const object = objectTipBench("beyond-2f");
    const incident = segment(drawn, "incident");
    const outgoing = segment(drawn, "outgoing-actual");
    expect(drawn.representable).toBe(true);
    expect(incident).toBeTruthy();
    expect(outgoing).toBeTruthy();
    expect(incident!.y1).toBeCloseTo(object.y);
    expect(incident!.y2).toBeCloseTo(object.y);
    expect(incident!.x2).toBeCloseTo(LENS_PLANE_X);
    expect(outgoing!.x1).toBeCloseTo(LENS_PLANE_X);
    expect(outgoing!.y1).toBeCloseTo(object.y);
    expect(
      projectedSegmentPassesThrough(outgoing!, { x: LENS_FAR_F_X, y: 0 }),
    ).toBe(true);
  });

  it("draws through-center undeviated through the optical center", () => {
    const drawn = projectLearnerRay(center!, "between-f-and-2f");
    const object = objectTipBench("between-f-and-2f");
    const incident = segment(drawn, "incident");
    const outgoing = segment(drawn, "outgoing-actual");
    expect(incident).toBeTruthy();
    expect(outgoing).toBeTruthy();
    expect(
      projectedSegmentPassesThrough(incident!, { x: LENS_PLANE_X, y: 0 }),
    ).toBe(true);
    expect(
      projectedSegmentPassesThrough(outgoing!, { x: LENS_PLANE_X, y: 0 }),
    ).toBe(true);
    expect(projectedSegmentPassesThrough(outgoing!, object)).toBe(true);
    expect(segment(drawn, "backward-extension")).toBeUndefined();
  });

  it("draws the legal actual focal reference through near F, then parallel after the lens", () => {
    const drawn = projectLearnerRay(focalActual, "beyond-2f");
    const incident = segment(drawn, "incident");
    const outgoing = segment(drawn, "outgoing-actual");
    expect(incident).toBeTruthy();
    expect(outgoing).toBeTruthy();
    expect(
      projectedSegmentPassesThrough(incident!, { x: LENS_NEAR_F_X, y: 0 }),
    ).toBe(true);
    expect(outgoing!.y1).toBeCloseTo(outgoing!.y2);
    expect(outgoing!.y1).toBeCloseTo(drawn.lensHit!.y);
  });

  it("does not invent a finite meeting at u = f", () => {
    const parallelDrawn = projectLearnerRay(parallel!, "at-f");
    const centerDrawn = projectLearnerRay(center!, "at-f");
    const meeting = intersectProjectedLines(
      segment(parallelDrawn, "outgoing-actual")!,
      segment(centerDrawn, "outgoing-actual")!,
    );
    expect(meeting).toBeNull();
    expect(
      projectedSegmentPassesThrough(segment(parallelDrawn, "outgoing-actual")!, {
        x: LENS_FAR_F_X,
        y: 0,
      }),
    ).toBe(true);
  });

  it("keeps inside-f actual outgoing diverging and dashes the outgoing backward extension", () => {
    const parallelDrawn = projectLearnerRay(parallel!, "inside-f");
    const centerDrawn = projectLearnerRay(center!, "inside-f");
    const meeting = intersectProjectedLines(
      segment(parallelDrawn, "outgoing-actual")!,
      segment(centerDrawn, "outgoing-actual")!,
    );
    expect(meeting).not.toBeNull();
    expect(meeting!.x).toBeLessThan(0);
    expect(segment(parallelDrawn, "outgoing-actual")).toBeTruthy();
    expect(segment(parallelDrawn, "backward-extension")).toBeTruthy();
    expect(
      projectedSegmentPassesThrough(segment(parallelDrawn, "backward-extension")!, {
        x: LENS_FAR_F_X,
        y: 0,
      }),
    ).toBe(true);
    expect(segment(parallelDrawn, "backward-extension")!.x2).not.toBe(-3.2);
  });

  it("dashes the inside-f focal backward extension through near F without repairing it", () => {
    const drawn = projectLearnerRay(focalBackward, "inside-f");
    const backward = allSegments(drawn, "backward-extension").find((item) =>
      projectedSegmentPassesThrough(item, { x: LENS_NEAR_F_X, y: 0 }),
    );
    const incident = segment(drawn, "incident");
    const outgoing = segment(drawn, "outgoing-actual");
    expect(backward).toBeTruthy();
    expect(incident).toBeTruthy();
    expect(outgoing).toBeTruthy();
    expect(outgoing!.y1).toBeCloseTo(outgoing!.y2);
    expect(incident!.x2).toBeCloseTo(LENS_PLANE_X);
  });

  it("does not silently correct an invalid parallel-axis pairing into the official ray", () => {
    const invalid: CanonicalRayChoice = {
      kind: "parallel-axis",
      beforeLens: "parallel-to-principal-axis",
      afterLens: "undeviated",
      incidentPath: "actual",
    };
    const drawn = projectLearnerRay(invalid, "beyond-2f");
    const outgoing = segment(drawn, "outgoing-actual");
    expect(outgoing).toBeTruthy();
    expect(outgoing!.y1).toBeCloseTo(outgoing!.y2);
    expect(
      projectedSegmentPassesThrough(outgoing!, { x: LENS_FAR_F_X, y: 0 }),
    ).toBe(false);
  });

  it("does not silently correct a mislabeled through-center into an undeviated line", () => {
    const invalid: CanonicalRayChoice = {
      kind: "through-center",
      beforeLens: "toward-optical-center",
      afterLens: "through-far-focal-point",
      incidentPath: "actual",
    };
    const drawn = projectLearnerRay(invalid, "beyond-2f");
    const outgoing = segment(drawn, "outgoing-actual");
    const object = objectTipBench("beyond-2f");
    expect(outgoing).toBeTruthy();
    expect(projectedSegmentPassesThrough(outgoing!, object)).toBe(false);
    expect(
      projectedSegmentPassesThrough(outgoing!, { x: LENS_FAR_F_X, y: 0 }),
    ).toBe(true);
  });

  it("does not invent geometry for an unrepresentable beforeLens", () => {
    const invalid: CanonicalRayChoice = {
      kind: "parallel-axis",
      beforeLens: "undeviated",
      afterLens: "through-far-focal-point",
      incidentPath: "actual",
    };
    const drawn = projectLearnerRay(invalid, "beyond-2f");
    expect(drawn.representable).toBe(false);
    expect(drawn.segments).toHaveLength(0);
    expect(drawn.reason).toMatch(/undeviated/);
  });

  it("renders at-f through-near-focus as a vertical path that never hits the lens", () => {
    const drawn = projectLearnerRay(focalActual, "at-f");
    expect(drawn.lensHit).toBeNull();
    expect(segment(drawn, "outgoing-actual")).toBeUndefined();
    const incident = segment(drawn, "incident");
    expect(incident).toBeTruthy();
    expect(incident!.x1).toBeCloseTo(incident!.x2);
    expect(incident!.x1).toBeCloseTo(LENS_NEAR_F_X);
  });
});
