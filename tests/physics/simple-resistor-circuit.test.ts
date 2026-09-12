import { describe, expect, it } from "vitest";

import {
  EXAM_CALCULATION_INPUT,
  officialCurrentA,
  officialCurrentFromVoltageAndResistanceA,
  officialResistanceOhm,
  officialVoltageAcrossResistorV,
  pairsForComparison,
} from "@/content/physics-models/ohms-law/physics-boundary";
import {
  ohmsVisibleReadings,
  runOhmsExperiment,
  runOhmsObserveDemo,
} from "@/lib/physics/simple-resistor-circuit";

describe("simple resistor circuit physics", () => {
  it("computes I = U / R from official functions", () => {
    expect(
      officialCurrentA({
        resistorId: "R-5",
        sourceVoltageId: "U-3",
        circuitClosed: true,
      }),
    ).toBe(0.6);
    expect(
      officialCurrentA({
        resistorId: "R-5",
        sourceVoltageId: "U-6",
        circuitClosed: true,
      }),
    ).toBe(1.2);
    expect(
      officialCurrentA({
        resistorId: "R-10",
        sourceVoltageId: "U-3",
        circuitClosed: true,
      }),
    ).toBe(0.3);
  });

  it("keeps source voltage when the circuit is open and I and Uresistor are 0", () => {
    const open = ohmsVisibleReadings({
      resistorId: "R-5",
      sourceVoltageId: "U-6",
      circuitClosed: false,
    });
    expect(open.currentA).toBe(0);
    expect(open.voltageAcrossResistorV).toBe(0);
    expect(open.sourceVoltageV).toBe(6);
    expect(officialVoltageAcrossResistorV("U-6", false)).toBe(0);
  });

  it("holds R when comparing voltages and holds U when comparing resistances", () => {
    const sameR = pairsForComparison("same-resistance-different-voltage");
    expect(sameR.left.resistorId).toBe(sameR.right.resistorId);
    expect(sameR.left.sourceVoltageId).not.toBe(sameR.right.sourceVoltageId);
    expect(officialCurrentA(sameR.right)).toBeGreaterThan(officialCurrentA(sameR.left));

    const sameU = pairsForComparison("same-voltage-different-resistance");
    expect(sameU.left.sourceVoltageId).toBe(sameU.right.sourceVoltageId);
    expect(sameU.left.resistorId).not.toBe(sameU.right.resistorId);
    expect(officialCurrentA(sameU.right)).toBeLessThan(officialCurrentA(sameU.left));
  });

  it("rejects non-positive resistance", () => {
    expect(() => officialCurrentFromVoltageAndResistanceA(6, 0)).toThrow(
      /Resistance must be positive/,
    );
  });

  it("derives exam current from the official function, not a UI literal", () => {
    expect(
      officialCurrentFromVoltageAndResistanceA(
        EXAM_CALCULATION_INPUT.voltageV,
        EXAM_CALCULATION_INPUT.resistanceOhm,
      ),
    ).toBe(3);
  });

  it("reveals experiment readings from officialCurrentA", () => {
    const result = runOhmsExperiment("same-resistance-different-voltage");
    expect(result.after.readingsRevealed).toBe(true);
    expect(ohmsVisibleReadings(result.after.left).currentA).toBe(
      officialCurrentA(result.after.left),
    );
    expect(officialResistanceOhm(result.after.left.resistorId)).toBe(5);
  });

  it("can show an open observe demo without collapsing source voltage", () => {
    const open = runOhmsObserveDemo(false);
    const left = ohmsVisibleReadings({
      ...open.left,
      circuitClosed: open.circuitClosed && open.left.circuitClosed,
    });
    expect(left.currentA).toBe(0);
    expect(left.sourceVoltageV).toBeGreaterThan(0);
  });
});
