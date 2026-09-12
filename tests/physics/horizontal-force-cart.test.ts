import { describe, expect, it } from "vitest";

import {
  applyForceAndStep,
  createMovingCartState,
  createRestingCartState,
  expectedMotionStateChange,
  runCartExperiment,
  runObserveDemo,
  stepCart,
} from "@/lib/physics/horizontal-force-cart";

describe("horizontal force cart physics", () => {
  it("starts rightward motion from rest under a right net force", () => {
    const next = applyForceAndStep(createRestingCartState(), "right");
    expect(next.speedTick).toBe(1);
    expect(next.motionDirection).toBe("right");
    expect(next.lastChange).toBe("started-moving");
    expect(next.netForce).toBe("right");
  });

  it("speeds up a right-moving cart under a right net force", () => {
    const moving = createMovingCartState("right", 2);
    const next = applyForceAndStep(moving, "right");
    expect(next.speedTick).toBe(3);
    expect(next.motionDirection).toBe("right");
    expect(next.lastChange).toBe("sped-up");
  });

  it("slows a right-moving cart under a left net force", () => {
    const moving = createMovingCartState("right", 2);
    const next = applyForceAndStep(moving, "left");
    expect(next.speedTick).toBe(1);
    expect(next.motionDirection).toBe("right");
    expect(next.lastChange).toBe("slowed-down");
  });

  it("keeps motion unchanged under zero net force", () => {
    const moving = createMovingCartState("right", 2);
    const next = applyForceAndStep(moving, "zero");
    expect(next.speedTick).toBe(2);
    expect(next.motionDirection).toBe("right");
    expect(next.lastChange).toBe("unchanged");
    expect(next.frictionOmitted).toBe(true);
  });

  it("reverses only after continued opposite force past rest", () => {
    const first = applyForceAndStep(createMovingCartState("right", 1), "left");
    expect(first.speedTick).toBe(0);
    expect(first.motionDirection).toBe("none");
    expect(first.lastChange).toBe("slowed-down");

    const second = stepCart(first);
    expect(second.lastChange).toBe("started-moving");
    expect(second.motionDirection).toBe("left");
    expect(second.speedTick).toBe(1);
  });

  it("does not reverse on the required opposite-force experiment tick", () => {
    const result = runCartExperiment("force-against-motion");
    expect(result.after.lastChange).toBe("slowed-down");
    expect(result.after.motionDirection).toBe("right");
    expect(expectedMotionStateChange("force-against-motion")).toBe("slowed-down");
  });

  it("returns the same next state for the same inputs", () => {
    const start = createMovingCartState("right", 2);
    expect(applyForceAndStep(start, "right")).toEqual(
      applyForceAndStep(start, "right"),
    );
  });

  it("observe demo starts still, then starts and speeds up", () => {
    const demo = runObserveDemo();
    expect(demo[0]?.speedTick).toBe(0);
    expect(demo[1]?.lastChange).toBe("started-moving");
    expect(demo[2]?.lastChange).toBe("sped-up");
  });

  it("does not treat position interpolation as physics truth", () => {
    const before = createMovingCartState("right", 2);
    const after = applyForceAndStep(before, "zero");
    const interpolatedPosition = (before.positionTick + after.positionTick) / 2;
    expect(interpolatedPosition).not.toBe(after.positionTick);
    expect(after.lastChange).toBe("unchanged");
    expect(after.speedTick).toBe(before.speedTick);
  });
});
