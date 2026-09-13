import { describe, expect, it } from "vitest";

import { examPatterns } from "@/content/physics-models/convex-lens-imaging/exam";
import { lensExamDiagramSpec } from "@/lib/learning/lens-exam-diagram";

describe("Scene 07 exam diagram adapter", () => {
  it("gives a beyond-2f figure only for the diagram-format pattern", () => {
    const diagram = examPatterns.find((item) => item.format === "diagram");
    expect(diagram?.id).toBe("exam-object-beyond-2f-properties");
    expect(diagram?.stem.startsWith("如图")).toBe(true);
    const spec = lensExamDiagramSpec(diagram!);
    expect(spec).toEqual({
      patternId: "exam-object-beyond-2f-properties",
      objectStation: "beyond-2f",
      showScreen: true,
      showImage: false,
      showRays: false,
    });
  });

  it("does not invent a figure for text or experimental patterns", () => {
    for (const pattern of examPatterns.filter((item) => item.format !== "diagram")) {
      expect(lensExamDiagramSpec(pattern)).toBeNull();
    }
  });
});
