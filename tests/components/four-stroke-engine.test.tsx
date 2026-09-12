import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { EngineDemo } from "@/components/physics/engine/EngineDemo";
import { FourStrokeEngine } from "@/components/physics/engine/FourStrokeEngine";
import { ENGINE_DEMO_COPY } from "@/lib/content/engine-visual";
import { EngineStroke, getStrokeState } from "@/lib/physics/engine";

function engine() {
  return screen.getByTestId("four-stroke-engine");
}

describe("FourStrokeEngine rendering from EngineState", () => {
  it("intake renders intake valve open and exhaust closed", () => {
    render(
      <FourStrokeEngine
        state={getStrokeState(EngineStroke.INTAKE, {
          combustionEnabled: true,
          pistonCanMove: true,
        })}
      />,
    );

    expect(engine()).toHaveAttribute("data-stroke", "intake");
    expect(engine()).toHaveAttribute("data-intake-valve", "open");
    expect(engine()).toHaveAttribute("data-exhaust-valve", "closed");
    expect(engine()).toHaveAttribute("data-combustion", "off");
  });

  it("compression renders both valves closed", () => {
    render(
      <FourStrokeEngine
        state={getStrokeState(EngineStroke.COMPRESSION, {
          combustionEnabled: true,
          pistonCanMove: true,
        })}
      />,
    );

    expect(engine()).toHaveAttribute("data-intake-valve", "closed");
    expect(engine()).toHaveAttribute("data-exhaust-valve", "closed");
    expect(engine()).toHaveAttribute("data-combustion", "off");
  });

  it("power renders combustion when combustionEventActive", () => {
    render(
      <FourStrokeEngine
        state={getStrokeState(EngineStroke.POWER, {
          combustionEnabled: true,
          pistonCanMove: true,
        })}
      />,
    );

    expect(engine()).toHaveAttribute("data-combustion", "active");
    expect(engine()).toHaveAttribute("data-mechanical-output", "main-output");
    expect(screen.getByTestId("combustion-effect")).toBeInTheDocument();
  });

  it("exhaust renders exhaust valve open", () => {
    render(
      <FourStrokeEngine
        state={getStrokeState(EngineStroke.EXHAUST, {
          combustionEnabled: true,
          pistonCanMove: true,
        })}
      />,
    );

    expect(engine()).toHaveAttribute("data-intake-valve", "closed");
    expect(engine()).toHaveAttribute("data-exhaust-valve", "open");
    expect(engine()).toHaveAttribute("data-combustion", "off");
  });

  it("combustion-disabled power renders no combustion effect", () => {
    render(
      <FourStrokeEngine
        state={getStrokeState(EngineStroke.POWER, {
          combustionEnabled: false,
          pistonCanMove: true,
        })}
      />,
    );

    expect(engine()).toHaveAttribute("data-combustion", "off");
    expect(engine()).toHaveAttribute("data-working-gas", "compressed-unburned");
    expect(screen.queryByTestId("combustion-effect")).not.toBeInTheDocument();
    expect(engine()).toHaveAttribute("data-mechanical-output", "none");
    expect(engine()).toHaveAttribute("data-crankshaft-moving", "true");
  });

  it("piston-locked power does not travel as a normal power stroke", () => {
    render(
      <FourStrokeEngine
        state={getStrokeState(EngineStroke.POWER, {
          combustionEnabled: true,
          pistonCanMove: false,
        })}
        motionProgress={0.8}
      />,
    );

    expect(engine()).toHaveAttribute("data-piston-direction", "held");
    expect(engine()).toHaveAttribute("data-combustion", "active");
    expect(engine()).toHaveAttribute("data-mechanical-output", "blocked");
    expect(engine()).toHaveAttribute("data-crankshaft-moving", "false");
    expect(screen.getByTestId("engine-piston")).toHaveAttribute("data-piston-held", "true");
  });

  it("does not infer main-output from crankshaftMoving", () => {
    render(
      <FourStrokeEngine
        state={getStrokeState(EngineStroke.INTAKE, {
          combustionEnabled: true,
          pistonCanMove: true,
        })}
      />,
    );

    expect(engine()).toHaveAttribute("data-crankshaft-moving", "true");
    expect(engine()).toHaveAttribute("data-mechanical-output", "none");
  });
});

describe("engine demo controls", () => {
  it("next-stroke follows engine transitions and reset returns to intake", async () => {
    const user = userEvent.setup();
    render(<EngineDemo />);

    expect(engine()).toHaveAttribute("data-stroke", "intake");

    await user.click(screen.getByRole("button", { name: ENGINE_DEMO_COPY.next }));
    expect(engine()).toHaveAttribute("data-stroke", "compression");

    await user.click(screen.getByRole("button", { name: ENGINE_DEMO_COPY.next }));
    expect(engine()).toHaveAttribute("data-stroke", "power");

    await user.click(screen.getByRole("button", { name: ENGINE_DEMO_COPY.reset }));
    expect(engine()).toHaveAttribute("data-stroke", "intake");
    expect(engine()).toHaveAttribute("data-intake-valve", "open");
  });

  it("keeps motion status separate from output status", () => {
    render(<EngineDemo />);

    expect(screen.getByTestId("motion-status")).toHaveTextContent(
      ENGINE_DEMO_COPY.crankMoving,
    );
    expect(screen.getByTestId("output-status")).toHaveTextContent("无");
    expect(screen.getByTestId("motion-is-not-output")).toBeInTheDocument();
  });
});
