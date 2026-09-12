import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SimpleResistorCircuit } from "@/components/physics/ohms/SimpleResistorCircuit";
import { officialCurrentA } from "@/content/physics-models/ohms-law/physics-boundary";
import {
  createInitialOhmsState,
  ohmsVisibleReadings,
  runOhmsExperiment,
  runOhmsObserveDemo,
} from "@/lib/physics/simple-resistor-circuit";

describe("Scene 06 PRI", () => {
  it("binds I, U, and R to distinct labels and units", () => {
    const state = {
      ...runOhmsExperiment("same-resistance-different-voltage").after,
    };
    const { container } = render(<SimpleResistorCircuit state={state} />);
    expect(container.textContent).not.toMatch(/6\s*V\s*→\s*1\.2\s*A/);
    expect(screen.getByTestId("ohms-left-current")).toHaveAttribute(
      "data-quantity-id",
      "current",
    );
    expect(screen.getByTestId("ohms-left-resistor-voltage")).toHaveAttribute(
      "data-quantity-id",
      "voltage",
    );
    expect(screen.getByTestId("ohms-left-resistance")).toHaveAttribute(
      "data-quantity-id",
      "resistance",
    );
    expect(screen.getByTestId("ohms-left-current").textContent).toMatch(/A/);
    expect(screen.getByTestId("ohms-left-resistor-voltage").textContent).toMatch(/V/);
    expect(screen.getByTestId("ohms-left-resistance").textContent).toMatch(/Ω/);
  });

  it("shows officialCurrentA, not a hardcoded production current", () => {
    const after = runOhmsExperiment("same-resistance-different-voltage").after;
    render(<SimpleResistorCircuit state={after} />);
    const expected = officialCurrentA(after.left);
    expect(screen.getByTestId("ohms-left-current")).toHaveTextContent(`${expected} A`);
  });

  it("keeps source voltage when I and resistor voltage are 0", () => {
    const open = runOhmsObserveDemo(false);
    render(<SimpleResistorCircuit state={open} />);
    const readings = ohmsVisibleReadings({
      ...open.left,
      circuitClosed: false,
    });
    expect(readings.currentA).toBe(0);
    expect(readings.voltageAcrossResistorV).toBe(0);
    expect(screen.getByTestId("ohms-left-current")).toHaveTextContent("0 A");
    expect(screen.getByTestId("ohms-left-resistor-voltage")).toHaveTextContent("0 V");
    expect(screen.getByTestId("ohms-left-source-voltage")).not.toHaveTextContent("0 V");
  });

  it("marks MODEL as frozen so later stages are not live experiment", () => {
    render(
      <SimpleResistorCircuit
        state={{ ...createInitialOhmsState(), readingsRevealed: true }}
        frozen
      />,
    );
    expect(screen.getByTestId("simple-resistor-circuit")).toHaveAttribute(
      "data-frozen",
      "true",
    );
    expect(screen.getByText(/不是正在做的实验/)).toBeInTheDocument();
  });
});
