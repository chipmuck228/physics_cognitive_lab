import { describe, expect, it } from "vitest";

import {
  classifyExplanationLevel,
  summarizeExplanationLevel,
} from "@/lib/learning/explanation";

describe("explanation classification", () => {
  it("keeps simple result descriptions at E0", () => {
    expect(classifyExplanationLevel("The bread got hotter.")).toBe(0);
    expect(classifyExplanationLevel("面包变热了。")).toBe(0);
  });

  it("recognizes process naming at E1", () => {
    expect(classifyExplanationLevel("The microwave heated it.")).toBe(1);
  });

  it("recognizes energy entering at E2", () => {
    expect(classifyExplanationLevel("Energy entered the bread.")).toBe(2);
  });

  it("recognizes a causal chain at E3 or E4", () => {
    expect(
      classifyExplanationLevel(
        "Energy entered the bread, so its internal energy changed and its temperature increased.",
      ),
    ).toBe(3);

    expect(
      classifyExplanationLevel(
        "When energy enters a system, its internal energy can change, which makes the temperature increase.",
      ),
    ).toBe(4);
    expect(
      classifyExplanationLevel("能量进入面包后，内能发生了变化，所以温度升高。"),
    ).toBe(3);
    expect(
      classifyExplanationLevel("能量进入面包后，面包的内能发生了变化，温度升高。"),
    ).toBe(3);
  });

  it("returns stage-appropriate feedback", () => {
    expect(summarizeExplanationLevel(2)).toContain("能量进入");
    expect(summarizeExplanationLevel(4)).toContain("换个情况");
  });
});
