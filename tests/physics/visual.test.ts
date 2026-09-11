import { describe, expect, it } from "vitest";

import {
  formatClock,
  interpolateTemperature,
  visualDurationMs,
} from "@/lib/physics/visual";

describe("visual helpers", () => {
  it("maps heating time into a short visible duration", () => {
    expect(visualDurationMs(30, false)).toBe(3000);
    expect(visualDurationMs(5, false)).toBe(2000);
    expect(visualDurationMs(180, false)).toBe(6000);
  });

  it("skips motion when requested", () => {
    expect(visualDurationMs(30, true)).toBe(0);
  });

  it("interpolates temperature monotonically", () => {
    expect(interpolateTemperature(20, 35, 0)).toBe(20);
    expect(interpolateTemperature(20, 35, 1)).toBe(35);
    expect(interpolateTemperature(20, 35, 0.5)).toBe(27.5);
  });

  it("formats the microwave clock", () => {
    expect(formatClock(30)).toBe("00:30");
    expect(formatClock(0)).toBe("00:00");
    expect(formatClock(75)).toBe("01:15");
  });
});
