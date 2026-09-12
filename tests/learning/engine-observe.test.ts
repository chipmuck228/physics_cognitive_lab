import { describe, expect, it } from "vitest";

import {
  evaluateEngineObservation,
  hasSufficientEngineObservation,
} from "@/lib/learning/engine-observe";

describe("engine OBSERVE evidence", () => {
  it("does not pass from autoplay or an empty selection", () => {
    expect(evaluateEngineObservation([]).sufficient).toBe(false);
    expect(
      hasSufficientEngineObservation([
        {
          text: "",
          timestamp: "t",
          watchedFullCycle: true,
          selectedOptionIds: [],
          sufficient: false,
        },
      ]),
    ).toBe(false);
  });

  it("does not pass from a single random checkbox", () => {
    expect(evaluateEngineObservation(["intake-opens"]).sufficient).toBe(false);
    expect(evaluateEngineObservation(["piston-up-down"]).sufficient).toBe(false);
  });

  it("does not let distractors satisfy the gate", () => {
    expect(
      evaluateEngineObservation([
        "combustion-every-stage",
        "piston-only-down",
      ]).sufficient,
    ).toBe(false);
    expect(
      evaluateEngineObservation([
        "piston-up-down",
        "combustion-every-stage",
      ]).sufficient,
    ).toBe(false);
  });

  it("passes when piston motion and a valve or combustion change are selected", () => {
    expect(
      evaluateEngineObservation(["piston-up-down", "intake-opens"]).sufficient,
    ).toBe(true);
    expect(
      evaluateEngineObservation(["piston-up-down", "exhaust-opens"]).sufficient,
    ).toBe(true);
    expect(
      evaluateEngineObservation(["piston-up-down", "combustion-one-stage"])
        .sufficient,
    ).toBe(true);
  });
});
