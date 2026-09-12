/**
 * Official numerical contract for the named engine
 * `deterministic-simple-resistor-circuit`.
 *
 * Same inputs → same output. The LLM must never invent I, U, or R.
 * This module is the quantitative contract, not a SceneAdapter and
 * not student-visible copy.
 *
 * Pedagogical catalog values below are engine inputs. They must not
 * be copied into production UI as literals. Displayed current must
 * come from officialCurrentA.
 */

export type ResistorId = "R-5" | "R-10";
export type SourceVoltageId = "U-3" | "U-6";
export type OhmComparisonMode =
  | "observe"
  | "same-resistance-different-voltage"
  | "same-voltage-different-resistance";

export interface ResistorSpec {
  id: ResistorId;
  resistanceOhm: number;
  label: string;
}

export interface SourceVoltageSpec {
  id: SourceVoltageId;
  voltageV: number;
  label: string;
}

/** Pedagogical catalog. Not UI truth. */
export const RESISTOR_CATALOG: Record<ResistorId, ResistorSpec> = {
  "R-5": {
    id: "R-5",
    resistanceOhm: 5,
    label: "电阻 A",
  },
  "R-10": {
    id: "R-10",
    resistanceOhm: 10,
    label: "电阻 B",
  },
};

/** Pedagogical catalog. Not UI truth. */
export const SOURCE_VOLTAGE_CATALOG: Record<SourceVoltageId, SourceVoltageSpec> =
  {
    "U-3": {
      id: "U-3",
      voltageV: 3,
      label: "较低电压",
    },
    "U-6": {
      id: "U-6",
      voltageV: 6,
      label: "较高电压",
    },
  };

export interface SimpleResistorInputs {
  resistorId: ResistorId;
  sourceVoltageId: SourceVoltageId;
  circuitClosed: boolean;
}

export function officialResistanceOhm(resistorId: ResistorId): number {
  const resistance = RESISTOR_CATALOG[resistorId].resistanceOhm;
  if (resistance <= 0) {
    throw new Error("Resistance must be positive.");
  }
  return resistance;
}

export function officialVoltageAcrossResistorV(
  sourceVoltageId: SourceVoltageId,
  circuitClosed: boolean,
): number {
  if (!circuitClosed) {
    return 0;
  }
  const voltage = SOURCE_VOLTAGE_CATALOG[sourceVoltageId].voltageV;
  if (voltage < 0) {
    throw new Error("Grade-9 magnitudes do not use negative voltage.");
  }
  return voltage;
}

/**
 * Canonical derived current for one ohmic resistor in a closed
 * ideal circuit: I = U / R.
 *
 * Open circuit: I = 0. Do not reuse this 0 as a claim that the
 * source has no voltage. Source open-circuit voltage is not this
 * function's output.
 */
export function officialCurrentFromVoltageAndResistanceA(
  voltageV: number,
  resistanceOhm: number,
): number {
  if (resistanceOhm <= 0) {
    throw new Error("Resistance must be positive.");
  }
  if (voltageV < 0) {
    throw new Error("Grade-9 magnitudes do not use negative voltage.");
  }
  return voltageV / resistanceOhm;
}

/** Exam sitting numbers. Not the lab catalog. Not UI literals. */
export const EXAM_CALCULATION_INPUT = {
  voltageV: 12,
  resistanceOhm: 4,
} as const;

export function officialCurrentA(inputs: SimpleResistorInputs): number {
  if (!inputs.circuitClosed) {
    return 0;
  }
  return officialCurrentFromVoltageAndResistanceA(
    officialVoltageAcrossResistorV(inputs.sourceVoltageId, true),
    officialResistanceOhm(inputs.resistorId),
  );
}

export function pairsForComparison(mode: OhmComparisonMode): {
  left: SimpleResistorInputs;
  right: SimpleResistorInputs;
  controlled: "resistance" | "voltage" | "observe";
} {
  switch (mode) {
    case "observe":
    case "same-resistance-different-voltage":
      return {
        left: {
          resistorId: "R-5",
          sourceVoltageId: "U-3",
          circuitClosed: true,
        },
        right: {
          resistorId: "R-5",
          sourceVoltageId: "U-6",
          circuitClosed: true,
        },
        controlled: "resistance",
      };
    case "same-voltage-different-resistance":
      return {
        left: {
          resistorId: "R-5",
          sourceVoltageId: "U-3",
          circuitClosed: true,
        },
        right: {
          resistorId: "R-10",
          sourceVoltageId: "U-3",
          circuitClosed: true,
        },
        controlled: "voltage",
      };
    default: {
      const exhaustive: never = mode;
      throw new Error(`Unknown comparison mode: ${String(exhaustive)}`);
    }
  }
}
