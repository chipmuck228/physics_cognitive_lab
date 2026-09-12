import { describe, expect, it } from "vitest";

import {
  EngineExperimentId,
  EngineStroke,
  hasMainMechanicalOutput,
  runCombustionDisabledExperiment,
  runEngineCycle,
  runLockedMechanicalSystemExperiment,
} from "@/lib/physics/engine";

describe("experiment A — combustion disabled", () => {
  const result = runCombustionDisabledExperiment();
  const power = result.powerStroke;

  it("does not fire a combustion event", () => {
    expect(result.experimentId).toBe(EngineExperimentId.COMBUSTION_DISABLED);
    expect(result.intervention.combustionEnabled).toBe(false);
    expect(power.combustionEventActive).toBe(false);
    expect(power.combustionOccurred).toBe(false);
    expect(result.combustionOccurred).toBe(false);
    expect(power.workingGasState).toBe("compressed-unburned");
    expect(power.energyState.chemicalToInternalConversion).toBe("skipped");
  });

  it("does not produce gas-to-mechanical work", () => {
    expect(power.workTransfer).not.toBe("gas-to-mechanical");
    expect(result.workOccurred).toBe(false);
  });

  it("does not classify the result as main mechanical output", () => {
    expect(power.mechanicalOutput).not.toBe("main-output");
    expect(power.mechanicalOutput).toBe("none");
    expect(result.normalMechanicalOutputOccurred).toBe(false);
    expect(result.blockedReason).toBe("combustion-disabled");
    expect(hasMainMechanicalOutput(power)).toBe(false);
  });

  it("may keep the mechanism moving without calling that useful power", () => {
    expect(power.pistonCanMove).toBe(true);
    expect(power.crankshaftMoving).toBe(true);
    expect(power.crankshaftMoving && power.mechanicalOutput === "main-output").toBe(
      false,
    );

    const laterMotionWithoutPower = result.states.filter(
      (state) => state.crankshaftMoving && !hasMainMechanicalOutput(state),
    );
    expect(laterMotionWithoutPower.length).toBeGreaterThan(0);
  });
});

describe("experiment B — locked mechanical system", () => {
  const result = runLockedMechanicalSystemExperiment();
  const power = result.powerStroke;
  const compression = result.states.find(
    (state) => state.stroke === EngineStroke.COMPRESSION,
  );

  it("allows combustion on the intended power event", () => {
    expect(result.experimentId).toBe(
      EngineExperimentId.LOCKED_MECHANICAL_SYSTEM,
    );
    expect(compression?.workingGasState).toBe("compressed");
    expect(power.combustionEnabled).toBe(true);
    expect(power.combustionEventActive).toBe(true);
    expect(power.combustionOccurred).toBe(true);
    expect(result.combustionOccurred).toBe(true);
    expect(power.workingGasState).toBe("combusted-hot");
    expect(power.energyState.chemicalToInternalConversion).toBe("occurred");
  });

  it("blocks gas-to-mechanical work", () => {
    expect(power.pistonCanMove).toBe(false);
    expect(power.pistonDirection).toBe("held");
    expect(power.workTransfer).toBe("blocked");
    expect(result.workOccurred).toBe(false);
  });

  it("sets mechanicalOutput to blocked", () => {
    expect(power.mechanicalOutput).toBe("blocked");
    expect(result.normalMechanicalOutputOccurred).toBe(false);
    expect(result.blockedReason).toBe("mechanical-system-locked");
    expect(power.crankshaftMoving).toBe(false);
  });

  it("preserves energy release without normal mechanical output", () => {
    expect(result.combustionOccurred).toBe(true);
    expect(result.normalMechanicalOutputOccurred).toBe(false);
  });
});

describe("motion vs output boundary", () => {
  it("crankshaftMoving does not imply main-output", () => {
    const disabled = runCombustionDisabledExperiment();
    const normal = runEngineCycle({
      combustionEnabled: true,
      pistonCanMove: true,
    });
    const intake = normal[0];

    expect(intake?.crankshaftMoving).toBe(true);
    expect(intake?.mechanicalOutput).not.toBe("main-output");

    expect(disabled.powerStroke.crankshaftMoving).toBe(true);
    expect(disabled.powerStroke.mechanicalOutput).not.toBe("main-output");

    const power = normal.find((state) => state.stroke === EngineStroke.POWER);
    expect(power?.crankshaftMoving).toBe(true);
    expect(power?.mechanicalOutput).toBe("main-output");
  });

  it("does not include student prediction, reflection, or grading", () => {
    const result = runCombustionDisabledExperiment();

    expect(result).not.toHaveProperty("prediction");
    expect(result).not.toHaveProperty("reflection");
    expect(result).not.toHaveProperty("correct");
    expect(result).not.toHaveProperty("evidenceLevel");
  });

  it("is deterministic", () => {
    expect(runCombustionDisabledExperiment()).toEqual(
      runCombustionDisabledExperiment(),
    );
    expect(runLockedMechanicalSystemExperiment()).toEqual(
      runLockedMechanicalSystemExperiment(),
    );
  });
});
