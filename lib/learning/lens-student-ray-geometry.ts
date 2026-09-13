/**
 * Scene 07 learner-ray projection.
 * CanonicalRayChoice + ObjectStation → bench-unit SVG segments.
 * Does not evaluate correctness, does not use official image geometry,
 * and is not a universal ray engine.
 */

import type {
  CanonicalRayChoice,
  RaySegment,
} from "@/content/physics-models/convex-lens-imaging/construction";
import type { ObjectStation } from "@/content/physics-models/convex-lens-imaging/physics-boundary";
import { LENS_BENCH_UNIT } from "@/lib/learning/lens-semantic-action";
import { OBJECT_BENCH_X } from "@/lib/physics/convex-lens-optical-bench";

export const LENS_OBJECT_HEIGHT_PX = 44;
export const LENS_NEAR_F_X = -1;
export const LENS_FAR_F_X = 1;
export const LENS_PLANE_X = 0;
const RIGHT_X = 2.85;
const LEFT_X = -3.4;
const EPS = 1e-6;

export type LensRaySegmentRole =
  | "incident"
  | "outgoing-actual"
  | "backward-extension";

export interface LensProjectedRaySegment {
  role: LensRaySegmentRole;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface LensStudentRayProjection {
  kind: CanonicalRayChoice["kind"];
  representable: boolean;
  reason?: string;
  object: { x: number; y: number };
  lensHit: { x: number; y: number } | null;
  segments: LensProjectedRaySegment[];
}

export function objectTipBench(
  station: ObjectStation,
  objectHeightPx = LENS_OBJECT_HEIGHT_PX,
): { x: number; y: number } {
  return {
    x: OBJECT_BENCH_X[station],
    y: objectHeightPx / LENS_BENCH_UNIT,
  };
}

function nearly(a: number, b: number): boolean {
  return Math.abs(a - b) < EPS;
}

function yAtX(
  a: { x: number; y: number },
  b: { x: number; y: number },
  x: number,
): number {
  const dx = b.x - a.x;
  if (Math.abs(dx) < EPS) {
    return a.y;
  }
  return a.y + ((x - a.x) / dx) * (b.y - a.y);
}

function pointAtX(
  a: { x: number; y: number },
  b: { x: number; y: number },
  x: number,
): { x: number; y: number } {
  return { x, y: yAtX(a, b, x) };
}

export function projectedSegmentPassesThrough(
  segment: LensProjectedRaySegment,
  point: { x: number; y: number },
  epsilon = 1e-4,
): boolean {
  const cross =
    (segment.x2 - segment.x1) * (point.y - segment.y1) -
    (segment.y2 - segment.y1) * (point.x - segment.x1);
  return Math.abs(cross) < epsilon;
}

export function intersectProjectedLines(
  a: LensProjectedRaySegment,
  b: LensProjectedRaySegment,
): { x: number; y: number } | null {
  const den =
    (a.x1 - a.x2) * (b.y1 - b.y2) - (a.y1 - a.y2) * (b.x1 - b.x2);
  if (Math.abs(den) < EPS) {
    return null;
  }
  const x =
    ((a.x1 * a.y2 - a.y1 * a.x2) * (b.x1 - b.x2) -
      (a.x1 - a.x2) * (b.x1 * b.y2 - b.y1 * b.x2)) /
    den;
  const y =
    ((a.x1 * a.y2 - a.y1 * a.x2) * (b.y1 - b.y2) -
      (a.y1 - a.y2) * (b.x1 * b.y2 - b.y1 * b.x2)) /
    den;
  return { x, y };
}

function pointsCollinear(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
): boolean {
  const cross = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
  return Math.abs(cross) < 1e-5;
}

function incidentFromBefore(
  before: RaySegment,
  object: { x: number; y: number },
):
  | {
      status: "ok";
      through: { x: number; y: number };
      vertical: boolean;
      lensHit: { x: number; y: number } | null;
    }
  | { status: "unrepresentable"; reason: string } {
  if (before === "undeviated") {
    return {
      status: "unrepresentable",
      reason: "beforeLens 'undeviated' has no incoming direction to continue",
    };
  }
  if (before === "parallel-to-principal-axis") {
    return {
      status: "ok",
      through: { x: LENS_PLANE_X, y: object.y },
      vertical: false,
      lensHit: { x: LENS_PLANE_X, y: object.y },
    };
  }
  if (before === "toward-optical-center") {
    return {
      status: "ok",
      through: { x: LENS_PLANE_X, y: 0 },
      vertical: false,
      lensHit: { x: LENS_PLANE_X, y: 0 },
    };
  }
  if (before === "through-near-focal-point") {
    if (nearly(object.x, LENS_NEAR_F_X)) {
      return {
        status: "ok",
        through: { x: LENS_NEAR_F_X, y: 0 },
        vertical: true,
        lensHit: null,
      };
    }
    const nearF = { x: LENS_NEAR_F_X, y: 0 };
    return {
      status: "ok",
      through: nearF,
      vertical: false,
      lensHit: pointAtX(object, nearF, LENS_PLANE_X),
    };
  }
  const farF = { x: LENS_FAR_F_X, y: 0 };
  return {
    status: "ok",
    through: farF,
    vertical: false,
    lensHit: pointAtX(object, farF, LENS_PLANE_X),
  };
}

function outgoingGuide(
  after: RaySegment,
  object: { x: number; y: number },
  lensHit: { x: number; y: number },
):
  | { a: { x: number; y: number }; b: { x: number; y: number } }
  | { status: "unrepresentable"; reason: string } {
  if (after === "through-far-focal-point") {
    return { a: lensHit, b: { x: LENS_FAR_F_X, y: 0 } };
  }
  if (after === "parallel-to-principal-axis") {
    return { a: lensHit, b: { x: LENS_FAR_F_X, y: lensHit.y } };
  }
  if (after === "undeviated") {
    if (nearly(object.x, lensHit.x) && nearly(object.y, lensHit.y)) {
      return {
        status: "unrepresentable",
        reason: "undeviated afterLens needs a distinct incident direction",
      };
    }
    return { a: object, b: lensHit };
  }
  return {
    status: "unrepresentable",
    reason: `afterLens '${after}' has no Scene07 outgoing projection`,
  };
}

function pushSegment(
  segments: LensProjectedRaySegment[],
  role: LensRaySegmentRole,
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  segments.push({
    role,
    x1: from.x,
    y1: from.y,
    x2: to.x,
    y2: to.y,
  });
}

export function projectLearnerRay(
  ray: CanonicalRayChoice,
  station: ObjectStation,
  objectHeightPx = LENS_OBJECT_HEIGHT_PX,
): LensStudentRayProjection {
  const object = objectTipBench(station, objectHeightPx);
  const incident = incidentFromBefore(ray.beforeLens, object);
  if (incident.status === "unrepresentable") {
    return {
      kind: ray.kind,
      representable: false,
      reason: incident.reason,
      object,
      lensHit: null,
      segments: [],
    };
  }

  const segments: LensProjectedRaySegment[] = [];

  if (incident.vertical) {
    pushSegment(
      segments,
      ray.incidentPath === "backward-extension"
        ? "backward-extension"
        : "incident",
      object,
      { x: object.x, y: 0 },
    );
    return {
      kind: ray.kind,
      representable: true,
      object,
      lensHit: null,
      segments,
    };
  }

  const lensHit = incident.lensHit;
  if (!lensHit) {
    return {
      kind: ray.kind,
      representable: false,
      reason: "beforeLens path does not meet the lens plane",
      object,
      lensHit: null,
      segments: [],
    };
  }

  const landmarkTowardLens =
    (incident.through.x - object.x) * (lensHit.x - object.x) >= -EPS;

  if (!landmarkTowardLens && ray.beforeLens === "through-near-focal-point") {
    pushSegment(
      segments,
      ray.incidentPath === "actual" ? "incident" : "backward-extension",
      object,
      pointAtX(object, incident.through, LEFT_X),
    );
    pushSegment(segments, "incident", object, lensHit);
  } else {
    pushSegment(
      segments,
      ray.incidentPath === "backward-extension"
        ? "backward-extension"
        : "incident",
      object,
      lensHit,
    );
  }

  const outgoing = outgoingGuide(ray.afterLens, object, lensHit);
  if ("status" in outgoing) {
    return {
      kind: ray.kind,
      representable: true,
      reason: outgoing.reason,
      object,
      lensHit,
      segments,
    };
  }

  if (nearly(outgoing.a.x, outgoing.b.x)) {
    return {
      kind: ray.kind,
      representable: true,
      reason: "afterLens direction is along the lens plane",
      object,
      lensHit,
      segments,
    };
  }

  pushSegment(
    segments,
    "outgoing-actual",
    lensHit,
    pointAtX(outgoing.a, outgoing.b, RIGHT_X),
  );

  const coincidesWithIncident =
    pointsCollinear(object, outgoing.a, outgoing.b) &&
    pointsCollinear(lensHit, outgoing.a, outgoing.b);
  if (!coincidesWithIncident) {
    pushSegment(
      segments,
      "backward-extension",
      lensHit,
      pointAtX(outgoing.a, outgoing.b, LEFT_X),
    );
  }

  return {
    kind: ray.kind,
    representable: true,
    object,
    lensHit,
    segments,
  };
}
