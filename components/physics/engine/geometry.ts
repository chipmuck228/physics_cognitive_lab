/** SVG layout for the pedagogical engine. Not a physical simulation. */

export const ENGINE_VIEW = {
  width: 360,
  height: 500,
  cx: 180,
  cylinderLeft: 114,
  cylinderRight: 246,
  headY: 56,
  chamberTop: 78,
  clearance: 22,
  pistonTravel: 158,
  pistonHeight: 52,
  crankCx: 180,
  crankCy: 404,
  crankRadius: 40,
} as const;

export function pistonTopY(pistonPosition: number): number {
  return (
    ENGINE_VIEW.chamberTop +
    ENGINE_VIEW.clearance +
    pistonPosition * ENGINE_VIEW.pistonTravel
  );
}

export function pistonPinPoint(pistonPosition: number): { x: number; y: number } {
  return {
    x: ENGINE_VIEW.cx,
    y: pistonTopY(pistonPosition) + ENGINE_VIEW.pistonHeight - 10,
  };
}

export function crankPinPoint(angleRad: number): { x: number; y: number } {
  return {
    x: ENGINE_VIEW.crankCx + ENGINE_VIEW.crankRadius * Math.sin(angleRad),
    y: ENGINE_VIEW.crankCy - ENGINE_VIEW.crankRadius * Math.cos(angleRad),
  };
}
