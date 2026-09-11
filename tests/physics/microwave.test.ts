import { describe, expect, it } from "vitest";

import {
  DEFAULT_BREAD_FACTOR,
  DEFAULT_HEATING_TIME_SEC,
  DEFAULT_POWER_W,
  EFFECTIVE_HEAT_CAPACITY_J_PER_C,
  MAX_TEMPERATURE_C,
  MIN_TEMPERATURE_C,
  ROOM_TEMPERATURE_C,
} from "@/lib/physics/constants";
import { simulateHeating } from "@/lib/physics/microwave";

const baseline = {
  initialTemperatureC: ROOM_TEMPERATURE_C,
  powerW: DEFAULT_POWER_W,
  heatingTimeSec: DEFAULT_HEATING_TIME_SEC,
  breadFactor: DEFAULT_BREAD_FACTOR,
};

describe("simulateHeating", () => {
  it("is deterministic for the same input", () => {
    const first = simulateHeating(baseline);
    const second = simulateHeating(baseline);

    expect(first).toEqual(second);
    expect(first.energyInputJ).toBe(DEFAULT_POWER_W * DEFAULT_HEATING_TIME_SEC);
    expect(first.deltaTemperatureC).toBe(
      first.energyInputJ / EFFECTIVE_HEAT_CAPACITY_J_PER_C,
    );
    expect(first.finalTemperatureC).toBe(
      ROOM_TEMPERATURE_C + first.deltaTemperatureC,
    );
  });

  it("increases temperature when heating time increases", () => {
    const short = simulateHeating({ ...baseline, heatingTimeSec: 20 });
    const long = simulateHeating({ ...baseline, heatingTimeSec: 40 });

    expect(long.finalTemperatureC).toBeGreaterThan(short.finalTemperatureC);
    expect(long.energyInputJ).toBeGreaterThan(short.energyInputJ);
  });

  it("increases temperature when power increases", () => {
    const low = simulateHeating({ ...baseline, powerW: 300 });
    const high = simulateHeating({ ...baseline, powerW: 800 });

    expect(high.finalTemperatureC).toBeGreaterThan(low.finalTemperatureC);
  });

  it("changes predictably with bread factor", () => {
    const normal = simulateHeating({ ...baseline, breadFactor: 1 });
    const double = simulateHeating({ ...baseline, breadFactor: 2 });

    expect(double.deltaTemperatureC).toBeCloseTo(normal.deltaTemperatureC * 2);
  });

  it("treats zero time or power as no temperature change", () => {
    const noTime = simulateHeating({ ...baseline, heatingTimeSec: 0 });
    const noPower = simulateHeating({ ...baseline, powerW: 0 });

    expect(noTime.finalTemperatureC).toBe(ROOM_TEMPERATURE_C);
    expect(noPower.finalTemperatureC).toBe(ROOM_TEMPERATURE_C);
    expect(noTime.energyInputJ).toBe(0);
    expect(noPower.energyInputJ).toBe(0);
  });

  it("handles invalid numeric inputs safely", () => {
    const result = simulateHeating({
      initialTemperatureC: Number.NaN,
      powerW: Number.POSITIVE_INFINITY,
      heatingTimeSec: -12,
      breadFactor: Number.NaN,
    });

    expect(Number.isFinite(result.finalTemperatureC)).toBe(true);
    expect(result.finalTemperatureC).toBeGreaterThanOrEqual(MIN_TEMPERATURE_C);
    expect(result.finalTemperatureC).toBeLessThanOrEqual(MAX_TEMPERATURE_C);
    expect(result.energyInputJ).toBe(0);
  });

  it("clamps impossible temperatures", () => {
    const tooHot = simulateHeating({
      initialTemperatureC: 110,
      powerW: 1200,
      heatingTimeSec: 180,
      breadFactor: 4,
    });
    const tooCold = simulateHeating({
      initialTemperatureC: -50,
      powerW: 0,
      heatingTimeSec: 0,
      breadFactor: 1,
    });

    expect(tooHot.finalTemperatureC).toBe(MAX_TEMPERATURE_C);
    expect(tooCold.finalTemperatureC).toBe(MIN_TEMPERATURE_C);
  });
});
