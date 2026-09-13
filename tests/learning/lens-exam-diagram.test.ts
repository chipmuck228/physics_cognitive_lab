import { describe, expect, it } from "vitest";

import { examPatterns } from "@/content/physics-models/convex-lens-imaging/exam";
import {
  LENS_EXAM_BEYOND_2F_LAYOUT,
  lensExamDiagramSpec,
  lensExamObjectIsBeyondLeft2F,
  lensExamScreenIsBetweenRightFAnd2F,
} from "@/lib/learning/lens-exam-diagram";

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
      screenRegion: "between-f-and-2f",
      layout: LENS_EXAM_BEYOND_2F_LAYOUT,
    });
  });

  it("places the screen between right F and 2F, object beyond left 2F", () => {
    const spec = lensExamDiagramSpec({
      id: "exam-object-beyond-2f-properties",
      format: "diagram",
    });
    expect(spec?.screenRegion).toBe("between-f-and-2f");
    expect(lensExamObjectIsBeyondLeft2F(spec!.layout)).toBe(true);
    expect(lensExamScreenIsBetweenRightFAnd2F(spec!.layout)).toBe(true);
    expect(spec!.layout.screenX).toBeGreaterThan(spec!.layout.rightF);
    expect(spec!.layout.screenX + spec!.layout.screenWidth).toBeLessThan(spec!.layout.right2F);
    expect(spec!.layout.objectX).toBeLessThan(spec!.layout.left2F);
    expect(spec!.showImage).toBe(false);
    expect(spec!.showRays).toBe(false);
  });

  it("fails if the screen is moved beyond 2F", () => {
    expect(
      lensExamScreenIsBetweenRightFAnd2F({
        ...LENS_EXAM_BEYOND_2F_LAYOUT,
        screenX: 448,
      }),
    ).toBe(false);
  });

  it("does not invent a figure for text or experimental patterns", () => {
    for (const pattern of examPatterns.filter((item) => item.format !== "diagram")) {
      expect(lensExamDiagramSpec(pattern)).toBeNull();
    }
  });
});
