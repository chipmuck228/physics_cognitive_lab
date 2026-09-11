import { describe, expect, it } from "vitest";

import {
  classifyExplanationLevel,
  summarizeExplanationLevel,
} from "@/lib/learning/explanation";

describe("explanation classification", () => {
  it("keeps simple result descriptions at E0", () => {
    expect(classifyExplanationLevel("The bread got hotter.")).toBe(0);
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
  });

  it("returns stage-appropriate feedback", () => {
    expect(summarizeExplanationLevel(2)).toContain("energy enters");
    expect(summarizeExplanationLevel(4)).toContain("reusable");
  });
});
