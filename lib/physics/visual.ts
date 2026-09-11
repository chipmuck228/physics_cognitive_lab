export function visualDurationMs(
  heatingTimeSec: number,
  reduceMotion: boolean,
): number {
  if (reduceMotion) {
    return 0;
  }

  const scaled = heatingTimeSec * 100;
  return clamp(scaled, 2000, 6000);
}

export function interpolateTemperature(
  fromC: number,
  toC: number,
  progress: number,
): number {
  const t = clamp(progress, 0, 1);
  return fromC + (toC - fromC) * t;
}

export function formatClock(totalSec: number): string {
  const seconds = Math.max(0, Math.ceil(totalSec));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function formatTemperature(valueC: number): string {
  return `${valueC.toFixed(1)} °C`;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
