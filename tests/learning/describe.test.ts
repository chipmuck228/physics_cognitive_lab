import { describe, expect, it } from "vitest";

import {
  evaluateDescription,
  hasSufficientDescription,
  isSufficientPhysicsDescription,
} from "@/lib/learning/describe";

describe("describe evaluator", () => {
  it("accepts an explicit physics-language description", () => {
    const result = evaluateDescription("The temperature of the bread increased.");

    expect(result).toMatchObject({
      object: "bread",
      quantity: "temperature",
      change: "increase",
      sufficient: true,
    });
  });

  it("accepts temperature increased when the scene object is bread", () => {
    expect(isSufficientPhysicsDescription("Temperature increased.")).toBe(true);
    expect(isSufficientPhysicsDescription("The bread's temperature went up.")).toBe(
      true,
    );
    expect(isSufficientPhysicsDescription("面包的温度升高了。")).toBe(true);
    expect(isSufficientPhysicsDescription("温度升高了。")).toBe(true);
  });

  it("rejects everyday heat language as final DESCRIBE evidence", () => {
    expect(isSufficientPhysicsDescription("The bread became hot.")).toBe(false);
    expect(isSufficientPhysicsDescription("面包变热了。")).toBe(false);

    const everyday = evaluateDescription("The bread became hot.");
    expect(everyday.object).toBe("bread");
    expect(everyday.quantity).toBeUndefined();
    expect(everyday.sufficient).toBe(false);
  });

  it("does not treat a decrease as the required change", () => {
    expect(isSufficientPhysicsDescription("The temperature of the bread decreased.")).toBe(
      false,
    );
  });

  it("recognizes a sufficient stored description", () => {
    expect(
      hasSufficientDescription([
        { text: "The bread became hot.", object: "bread" },
        {
          text: "The temperature of the bread increased.",
          object: "bread",
          quantity: "temperature",
          change: "increase",
          sufficient: true,
        },
      ]),
    ).toBe(true);
  });
});
